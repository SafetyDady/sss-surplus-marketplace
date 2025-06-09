// Firebase Authentication Service
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Admin roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Admin permissions
export const ADMIN_PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: ['all'],
  [ADMIN_ROLES.ADMIN]: ['contact_management', 'vendor_management', 'reports'],
  [ADMIN_ROLES.MODERATOR]: ['contact_management']
};

/**
 * Sign in admin user
 */
export const signInAdmin = async (email, password) => {
  try {
    console.log('Signing in admin:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user is admin
    const adminData = await getAdminData(user.uid);
    if (!adminData) {
      await signOut(auth);
      throw new Error('ไม่มีสิทธิ์เข้าถึงระบบ Admin');
    }
    
    console.log('Admin signed in successfully:', adminData);
    return {
      user,
      adminData
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign out admin user
 */
export const signOutAdmin = async () => {
  try {
    await signOut(auth);
    console.log('Admin signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Create admin user
 */
export const createAdminUser = async (email, password, userData) => {
  try {
    console.log('Creating admin user:', email);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, {
      displayName: userData.name
    });
    
    // Create admin document
    const adminData = {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      role: userData.role || ADMIN_ROLES.MODERATOR,
      permissions: ADMIN_PERMISSIONS[userData.role || ADMIN_ROLES.MODERATOR],
      createdAt: new Date(),
      createdBy: userData.createdBy || 'system',
      isActive: true,
      lastLogin: null
    };
    
    await setDoc(doc(db, 'admin_users', user.uid), adminData);
    
    console.log('Admin user created successfully:', adminData);
    return {
      user,
      adminData
    };
  } catch (error) {
    console.error('Create admin user error:', error);
    throw error;
  }
};

/**
 * Get admin data
 */
export const getAdminData = async (uid) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admin_users', uid));
    if (adminDoc.exists()) {
      return adminDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Get admin data error:', error);
    return null;
  }
};

/**
 * Update admin last login
 */
export const updateAdminLastLogin = async (uid) => {
  try {
    await updateDoc(doc(db, 'admin_users', uid), {
      lastLogin: new Date()
    });
  } catch (error) {
    console.error('Update last login error:', error);
  }
};

/**
 * Check admin permission
 */
export const hasPermission = (adminData, permission) => {
  if (!adminData || !adminData.permissions) return false;
  
  // Super admin has all permissions
  if (adminData.permissions.includes('all')) return true;
  
  return adminData.permissions.includes(permission);
};

/**
 * Get all admin users
 */
export const getAllAdminUsers = async () => {
  try {
    const q = query(collection(db, 'admin_users'));
    const querySnapshot = await getDocs(q);
    
    const adminUsers = [];
    querySnapshot.forEach((doc) => {
      adminUsers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return adminUsers;
  } catch (error) {
    console.error('Get all admin users error:', error);
    throw error;
  }
};

/**
 * Update admin user
 */
export const updateAdminUser = async (uid, updates) => {
  try {
    // Update permissions if role changed
    if (updates.role) {
      updates.permissions = ADMIN_PERMISSIONS[updates.role];
    }
    
    updates.updatedAt = new Date();
    
    await updateDoc(doc(db, 'admin_users', uid), updates);
    console.log('Admin user updated successfully');
  } catch (error) {
    console.error('Update admin user error:', error);
    throw error;
  }
};

/**
 * Deactivate admin user
 */
export const deactivateAdminUser = async (uid) => {
  try {
    await updateDoc(doc(db, 'admin_users', uid), {
      isActive: false,
      deactivatedAt: new Date()
    });
    console.log('Admin user deactivated successfully');
  } catch (error) {
    console.error('Deactivate admin user error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendAdminPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Send password reset error:', error);
    throw error;
  }
};

/**
 * Auth state observer
 */
export const onAdminAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get admin data
      const adminData = await getAdminData(user.uid);
      if (adminData && adminData.isActive) {
        // Update last login
        await updateAdminLastLogin(user.uid);
        callback({ user, adminData });
      } else {
        // Not an admin or inactive
        await signOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Default admin user for initial setup
export const DEFAULT_ADMIN = {
  email: 'admin@sss-supply.com',
  password: 'Admin123!',
  name: 'System Administrator',
  role: ADMIN_ROLES.SUPER_ADMIN
};

