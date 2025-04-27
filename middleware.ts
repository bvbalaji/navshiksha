import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    // Get the token and check if the user is authenticated
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const isAuthenticated = !!token

    // Define auth pages (login, register, etc.)
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

    // If on an auth page and already authenticated, redirect to dashboard
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If on a protected route and not authenticated, redirect to login
    const isProtectedRoute =
      pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/tutor")

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

// Specify which routes to apply the middleware to
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/tutor/:path*", "/login", "/register"],
}
