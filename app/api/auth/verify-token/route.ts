import { NextRequest, NextResponse } from 'next/server'
import { admin } from '@/firebase/admin'

/*
File: /app/api/auth/verify-token/route.ts
Version: 1.0 | 2025-06-13
note: API endpoint for verifying Firebase ID tokens and assigning roles based on adminWhitelist
*/

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      )
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid, email } = decodedToken

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found in token' },
        { status: 400 }
      )
    }

    // Check if user exists in adminWhitelist
    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    const whitelistQuery = await adminWhitelistRef.where('email', '==', email).get()

    let role = 'user' // Default role
    let permissions: string[] = []

    if (!whitelistQuery.empty) {
      // User is in adminWhitelist
      const whitelistDoc = whitelistQuery.docs[0]
      const whitelistData = whitelistDoc.data()

      if (whitelistData.status === 'pending') {
        // Activate the user
        role = whitelistData.role || 'admin'
        permissions = role === 'super_admin' ? ['all'] : ['admin_dashboard']

        // Update whitelist status to activated
        await whitelistDoc.ref.update({
          status: 'activated',
          activatedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
        })
      } else if (whitelistData.status === 'activated') {
        // User is already activated
        role = whitelistData.role || 'admin'
        permissions = role === 'super_admin' ? ['all'] : ['admin_dashboard']
      } else if (whitelistData.status === 'disabled') {
        // User is disabled
        return NextResponse.json(
          { error: 'Account has been disabled' },
          { status: 403 }
        )
      }
    }

    // Get current custom claims
    const userRecord = await admin.auth().getUser(uid)
    const currentClaims = userRecord.customClaims || {}

    // Only update claims if they have changed
    if (currentClaims.role !== role || JSON.stringify(currentClaims.permissions) !== JSON.stringify(permissions)) {
      // Set custom claims
      await admin.auth().setCustomUserClaims(uid, {
        role,
        permissions
      })

      // Revoke refresh tokens to force new token with updated claims
      await admin.auth().revokeRefreshTokens(uid)
    }

    // Update or create user profile in Firestore
    const userRef = admin.firestore().collection('users').doc(uid)
    await userRef.set({
      email,
      role,
      permissions,
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true })

    return NextResponse.json({
      success: true,
      role,
      permissions,
      message: 'Token verified and role assigned successfully'
    })

  } catch (error) {
    console.error('Error verifying token:', error)
    
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

