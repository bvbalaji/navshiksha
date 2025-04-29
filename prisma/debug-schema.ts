import { PrismaClient } from "@prisma/client"

// This script helps debug Prisma schema issues
async function debugSchema() {
  console.log("🔍 Starting Prisma schema debug...")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    // List all available models on the Prisma client
    console.log("Available models on Prisma client:")
    const clientKeys = Object.keys(prisma).filter(
      (key:any) => !key.startsWith("_") && typeof prisma[key] === "object" && prisma[key] !== null,
    )
    console.log(clientKeys)

    // Try to get the schema version
    try {
      const schemaVersion = await prisma.$queryRaw`SELECT version();`
      console.log("Database version:", schemaVersion)
    } catch (e) {
      console.error("Could not query database version:", e)
    }

    console.log("✅ Schema debug completed")
  } catch (error) {
    console.error("❌ Schema debug failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the debug function
debugSchema().catch((e) => {
  console.error("Fatal error during schema debugging:", e)
  process.exit(1)
})
