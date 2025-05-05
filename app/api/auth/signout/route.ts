import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { clearAuthCookies } from "@/lib/auth/auth-utils"

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
    
    let newCookieStore = cookieStore;
    cookieStore.getAll().forEach(async cookie => {
      if (
        cookie.name.includes("next-auth") ||
        cookie.name.includes("__Secure-next-auth") ||
        cookie.name.includes("__Host-next-auth")
      ) {
        cookieStore.set(cookie.name, '', {maxAge: 0})
      }
    }) 
    console.log(cookieStore, 'CCCCCCCCCCCCCCCCCC')

    setTimeout(() => {
      console.log(cookieStore, 'CCCCCCCCCCCCCCCCCC'),
      1800
    })
    //  set the new reduced cookie
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
