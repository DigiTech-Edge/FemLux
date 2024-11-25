import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Define route arrays
const AUTH_ROUTES = [
  "/auth",
  "/login",
  "/register",
  "/forgot-password",
] as const;

const PROTECTED_ROUTES = ["/favourites", "/profile"] as const;

const ADMIN_ROUTES = ["/admin"] as const;

export async function middleware(request: NextRequest) {
  // First, update the Supabase auth session and get the authenticated user
  const { response, user } = await updateSession(request);

  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;

  // Check if current path matches any of the defined routes
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // Use the authenticated user status
  const isAuthenticated = !!user;

  // Handle auth pages (redirect to home if already logged in)
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle protected routes (redirect to login if not authenticated)
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle admin routes (check both authentication and admin role)
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check for admin role in user_metadata
    const isAdmin = user?.user_metadata?.role === "admin";

    if (!isAdmin) {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
