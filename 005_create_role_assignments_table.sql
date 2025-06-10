-- 005_create_role_assignments_table.sql
-- Role assignment history and audit trail

CREATE TABLE IF NOT EXISTS role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES users(id),
    from_role VARCHAR(50),
    to_role VARCHAR(50) NOT NULL CHECK (to_role IN ('super_admin', 'admin', 'vendor', 'customer')),
    reason TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_role_assignments_user_id ON role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_assigned_by ON role_assignments(assigned_by);
CREATE INDEX IF NOT EXISTS idx_role_assignments_to_role ON role_assignments(to_role);
CREATE INDEX IF NOT EXISTS idx_role_assignments_assigned_at ON role_assignments(assigned_at);

