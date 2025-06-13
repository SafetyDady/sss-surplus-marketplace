import { admin } from './firebase/admin'

/*
File: /lib/roleManager.ts
Version: 1.0 | 2025-06-13
note: Centralized role management utility - Phase 2 of Incremental Refactoring
Purpose: Provide reusable functions for role and permission management
*/

export interface UserRole {
  role: string
  permissions: string[]
}

export interface AdminWhitelistEntry {
  email: string
  role: string
  status: 'pending' | 'activated' | 'disabled'
  createdAt?: any
  activatedAt?: any
  lastUpdatedAt?: any
}

/**
 * Get user role from various sources (ENV, Firestore)
 * Optimized for performance with single database query
 */
export async function getUserRole(email: string): Promise<UserRole> {
  // Check Super Admin from environment variables first (fastest)
  const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  
  if (superAdminEmails.includes(email)) {
    return {
      role: 'super_admin',
      permissions: ['all']
    }
  }

  // Check adminWhitelist in Firestore
  try {
    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    const whitelistQuery = await adminWhitelistRef.where('email', '==', email).limit(1).get()
    
    if (!whitelistQuery.empty) {
      const whitelistData = whitelistQuery.docs[0].data() as AdminWhitelistEntry
      
      if (whitelistData.status === 'disabled') {
        throw new Error('Account has been disabled')
      }
      
      if (whitelistData.status === 'pending' || whitelistData.status === 'activated') {
        const role = whitelistData.role || 'admin'
        return {
          role,
          permissions: role === 'super_admin' ? ['all'] : ['admin_dashboard']
        }
      }
    }
  } catch (error) {
    console.error('Error checking adminWhitelist:', error)
    if (error.message === 'Account has been disabled') {
      throw error
    }
    // Continue with default role if database error
  }

  // Default role
  return {
    role: 'user',
    permissions: []
  }
}

/**
 * Update user custom claims if they have changed
 * Returns true if claims were updated, false if no update needed
 */
export async function updateUserClaims(uid: string, newRole: string, newPermissions: string[]): Promise<boolean> {
  try {
    // Get current claims
    const userRecord = await admin.auth().getUser(uid)
    const currentClaims = userRecord.customClaims || {}
    
    // Check if update is needed
    const claimsChanged = currentClaims.role !== newRole || 
                         JSON.stringify(currentClaims.permissions) !== JSON.stringify(newPermissions)
    
    if (claimsChanged) {
      // Update claims and revoke refresh tokens
      await Promise.all([
        admin.auth().setCustomUserClaims(uid, { role: newRole, permissions: newPermissions }),
        admin.auth().revokeRefreshTokens(uid)
      ])
      
      console.log(`Claims updated: ${uid} → ${newRole}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error updating user claims:', error)
    throw error
  }
}

/**
 * Update user profile in Firestore (background operation)
 */
export function updateUserProfile(uid: string, email: string, role: string, permissions: string[]): void {
  const userRef = admin.firestore().collection('users').doc(uid)
  
  userRef.set({
    email,
    role,
    permissions,
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).catch(error => 
    console.error('Background user profile update failed:', error)
  )
}

/**
 * Activate pending admin user
 */
export async function activateAdminUser(email: string): Promise<void> {
  try {
    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    const whitelistQuery = await adminWhitelistRef.where('email', '==', email).limit(1).get()
    
    if (!whitelistQuery.empty) {
      const whitelistDoc = whitelistQuery.docs[0]
      const whitelistData = whitelistDoc.data()
      
      if (whitelistData.status === 'pending') {
        await whitelistDoc.ref.update({
          status: 'activated',
          activatedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
        })
        
        console.log(`Admin user activated: ${email}`)
      }
    }
  } catch (error) {
    console.error('Error activating admin user:', error)
    throw error
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  if (!permissions || permissions.length === 0) return false
  if (permissions.includes('all')) return true
  return permissions.includes(requiredPermission)
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleNames = {
    'super_admin': 'Super Administrator',
    'admin': 'Administrator',
    'moderator': 'Moderator',
    'user': 'User'
  }
  
  return roleNames[role] || 'Unknown Role'
}

