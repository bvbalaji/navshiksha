import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirectTo") || "/"

  // Clear all cookies - this is a brute force approach
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  for (const cookie of allCookies) {
    // Clear the cookie with all possible domain/path combinations
    (await cookies()).delete({
    
      name: cookie.name,
      path: "/",
    })
  }

  setTimeout(()=> { window.location.href = `${redirectTo}`, 1750})

  // Return a simple HTML page that redirects
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${redirectTo}">
        <title>Signing out...</title>
      </head>
      <body>
        <p>Signing out...</p>
        <script>
          // Clear all local storage and session storage
          window.localStorage.clear();
          window.sessionStorage.clear();
          
          // Remove all cookies
          document.cookie.split(";").forEach(function(c) {
            document.cookie = c.trim().split("=")[0] + "=;" + "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          });
          
          // Redirect
          window.location.href = "${redirectTo}";
        </script>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
        // Ensure no caching
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}
