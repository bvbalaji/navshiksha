import { execSync } from "child_process"

/**
 * A simpler version of the database reset script that doesn't require user confirmation.
 * USE WITH CAUTION: This will immediately drop and recreate your database without prompting.
 */
async function resetDatabaseSimple() {
  console.log("🔄 Simple Database Reset Script")
  console.log("==============================")
  console.log("⚠️  WARNING: Dropping and recreating database schema...")

  try {
    // Reset the database using Prisma's built-in reset command
    console.log("\n🗑️  Dropping database schema...")
    execSync("npx prisma migrate reset --force", { stdio: "inherit" })

    console.log("\n✅ Database reset completed successfully.")

    // Generate Prisma client to ensure it matches the schema
    console.log("\n🔄 Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    console.log("\n✅ All done! Database has been reset and Prisma client updated.")
  } catch (error) {
    console.error("\n❌ Error during database reset:", error)

    // Fallback to db push if migrate reset fails
    console.log("\n🔄 Trying alternative method with db push...")
    try {
      execSync("npx prisma db push --force-reset", { stdio: "inherit" })
      console.log("\n✅ Database reset completed successfully with db push.")

      // Generate Prisma client
      execSync("npx prisma generate", { stdio: "inherit" })
    } catch (pushError) {
      console.error("\n❌ Failed to reset database with db push:", pushError)
      process.exit(1)
    }
  }
}

// Run the reset function
resetDatabaseSimple().catch((e) => {
  console.error("Fatal error:", e)
  process.exit(1)
})
