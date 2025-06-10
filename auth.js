// auth.js - NextAuth.js configuration for Social Login
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import LineProvider from 'next-auth/providers/line'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '../../../lib/prisma'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Get login type from session storage (set by frontend)
        const loginType = account.provider === 'credentials' ? 'super_admin' : 'social';
        
        // For social login, create user with pending role
        if (loginType === 'social') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            // Create new user with pending role
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: 'pending',
                provider: account.provider,
                providerId: account.providerAccountId,
                emailVerified: new Date(),
              }
            });
          } else if (existingUser.role === 'pending') {
            // User exists but still pending - allow login to show pending page
            return true;
          }
        }
        
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        // Fetch user data from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.userId = dbUser.id;
          token.provider = dbUser.provider;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Get user role to determine redirect
      const session = await getSession();
      
      if (session?.user?.role === 'pending') {
        return `${baseUrl}/pending-approval`;
      }
      
      // Role-based redirects
      const roleRedirects = {
        'super_admin': '/admin/super/dashboard',
        'admin': '/admin/dashboard',
        'vendor': '/vendor/dashboard',
        'customer': '/customer/dashboard'
      };
      
      const redirectUrl = roleRedirects[session?.user?.role];
      if (redirectUrl) {
        return `${baseUrl}${redirectUrl}`;
      }
      
      // Default redirect
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed in: ${user.email} via ${account.provider}`);
        
        // Send notification to Super Admin about new user
        await sendNewUserNotification(user, account.provider);
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
});

// Helper function to send new user notification
async function sendNewUserNotification(user, provider) {
  try {
    // Send email to Super Admin
    await fetch(`${process.env.NEXTAUTH_URL}/api/admin/notify-new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          name: user.name,
          email: user.email,
          provider: provider
        }
      })
    });
  } catch (error) {
    console.error('Error sending new user notification:', error);
  }
}

