import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function LogoutPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  // Clear all cookies server-side
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()

  for (const cookie of allCookies) {
    cookies().delete(cookie.name)
  }

  // Get the redirect URL or default to home
  const redirectTo = searchParams.redirectTo || "/"

  // Redirect to the specified URL
  redirect(redirectTo)
}
