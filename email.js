// email.js - Email service for role assignment notifications
import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  roleAssignment: {
    admin: {
      subject: '🎉 คุณได้รับสิทธิ์ Admin - SSS Surplus Marketplace',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎉 ยินดีด้วย!</h1>
            <p style="color: white; margin: 10px 0 0 0;">คุณได้รับสิทธิ์ Admin แล้ว</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">สวัสดี ${data.userName}</h2>
            <p style="color: #666; line-height: 1.6;">
              ยินดีด้วย! คุณได้รับสิทธิ์ <strong>Admin</strong> ในระบบ SSS Surplus Marketplace แล้ว
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">สิทธิ์ที่คุณได้รับ:</h3>
              <ul style="color: #666;">
                <li>จัดการ Vendors และอนุมัติการสมัคร</li>
                <li>จัดการสินค้าและหมวดหมู่</li>
                <li>ดูรายงานและสถิติการขาย</li>
                <li>จัดการคำสั่งซื้อและการชำระเงิน</li>
                <li>ตั้งค่าระบบขั้นพื้นฐาน</li>
              </ul>
            </div>
            
            ${data.reason ? `
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>หมายเหตุ:</strong> ${data.reason}
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/admin/dashboard" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                เข้าสู่ Admin Dashboard
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              อนุมัติโดย: ${data.assignedBy}<br>
              วันที่: ${new Date().toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>
      `
    },
    
    vendor: {
      subject: '🏪 คุณได้รับสิทธิ์ Vendor - SSS Surplus Marketplace',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏪 ยินดีต้อนรับ!</h1>
            <p style="color: white; margin: 10px 0 0 0;">คุณได้รับสิทธิ์ Vendor แล้ว</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">สวัสดี ${data.userName}</h2>
            <p style="color: #666; line-height: 1.6;">
              ยินดีด้วย! คุณได้รับสิทธิ์ <strong>Vendor</strong> ในระบบ SSS Surplus Marketplace แล้ว
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">สิทธิ์ที่คุณได้รับ:</h3>
              <ul style="color: #666;">
                <li>เพิ่มและจัดการสินค้าของคุณ</li>
                <li>ตั้งราคาและจัดการสต็อก</li>
                <li>ดูคำสั่งซื้อและจัดการการส่งสินค้า</li>
                <li>ดูรายงานยอดขายของคุณ</li>
                <li>จัดการโปรไฟล์ร้านค้า</li>
              </ul>
            </div>
            
            ${data.reason ? `
              <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>หมายเหตุ:</strong> ${data.reason}
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/vendor/dashboard" 
                 style="background: #11998e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                เข้าสู่ Vendor Dashboard
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              อนุมัติโดย: ${data.assignedBy}<br>
              วันที่: ${new Date().toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>
      `
    },
    
    customer: {
      subject: '👤 ยินดีต้อนรับสู่ SSS Surplus Marketplace',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">👤 ยินดีต้อนรับ!</h1>
            <p style="color: white; margin: 10px 0 0 0;">บัญชีของคุณพร้อมใช้งานแล้ว</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">สวัสดี ${data.userName}</h2>
            <p style="color: #666; line-height: 1.6;">
              ยินดีต้อนรับสู่ SSS Surplus Marketplace! บัญชีของคุณได้รับการอนุมัติแล้ว
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">คุณสามารถ:</h3>
              <ul style="color: #666;">
                <li>เลือกซื้อสินค้าจากร้านค้าต่างๆ</li>
                <li>เจรจาราคากับผู้ขาย</li>
                <li>ติดตามสถานะคำสั่งซื้อ</li>
                <li>จัดการโปรไฟล์และที่อยู่</li>
                <li>ดูประวัติการสั่งซื้อ</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/customer/dashboard" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                เริ่มช้อปปิ้ง
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              วันที่: ${new Date().toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>
      `
    }
  },

  newUserNotification: {
    subject: '🔔 มีผู้ใช้ใหม่รอการอนุมัติ - SSS Surplus Marketplace',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f59e0b; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🔔 ผู้ใช้ใหม่รอการอนุมัติ</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <p style="color: #666;">มีผู้ใช้ใหม่เข้าสู่ระบบและรอการอนุมัติ:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>ชื่อ:</strong> ${data.user.name}</p>
            <p><strong>อีเมล:</strong> ${data.user.email}</p>
            <p><strong>Provider:</strong> ${data.user.provider}</p>
            <p><strong>วันที่สมัคร:</strong> ${new Date().toLocaleDateString('th-TH')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/admin/super/dashboard" 
               style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              จัดการผู้ใช้
            </a>
          </div>
        </div>
      </div>
    `
  }
};

// Main function to send role assignment email
export async function sendRoleAssignmentEmail({ to, userName, role, assignedBy, reason }) {
  try {
    const transporter = createTransporter();
    
    const template = emailTemplates.roleAssignment[role];
    if (!template) {
      throw new Error(`No email template found for role: ${role}`);
    }

    const mailOptions = {
      from: `"SSS Surplus Marketplace" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html({ userName, assignedBy, reason })
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Role assignment email sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending role assignment email:', error);
    throw error;
  }
}

// Function to send new user notification to Super Admin
export async function sendNewUserNotification(userData) {
  try {
    const transporter = createTransporter();
    
    // Get Super Admin emails
    const superAdminEmails = process.env.SUPER_ADMIN_EMAILS?.split(',') || [];
    
    if (superAdminEmails.length === 0) {
      console.warn('No Super Admin emails configured');
      return;
    }

    const template = emailTemplates.newUserNotification;
    
    const mailOptions = {
      from: `"SSS Surplus Marketplace" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: superAdminEmails,
      subject: template.subject,
      html: template.html({ user: userData })
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('New user notification sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending new user notification:', error);
    throw error;
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

