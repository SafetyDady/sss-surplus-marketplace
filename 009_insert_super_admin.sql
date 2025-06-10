-- 009_insert_super_admin.sql
-- Insert Super Admin user from environment variables

DO $$
DECLARE
    super_admin_email VARCHAR(255) := COALESCE(current_setting('app.super_admin_email', true), 'sanchai5651@gmail.com');
    super_admin_name VARCHAR(255) := COALESCE(current_setting('app.super_admin_name', true), 'System Administrator');
    existing_user_id UUID;
BEGIN
    -- Check if Super Admin already exists
    SELECT id INTO existing_user_id 
    FROM users 
    WHERE email = super_admin_email;
    
    IF existing_user_id IS NULL THEN
        -- Create Super Admin user
        INSERT INTO users (
            email,
            name,
            role,
            provider,
            email_verified,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            super_admin_email,
            super_admin_name,
            'super_admin',
            'credentials',
            CURRENT_TIMESTAMP,
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
        
        RAISE NOTICE 'Super Admin user created: %', super_admin_email;
    ELSE
        -- Update existing user to Super Admin if not already
        UPDATE users 
        SET 
            role = 'super_admin',
            is_active = true,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_user_id 
        AND role != 'super_admin';
        
        IF FOUND THEN
            RAISE NOTICE 'Existing user updated to Super Admin: %', super_admin_email;
        ELSE
            RAISE NOTICE 'Super Admin user already exists: %', super_admin_email;
        END IF;
    END IF;
END $$;

