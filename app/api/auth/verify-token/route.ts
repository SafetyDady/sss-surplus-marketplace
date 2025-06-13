import { NextRequest, NextResponse } from 'next/server'
import { admin } from '@/firebase/admin'
import { getUserRole, updateUserClaims, updateUserProfile, activateAdminUser } from '@/lib/roleManager'

/*
File: /app/api/auth/verify-token/route.ts
Version: 4.0 | 2025-06-13
note: Database-first authentication API - Phase 3 of Incremental Refactoring
Changes:
- Completely removed dependency on SUPER_ADMIN_EMAILS environment variable
- Now uses database-only approach for admin management
- Simplified and more maintainable
*/

export async function POST(request: NextRequest) {
  console.log('🔗 [API] /api/auth/verify-token called')
  
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required', success: false },
        { status: 400 }
      )
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid, email } = decodedToken
    
    console.log(`🔗 [API] Token verified for: ${email}`)

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found in token', success: false },
        { status: 400 }
      )
    }

    // Get user role using database-only approach
    let userRole
    try {
      userRole = await getUserRole(email)
    } catch (error) {
      if (error.message === 'Account has been disabled') {
        return NextResponse.json(
          { error: 'Account has been disabled', success: false },
          { status: 403 }
        )
      }
      throw error
    }

    const { role, permissions } = userRole

    // Update custom claims if needed
    try {
      const claimsUpdated = await updateUserClaims(uid, role, permissions)
      
      if (claimsUpdated) {
        console.log(`🔗 [API] Claims updated for ${email}: ${role}`)
      }
    } catch (claimsError) {
      console.error('🔗 [API] Failed to update claims:', claimsError)
      return NextResponse.json(
        { error: 'Failed to update user permissions', success: false },
        { status: 500 }
      )
    }

    // Activate admin user if pending (background operation)
    if (role !== 'user') {
      activateAdminUser(email).catch(error => 
        console.error('🔗 [API] Background admin activation failed:', error)
      )
    }

    // Update user profile (background operation)
    updateUserProfile(uid, email, role, permissions)

    console.log(`🔗 [API] Verification completed: ${email} as ${role}`)
    
    return NextResponse.json({
      success: true,
      role,
      permissions,
      message: 'Token verified successfully'
    })

  } catch (error) {
    console.error('🔗 [API] Verification error:', error)
    
    // Standardized error responses
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token has expired', success: false },
        { status: 401 }
      )
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { error: 'Token has been revoked', success: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

