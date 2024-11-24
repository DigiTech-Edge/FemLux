import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define route arrays
const AUTH_ROUTES = [
  '/auth',
  '/login',
  '/register',
  '/forgot-password'
] as const;

const PROTECTED_ROUTES = [
  '/favourites',
  '/profile'
] as const;

const ADMIN_ROUTES = [
  '/admin'
] as const;

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Check if current path matches any of the defined routes
  const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  // Handle auth pages (redirect to home if already logged in)
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Handle protected routes (redirect to login if not authenticated)
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Handle admin routes (check both authentication and admin role)
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const isAdmin = session.user?.user_metadata?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
