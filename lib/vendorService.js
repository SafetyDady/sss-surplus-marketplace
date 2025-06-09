// lib/vendorService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// Vendor Applications Collection
const VENDOR_COLLECTION = 'vendor_applications';

/**
 * Upload document to Firebase Storage
 */
export const uploadDocument = async (file, vendorId, documentType) => {
  try {
    const fileName = `${documentType}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `vendor-documents/${vendorId}/${documentType}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL, path: snapshot.ref.fullPath };
  } catch (error) {
    console.error('Error uploading document: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Submit a new vendor application
 */
export const submitVendorApplication = async (applicationData, documents = {}) => {
  try {
    // Generate temporary vendor ID for document uploads
    const tempVendorId = `temp_${Date.now()}`;
    
    // Upload documents first
    const uploadedDocuments = {};
    for (const [docType, file] of Object.entries(documents)) {
      if (file) {
        const uploadResult = await uploadDocument(file, tempVendorId, docType);
        if (uploadResult.success) {
          uploadedDocuments[docType] = {
            url: uploadResult.url,
            path: uploadResult.path,
            fileName: file.name,
            fileSize: file.size,
            uploadedAt: new Date()
          };
        }
      }
    }
    
    // Create application document
    const docRef = await addDoc(collection(db, VENDOR_COLLECTION), {
      applicantType: applicationData.applicantType,
      companyInfo: {
        companyName: applicationData.companyName || '',
        businessType: applicationData.businessType || '',
        companyAddress: applicationData.companyAddress || '',
        taxId: applicationData.taxId || '',
        website: applicationData.website || ''
      },
      contactInfo: {
        contactName: applicationData.contactName,
        position: applicationData.position || '',
        email: applicationData.email,
        phone: applicationData.phone,
        mobile: applicationData.mobile || '',
        lineId: applicationData.lineId || ''
      },
      productInfo: {
        productCategories: applicationData.productCategories || [],
        productDescription: applicationData.productDescription || '',
        monthlyVolume: applicationData.monthlyVolume || '',
        experience: applicationData.experience || ''
      },
      additionalInfo: {
        motivation: applicationData.motivation || '',
        otherPlatforms: applicationData.otherPlatforms || '',
        terms: applicationData.terms || false,
        newsletter: applicationData.newsletter || false
      },
      documents: uploadedDocuments,
      systemInfo: {
        status: 'pending',
        submittedAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        notes: ''
      }
    });
    
    console.log('Vendor application submitted with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting vendor application: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all vendor applications (Admin)
 */
export const getVendorApplications = async (filters = {}) => {
  try {
    let q = collection(db, VENDOR_COLLECTION);
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('systemInfo.status', '==', filters.status));
    }
    
    if (filters.applicantType) {
      q = query(q, where('applicantType', '==', filters.applicantType));
    }
    
    // Order by submission date (newest first)
    q = query(q, orderBy('systemInfo.submittedAt', 'desc'));
    
    // Apply limit if specified
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: applications };
  } catch (error) {
    console.error('Error getting vendor applications: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update vendor application status (Admin)
 */
export const updateVendorApplicationStatus = async (applicationId, updateData) => {
  try {
    const applicationRef = doc(db, VENDOR_COLLECTION, applicationId);
    
    const updatePayload = {
      'systemInfo.status': updateData.status,
      'systemInfo.reviewedAt': serverTimestamp(),
      'systemInfo.reviewedBy': updateData.reviewedBy || 'admin'
    };
    
    if (updateData.notes) {
      updatePayload['systemInfo.notes'] = updateData.notes;
    }
    
    await updateDoc(applicationRef, updatePayload);
    
    console.log('Vendor application updated: ', applicationId);
    return { success: true };
  } catch (error) {
    console.error('Error updating vendor application: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get vendor application statistics (Admin)
 */
export const getVendorApplicationStats = async () => {
  try {
    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      byType: {
        individual: 0,
        company: 0
      },
      recentApplications: []
    };
    
    // Get all applications
    const querySnapshot = await getDocs(
      query(collection(db, VENDOR_COLLECTION), orderBy('systemInfo.submittedAt', 'desc'))
    );
    
    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      stats.total++;
      
      // Count by status
      const status = data.systemInfo?.status || 'pending';
      if (stats[status] !== undefined) {
        stats[status]++;
      }
      
      // Count by applicant type
      const applicantType = data.applicantType || 'individual';
      if (stats.byType[applicantType] !== undefined) {
        stats.byType[applicantType]++;
      }
      
      // Get recent applications (last 5)
      if (index < 5) {
        stats.recentApplications.push({
          id: doc.id,
          companyName: data.companyInfo?.companyName || data.contactInfo?.contactName,
          status: data.systemInfo?.status,
          submittedAt: data.systemInfo?.submittedAt
        });
      }
    });
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting vendor application stats: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search vendor applications (Admin)
 */
export const searchVendorApplications = async (searchTerm) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, VENDOR_COLLECTION), orderBy('systemInfo.submittedAt', 'desc'))
    );
    
    const applications = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchableText = [
        data.companyInfo?.companyName || '',
        data.contactInfo?.contactName || '',
        data.contactInfo?.email || '',
        data.productInfo?.productDescription || ''
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(searchLower)) {
        applications.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return { success: true, data: applications };
  } catch (error) {
    console.error('Error searching vendor applications: ', error);
    return { success: false, error: error.message };
  }
};

