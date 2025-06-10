#!/bin/bash
# run_migrations.sh - Script to run all database migrations

set -e

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-sss_surplus}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD}

# Super Admin configuration from environment
SUPER_ADMIN_EMAIL=${SUPER_ADMIN_EMAILS:-"sanchai5651@gmail.com"}
SUPER_ADMIN_NAME=${SUPER_ADMIN_NAME:-"System Administrator"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting database migrations...${NC}"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql command not found. Please install PostgreSQL client.${NC}"
    exit 1
fi

# Test database connection
echo -e "${YELLOW}📡 Testing database connection...${NC}"
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to database. Please check your configuration.${NC}"
    echo "Host: $DB_HOST"
    echo "Port: $DB_PORT"
    echo "Database: $DB_NAME"
    echo "User: $DB_USER"
    exit 1
fi

echo -e "${GREEN}✅ Database connection successful${NC}"

# Create migrations table if it doesn't exist
echo -e "${YELLOW}📋 Creating migrations table...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

# Function to run a migration
run_migration() {
    local file=$1
    local filename=$(basename "$file")
    
    # Check if migration already executed
    local executed=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM migrations WHERE filename = '$filename';" | tr -d ' ')
    
    if [ "$executed" -eq "0" ]; then
        echo -e "${YELLOW}⚡ Running migration: $filename${NC}"
        
        # Set environment variables for the migration
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME \
            -v app.super_admin_email="$SUPER_ADMIN_EMAIL" \
            -v app.super_admin_name="$SUPER_ADMIN_NAME" \
            -f "$file"
        
        if [ $? -eq 0 ]; then
            # Record successful migration
            PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "INSERT INTO migrations (filename) VALUES ('$filename');"
            echo -e "${GREEN}✅ Migration completed: $filename${NC}"
        else
            echo -e "${RED}❌ Migration failed: $filename${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}⏭️  Migration already executed: $filename${NC}"
    fi
}

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Run migrations in order
echo -e "${YELLOW}📁 Looking for migration files in: $SCRIPT_DIR${NC}"

for migration_file in "$SCRIPT_DIR"/*.sql; do
    if [ -f "$migration_file" ]; then
        run_migration "$migration_file"
    fi
done

# Verify Super Admin creation
echo -e "${YELLOW}🔍 Verifying Super Admin user...${NC}"
SUPER_ADMIN_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users WHERE email = '$SUPER_ADMIN_EMAIL' AND role = 'super_admin';" | tr -d ' ')

if [ "$SUPER_ADMIN_EXISTS" -eq "1" ]; then
    echo -e "${GREEN}✅ Super Admin user verified: $SUPER_ADMIN_EMAIL${NC}"
else
    echo -e "${RED}❌ Super Admin user not found or not properly configured${NC}"
    exit 1
fi

# Show migration status
echo -e "${YELLOW}📊 Migration status:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT filename, executed_at FROM migrations ORDER BY executed_at;"

echo -e "${GREEN}🎉 All migrations completed successfully!${NC}"

# Show user statistics
echo -e "${YELLOW}👥 User statistics:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role;"

echo -e "${GREEN}✨ Database is ready for use!${NC}"

