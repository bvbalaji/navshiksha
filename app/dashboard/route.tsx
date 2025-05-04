import { redirect } from "next/navigation"
import { getToken } from "next-auth/jwt"
import { cookies, headers } from "next/headers"

export async function GET(request: Request) {
  // Get the token from the request
  const req = {
    headers: Object.fromEntries(headers()),
    cookies: Object.fromEntries(
      cookies()
        .getAll()
        .map((c) => [c.name, c.value]),
    ),
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Determine where to redirect based on user role
  if (token) {
    const role = ((token.role as string) || "").toUpperCase()

    if (role === "ADMIN") {
      redirect("/admin")
    } else if (role === "TEACHER") {
      redirect("/teacher")
    } else {
      redirect("/student")
    }
  }

  // If not authenticated, redirect to login
  redirect("/login")
}
