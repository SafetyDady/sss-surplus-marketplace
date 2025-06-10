-- 007_create_login_logs_table.sql
-- Login attempt logs for security monitoring

CREATE TABLE IF NOT EXISTS login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    login_type VARCHAR(50) NOT NULL, -- 'social', 'super_admin_credentials', etc.
    provider VARCHAR(50), -- 'google', 'facebook', 'line', 'credentials'
    success BOOLEAN NOT NULL DEFAULT false,
    failure_reason VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_email ON login_logs(email);
CREATE INDEX IF NOT EXISTS idx_login_logs_login_type ON login_logs(login_type);
CREATE INDEX IF NOT EXISTS idx_login_logs_success ON login_logs(success);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON login_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_login_logs_ip_address ON login_logs(ip_address);

