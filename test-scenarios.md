# test-scenarios.md - Manual Testing Scenarios

## 🧪 Manual Testing Scenarios for Role-based Authentication

### Prerequisites
- Database with migrations applied
- Environment variables configured
- Email service configured (optional for email tests)
- Test social OAuth apps configured

---

## 📋 Test Scenario 1: Super Admin First Login

### Objective
Verify Super Admin can login with environment credentials and access dashboard

### Steps
1. **Navigate to login page**
   - Go to `/auth/signin`
   - Verify all login options are visible

2. **Select Super Admin login**
   - Click "Super" tab
   - Verify Super Admin form appears
   - Check placeholder shows correct email

3. **Enter credentials**
   - Email: `sanchai5651@gmail.com`
   - Password: `Safety17`
   - Click "เข้าสู่ระบบ SUPER ADMIN"

4. **Verify redirect**
   - Should redirect to `/admin/super/dashboard`
   - Dashboard should load with user statistics
   - Should show "Super Admin Dashboard" title

### Expected Results
- ✅ Login successful
- ✅ Redirected to Super Admin dashboard
- ✅ Can see pending users (if any)
- ✅ All admin functions accessible

### Error Cases to Test
- ❌ Wrong email → "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง"
- ❌ Wrong password → "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง"
- ❌ Empty fields → "กรุณากรอกอีเมลและรหัสผ่าน"

---

## 📋 Test Scenario 2: New User Social Login (Admin)

### Objective
Test complete flow from social login to role assignment

### Steps
1. **Social login as new user**
   - Go to `/auth/signin`
   - Click "Admin" tab
   - Click "เข้าสู่ระบบด้วย Google"
   - Complete Google OAuth (use test account)

2. **Verify pending status**
   - Should redirect to `/pending-approval`
   - Should show "รอการอนุมัติบัญชี" message
   - Should display user info and next steps

3. **Super Admin assigns role**
   - Login as Super Admin in new tab
   - Go to Super Admin dashboard
   - Find new user in pending list
   - Click "👨‍💼" (Admin) button
   - Add reason: "New admin assignment"
   - Click confirm

4. **Verify role assignment**
   - Check success message appears
   - User should move from pending to admin list
   - Email notification should be sent (check logs)

5. **Test new admin access**
   - Go back to pending user tab
   - Refresh page or click "ตรวจสอบสถานะอีกครั้ง"
   - Should redirect to `/admin/dashboard`
   - Should see "Admin Dashboard"

### Expected Results
- ✅ Social login creates pending user
- ✅ Super Admin can see and assign role
- ✅ User receives admin access
- ✅ Email notification sent
- ✅ Proper redirects work

---

## 📋 Test Scenario 3: New User Social Login (Vendor)

### Objective
Test vendor role assignment flow

### Steps
1. **Social login as vendor**
   - Go to `/auth/signin`
   - Click "Vendor" tab
   - Click "เข้าสู่ระบบด้วย Facebook"
   - Complete Facebook OAuth

2. **Verify pending status**
   - Should redirect to `/pending-approval`
   - Should show vendor-specific messaging

3. **Admin assigns vendor role**
   - Login as Admin (not Super Admin)
   - Go to admin dashboard
   - Navigate to user management
   - Find pending vendor
   - Assign vendor role with reason

4. **Verify vendor access**
   - Pending user should get vendor access
   - Should redirect to `/vendor/dashboard`
   - Should see vendor-specific features

### Expected Results
- ✅ Admin can assign vendor roles
- ✅ Vendor gets appropriate access
- ✅ Cannot access admin functions

---

## 📋 Test Scenario 4: Permission Testing

### Objective
Verify role-based access control works correctly

### Test Cases

#### 4.1 Super Admin Permissions
- ✅ Can access `/admin/super/dashboard`
- ✅ Can assign admin roles
- ✅ Can assign vendor roles
- ✅ Can assign customer roles
- ✅ Can view all users
- ✅ Can view audit logs

#### 4.2 Admin Permissions
- ✅ Can access `/admin/dashboard`
- ❌ Cannot access `/admin/super/dashboard`
- ❌ Cannot assign admin roles
- ✅ Can assign vendor roles
- ✅ Can assign customer roles
- ✅ Can view non-admin users

#### 4.3 Vendor Permissions
- ✅ Can access `/vendor/dashboard`
- ❌ Cannot access `/admin/*`
- ❌ Cannot assign any roles
- ✅ Can manage own products
- ✅ Can view own orders

#### 4.4 Customer Permissions
- ✅ Can access `/customer/dashboard`
- ❌ Cannot access `/admin/*`
- ❌ Cannot access `/vendor/*`
- ✅ Can browse products
- ✅ Can place orders

#### 4.5 Pending User Permissions
- ❌ Cannot access any dashboard
- ✅ Can only access `/pending-approval`
- ❌ Redirected from all other protected routes

---

## 📋 Test Scenario 5: Middleware Protection

### Objective
Test route protection and redirects

### Steps
1. **Test unauthenticated access**
   - Clear all cookies/localStorage
   - Try to access `/admin/dashboard`
   - Should redirect to `/auth/signin`

2. **Test wrong role access**
   - Login as customer
   - Try to access `/admin/dashboard`
   - Should redirect to `/customer/dashboard`

3. **Test pending user access**
   - Login as pending user
   - Try to access any dashboard
   - Should redirect to `/pending-approval`

4. **Test public routes**
   - Access `/`, `/products`, `/about`
   - Should work without authentication

### Expected Results
- ✅ Protected routes require authentication
- ✅ Role-based redirects work
- ✅ Public routes accessible
- ✅ Proper error handling

---

## 📋 Test Scenario 6: Email Notifications

### Objective
Test email notification system

### Steps
1. **Test new user notification**
   - New user signs up via social login
   - Check email logs for Super Admin notification
   - Verify email contains user details

2. **Test role assignment notification**
   - Super Admin assigns admin role
   - Check email logs for user notification
   - Verify email contains role details and login link

3. **Test email failure handling**
   - Temporarily break email configuration
   - Assign role to user
   - Verify role assignment still works
   - Check error logs for email failure

### Expected Results
- ✅ New user emails sent to Super Admin
- ✅ Role assignment emails sent to users
- ✅ System works even if email fails
- ✅ Proper error logging

---

## 📋 Test Scenario 7: Database Integrity

### Objective
Test data consistency and audit trails

### Steps
1. **Test role assignment logging**
   - Assign roles to multiple users
   - Check `role_assignments` table
   - Verify all assignments are logged

2. **Test admin action logging**
   - Perform various admin actions
   - Check `admin_actions` table
   - Verify actions are properly logged

3. **Test login logging**
   - Perform various login attempts
   - Check `login_logs` table
   - Verify both success and failure logs

4. **Test data relationships**
   - Check foreign key constraints
   - Verify cascade deletes work
   - Test data integrity

### Expected Results
- ✅ All actions properly logged
- ✅ Data relationships maintained
- ✅ Audit trail complete
- ✅ No orphaned records

---

## 📋 Test Scenario 8: Error Handling

### Objective
Test system behavior under error conditions

### Test Cases

#### 8.1 Network Errors
- Disconnect internet during login
- Verify proper error messages
- Test retry mechanisms

#### 8.2 Database Errors
- Simulate database connection issues
- Verify graceful degradation
- Test error recovery

#### 8.3 OAuth Errors
- Test OAuth provider failures
- Verify error handling
- Test fallback options

#### 8.4 Session Errors
- Test expired sessions
- Test invalid tokens
- Verify proper cleanup

### Expected Results
- ✅ Graceful error handling
- ✅ User-friendly error messages
- ✅ System recovery
- ✅ No data corruption

---

## 📋 Test Scenario 9: Performance Testing

### Objective
Test system performance under load

### Steps
1. **Test with many users**
   - Create 100+ test users
   - Test dashboard loading times
   - Test search and filtering

2. **Test concurrent logins**
   - Simulate multiple simultaneous logins
   - Verify system stability
   - Check response times

3. **Test large datasets**
   - Test with many role assignments
   - Test audit log performance
   - Test pagination

### Expected Results
- ✅ Acceptable response times
- ✅ System stability under load
- ✅ Efficient database queries
- ✅ Proper pagination

---

## 📋 Test Scenario 10: Security Testing

### Objective
Test security measures and vulnerabilities

### Test Cases

#### 10.1 Authentication Security
- Test password brute force protection
- Test session hijacking prevention
- Test CSRF protection

#### 10.2 Authorization Security
- Test privilege escalation attempts
- Test direct URL access
- Test API endpoint security

#### 10.3 Data Security
- Test SQL injection prevention
- Test XSS prevention
- Test data sanitization

### Expected Results
- ✅ No security vulnerabilities
- ✅ Proper input validation
- ✅ Secure session handling
- ✅ Protected API endpoints

---

## 🔧 Testing Tools and Setup

### Required Tools
- Browser (Chrome/Firefox)
- Database client (pgAdmin/DBeaver)
- Email testing tool (MailHog/Mailtrap)
- Network monitoring (Browser DevTools)

### Test Data Setup
```sql
-- Create test users for different scenarios
INSERT INTO users (email, name, role, provider) VALUES
('testadmin@example.com', 'Test Admin', 'admin', 'google'),
('testvendor@example.com', 'Test Vendor', 'vendor', 'facebook'),
('testcustomer@example.com', 'Test Customer', 'customer', 'line'),
('testpending@example.com', 'Test Pending', 'pending', 'google');
```

### Environment Variables for Testing
```env
# Test database
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/test_sss_surplus"

# Test OAuth (use test apps)
GOOGLE_CLIENT_ID="test_google_client_id"
GOOGLE_CLIENT_SECRET="test_google_client_secret"

# Test email
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER="test@example.com"
SMTP_PASS="test_password"

# Super Admin
SUPER_ADMIN_EMAILS="sanchai5651@gmail.com"
SUPER_ADMIN_PASSWORD="Safety17"
SUPER_ADMIN_MODE="true"
NEXT_PUBLIC_SUPER_ADMIN_ENABLED="true"
```

---

## 📊 Test Results Template

### Test Execution Log
```
Date: ___________
Tester: ___________
Environment: ___________

Scenario 1: Super Admin Login
- Step 1: ✅/❌ 
- Step 2: ✅/❌
- Step 3: ✅/❌
- Overall: ✅/❌
- Notes: ___________

Scenario 2: New User Social Login
- Step 1: ✅/❌
- Step 2: ✅/❌
- Step 3: ✅/❌
- Overall: ✅/❌
- Notes: ___________

[Continue for all scenarios...]

Summary:
- Total Scenarios: ___
- Passed: ___
- Failed: ___
- Critical Issues: ___
- Minor Issues: ___
```

