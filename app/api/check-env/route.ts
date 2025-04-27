import { NextResponse } from "next/server"

export async function GET() {
  // Only return this in development mode for security
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        message: "This endpoint is only available in development mode",
      },
      { status: 403 },
    )
  }

  // Check for required environment variables
  const envVars = {
    NODE_ENV: process.env.NODE_ENV || "not set",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "not set",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set (hidden)" : "not set",
    DATABASE_URL: process.env.DATABASE_URL ? "set (hidden)" : "not set",
  }

  return NextResponse.json({
    environment: envVars,
    baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
    message: "Environment variables check completed",
  })
}
