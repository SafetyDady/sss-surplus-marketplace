import { NextRequest, NextResponse } from 'next/server'
import { admin } from '@/firebase/admin'

/*
File: /app/api/auth/verify-token/route.ts
Version: 2.0 | 2025-06-13
note: Enhanced API endpoint for verifying Firebase ID tokens with improved error handling and debugging
*/

export async function POST(request: NextRequest) {
  console.log('API: /api/auth/verify-token called')
  
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      console.error('API Error: ID token is required')
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      )
    }

    console.log('API: Verifying ID token...')
    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid, email } = decodedToken
    
    console.log(`API: Token verified for user: ${email}`)

    if (!email) {
      console.error('API Error: Email not found in token')
      return NextResponse.json(
        { error: 'Email not found in token' },
        { status: 400 }
      )
    }

    // Check if user is Super Admin from environment variables first
    console.log(`API: Checking if user ${email} is Super Admin from ENV...`)
    
    const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
    const isSuperAdmin = superAdminEmails.includes(email)
    
    console.log(`API: Super Admin emails from ENV: ${superAdminEmails.join(', ')}`)
    console.log(`API: Is ${email} a Super Admin: ${isSuperAdmin}`)

    let role = 'user' // Default role
    let permissions: string[] = []

    if (isSuperAdmin) {
      // User is Super Admin from environment variables
      role = 'super_admin'
      permissions = ['all']
      console.log(`API: User ${email} assigned Super Admin role from ENV`)
    } else {
      // Check if user exists in adminWhitelist
      console.log(`API: Checking if user ${email} exists in adminWhitelist...`)
      
      try {
        const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
        const whitelistQuery = await adminWhitelistRef.where('email', '==', email).get()
        
        console.log(`API: adminWhitelist query completed, found: ${!whitelistQuery.empty}`)

      if (!whitelistQuery.empty) {
        // User is in adminWhitelist
        const whitelistDoc = whitelistQuery.docs[0]
        const whitelistData = whitelistDoc.data()
        
        console.log(`API: User found in whitelist with status: ${whitelistData.status}, role: ${whitelistData.role || 'not set'}`)

        if (whitelistData.status === 'pending') {
          // Activate the user
          role = whitelistData.role || 'admin'
          permissions = role === 'super_admin' ? ['all'] : ['admin_dashboard']
          
          console.log(`API: Activating user with role: ${role}`)

          try {
            // Update whitelist status to activated
            await whitelistDoc.ref.update({
              status: 'activated',
              activatedAt: admin.firestore.FieldValue.serverTimestamp(),
              lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
            })
            console.log('API: Whitelist status updated to activated')
          } catch (updateError) {
            console.error('API Error: Failed to update whitelist status:', updateError)
            // Continue with role assignment even if update fails
          }
        } else if (whitelistData.status === 'activated') {
          // User is already activated
          role = whitelistData.role || 'admin'
          permissions = role === 'super_admin' ? ['all'] : ['admin_dashboard']
          console.log(`API: User already activated with role: ${role}`)
        } else if (whitelistData.status === 'disabled') {
          // User is disabled
          console.error('API Error: Account has been disabled')
          return NextResponse.json(
            { error: 'Account has been disabled' },
            { status: 403 }
          )
        }
      } else {
        console.log(`API: User not found in adminWhitelist, using default role: ${role}`)
      }
      } catch (firestoreError) {
        console.error('API Error: Firestore operation failed:', firestoreError)
        return NextResponse.json(
          { error: 'Database operation failed', details: firestoreError.message },
          { status: 500 }
        )
      }
    }

    console.log(`API: Final role assignment - Role: ${role}, Permissions: ${permissions.join(', ')}`)
    console.log(`API: Getting user record for UID: ${uid}`)
      
      // Get current custom claims
      const userRecord = await admin.auth().getUser(uid)
      const currentClaims = userRecord.customClaims || {}
      
      console.log(`API: Current claims:`, currentClaims)
      console.log(`API: New role: ${role}, permissions:`, permissions)

      // Only update claims if they have changed
      if (currentClaims.role !== role || JSON.stringify(currentClaims.permissions) !== JSON.stringify(permissions)) {
        console.log('API: Claims have changed, updating...')
        
        try {
          // Set custom claims
          await admin.auth().setCustomUserClaims(uid, {
            role,
            permissions
          })
          console.log('API: Custom claims set successfully')
          
          // Revoke refresh tokens to force new token with updated claims
          await admin.auth().revokeRefreshTokens(uid)
          console.log('API: Refresh tokens revoked successfully')
        } catch (claimsError) {
          console.error('API Error: Failed to set custom claims:', claimsError)
          return NextResponse.json(
            { error: 'Failed to set custom claims', details: claimsError.message },
            { status: 500 }
          )
        }
      } else {
        console.log('API: Claims unchanged, skipping update')
      }

      console.log('API: Updating user profile in Firestore...')
      
      try {
        // Update or create user profile in Firestore
        const userRef = admin.firestore().collection('users').doc(uid)
        await userRef.set({
          email,
          role,
          permissions,
          lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        console.log('API: User profile updated successfully')
      } catch (profileError) {
        console.error('API Error: Failed to update user profile:', profileError)
        // Continue even if profile update fails
      }

      console.log('API: Token verification and role assignment completed successfully')
      return NextResponse.json({
        success: true,
        role,
        permissions,
        message: 'Token verified and role assigned successfully'
      })
    } catch (firestoreError) {
      console.error('API Error: Firestore operation failed:', firestoreError)
      return NextResponse.json(
        { error: 'Database operation failed', details: firestoreError.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error: Error verifying token:', error)
    
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      )
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { error: 'Token has been revoked' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

