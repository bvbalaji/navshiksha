import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

export async function clearAuthCookies() {
  const cookieStore = await cookies()

  // Get all cookies
  const allCookies = cookieStore.getAll()

  // Clear all auth-related cookies
  allCookies.forEach((cookie) => {
    if (
      cookie.name.includes("next-auth") ||
      cookie.name.includes("__Secure-next-auth") ||
      cookie.name.includes("__Host-next-auth")
    ) {
      (cookies() as unknown as UnsafeUnwrappedCookies).delete(cookie.name)
    }
  })
}

export function isProduction() {
  return process.env.NODE_ENV === "production"
}

export function getBaseUrl(request?: Request) {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  if (request) {
    const url = new URL(request.url)
    return `${url.protocol}//${url.host}`
  }

  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return process.env.NEXTAUTH_URL
}
