#!/bin/bash
# production-deploy.sh - Complete Production Deployment Script

echo "🚀 SSS Surplus Marketplace - Production Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="sss-surplus-marketplace"
DOMAIN="yourdomain.com"
DATABASE_NAME="sss_surplus_prod"

echo -e "${BLUE}📋 Starting deployment process...${NC}"

# Step 1: Check prerequisites
echo -e "\n${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}" >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}❌ git is required but not installed.${NC}" >&2; exit 1; }

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Step 2: Install Vercel CLI
echo -e "\n${YELLOW}Step 2: Installing Vercel CLI...${NC}"
npm install -g vercel
echo -e "${GREEN}✅ Vercel CLI installed${NC}"

# Step 3: Project setup
echo -e "\n${YELLOW}Step 3: Setting up project...${NC}"

# Create project directory if it doesn't exist
if [ ! -d "$PROJECT_NAME" ]; then
    echo "Creating project directory..."
    mkdir -p $PROJECT_NAME
    cd $PROJECT_NAME
    
    # Initialize Next.js project
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
else
    cd $PROJECT_NAME
fi

# Step 4: Install dependencies
echo -e "\n${YELLOW}Step 4: Installing dependencies...${NC}"
npm install next-auth @prisma/client prisma bcryptjs jsonwebtoken nodemailer @types/bcryptjs @types/jsonwebtoken @types/nodemailer

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 5: Copy authentication files
echo -e "\n${YELLOW}Step 5: Copying authentication files...${NC}"

# Create directories
mkdir -p src/components/auth
mkdir -p src/pages/api/auth
mkdir -p src/pages/api/admin
mkdir -p src/lib
mkdir -p database/migrations
mkdir -p tests

# Copy component files
cp ../AdminVendorSocialLogin.jsx src/components/auth/
cp ../PendingApprovalPage.jsx src/components/auth/
cp ../SuperAdminDashboard.jsx src/components/auth/

# Copy API files
cp ../auth.js src/pages/api/auth/[...nextauth].js
cp ../super-admin-login.js src/pages/api/auth/
cp ../users.js src/pages/api/admin/
cp ../role.js src/pages/api/admin/users/[userId]/

# Copy library files
cp ../middleware.js src/
cp ../email.js src/lib/

# Copy database files
cp ../*.sql database/migrations/
cp ../schema.prisma prisma/
cp ../run_migrations.sh database/

# Copy test files
cp ../*.test.js tests/

echo -e "${GREEN}✅ Authentication files copied${NC}"

# Step 6: Environment configuration
echo -e "\n${YELLOW}Step 6: Environment configuration...${NC}"

cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://username:password@host:5432/${DATABASE_NAME}"

# NextAuth
NEXTAUTH_URL="https://${DOMAIN}"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Super Admin
SUPER_ADMIN_MODE="true"
SUPER_ADMIN_EMAILS="sanchai5651@gmail.com"
SUPER_ADMIN_PASSWORD="Safety17"
SUPER_ADMIN_NAME="System Administrator"
NEXT_PUBLIC_SUPER_ADMIN_ENABLED="true"

# OAuth Providers (Replace with your credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@${DOMAIN}"
SMTP_PASS="your-app-password"
SMTP_FROM="SSS Surplus <noreply@${DOMAIN}>"

# Security
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://${DOMAIN}"
EOF

echo -e "${GREEN}✅ Environment file created${NC}"
echo -e "${YELLOW}⚠️  Please update the OAuth credentials and database URL in .env.local${NC}"

# Step 7: Vercel configuration
echo -e "\n${YELLOW}Step 7: Creating Vercel configuration...${NC}"

cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPER_ADMIN_ENABLED": "true",
    "NEXT_PUBLIC_APP_URL": "https://${DOMAIN}"
  },
  "functions": {
    "src/pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
EOF

echo -e "${GREEN}✅ Vercel configuration created${NC}"

# Step 8: Next.js configuration
echo -e "\n${YELLOW}Step 8: Creating Next.js configuration...${NC}"

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  env: {
    SUPER_ADMIN_ENABLED: process.env.NEXT_PUBLIC_SUPER_ADMIN_ENABLED,
  },
};

module.exports = nextConfig;
EOF

echo -e "${GREEN}✅ Next.js configuration created${NC}"

# Step 9: Create health check endpoint
echo -e "\n${YELLOW}Step 9: Creating health check endpoint...${NC}"

mkdir -p src/pages/api
cat > src/pages/api/health.js << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check environment variables
    const requiredEnvs = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'SUPER_ADMIN_EMAILS',
      'SUPER_ADMIN_PASSWORD'
    ];
    
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Missing environment variables',
        missing: missingEnvs
      });
    }

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV
    });

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
EOF

echo -e "${GREEN}✅ Health check endpoint created${NC}"

# Step 10: Build and test locally
echo -e "\n${YELLOW}Step 10: Building and testing locally...${NC}"

# Generate Prisma client
npx prisma generate

# Build the project
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Local build successful${NC}"
else
    echo -e "${RED}❌ Local build failed${NC}"
    exit 1
fi

# Step 11: Vercel deployment
echo -e "\n${YELLOW}Step 11: Deploying to Vercel...${NC}"

# Login to Vercel (interactive)
echo "Please login to Vercel when prompted..."
vercel login

# Link project
vercel link --yes

# Set environment variables
echo "Setting environment variables..."
vercel env add DATABASE_URL production < <(echo "$DATABASE_URL")
vercel env add NEXTAUTH_SECRET production < <(echo "$(openssl rand -base64 32)")
vercel env add SUPER_ADMIN_MODE production < <(echo "true")
vercel env add SUPER_ADMIN_EMAILS production < <(echo "sanchai5651@gmail.com")
vercel env add SUPER_ADMIN_PASSWORD production < <(echo "Safety17")
vercel env add SUPER_ADMIN_NAME production < <(echo "System Administrator")
vercel env add NEXT_PUBLIC_SUPER_ADMIN_ENABLED production < <(echo "true")

# Deploy to production
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 12: Post-deployment verification
echo -e "\n${YELLOW}Step 12: Post-deployment verification...${NC}"

DEPLOYMENT_URL=$(vercel ls | grep $PROJECT_NAME | head -1 | awk '{print $2}')

if [ ! -z "$DEPLOYMENT_URL" ]; then
    echo "Testing deployment at: https://$DEPLOYMENT_URL"
    
    # Test health endpoint
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOYMENT_URL/api/health")
    
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check returned status: $HTTP_STATUS${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Could not determine deployment URL${NC}"
fi

# Step 13: Final instructions
echo -e "\n${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================================="
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update OAuth provider redirect URIs to point to your production domain"
echo "2. Configure your database and run migrations"
echo "3. Test Super Admin login: sanchai5651@gmail.com / Safety17"
echo "4. Test social login flows"
echo "5. Configure custom domain if needed"
echo ""
echo -e "${BLUE}📊 Important URLs:${NC}"
echo "• Production App: https://$DEPLOYMENT_URL"
echo "• Health Check: https://$DEPLOYMENT_URL/api/health"
echo "• Admin Login: https://$DEPLOYMENT_URL/auth/signin"
echo ""
echo -e "${BLUE}🔧 Configuration Files Created:${NC}"
echo "• .env.local - Environment variables"
echo "• vercel.json - Vercel configuration"
echo "• next.config.js - Next.js configuration"
echo "• src/pages/api/health.js - Health check endpoint"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "• Update OAuth credentials in environment variables"
echo "• Configure your production database"
echo "• Run database migrations"
echo "• Set up monitoring and backups"
echo ""
echo -e "${GREEN}✅ Your SSS Surplus Marketplace is now live in production!${NC}"

