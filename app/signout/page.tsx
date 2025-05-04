import { redirect } from "next/navigation"
import { clearAuthCookies } from "@/lib/auth/auth-utils"

export default async function SignOutPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  // Clear auth cookies server-side
  clearAuthCookies()

  // Get the callback URL or default to home
  const callbackUrl = (await searchParams).callbackUrl || "/"

  // Redirect to the callback URL
  redirect(callbackUrl)
}
