// app/api/auth/super-admin-login/route.js - Next.js 13+ App Router API
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return Response.json({ 
        success: false, 
        message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
      }, { status: 400 });
    }

    // Check against environment variables
    const superAdminEmail = process.env.SUPER_ADMIN_EMAILS;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminEnabled = process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED === 'true';
    const superAdminMode = process.env.SUPER_ADMIN_MODE === 'true';

    console.log('Super Admin Login Attempt:', {
      email,
      superAdminEmail,
      superAdminEnabled,
      superAdminMode,
      passwordMatch: password === superAdminPassword
    });

    if (!superAdminEnabled || !superAdminMode) {
      return Response.json({ 
        success: false, 
        message: 'Super Admin access is disabled' 
      }, { status: 403 });
    }

    // Validate credentials
    if (email !== superAdminEmail || password !== superAdminPassword) {
      return Response.json({ 
        success: false, 
        message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' 
      }, { status: 401 });
    }

    // Generate JWT token (simplified without database)
    const token = jwt.sign(
      { 
        email: superAdminEmail,
        role: 'super_admin',
        type: 'super_admin_session',
        name: process.env.SUPER_ADMIN_NAME || 'System Administrator'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
      { expiresIn: '24h' }
    );

    // Return success response
    return Response.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token: token,
      user: {
        email: superAdminEmail,
        name: process.env.SUPER_ADMIN_NAME || 'System Administrator',
        role: 'super_admin',
      },
      redirectTo: '/admin/super/dashboard'
    });

  } catch (error) {
    console.error('Super Admin login error:', error);
    
    return Response.json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในระบบ: ' + error.message 
    }, { status: 500 });
  }
}

