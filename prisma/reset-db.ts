import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"
import * as readline from "readline"

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ["warn", "error"],
})

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Function to ask for confirmation
function askForConfirmation(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      resolve(answer.toLowerCase() === "y")
    })
  })
}

// Main function to reset the database
async function resetDatabase() {
  console.log("🔄 Database Reset Script")
  console.log("========================")
  console.log("⚠️  WARNING: This will DELETE ALL DATA in your database!")
  console.log("⚠️  This action cannot be undone!")
  console.log("")

  const confirmed = await askForConfirmation("Are you sure you want to reset the database?")
  if (!confirmed) {
    console.log("❌ Database reset cancelled.")
    rl.close()
    return
  }

  try {
    console.log("\n🗑️  Dropping all database objects...")

    // Drop all objects in the public schema
    await prisma.$executeRawUnsafe(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        -- Disable triggers
        EXECUTE 'SET session_replication_role = replica';
        
        -- Drop all tables
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        
        -- Drop all sequences
        FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
          EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
        END LOOP;
        
        -- Drop all views
        FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
          EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.table_name) || ' CASCADE';
        END LOOP;
        
        -- Drop all types (including enums)
        FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP
          EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
        
        -- Drop all domains
        FOR r IN (SELECT domain_name FROM information_schema.domains WHERE domain_schema = 'public') LOOP
          EXECUTE 'DROP DOMAIN IF EXISTS public.' || quote_ident(r.domain_name) || ' CASCADE';
        END LOOP;
        
        -- Drop all functions
        FOR r IN (SELECT proname, oidvectortypes(proargtypes) as args FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid) WHERE ns.nspname = 'public') LOOP
          EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        END LOOP;
        
        -- Re-enable triggers
        EXECUTE 'SET session_replication_role = DEFAULT';
      END $$;
    `)

    console.log("✅ All database objects dropped successfully.")

    // Ask if the user wants to recreate the schema
    const recreateSchema = await askForConfirmation("Do you want to recreate the database schema using Prisma?")

    if (recreateSchema) {
      console.log("\n🔨 Recreating database schema...")

      try {
        // Run Prisma migration reset (drops everything and applies migrations)
        execSync("npx prisma migrate reset --force", { stdio: "inherit" })
        console.log("✅ Database schema recreated successfully.")
      } catch (error) {
        console.error("❌ Failed to recreate schema:", error)

        // Fallback to db push if migrate reset fails
        console.log("🔄 Trying alternative method with db push...")
        try {
          execSync("npx prisma db push", { stdio: "inherit" })
          console.log("✅ Database schema recreated successfully with db push.")
        } catch (pushError) {
          console.error("❌ Failed to recreate schema with db push:", pushError)
        }
      }

      // Ask if the user wants to seed the database
      const seedDatabase = await askForConfirmation("Do you want to seed the database?")

      if (seedDatabase) {
        console.log("\n🌱 Seeding database...")
        try {
          execSync("npx prisma db seed", { stdio: "inherit" })
          console.log("✅ Database seeded successfully.")
        } catch (error) {
          console.error("❌ Failed to seed database:", error)
        }
      }
    }

    console.log("\n✅ Database reset process completed.")
  } catch (error) {
    console.error("❌ Error during database reset:", error)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

// Run the reset function
resetDatabase().catch((e) => {
  console.error("Fatal error:", e)
  process.exit(1)
})
