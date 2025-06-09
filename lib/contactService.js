// lib/contactService.js
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
import { db } from './firebase';

// Contact Messages Collection
const CONTACT_COLLECTION = 'contact_messages';

/**
 * Submit a new contact message
 */
export const submitContactMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
      senderInfo: {
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone || ''
      },
      messageInfo: {
        subject: messageData.subject,
        message: messageData.message,
        priority: messageData.priority || 'medium'
      },
      systemInfo: {
        status: 'new',
        submittedAt: serverTimestamp(),
        repliedAt: null,
        repliedBy: null,
        reply: ''
      }
    });
    
    console.log('Contact message submitted with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting contact message: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all contact messages (Admin)
 */
export const getContactMessages = async (filters = {}) => {
  try {
    let q = collection(db, CONTACT_COLLECTION);
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('systemInfo.status', '==', filters.status));
    }
    
    if (filters.subject) {
      q = query(q, where('messageInfo.subject', '==', filters.subject));
    }
    
    // Order by submission date (newest first)
    q = query(q, orderBy('systemInfo.submittedAt', 'desc'));
    
    // Apply limit if specified
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, data: messages };
  } catch (error) {
    console.error('Error getting contact messages: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update contact message status and reply (Admin)
 */
export const updateContactMessage = async (messageId, updateData) => {
  try {
    const messageRef = doc(db, CONTACT_COLLECTION, messageId);
    
    const updatePayload = {
      'systemInfo.status': updateData.status
    };
    
    if (updateData.reply) {
      updatePayload['systemInfo.reply'] = updateData.reply;
      updatePayload['systemInfo.repliedAt'] = serverTimestamp();
      updatePayload['systemInfo.repliedBy'] = updateData.repliedBy || 'admin';
    }
    
    await updateDoc(messageRef, updatePayload);
    
    console.log('Contact message updated: ', messageId);
    return { success: true };
  } catch (error) {
    console.error('Error updating contact message: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get contact message statistics (Admin)
 */
export const getContactMessageStats = async () => {
  try {
    const stats = {
      total: 0,
      new: 0,
      replied: 0,
      pending: 0,
      closed: 0,
      bySubject: {
        product: 0,
        order: 0,
        support: 0,
        business: 0
      }
    };
    
    // Get all messages
    const querySnapshot = await getDocs(collection(db, CONTACT_COLLECTION));
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stats.total++;
      
      // Count by status
      const status = data.systemInfo?.status || 'new';
      if (stats[status] !== undefined) {
        stats[status]++;
      }
      
      // Count by subject
      const subject = data.messageInfo?.subject || 'support';
      if (stats.bySubject[subject] !== undefined) {
        stats.bySubject[subject]++;
      }
    });
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting contact message stats: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search contact messages (Admin)
 */
export const searchContactMessages = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - for production, consider using Algolia or similar
    const querySnapshot = await getDocs(
      query(collection(db, CONTACT_COLLECTION), orderBy('systemInfo.submittedAt', 'desc'))
    );
    
    const messages = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchableText = [
        data.senderInfo?.name || '',
        data.senderInfo?.email || '',
        data.messageInfo?.message || ''
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(searchLower)) {
        messages.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return { success: true, data: messages };
  } catch (error) {
    console.error('Error searching contact messages: ', error);
    return { success: false, error: error.message };
  }
};

