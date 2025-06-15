import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/connectFirestoreWithAdmin'

/*
File: /app/api/admin/create-user/route.ts
Purpose: API endpoint to create admin user in Firestore database
*/

export async function POST(request: NextRequest) {
  console.log('🔄 [Create Admin User API] POST /api/admin/create-user called')
  
  try {
    // Simple authentication check
    const { secret, email, role } = await request.json()
    
    // Use migration secret for authentication
    if (secret !== process.env.MIGRATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret', success: false },
        { status: 401 }
      )
    }

    // Default values
    const userEmail = email || 'sanchai5651@gmail.com'
    const userRole = role || 'super_admin'

    console.log(`🔄 Creating admin user: ${userEmail} with role: ${userRole}`)
    
    // Create adminWhitelist entry
    const adminRef = db.collection('adminWhitelist').doc(userEmail)
    await adminRef.set({
      email: userEmail,
      role: userRole,
      createdAt: new Date(),
      createdBy: 'api_migration',
      active: true
    })
    
    console.log('✅ Admin whitelist entry created')
    
    // Create users entry
    const userRef = db.collection('users').doc(userEmail)
    await userRef.set({
      email: userEmail,
      role: userRole,
      displayName: userRole === 'super_admin' ? 'Super Admin' : 'Admin',
      createdAt: new Date(),
      lastLogin: null,
      active: true
    })
    
    console.log('✅ User entry created')
    
    return NextResponse.json({
      success: true,
      message: `Admin user ${userEmail} created successfully`,
      data: {
        email: userEmail,
        role: userRole
      }
    })

  } catch (error) {
    console.error('🔄 [Create Admin User API] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create admin user', 
        details: error.message, 
        success: false 
      },
      { status: 500 }
    )
  }
}

