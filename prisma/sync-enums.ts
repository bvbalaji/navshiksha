import { PrismaClient } from "@prisma/client"

// This script helps synchronize enum values between Prisma and PostgreSQL
async function syncEnums() {
  console.log("🔄 Synchronizing enum values...")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    // Get all enum types from PostgreSQL
    const enumTypes = await prisma.$queryRaw`
      SELECT 
        t.typname AS enum_name,
        array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
      FROM 
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE 
        n.nspname = 'public'
      GROUP BY 
        t.typname;
    `

    console.log("Current enum types in PostgreSQL:")
    console.log(JSON.stringify(enumTypes, null, 2))

    // Define the expected enum values based on your Prisma schema
    const expectedEnums = {
      UserRole: ["student", "teacher", "admin"],
      ContentType: ["text", "video", "interactive", "quiz"],
      CourseLevel: ["beginner", "intermediate", "advanced"],
      ProgressStatus: ["not_started", "in_progress", "completed"],
      PlanStatus: ["assigned", "in_progress", "completed", "cancelled"],
      ResourceType: ["pdf", "video", "link", "image", "document", "other"],
      QuestionType: ["multiple_choice", "true_false", "short_answer", "essay"],
    }

    // Check if enums need updating
    for (const [enumName, expectedValues] of Object.entries(expectedEnums)) {
      const existingEnum = (enumTypes as any[]).find((e) => e.enum_name === enumName)

      if (!existingEnum) {
        console.log(`Enum ${enumName} doesn't exist in the database. Creating it...`)

        // Construct the SQL statement as a string - FIX: Don't use template literals for dynamic parts
        const valuesString = expectedValues.map((v) => `'${v}'`).join(", ")
        const createEnumSQL = `CREATE TYPE "public"."${enumName}" AS ENUM (${valuesString});`

        // Log the SQL we're about to execute
        console.log("Executing SQL:", createEnumSQL)

        // Execute as raw SQL without parameters
        await prisma.$executeRawUnsafe(createEnumSQL)

        console.log(`Created enum ${enumName}`)
      } else {
        // Check if values match
        const currentValues = existingEnum.enum_values
        const missingValues = expectedValues.filter((v) => !currentValues.includes(v))
        const extraValues = currentValues.filter((v) => !expectedValues.includes(v))

        if (missingValues.length > 0 || extraValues.length > 0) {
          console.log(`Enum ${enumName} has differences:`)
          if (missingValues.length > 0) console.log(`  Missing values: ${missingValues.join(", ")}`)
          if (extraValues.length > 0) console.log(`  Extra values: ${extraValues.join(", ")}`)

          // Generate SQL to update the enum (but don't execute it automatically)
          const valuesString = expectedValues.map((v) => `'${v}'`).join(", ")
          console.log(`To update enum ${enumName}, you would need to run these SQL commands:`)
          console.log(`
-- Create a new enum type
CREATE TYPE "public"."${enumName}_new" AS ENUM (${valuesString});

-- Update tables to use the new enum type (you'll need to do this for each table using this enum)
-- Example:
-- ALTER TABLE table_name 
-- ALTER COLUMN column_name TYPE "public"."${enumName}_new" 
-- USING column_name::text::"public"."${enumName}_new";

-- Drop the old enum type
-- DROP TYPE "public"."${enumName}";

-- Rename the new enum type to the original name
-- ALTER TYPE "public"."${enumName}_new" RENAME TO "${enumName}";
          `)
        } else {
          console.log(`Enum ${enumName} values match expected values.`)
        }
      }
    }

    console.log("\n✅ Enum synchronization check completed")
  } catch (error) {
    console.error("❌ Enum synchronization failed:", error)
    // Print more detailed error information
    if (error.message) {
      console.error("Error message:", error.message)
    }
    if (error.code) {
      console.error("Error code:", error.code)
    }
    if (error.meta) {
      console.error("Error meta:", error.meta)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the sync function
syncEnums().catch((e) => {
  console.error("Fatal error during enum synchronization:", e)
  process.exit(1)
})
