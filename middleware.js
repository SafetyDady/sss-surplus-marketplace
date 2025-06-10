// middleware.js - Next.js middleware for authentication and authorization
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/auth/signin',
      '/auth/signup', 
      '/auth/error',
      '/api/auth',
      '/products', // Allow viewing products without login
      '/about',
      '/contact'
    ];

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route => 
      pathname.startsWith(route) || pathname === route
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // If no token and trying to access protected route
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-based route protection
    const roleRoutes = {
      '/admin/super': ['super_admin'],
      '/admin': ['super_admin', 'admin'],
      '/vendor': ['super_admin', 'admin', 'vendor'],
      '/customer': ['super_admin', 'admin', 'customer'],
    };

    // Check role-based access
    for (const [routePrefix, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(token.role)) {
          // Redirect to appropriate dashboard based on role
          const redirectMap = {
            'super_admin': '/admin/super/dashboard',
            'admin': '/admin/dashboard',
            'vendor': '/vendor/dashboard',
            'customer': '/customer/dashboard',
            'pending': '/pending-approval'
          };
          
          const redirectUrl = redirectMap[token.role] || '/';
          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
      }
    }

    // Handle pending users
    if (token.role === 'pending' && pathname !== '/pending-approval') {
      return NextResponse.redirect(new URL('/pending-approval', req.url));
    }

    // Redirect from pending page if role has been assigned
    if (pathname === '/pending-approval' && token.role !== 'pending') {
      const redirectMap = {
        'super_admin': '/admin/super/dashboard',
        'admin': '/admin/dashboard', 
        'vendor': '/vendor/dashboard',
        'customer': '/customer/dashboard'
      };
      
      const redirectUrl = redirectMap[token.role] || '/';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error', 
          '/products',
          '/about',
          '/contact'
        ];

        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route) || pathname === route
        );

        if (isPublicRoute) {
          return true;
        }

        // API routes that don't require auth
        if (pathname.startsWith('/api/auth/')) {
          return true;
        }

        // Require token for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

