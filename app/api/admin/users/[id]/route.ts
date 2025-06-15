import { NextRequest, NextResponse } from 'next/server'
import { admin } from '@/firebase/admin'
import { getUserRole, hasPermission } from '@/lib/roleManager'

/*
File: /app/api/admin/users/[id]/route.ts
Version: 1.0 | 2025-06-13
note: Individual admin user management API - Phase 3 of Incremental Refactoring
Purpose: Update and delete specific admin users
*/

// GET: Get specific admin user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`👤 [Admin API] GET /api/admin/users/${params.id} called`)
  
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

    // Get specific admin user
    const adminDoc = await admin.firestore().collection('adminWhitelist').doc(params.id).get()
    
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin user not found', success: false },
        { status: 404 }
      )
    }

    const adminData = {
      id: adminDoc.id,
      ...adminDoc.data(),
      createdAt: adminDoc.data()?.createdAt?.toDate?.()?.toISOString() || null,
      activatedAt: adminDoc.data()?.activatedAt?.toDate?.()?.toISOString() || null,
      lastUpdatedAt: adminDoc.data()?.lastUpdatedAt?.toDate?.()?.toISOString() || null
    }

    return NextResponse.json({
      success: true,
      data: adminData
    })

  } catch (error) {
    console.error('👤 [Admin API] Error retrieving admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

// PUT: Update admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`👤 [Admin API] PUT /api/admin/users/${params.id} called`)
  
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

    const { role, name, status } = await request.json()

    // Validate role if provided
    if (role) {
      const validRoles = ['admin', 'moderator', 'super_admin']
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role', success: false },
          { status: 400 }
        )
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'activated', 'disabled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status', success: false },
          { status: 400 }
        )
      }
    }

    // Check if admin user exists
    const adminDocRef = admin.firestore().collection('adminWhitelist').doc(params.id)
    const adminDoc = await adminDocRef.get()
    
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin user not found', success: false },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: currentUserEmail
    }

    if (role) updateData.role = role
    if (name !== undefined) updateData.name = name
    if (status) {
      updateData.status = status
      if (status === 'activated' && adminDoc.data()?.status !== 'activated') {
        updateData.activatedAt = admin.firestore.FieldValue.serverTimestamp()
      }
    }

    // Update admin user
    await adminDocRef.update(updateData)
    
    // Get updated document
    const updatedDoc = await adminDocRef.get()
    const updatedData = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate?.()?.toISOString() || null,
      activatedAt: updatedDoc.data()?.activatedAt?.toDate?.()?.toISOString() || null,
      lastUpdatedAt: updatedDoc.data()?.lastUpdatedAt?.toDate?.()?.toISOString() || null
    }

    console.log(`👤 [Admin API] Updated admin user: ${params.id}`)
    
    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'Admin user updated successfully'
    })

  } catch (error) {
    console.error('👤 [Admin API] Error updating admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

// DELETE: Remove admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`👤 [Admin API] DELETE /api/admin/users/${params.id} called`)
  
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

    // Check if admin user exists
    const adminDocRef = admin.firestore().collection('adminWhitelist').doc(params.id)
    const adminDoc = await adminDocRef.get()
    
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin user not found', success: false },
        { status: 404 }
      )
    }

    // Prevent self-deletion
    const adminData = adminDoc.data()
    if (adminData?.email === currentUserEmail) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account', success: false },
        { status: 400 }
      )
    }

    // Delete admin user
    await adminDocRef.delete()
    
    console.log(`👤 [Admin API] Deleted admin user: ${params.id} (${adminData?.email})`)
    
    return NextResponse.json({
      success: true,
      message: 'Admin user deleted successfully'
    })

  } catch (error) {
    console.error('👤 [Admin API] Error deleting admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}

