import { NextRequest, NextResponse } from 'next/server'
import { admin } from '@/firebase/admin'
import { getUserRole, hasPermission } from '@/lib/roleManager'

/*
File: /app/api/admin/users/route.ts
Version: 1.0 | 2025-06-13
note: Admin user management API - Phase 3 of Incremental Refactoring
Purpose: CRUD operations for admin users, replacing environment variable management
*/

// GET: List all admin users
export async function GET(request: NextRequest) {
  console.log('👥 [Admin API] GET /api/admin/users called')
  
  try {
    // Get current user from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required', success: false },
        { status: 401 }
      )
    }

    const idToken = authHeader.substring(7)
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { email } = decodedToken

    // Check if user has admin permissions
    const userRole = await getUserRole(email)
    if (!hasPermission(userRole.permissions, 'admin_management')) {
      return NextResponse.json(
        { error: 'Insufficient permissions', success: false },
        { status: 403 }
      )
    }

    // Get all admin users from adminWhitelist
    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    const snapshot = await adminWhitelistRef.orderBy('createdAt', 'desc').get()
    
    const adminUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      activatedAt: doc.data().activatedAt?.toDate?.()?.toISOString() || null,
      lastUpdatedAt: doc.data().lastUpdatedAt?.toDate?.()?.toISOString() || null
    }))

    console.log(`👥 [Admin API] Retrieved ${adminUsers.length} admin users`)
    
    return NextResponse.json({
      success: true,
      data: adminUsers,
      count: adminUsers.length
    })

  } catch (error) {
    console.error('👥 [Admin API] Error retrieving admin users:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

// POST: Add new admin user
export async function POST(request: NextRequest) {
  console.log('👥 [Admin API] POST /api/admin/users called')
  
  try {
    // Get current user from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required', success: false },
        { status: 401 }
      )
    }

    const idToken = authHeader.substring(7)
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { email: currentUserEmail } = decodedToken

    // Check if user has admin permissions
    const userRole = await getUserRole(currentUserEmail)
    if (!hasPermission(userRole.permissions, 'admin_management')) {
      return NextResponse.json(
        { error: 'Insufficient permissions', success: false },
        { status: 403 }
      )
    }

    const { email, role, name } = await request.json()

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required', success: false },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'moderator', 'super_admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role', success: false },
        { status: 400 }
      )
    }

    // Check if user already exists
    const adminWhitelistRef = admin.firestore().collection('adminWhitelist')
    const existingUser = await adminWhitelistRef.where('email', '==', email).get()
    
    if (!existingUser.empty) {
      return NextResponse.json(
        { error: 'User already exists in admin whitelist', success: false },
        { status: 409 }
      )
    }

    // Add new admin user
    const newAdminUser = {
      email,
      role,
      name: name || '',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: currentUserEmail,
      lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }

    const docRef = await adminWhitelistRef.add(newAdminUser)
    
    console.log(`👥 [Admin API] Added new admin user: ${email} as ${role}`)
    
    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...newAdminUser,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
      },
      message: 'Admin user added successfully'
    })

  } catch (error) {
    console.error('👥 [Admin API] Error adding admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

