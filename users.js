// users.js - API endpoint for user management
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super Admin required.' });
    }

    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUsers(req, res) {
  try {
    const { page = 1, limit = 50, role, search } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (role && role !== 'all') {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [
          { role: 'asc' }, // Pending users first
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          isActive: true,
        }
      }),
      prisma.user.count({ where })
    ]);

    // Get role statistics
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    const stats = roleStats.reduce((acc, stat) => {
      acc[stat.role] = stat._count.role;
      return acc;
    }, {});

    res.status(200).json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}

async function createUser(req, res) {
  try {
    const { email, name, role, provider = 'manual' } = req.body;

    // Validate input
    if (!email || !name || !role) {
      return res.status(400).json({ message: 'Email, name, and role are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        provider,
        emailVerified: new Date(),
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        createdAt: true,
      }
    });

    // Log the action
    await prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        action: 'CREATE_USER',
        targetUserId: user.id,
        details: {
          email: user.email,
          role: user.role,
          provider: user.provider
        }
      }
    }).catch(console.error);

    res.status(201).json({ user, message: 'User created successfully' });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

