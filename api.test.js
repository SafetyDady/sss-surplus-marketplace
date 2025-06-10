// api.test.js - Test cases for API endpoints
import { createMocks } from 'node-mocks-http';
import superAdminLoginHandler from '../pages/api/auth/super-admin-login';
import usersHandler from '../pages/api/admin/users';
import roleHandler from '../pages/api/admin/users/[userId]/role';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    loginLog: {
      create: jest.fn(),
    },
    roleAssignment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    adminAction: {
      create: jest.fn(),
    },
  },
}));

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock email service
jest.mock('../lib/email', () => ({
  sendRoleAssignmentEmail: jest.fn(),
}));

import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { sendRoleAssignmentEmail } from '../lib/email';

describe('API Endpoints Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/api/auth/super-admin-login', () => {
    test('successful Super Admin login', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'sanchai5651@gmail.com',
          password: 'Safety17',
        },
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'test-agent',
        },
      });

      // Mock environment variables
      process.env.SUPER_ADMIN_EMAILS = 'sanchai5651@gmail.com';
      process.env.SUPER_ADMIN_PASSWORD = 'Safety17';
      process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED = 'true';
      process.env.SUPER_ADMIN_MODE = 'true';
      process.env.NEXTAUTH_SECRET = 'test-secret';

      // Mock database responses
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'sanchai5651@gmail.com',
        name: 'System Administrator',
        role: 'super_admin',
      });

      prisma.loginLog.create.mockResolvedValue({});

      await superAdminLoginHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.user.role).toBe('super_admin');
      expect(data.redirectTo).toBe('/admin/super/dashboard');
    });

    test('invalid credentials', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'wrong@email.com',
          password: 'wrongpassword',
        },
      });

      process.env.SUPER_ADMIN_EMAILS = 'sanchai5651@gmail.com';
      process.env.SUPER_ADMIN_PASSWORD = 'Safety17';
      process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED = 'true';
      process.env.SUPER_ADMIN_MODE = 'true';

      await superAdminLoginHandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('ข้อมูลเข้าสู่ระบบไม่ถูกต้อง');
    });

    test('Super Admin disabled', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'sanchai5651@gmail.com',
          password: 'Safety17',
        },
      });

      process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED = 'false';

      await superAdminLoginHandler(req, res);

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Super Admin access is disabled');
    });

    test('method not allowed', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      await superAdminLoginHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
    });
  });

  describe('/api/admin/users', () => {
    beforeEach(() => {
      getServerSession.mockResolvedValue({
        user: { id: '1', role: 'super_admin' },
      });
    });

    test('get users with pagination', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { page: '1', limit: '10' },
      });

      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User 1',
          role: 'pending',
          provider: 'google',
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User 2',
          role: 'admin',
          provider: 'facebook',
          createdAt: new Date(),
        },
      ];

      const mockStats = [
        { role: 'pending', _count: { role: 1 } },
        { role: 'admin', _count: { role: 1 } },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(2);
      prisma.user.groupBy.mockResolvedValue(mockStats);

      await usersHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.users).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
      expect(data.stats.pending).toBe(1);
      expect(data.stats.admin).toBe(1);
    });

    test('create new user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'newuser@example.com',
          name: 'New User',
          role: 'admin',
        },
      });

      const mockUser = {
        id: '3',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'admin',
        provider: 'manual',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.adminAction.create.mockResolvedValue({});

      await usersHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.user.email).toBe('newuser@example.com');
      expect(data.message).toBe('User created successfully');
    });

    test('create user with existing email', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'existing@example.com',
          name: 'Existing User',
          role: 'admin',
        },
      });

      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'existing@example.com',
      });

      await usersHandler(req, res);

      expect(res._getStatusCode()).toBe(409);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('User with this email already exists');
    });

    test('unauthorized access', async () => {
      getServerSession.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'GET',
      });

      await usersHandler(req, res);

      expect(res._getStatusCode()).toBe(403);
    });
  });

  describe('/api/admin/users/[userId]/role', () => {
    beforeEach(() => {
      getServerSession.mockResolvedValue({
        user: { id: '1', role: 'super_admin', name: 'Super Admin' },
      });
    });

    test('assign admin role successfully', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { userId: '2' },
        body: {
          role: 'admin',
          reason: 'Promoted to admin',
        },
      });

      const mockTargetUser = {
        id: '2',
        email: 'user@example.com',
        name: 'Target User',
        role: 'pending',
      };

      const mockUpdatedUser = {
        ...mockTargetUser,
        role: 'admin',
        assignedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockTargetUser);
      prisma.user.update.mockResolvedValue(mockUpdatedUser);
      prisma.roleAssignment.create.mockResolvedValue({});
      prisma.adminAction.create.mockResolvedValue({});
      sendRoleAssignmentEmail.mockResolvedValue({});

      await roleHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Role assigned successfully');
      expect(data.user.role).toBe('admin');

      expect(sendRoleAssignmentEmail).toHaveBeenCalledWith({
        to: 'user@example.com',
        userName: 'Target User',
        role: 'admin',
        assignedBy: 'Super Admin',
        reason: 'Promoted to admin',
      });
    });

    test('admin cannot assign admin role', async () => {
      getServerSession.mockResolvedValue({
        user: { id: '1', role: 'admin' },
      });

      const { req, res } = createMocks({
        method: 'PUT',
        query: { userId: '2' },
        body: {
          role: 'admin',
        },
      });

      await roleHandler(req, res);

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Only Super Admin can assign Admin role');
    });

    test('cannot modify super admin role', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { userId: '2' },
        body: {
          role: 'admin',
        },
      });

      prisma.user.findUnique.mockResolvedValue({
        id: '2',
        email: 'superadmin@example.com',
        role: 'super_admin',
      });

      await roleHandler(req, res);

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('Cannot modify Super Admin role');
    });

    test('user not found', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { userId: '999' },
        body: {
          role: 'admin',
        },
      });

      prisma.user.findUnique.mockResolvedValue(null);

      await roleHandler(req, res);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe('User not found');
    });

    test('get role history', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { userId: '2' },
      });

      const mockRoleHistory = [
        {
          id: '1',
          userId: '2',
          fromRole: 'pending',
          toRole: 'admin',
          reason: 'Promoted',
          assignedAt: new Date(),
          assignedByUser: {
            name: 'Super Admin',
            email: 'super@example.com',
            role: 'super_admin',
          },
        },
      ];

      prisma.roleAssignment.findMany.mockResolvedValue(mockRoleHistory);

      await roleHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.roleHistory).toHaveLength(1);
      expect(data.roleHistory[0].toRole).toBe('admin');
    });
  });
});

