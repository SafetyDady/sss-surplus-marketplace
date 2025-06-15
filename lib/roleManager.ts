import { admin } from './firebase/admin'

/*
File: /lib/roleManager.ts
Version: 2.0 | 2025-06-13
note: Enhanced role management utility - Phase 3 of Incremental Refactoring
Changes:
- Removed dependency on SUPER_ADMIN_EMAILS environment variable
- Added admin_management permission
- Enhanced permission system
- Added database-first admin management
*/

export interface UserRole {
  role: string
  permissions: string[]
}

export interface AdminWhitelistEntry {
  email: string
  role: string
  status: 'pending' | 'activated' | 'disabled'
  name?: string
  createdAt?: any
  activatedAt?: any
  lastUpdatedAt?: any
  createdBy?: string
  updatedBy?: string
}

/**
 * Get user role from database (Firestore only)
 * No longer uses environment variables
 */
export async function getUserRole(email: string): Promise<UserRole> {
  try {
    // Check adminWhitelist in Firestore
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
          permissions: getRolePermissions(role)
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
 * Get permissions for a specific role
 */
export function getRolePermissions(role: string): string[] {
  const rolePermissions = {
    'super_admin': ['all'],
    'admin': ['admin_dashboard', 'admin_management', 'user_management', 'content_management'],
    'moderator': ['admin_dashboard', 'content_management'],
    'user': []
  }
  
  return rolePermissions[role] || []
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

/**
 * Create initial super admin user in database
 * This replaces the environment variable approach
 */
export async function createInitialSuperAdmin(email: string, name: string = 'System Administrator'): Promise<void> {
  try {
    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    
    // Check if super admin already exists
    const existingQuery = await adminWhitelistRef.where('email', '==', email).limit(1).get()
    
    if (existingQuery.empty) {
      // Create initial super admin
      await adminWhitelistRef.add({
        email,
        name,
        role: 'super_admin',
        status: 'activated',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        activatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'system'
      })
      
      console.log(`Initial super admin created: ${email}`)
    } else {
      console.log(`Super admin already exists: ${email}`)
    }
  } catch (error) {
    console.error('Error creating initial super admin:', error)
    throw error
  }
}

/**
 * Migrate existing environment variable super admins to database
 * This is a one-time migration function
 */
export async function migrateEnvSuperAdminsToDatabase(): Promise<void> {
  try {
    const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
    
    if (superAdminEmails.length === 0) {
      console.log('No super admin emails found in environment variables')
      return
    }

    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    
    for (const email of superAdminEmails) {
      if (email) {
        // Check if already exists
        const existingQuery = await adminWhitelistRef.where('email', '==', email).limit(1).get()
        
        if (existingQuery.empty) {
          // Migrate to database
          await adminWhitelistRef.add({
            email,
            name: 'Migrated Super Admin',
            role: 'super_admin',
            status: 'activated',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            activatedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: 'migration'
          })
          
          console.log(`Migrated super admin to database: ${email}`)
        }
      }
    }
    
    console.log('Super admin migration completed')
  } catch (error) {
    console.error('Error migrating super admins:', error)
    throw error
  }
}

