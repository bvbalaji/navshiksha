"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout(formData: FormData) {
  // Get the redirect URL from the form data or default to home
  const redirectTo = formData.get("redirectTo")?.toString() || "/"

  // Clear all cookies
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()

  for (const cookie of allCookies) {
    cookies().delete(cookie.name)
  }

  // Redirect to the specified URL
  redirect(redirectTo)
}
