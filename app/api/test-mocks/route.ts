import { type NextRequest, NextResponse } from "next/server"
import { setupTestMocks, cleanupTestMocks } from "@/lib/server/api-testing"

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "This endpoint is not available in production" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")

  if (action === "setup") {
    const result = await setupTestMocks()
    return NextResponse.json(result)
  } else if (action === "cleanup") {
    const result = await cleanupTestMocks()
    return NextResponse.json(result)
  }

  return NextResponse.json({ error: "Invalid action. Use ?action=setup or ?action=cleanup" }, { status: 400 })
}
