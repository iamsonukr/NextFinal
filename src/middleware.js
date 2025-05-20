// middleware.js (in root directory)
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        if (req.nextUrl.pathname.startsWith('/profile') ||
            req.nextUrl.pathname.startsWith('/orders') ||
            req.nextUrl.pathname.startsWith('/checkout')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*'
  ]
}