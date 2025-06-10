// auth.test.js - Test cases for authentication system
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn, signOut, getSession } from 'next-auth/react';
import AdminVendorSocialLogin from '../components/AdminVendorSocialLogin';
import PendingApprovalPage from '../components/PendingApprovalPage';
import SuperAdminDashboard from '../components/SuperAdminDashboard';

// Mock NextAuth
jest.mock('next-auth/react');

// Mock fetch
global.fetch = jest.fn();

describe('Authentication System Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    signIn.mockClear();
    signOut.mockClear();
    getSession.mockClear();
  });

  describe('AdminVendorSocialLogin Component', () => {
    test('renders login form with all login types', () => {
      render(<AdminVendorSocialLogin />);
      
      expect(screen.getByText('Admin Portal')).toBeInTheDocument();
      expect(screen.getByText('เข้าสู่ระบบด้วย Google')).toBeInTheDocument();
      expect(screen.getByText('เข้าสู่ระบบด้วย Facebook')).toBeInTheDocument();
      expect(screen.getByText('เข้าสู่ระบบด้วย Line')).toBeInTheDocument();
    });

    test('switches between Admin and Vendor login types', () => {
      render(<AdminVendorSocialLogin />);
      
      const vendorButton = screen.getByText('Vendor');
      fireEvent.click(vendorButton);
      
      expect(screen.getByText('Vendor Portal')).toBeInTheDocument();
      expect(screen.getByText('ระบบจัดการสำหรับผู้ขาย')).toBeInTheDocument();
    });

    test('shows Super Admin credentials form when selected', () => {
      render(<AdminVendorSocialLogin />);
      
      const superAdminButton = screen.getByText('Super');
      fireEvent.click(superAdminButton);
      
      expect(screen.getByText('Super Admin Portal')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('sanchai5651@gmail.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    test('handles social login for Admin', async () => {
      // Mock window.location
      delete window.location;
      window.location = { href: '' };

      render(<AdminVendorSocialLogin />);
      
      const googleButton = screen.getByText('เข้าสู่ระบบด้วย Google');
      fireEvent.click(googleButton);
      
      await waitFor(() => {
        expect(window.location.href).toContain('/api/auth/signin/google');
        expect(window.location.href).toContain('type=admin');
      });
    });

    test('handles Super Admin credential login', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-token',
          user: { id: '1', email: 'admin@test.com', role: 'super_admin' },
          redirectTo: '/admin/super/dashboard'
        })
      });

      // Mock window.location
      delete window.location;
      window.location = { href: '' };

      render(<AdminVendorSocialLogin />);
      
      // Switch to Super Admin
      const superAdminButton = screen.getByText('Super');
      fireEvent.click(superAdminButton);
      
      // Fill credentials
      const emailInput = screen.getByPlaceholderText('sanchai5651@gmail.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'sanchai5651@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Safety17' } });
      
      // Submit form
      const submitButton = screen.getByText('เข้าสู่ระบบ SUPER ADMIN');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/super-admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'sanchai5651@gmail.com',
            password: 'Safety17'
          })
        });
      });
    });

    test('handles Super Admin login failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง'
        })
      });

      // Mock alert
      window.alert = jest.fn();

      render(<AdminVendorSocialLogin />);
      
      // Switch to Super Admin and submit invalid credentials
      const superAdminButton = screen.getByText('Super');
      fireEvent.click(superAdminButton);
      
      const emailInput = screen.getByPlaceholderText('sanchai5651@gmail.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      
      const submitButton = screen.getByText('เข้าสู่ระบบ SUPER ADMIN');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('ข้อมูลเข้าสู่ระบบไม่ถูกต้อง');
      });
    });
  });

  describe('PendingApprovalPage Component', () => {
    test('renders pending approval message', () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'google',
        role: 'pending'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      render(<PendingApprovalPage />);
      
      expect(screen.getByText('รอการอนุมัติบัญชี')).toBeInTheDocument();
      expect(screen.getByText('ขั้นตอนการอนุมัติ:')).toBeInTheDocument();
    });

    test('redirects when role is assigned', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'google',
        role: 'admin'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      // Mock window.location
      delete window.location;
      window.location = { href: '' };

      render(<PendingApprovalPage />);
      
      await waitFor(() => {
        expect(window.location.href).toBe('/admin/dashboard');
      });
    });

    test('handles status check', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'google',
        role: 'pending'
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser
      });

      render(<PendingApprovalPage />);
      
      const checkButton = screen.getByText('ตรวจสอบสถานะอีกครั้ง');
      fireEvent.click(checkButton);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
          headers: {
            'Authorization': 'Bearer null'
          }
        });
      });
    });
  });

  describe('SuperAdminDashboard Component', () => {
    const mockUsers = [
      {
        id: '1',
        name: 'Pending User',
        email: 'pending@example.com',
        role: 'pending',
        provider: 'google',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        provider: 'google',
        created_at: '2024-01-01T00:00:00Z'
      }
    ];

    test('renders dashboard with user statistics', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: mockUsers,
          stats: { pending: 1, admin: 1, vendor: 0, customer: 0 }
        })
      });

      render(<SuperAdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Super Admin Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Pending Users (1)')).toBeInTheDocument();
      });
    });

    test('assigns admin role to pending user', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            users: mockUsers,
            stats: { pending: 1, admin: 1, vendor: 0, customer: 0 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Role assigned successfully' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            users: mockUsers.map(u => u.id === '1' ? { ...u, role: 'admin' } : u),
            stats: { pending: 0, admin: 2, vendor: 0, customer: 0 }
          })
        });

      render(<SuperAdminDashboard />);
      
      await waitFor(() => {
        const adminButton = screen.getByTitle('Assign as Admin');
        fireEvent.click(adminButton);
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/users/1/role', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer null'
          },
          body: JSON.stringify({ role: 'admin', reason: '' })
        });
      });
    });

    test('filters users by search term', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: mockUsers,
          stats: { pending: 1, admin: 1, vendor: 0, customer: 0 }
        })
      });

      render(<SuperAdminDashboard />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search users...');
        fireEvent.change(searchInput, { target: { value: 'pending' } });
        
        expect(screen.getByText('Pending User')).toBeInTheDocument();
        expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
      });
    });

    test('switches between pending and all users tabs', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: mockUsers,
          stats: { pending: 1, admin: 1, vendor: 0, customer: 0 }
        })
      });

      render(<SuperAdminDashboard />);
      
      await waitFor(() => {
        const allUsersTab = screen.getByText('All Users (2)');
        fireEvent.click(allUsersTab);
        
        expect(screen.getByText('Pending User')).toBeInTheDocument();
        expect(screen.getByText('Admin User')).toBeInTheDocument();
      });
    });
  });
});

