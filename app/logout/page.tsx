import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function LogoutPage(
  props: {
    searchParams: Promise<{ redirectTo?: string }>
  }
) {
  const searchParams = await props.searchParams;
  // Clear all cookies server-side
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  for (const cookie of allCookies) {
    (await cookies()).delete(cookie.name)
  }

  // Get the redirect URL or default to home
  const redirectTo = searchParams.redirectTo || "/"

  // Redirect to the specified URL
  redirect(redirectTo)
}
