// [userId]/role.js - API endpoint for role assignment
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '../../../../lib/prisma';
import { sendRoleAssignmentEmail } from '../../../../lib/email';

export default async function handler(req, res) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check permissions
    const canAssignRoles = session.user.role === 'super_admin' || 
                          (session.user.role === 'admin' && req.body.role === 'vendor');
    
    if (!canAssignRoles) {
      return res.status(403).json({ message: 'Insufficient permissions to assign roles' });
    }

    const { userId } = req.query;

    switch (req.method) {
      case 'PUT':
        return await assignRole(req, res, userId, session);
      case 'GET':
        return await getRoleHistory(req, res, userId);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Role assignment API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function assignRole(req, res, userId, session) {
  try {
    const { role, reason = '' } = req.body;

    // Validate role
    const validRoles = ['admin', 'vendor', 'customer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Additional permission check for admin role
    if (role === 'admin' && session.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admin can assign Admin role' });
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-role modification for super admin
    if (targetUser.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot modify Super Admin role' });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role,
        assignedAt: new Date(),
        assignedBy: session.user.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        assignedAt: true,
      }
    });

    // Create role assignment record
    await prisma.roleAssignment.create({
      data: {
        userId: userId,
        assignedBy: session.user.id,
        fromRole: targetUser.role,
        toRole: role,
        reason: reason,
        assignedAt: new Date(),
      }
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        action: 'ASSIGN_ROLE',
        targetUserId: userId,
        details: {
          fromRole: targetUser.role,
          toRole: role,
          reason: reason,
          userEmail: targetUser.email
        }
      }
    }).catch(console.error);

    // Send email notification to user
    try {
      await sendRoleAssignmentEmail({
        to: targetUser.email,
        userName: targetUser.name,
        role: role,
        assignedBy: session.user.name,
        reason: reason
      });
    } catch (emailError) {
      console.error('Failed to send role assignment email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification to other admins if assigning admin role
    if (role === 'admin') {
      try {
        await notifyAdminsOfNewAdmin(targetUser, session.user);
      } catch (notifyError) {
        console.error('Failed to notify admins:', notifyError);
      }
    }

    res.status(200).json({
      message: 'Role assigned successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ message: 'Failed to assign role' });
  }
}

async function getRoleHistory(req, res, userId) {
  try {
    const roleHistory = await prisma.roleAssignment.findMany({
      where: { userId },
      include: {
        assignedByUser: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    res.status(200).json({ roleHistory });

  } catch (error) {
    console.error('Get role history error:', error);
    res.status(500).json({ message: 'Failed to fetch role history' });
  }
}

async function notifyAdminsOfNewAdmin(newAdmin, assignedBy) {
  try {
    // Get all super admins
    const superAdmins = await prisma.user.findMany({
      where: { 
        role: 'super_admin',
        isActive: true,
        NOT: { id: assignedBy.id } // Exclude the one who assigned
      },
      select: { email: true, name: true }
    });

    // Send notifications
    for (const admin of superAdmins) {
      await sendRoleAssignmentEmail({
        to: admin.email,
        userName: admin.name,
        role: 'notification',
        template: 'new_admin_assigned',
        data: {
          newAdminName: newAdmin.name,
          newAdminEmail: newAdmin.email,
          assignedBy: assignedBy.name
        }
      });
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
}

