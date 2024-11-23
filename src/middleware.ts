import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add the paths that require authentication
const protectedPaths = ['/favourites', '/profile']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('auth_token') // Temporary until Appwrite integration

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !isAuthenticated) {
    // Redirect to home if trying to access protected route while not authenticated
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/favourites/:path*', '/profile/:path*']
}
