import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    // Skip middleware for ALL auth-related routes to prevent redirect loops
    if (
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/logout") ||
      pathname === "/login" ||
      pathname === "/logout"
    ) {
      return NextResponse.next()
    }

    // Get the token using next-auth/jwt
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const isAuthenticated = !!token
    const userRole = ((token?.role as string) || "").toUpperCase()

    // Define auth pages (login, register, etc.)
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

    // If on an auth page and already authenticated, redirect based on role
    if (isAuthPage && isAuthenticated) {
      // Check user role and redirect accordingly
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else if (userRole === "TEACHER") {
        return NextResponse.redirect(new URL("/teacher", request.url))
      } else {
        return NextResponse.redirect(new URL("/student", request.url))
      }
    }

    // Role-based access control
    const isAdminRoute = pathname.startsWith("/admin")
    const isTeacherRoute = pathname.startsWith("/teacher")
    const isStudentRoute = pathname.startsWith("/student") || pathname.startsWith("/tutor")

    // If authenticated but trying to access unauthorized routes
    if (isAuthenticated) {
      // Admin can access all routes
      if (userRole === "ADMIN") {
        // Allow access to all routes
        return NextResponse.next()
      }

      // Teacher can access teacher routes but not admin routes
      if (userRole === "TEACHER") {
        if (isAdminRoute) {
          return NextResponse.redirect(new URL("/teacher", request.url))
        }

        // Redirect teachers trying to access student routes to teacher dashboard
        if (isStudentRoute) {
          return NextResponse.redirect(new URL("/teacher", request.url))
        }
      }

      // Student can only access student routes
      if (userRole === "STUDENT" || userRole === "") {
        if (isAdminRoute || isTeacherRoute) {
          return NextResponse.redirect(new URL("/student", request.url))
        }
      }
    }

    // If on a protected route and not authenticated, redirect to login
    const isProtectedRoute = isStudentRoute || isTeacherRoute || isAdminRoute

    if (isProtectedRoute && !isAuthenticated) {
      // Store the original URL to redirect back after login
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    // For all other cases, continue
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)

    // If there's an error in authentication, redirect to login
    if (pathname !== "/login" && pathname !== "/register" && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  }
}

// Update the matcher configuration - removed /dashboard/:path*
export const config = {
  matcher: [
    "/api/auth/:path*",
    "/teacher/api/:path*",
    "/student/api/:path*",
    "/admin/api/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/admin/:path*",
    "/tutor/:path*",
    "/login",
    "/register",
  ],
}
