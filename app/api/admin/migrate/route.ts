import { NextRequest, NextResponse } from 'next/server'
import { migrateEnvSuperAdminsToDatabase } from '@/lib/roleManager'

/*
File: /app/api/admin/migrate/route.ts
Version: 1.0 | 2025-06-13
note: Migration API for moving super admins from ENV to database - Phase 3 of Incremental Refactoring
Purpose: One-time migration to move from environment variable based admin management to database
*/

export async function POST(request: NextRequest) {
  console.log('🔄 [Migration API] POST /api/admin/migrate called')
  
  try {
    // Simple authentication check - this should be called by system admin only
    const { secret } = await request.json()
    
    // Use a simple secret for migration (in production, this should be more secure)
    if (secret !== process.env.MIGRATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid migration secret', success: false },
        { status: 401 }
      )
    }

    // Perform migration
    await migrateEnvSuperAdminsToDatabase()
    
    console.log('🔄 [Migration API] Migration completed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Super admin migration completed successfully'
    })

  } catch (error) {
    console.error('🔄 [Migration API] Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error.message, success: false },
      { status: 500 }
    )
  }
}

