import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware processing for API routes and static assets
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next()
  }

  console.log(`Middleware processing: ${pathname}`)

  try {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    })

    // For debugging
    console.log(`Path: ${pathname}, Token:`, token ? `Found for ${token.email} with role ${token.role}` : "Not found")

    // If no token and trying to access protected route, redirect to login
    if (!token && pathname.startsWith("/dashboard")) {
      console.log(`Redirecting to login from ${pathname} - no token`)
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If has token and trying to access auth routes, redirect to appropriate dashboard
    if (token && (pathname === "/login" || pathname === "/signup")) {
      console.log(`Redirecting from ${pathname} to dashboard - user is authenticated`)

      // Redirect based on role
      if (token.role === "teacher") {
        return NextResponse.redirect(new URL("/dashboard/teacher", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // IMPORTANT: Only apply role-based redirects for the exact dashboard paths
    // to prevent redirect loops with nested routes
    if (token) {
      // Teacher trying to access student dashboard root
      if (pathname === "/dashboard" && token.role === "teacher") {
        console.log(`Teacher accessing student dashboard, redirecting to teacher dashboard`)
        return NextResponse.redirect(new URL("/dashboard/teacher", request.url))
      }

      // Student trying to access teacher dashboard root
      if (pathname === "/dashboard/teacher" && token.role === "student") {
        console.log(`Student accessing teacher dashboard, redirecting to student dashboard`)
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, allow the request to proceed
  }

  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

