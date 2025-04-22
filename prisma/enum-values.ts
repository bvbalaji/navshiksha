import { PrismaClient, UserRole, ContentType, CourseLevel } from "@prisma/client"

// This script helps debug enum values in TypeScript vs PostgreSQL
async function checkEnumValues() {
  console.log("🔍 Checking enum values...")

  // Print TypeScript enum values
  console.log("\nTypeScript UserRole enum values:")
  console.log(UserRole)

  console.log("\nTypeScript ContentType enum values:")
  console.log(ContentType)

  console.log("\nTypeScript CourseLevel enum values:")
  console.log(CourseLevel)

  // Connect to database and check PostgreSQL enum values
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    console.log("\nChecking PostgreSQL enum values...")

    try {
      console.log("\nUserRole enum in PostgreSQL:")
      const userRoleEnum = await prisma.$queryRaw`
        SELECT enum_range(NULL::public."UserRole") as enum_values;
      `
      console.log(userRoleEnum)
    } catch (e) {
      console.error("Error checking UserRole enum:", e)
    }

    try {
      console.log("\nContentType enum in PostgreSQL:")
      const contentTypeEnum = await prisma.$queryRaw`
        SELECT enum_range(NULL::public."ContentType") as enum_values;
      `
      console.log(contentTypeEnum)
    } catch (e) {
      console.error("Error checking ContentType enum:", e)
    }

    try {
      console.log("\nCourseLevel enum in PostgreSQL:")
      const courseLevelEnum = await prisma.$queryRaw`
        SELECT enum_range(NULL::public."CourseLevel") as enum_values;
      `
      console.log(courseLevelEnum)
    } catch (e) {
      console.error("Error checking CourseLevel enum:", e)
    }

    console.log("\n✅ Enum value check completed")
  } catch (error) {
    console.error("❌ Enum value check failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check function
checkEnumValues().catch((e) => {
  console.error("Fatal error during enum value checking:", e)
  process.exit(1)
})
