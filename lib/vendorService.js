// lib/vendorService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'vendor_applications';

// Submit new vendor application
export const submitVendorApplication = async (formData) => {
  try {
    const applicationData = {
      // Company Information
      companyName: formData.companyName,
      businessType: formData.businessType,
      companyAddress: formData.companyAddress,
      taxId: formData.taxId || '',
      website: formData.website || '',
      
      // Contact Information
      contactName: formData.contactName,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      mobile: formData.mobile,
      lineId: formData.lineId || '',
      
      // Product Information
      productCategories: formData.productCategories,
      productDescription: formData.productDescription,
      monthlyVolume: formData.monthlyVolume,
      experience: formData.experience,
      
      // Additional Information
      motivation: formData.motivation,
      otherPlatforms: formData.otherPlatforms || '',
      terms: formData.terms,
      newsletter: formData.newsletter || false,
      
      // System Information
      status: 'pending',
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: '',
      reviewedAt: null,
      reviewedBy: null
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), applicationData);
    
    return {
      success: true,
      applicationId: docRef.id,
      message: 'ใบสมัครถูกส่งเรียบร้อยแล้ว'
    };
  } catch (error) {
    console.error('Error submitting vendor application:', error);
    return {
      success: false,
      error: error.message,
      message: 'เกิดข้อผิดพลาดในการส่งใบสมัคร'
    };
  }
};

// Get all vendor applications (for admin)
export const getVendorApplications = async (status = null) => {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        orderBy('submittedAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const applications = [];
    
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      applications
    };
  } catch (error) {
    console.error('Error getting vendor applications:', error);
    return {
      success: false,
      error: error.message,
      applications: []
    };
  }
};

// Update vendor application status (for admin)
export const updateVendorApplicationStatus = async (applicationId, status, notes = '', reviewedBy = '') => {
  try {
    const applicationRef = doc(db, COLLECTION_NAME, applicationId);
    
    await updateDoc(applicationRef, {
      status,
      notes,
      reviewedBy,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'อัพเดทสถานะเรียบร้อยแล้ว'
    };
  } catch (error) {
    console.error('Error updating vendor application:', error);
    return {
      success: false,
      error: error.message,
      message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ'
    };
  }
};

// Get vendor application statistics
export const getVendorApplicationStats = async () => {
  try {
    const allApps = await getVendorApplications();
    
    if (!allApps.success) {
      return { success: false, stats: {} };
    }

    const stats = {
      total: allApps.applications.length,
      pending: allApps.applications.filter(app => app.status === 'pending').length,
      approved: allApps.applications.filter(app => app.status === 'approved').length,
      rejected: allApps.applications.filter(app => app.status === 'rejected').length
    };

    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error getting vendor application stats:', error);
    return {
      success: false,
      stats: {}
    };
  }
};

