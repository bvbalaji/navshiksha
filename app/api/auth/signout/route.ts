import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Clear auth-related cookies
    const cookieStore = await cookies()
    const cookieNames = [
      "next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url",
      "__Host-next-auth.csrf-token",
    ]

    cookieNames.forEach((name) => {
      cookieStore.delete(name)
    })

    // Return a simple success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ success: false, error: "Failed to sign out" }, { status: 500 })
  }
}
