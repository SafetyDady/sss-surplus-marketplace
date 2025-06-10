// super-admin-login.js - API endpoint for Super Admin credential login
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
      });
    }

    // Check against environment variables
    const superAdminEmail = process.env.SUPER_ADMIN_EMAILS;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminEnabled = process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED === 'true';
    const superAdminMode = process.env.SUPER_ADMIN_MODE === 'true';

    if (!superAdminEnabled || !superAdminMode) {
      return res.status(403).json({ 
        success: false, 
        message: 'Super Admin access is disabled' 
      });
    }

    // Validate credentials
    if (email !== superAdminEmail || password !== superAdminPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' 
      });
    }

    // Check if Super Admin user exists in database
    let superAdminUser = await prisma.user.findUnique({
      where: { email: superAdminEmail }
    });

    // Create Super Admin user if doesn't exist
    if (!superAdminUser) {
      superAdminUser = await prisma.user.create({
        data: {
          email: superAdminEmail,
          name: process.env.SUPER_ADMIN_NAME || 'System Administrator',
          role: 'super_admin',
          provider: 'credentials',
          emailVerified: new Date(),
          isActive: true,
        }
      });
    } else if (superAdminUser.role !== 'super_admin') {
      // Update role if user exists but not super admin
      superAdminUser = await prisma.user.update({
        where: { id: superAdminUser.id },
        data: { role: 'super_admin' }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: superAdminUser.id,
        email: superAdminUser.email,
        role: 'super_admin',
        type: 'super_admin_session'
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Log successful login
    await prisma.loginLog.create({
      data: {
        userId: superAdminUser.id,
        loginType: 'super_admin_credentials',
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        success: true,
      }
    }).catch(console.error); // Don't fail if logging fails

    // Return success response
    res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token: token,
      user: {
        id: superAdminUser.id,
        email: superAdminUser.email,
        name: superAdminUser.name,
        role: superAdminUser.role,
      },
      redirectTo: '/admin/super/dashboard'
    });

  } catch (error) {
    console.error('Super Admin login error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในระบบ' 
    });
  }
}

