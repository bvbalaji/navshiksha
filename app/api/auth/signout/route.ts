import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const callbackUrl = (await url.searchParams.get("callbackUrl")) || "/"

  // Clear all auth-related cookies
  const cookieStore = await cookies()
  cookieStore.getAll().forEach(async cookie => {
    if (
      cookie.name.includes("next-auth") ||
      cookie.name.includes("__Secure-next-auth") ||
      cookie.name.includes("__Host-next-auth")
    ) {
      (await cookies()).delete(cookie.name)
    }
  })

  // Return a simple redirect response
  return NextResponse.redirect(new URL(callbackUrl, request.url))
}

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => ({}))
    const callbackUrl = data?.callbackUrl || "/"

    // Clear all auth-related cookies
    const cookieStore = await cookies()
    cookieStore.getAll().forEach(async cookie => {
      if (
        cookie.name.includes("next-auth") ||
        cookie.name.includes("__Secure-next-auth") ||
        cookie.name.includes("__Host-next-auth")
      ) {
        (await cookies()).delete(cookie.name)
      }
    })

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
      redirectUrl: callbackUrl,
    })
  } catch (error) {
    console.error("Sign-out error:", error)
    return NextResponse.json({ success: false, message: "Failed to sign out" }, { status: 500 })
  }
}
