import { PrismaClient } from "@prisma/client"

// This script helps debug enum issues in PostgreSQL
async function checkEnums() {
  console.log("🔍 Checking PostgreSQL enum types...")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    // Check all enum types in the database
    const enumTypes = await prisma.$queryRaw`
      SELECT n.nspname as schema,
             t.typname as name,
             array_agg(e.enumlabel) as enum_values
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      GROUP BY schema, name;
    `

    console.log("Enum types in database:")
    console.log(JSON.stringify(enumTypes, null, 2))

    // Check specific enums
    try {
      console.log("\nChecking UserRole enum:")
      const userRoleEnum = await prisma.$queryRaw`
        SELECT enum_range(NULL::public."UserRole") as enum_values;
      `
      console.log(userRoleEnum)
    } catch (e) {
      console.error("Error checking UserRole enum:", e)
    }

    try {
      console.log("\nChecking ContentType enum:")
      const contentTypeEnum = await prisma.$queryRaw`
        SELECT enum_range(NULL::public."ContentType") as enum_values;
      `
      console.log(contentTypeEnum)
    } catch (e) {
      console.error("Error checking ContentType enum:", e)
    }

    try {
      console.log("\nChecking CourseLevel enum:")
      const courseLevelEnum = await prisma.$queryRaw`
        SELECT enum_range(NULL::public."CourseLevel") as enum_values;
      `
      console.log(courseLevelEnum)
    } catch (e) {
      console.error("Error checking CourseLevel enum:", e)
    }

    console.log("\n✅ Enum check completed")
  } catch (error) {
    console.error("❌ Enum check failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check function
checkEnums().catch((e) => {
  console.error("Fatal error during enum checking:", e)
  process.exit(1)
})
