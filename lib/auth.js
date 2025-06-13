// Firebase Authentication Service
import { 
  // signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  // createUserWithEmailAndPassword,
  // updateProfile,
  // sendPasswordResetEmail
} from 'firebase/auth';
import { 
  // doc, 
  // setDoc, 
  // getDoc, 
  // updateDoc, 
  // collection, 
  // query, 
  // where, 
  // getDocs 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Admin roles - No longer needed, roles managed via Firebase Custom Claims
// export const ADMIN_ROLES = {
//   SUPER_ADMIN: 'super_admin',
//   ADMIN: 'admin',
//   MODERATOR: 'moderator'
// };

// Admin permissions - No longer needed, permissions managed via Firebase Custom Claims
// export const ADMIN_PERMISSIONS = {
//   [ADMIN_ROLES.SUPER_ADMIN]: ['all'],
//   [ADMIN_ROLES.ADMIN]: ['contact_management', 'vendor_management', 'reports'],
//   [ADMIN_ROLES.MODERATOR]: ['contact_management']
// };

/**
 * Sign in admin user - Replaced by Firebase signInWithPopup and role checking via custom claims
 */
// export const signInAdmin = async (email, password) => {
//   try {
//     console.log('Signing in admin:', email);
    
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
    
//     // Check if user is admin
//     const adminData = await getAdminData(user.uid);
//     if (!adminData) {
//       await signOut(auth);
//       throw new Error('ไม่มีสิทธิ์เข้าถึงระบบ Admin');
//     }
    
//     console.log('Admin signed in successfully:', adminData);
//     return {
//       user,
//       adminData
//     };
//   } catch (error) {
//     console.error('Sign in error:', error);
//     throw error;
//   }
// };

/**
 * Sign out admin user - Replaced by Firebase signOut
 */
// export const signOutAdmin = async () => {
//   try {
//     await signOut(auth);
//     console.log('Admin signed out successfully');
//   } catch (error) {
//     console.error('Sign out error:', error);
//     throw error;
//   }
// };

/**
 * Create admin user - Replaced by Firebase Auth user creation and custom claims/Firestore adminWhitelist for role assignment
 */
// export const createAdminUser = async (email, password, userData) => {
//   try {
//     console.log('Creating admin user:', email);
    
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
    
//     // Update profile
//     await updateProfile(user, {
//       displayName: userData.name
//     });
    
//     // Create admin document
//     const adminData = {
//       uid: user.uid,
//       email: user.email,
//       name: userData.name,
//       role: userData.role || ADMIN_ROLES.MODERATOR,
//       permissions: ADMIN_PERMISSIONS[userData.role || ADMIN_ROLES.MODERATOR],
//       createdAt: new Date(),
//       createdBy: userData.createdBy || 'system',
//       isActive: true,
//       lastLogin: null
//     };
    
//     await setDoc(doc(db, 'admin_users', user.uid), adminData);
    
//     console.log('Admin user created successfully:', adminData);
//     return {
//       user,
//       adminData
//     };
//   } catch (error) {
//     console.error('Create admin user error:', error);
//     throw error;
//   }
// };

/**
 * Get admin data - Replaced by Firebase custom claims and simplified user profile in Firestore
 */
// export const getAdminData = async (uid) => {
//   try {
//     const adminDoc = await getDoc(doc(db, 'admin_users', uid));
//     if (adminDoc.exists()) {
//       return adminDoc.data();
//     }
//     return null;
//   } catch (error) {
//     console.error('Get admin data error:', error);
//     return null;
//   }
// };

/**
 * Update admin last login - Can be handled in the verify-token API endpoint or a Firebase Function
 */
// export const updateAdminLastLogin = async (uid) => {
//   try {
//     await updateDoc(doc(db, 'admin_users', uid), {
//       lastLogin: new Date()
//     });
//   } catch (error) {
//     console.error('Update last login error:', error);
//   }
// };

/**
 * Check admin permission - Replaced by checking permissions from Firebase custom claims
 */
// export const hasPermission = (adminData, permission) => {
//   if (!adminData || !adminData.permissions) return false;
  
//   // Super admin has all permissions
//    if (adminData.permissions.includes('all')) return true;
  
//   return adminData.permissions.includes(permission);
// };

/**
 * Get all admin users - This might still be useful for the Admin Management UI, but its current implementation is tied to admin_users collection which will be replaced by adminWhitelist and Firebase user data. I should keep this in mind for future refactoring, but for now, the direct authentication logic is the focus.
 */
// export const getAllAdminUsers = async () => {
//   try {
//     const q = query(collection(db, 'admin_users'));
//     const querySnapshot = await getDocs(q);
    
//     const adminUsers = [];
//     querySnapshot.forEach((doc) => {
//       adminUsers.push({
//         id: doc.id,
//         ...doc.data()
//       });
//     });
    
//     return adminUsers;
//   } catch (error) {
//     console.error('Get all admin users error:', error);
//     throw error;
//   }
// };

/**
 * Update admin user - Similar to getAllAdminUsers, this is for managing admin users, which will now be primarily managed via adminWhitelist and Firebase custom claims.
 */
// export const updateAdminUser = async (uid, updates) => {
//   try {
//     // Update permissions if role changed
//     if (updates.role) {
//       updates.permissions = ADMIN_PERMISSIONS[updates.role];
//     }
    
//     updates.updatedAt = new Date();
    
//     await updateDoc(doc(db, 'admin_users', uid), updates);
//     console.log('Admin user updated successfully');
//   } catch (error) {
//     console.error('Update admin user error:', error);
//     throw error;
//   }
// };

/**
 * Deactivate admin user - Similar to updateAdminUser.
 */
// export const deactivateAdminUser = async (uid) => {
//   try {
//     await updateDoc(doc(db, 'admin_users', uid), {
//       isActive: false,
//       deactivatedAt: new Date()
//     });
//     console.log('Admin user deactivated successfully');
//   } catch (error) {
//     console.error('Deactivate admin user error:', error);
//     throw error;
//   }
// };

/**
 * Send password reset email - Firebase Auth has its own password reset functionality.
 */
// export const sendAdminPasswordReset = async (email) => {
//   try {
//     await sendPasswordResetEmail(auth, email);
//     console.log('Password reset email sent');
//   } catch (error) {
//     console.error('Send password reset error:', error);
//     throw error;
//   }
// };

/**
 * Auth state observer - Replaced by onAuthStateChanged from Firebase Auth and custom claims.
 */
// export const onAdminAuthStateChanged = (callback) => {
//   return onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       // Get admin data
//       const adminData = await getAdminData(user.uid);
//       if (adminData && adminData.isActive) {
//         // Update last login
//         await updateAdminLastLogin(user.uid);
//         callback({ user, adminData });
//       } else {
//         // Not an admin or inactive
//         await signOut(auth);
//         callback(null);
//       }
//     } else {
//       callback(null);
//     }
//   });
// };

// Default admin user for initial setup - Not needed with the new provisioning script.
// export const DEFAULT_ADMIN = {
//   email: 'admin@sss-supply.com',
//   password: 'Admin123!',
//   name: 'System Administrator',
//   role: ADMIN_ROLES.SUPER_ADMIN
// };


