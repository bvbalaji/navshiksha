import { PrismaClient } from "@prisma/client"

// This script helps fix enum issues in PostgreSQL
async function fixEnums() {
  console.log("🔧 Attempting to fix PostgreSQL enum types...")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    // First, check if the enums exist
    const enumTypes = await prisma.$queryRaw`
      SELECT n.nspname as schema,
             t.typname as name
      FROM pg_type t
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typtype = 'e'
      AND n.nspname = 'public';
    `

    console.log("Existing enum types:", enumTypes)

    // Create or update UserRole enum
    try {
      console.log("\nUpdating UserRole enum...")

      // Check if the enum exists first
      const userRoleExists = (enumTypes as any[]).some((e) => e.name === "UserRole")

      if (userRoleExists) {
        console.log("UserRole enum exists, updating values...")
        // This is a complex operation that might require dropping and recreating tables
        // For now, we'll just print the SQL that would be needed
        console.log(`
          -- To update an enum in PostgreSQL, you typically need to:
          -- 1. Create a new enum type
          -- 2. Update the column to use the new type
          -- 3. Drop the old type
          
          -- Example SQL (DO NOT RUN DIRECTLY - BACKUP YOUR DATA FIRST):
          
          -- Create new enum type
          CREATE TYPE "UserRole_new" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
          
          -- Update the column to use the new type
          ALTER TABLE users 
          ALTER COLUMN role TYPE "UserRole_new" 
          USING role::text::"UserRole_new";
          
          -- Drop old enum type
          DROP TYPE "UserRole";
          
          -- Rename new enum type to original name
          ALTER TYPE "UserRole_new" RENAME TO "UserRole";
        `)
      } else {
        console.log("UserRole enum doesn't exist, creating it...")
        await prisma.$executeRaw`
          CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
        `
        console.log("UserRole enum created successfully")
      }
    } catch (e) {
      console.error("Error updating UserRole enum:", e)
    }

    console.log("\n✅ Enum fix script completed")
    console.log("Note: Some operations may require manual intervention.")
    console.log(
      "Please check the output and consider running the suggested SQL commands manually after backing up your data.",
    )
  } catch (error) {
    console.error("❌ Enum fix failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix function
fixEnums().catch((e) => {
  console.error("Fatal error during enum fixing:", e)
  process.exit(1)
})
