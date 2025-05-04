import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

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

     // Get the callbackUrl from the query string
     const url = new URL(request.url)
     const callbackUrl = url.searchParams.get("callbackUrl") || "/"

    //  fetch session information
    const session = await getServerSession(authOptions)
      // If there's no session, redirect to the callback URL
    if (!session) {
      return NextResponse.redirect(callbackUrl)
    }

    
    // Return the sign-out page with the callbackUrl
    const baseUrl = process.env.NEXTAUTH_URL || request.headers.get("origin") || ""
    const signOutUrl = `${baseUrl}/api/auth/signout`

    // Return a simple success response
    NextResponse.json({ success: true })
    return NextResponse.redirect(signOutUrl)
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ success: false, error: "Failed to sign out" }, { status: 500 })

  

  

 
}
}
