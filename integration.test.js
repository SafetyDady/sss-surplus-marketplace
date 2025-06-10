// integration.test.js - Integration test scenarios
import { chromium } from 'playwright';

describe('Integration Tests - Role-based Authentication Flow', () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterEach(async () => {
    await context.close();
  });

  describe('Complete User Journey Tests', () => {
    test('Scenario 1: New user social login and role assignment', async () => {
      // Step 1: Navigate to login page
      await page.goto('http://localhost:3000/auth/signin');
      
      // Step 2: Select Admin login type
      await page.click('[data-testid="admin-tab"]');
      await expect(page.locator('text=Admin Portal')).toBeVisible();
      
      // Step 3: Mock Google OAuth (in real test, would use test OAuth)
      await page.route('**/api/auth/signin/google*', route => {
        route.fulfill({
          status: 302,
          headers: {
            'Location': '/pending-approval?provider=google&email=newuser@example.com'
          }
        });
      });
      
      // Step 4: Click Google login
      await page.click('[data-testid="google-login-btn"]');
      
      // Step 5: Should redirect to pending approval page
      await expect(page).toHaveURL(/.*pending-approval.*/);
      await expect(page.locator('text=รอการอนุมัติบัญชี')).toBeVisible();
      
      // Step 6: Verify pending user appears in Super Admin dashboard
      // (This would require Super Admin login in separate context)
      const adminContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      
      await adminPage.goto('http://localhost:3000/auth/signin');
      await adminPage.click('[data-testid="super-admin-tab"]');
      await adminPage.fill('[data-testid="email-input"]', 'sanchai5651@gmail.com');
      await adminPage.fill('[data-testid="password-input"]', 'Safety17');
      await adminPage.click('[data-testid="super-admin-login-btn"]');
      
      // Should redirect to Super Admin dashboard
      await expect(adminPage).toHaveURL(/.*admin\/super\/dashboard.*/);
      await expect(adminPage.locator('text=newuser@example.com')).toBeVisible();
      
      // Step 7: Assign admin role
      await adminPage.click('[data-testid="assign-admin-newuser@example.com"]');
      await adminPage.fill('[data-testid="reason-input"]', 'New admin assignment');
      await adminPage.click('[data-testid="confirm-assign-btn"]');
      
      // Step 8: Verify role assignment success
      await expect(adminPage.locator('text=Role assigned successfully')).toBeVisible();
      
      // Step 9: Check that pending user can now access admin dashboard
      await page.reload();
      await expect(page).toHaveURL(/.*admin\/dashboard.*/);
      await expect(page.locator('text=Admin Dashboard')).toBeVisible();
      
      await adminContext.close();
    });

    test('Scenario 2: Super Admin login and user management', async () => {
      // Step 1: Navigate to login page
      await page.goto('http://localhost:3000/auth/signin');
      
      // Step 2: Switch to Super Admin login
      await page.click('[data-testid="super-admin-tab"]');
      await expect(page.locator('text=Super Admin Portal')).toBeVisible();
      
      // Step 3: Enter credentials
      await page.fill('[data-testid="email-input"]', 'sanchai5651@gmail.com');
      await page.fill('[data-testid="password-input"]', 'Safety17');
      
      // Step 4: Submit login
      await page.click('[data-testid="super-admin-login-btn"]');
      
      // Step 5: Should redirect to Super Admin dashboard
      await expect(page).toHaveURL(/.*admin\/super\/dashboard.*/);
      await expect(page.locator('text=Super Admin Dashboard')).toBeVisible();
      
      // Step 6: Check user statistics
      await expect(page.locator('[data-testid="pending-users-count"]')).toBeVisible();
      await expect(page.locator('[data-testid="admin-users-count"]')).toBeVisible();
      
      // Step 7: Search for users
      await page.fill('[data-testid="user-search"]', 'test@example.com');
      await page.keyboard.press('Enter');
      
      // Step 8: Filter by role
      await page.selectOption('[data-testid="role-filter"]', 'pending');
      await expect(page.locator('[data-testid="user-list"] .pending-user')).toBeVisible();
      
      // Step 9: Assign vendor role
      await page.click('[data-testid="assign-vendor-btn"]');
      await page.fill('[data-testid="assignment-reason"]', 'Approved vendor application');
      await page.click('[data-testid="confirm-assignment"]');
      
      // Step 10: Verify assignment
      await expect(page.locator('text=Role assigned successfully')).toBeVisible();
      await expect(page.locator('.vendor-user')).toBeVisible();
    });

    test('Scenario 3: Admin assigns vendor role', async () => {
      // Step 1: Login as Admin
      await page.goto('http://localhost:3000/auth/signin');
      
      // Mock admin session
      await page.addInitScript(() => {
        window.localStorage.setItem('next-auth.session-token', 'mock-admin-token');
      });
      
      await page.goto('http://localhost:3000/admin/dashboard');
      
      // Step 2: Navigate to user management
      await page.click('[data-testid="user-management-link"]');
      await expect(page).toHaveURL(/.*admin\/users.*/);
      
      // Step 3: Find pending vendor application
      await page.fill('[data-testid="search-users"]', 'vendor@example.com');
      await expect(page.locator('text=vendor@example.com')).toBeVisible();
      
      // Step 4: Assign vendor role (Admin can only assign vendor, not admin)
      await page.click('[data-testid="assign-vendor-vendor@example.com"]');
      await page.fill('[data-testid="vendor-reason"]', 'Vendor application approved');
      await page.click('[data-testid="confirm-vendor-assignment"]');
      
      // Step 5: Verify assignment
      await expect(page.locator('text=Vendor role assigned')).toBeVisible();
      
      // Step 6: Verify admin cannot assign admin role
      await page.click('[data-testid="assign-admin-btn"]');
      await expect(page.locator('text=Insufficient permissions')).toBeVisible();
    });

    test('Scenario 4: Middleware protection and redirects', async () => {
      // Step 1: Try to access admin page without login
      await page.goto('http://localhost:3000/admin/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*auth\/signin.*/);
      
      // Step 2: Login as customer
      await page.addInitScript(() => {
        window.localStorage.setItem('next-auth.session-token', 'mock-customer-token');
        window.sessionStorage.setItem('user-role', 'customer');
      });
      
      // Step 3: Try to access admin page as customer
      await page.goto('http://localhost:3000/admin/dashboard');
      
      // Should redirect to customer dashboard
      await expect(page).toHaveURL(/.*customer\/dashboard.*/);
      
      // Step 4: Try to access vendor page as customer
      await page.goto('http://localhost:3000/vendor/dashboard');
      
      // Should redirect to customer dashboard
      await expect(page).toHaveURL(/.*customer\/dashboard.*/);
      
      // Step 5: Access allowed customer pages
      await page.goto('http://localhost:3000/customer/orders');
      await expect(page).toHaveURL(/.*customer\/orders.*/);
    });

    test('Scenario 5: Email notifications flow', async () => {
      // Mock email service
      await page.route('**/api/admin/notify-new-user', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      // Step 1: New user signs up
      await page.goto('http://localhost:3000/auth/signin');
      await page.click('[data-testid="vendor-tab"]');
      
      // Mock social login
      await page.route('**/api/auth/signin/google*', route => {
        route.fulfill({
          status: 302,
          headers: {
            'Location': '/pending-approval?newUser=true'
          }
        });
      });
      
      await page.click('[data-testid="google-login-btn"]');
      
      // Step 2: Verify notification was sent
      const requests = [];
      page.on('request', request => {
        if (request.url().includes('/api/admin/notify-new-user')) {
          requests.push(request);
        }
      });
      
      await page.waitForTimeout(1000);
      expect(requests.length).toBeGreaterThan(0);
      
      // Step 3: Super Admin receives notification and assigns role
      const adminContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      
      await adminPage.goto('http://localhost:3000/admin/super/dashboard');
      await expect(adminPage.locator('[data-testid="new-user-notification"]')).toBeVisible();
      
      // Step 4: Assign role and verify email is sent
      await adminPage.route('**/api/admin/send-role-email', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ emailSent: true })
        });
      });
      
      await adminPage.click('[data-testid="assign-vendor-btn"]');
      await adminPage.fill('[data-testid="reason-input"]', 'Welcome new vendor');
      await adminPage.click('[data-testid="confirm-btn"]');
      
      // Verify email notification request
      const emailRequests = [];
      adminPage.on('request', request => {
        if (request.url().includes('/api/admin/send-role-email')) {
          emailRequests.push(request);
        }
      });
      
      await adminPage.waitForTimeout(1000);
      expect(emailRequests.length).toBeGreaterThan(0);
      
      await adminContext.close();
    });
  });

  describe('Error Handling Tests', () => {
    test('Network error during login', async () => {
      await page.goto('http://localhost:3000/auth/signin');
      
      // Mock network error
      await page.route('**/api/auth/super-admin-login', route => {
        route.abort('failed');
      });
      
      await page.click('[data-testid="super-admin-tab"]');
      await page.fill('[data-testid="email-input"]', 'sanchai5651@gmail.com');
      await page.fill('[data-testid="password-input"]', 'Safety17');
      await page.click('[data-testid="super-admin-login-btn"]');
      
      await expect(page.locator('text=Network error')).toBeVisible();
    });

    test('Invalid Super Admin credentials', async () => {
      await page.goto('http://localhost:3000/auth/signin');
      
      await page.route('**/api/auth/super-admin-login', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง'
          })
        });
      });
      
      await page.click('[data-testid="super-admin-tab"]');
      await page.fill('[data-testid="email-input"]', 'wrong@email.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="super-admin-login-btn"]');
      
      await expect(page.locator('text=ข้อมูลเข้าสู่ระบบไม่ถูกต้อง')).toBeVisible();
    });

    test('Session expiry handling', async () => {
      // Mock expired session
      await page.addInitScript(() => {
        window.localStorage.setItem('next-auth.session-token', 'expired-token');
      });
      
      await page.goto('http://localhost:3000/admin/dashboard');
      
      await page.route('**/api/auth/session', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Session expired' })
        });
      });
      
      await page.reload();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*auth\/signin.*/);
      await expect(page.locator('text=Session expired')).toBeVisible();
    });
  });
});

