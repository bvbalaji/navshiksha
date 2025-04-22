import { PrismaClient } from "@prisma/client"

// This script helps check the actual database schema
async function checkDbSchema() {
  console.log("🔍 Checking database schema...")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    // Check tables
    console.log("\nChecking tables...")
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
    console.log("Tables:", tables)

    // Check enum types
    console.log("\nChecking enum types...")
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
        t.typname
      ORDER BY
        t.typname;
    `
    console.log("Enum types:", JSON.stringify(enumTypes, null, 2))

    // Check UserRole enum specifically
    console.log("\nChecking UserRole enum...")
    try {
      const userRoleEnum = await prisma.$queryRaw`
        SELECT 
          e.enumlabel AS enum_value,
          e.enumsortorder AS sort_order
        FROM 
          pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE 
          n.nspname = 'public' AND
          t.typname = 'UserRole'
        ORDER BY 
          e.enumsortorder;
      `
      console.log("UserRole enum values:", userRoleEnum)
    } catch (e) {
      console.error("Error checking UserRole enum:", e)
    }

    // Check users table schema
    console.log("\nChecking users table schema...")
    const usersColumns = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        udt_name,
        is_nullable
      FROM 
        information_schema.columns 
      WHERE 
        table_schema = 'public' AND 
        table_name = 'users'
      ORDER BY 
        ordinal_position;
    `
    console.log("Users table columns:", usersColumns)

    console.log("\n✅ Database schema check completed")
  } catch (error) {
    console.error("❌ Database schema check failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check function
checkDbSchema().catch((e) => {
  console.error("Fatal error during database schema check:", e)
  process.exit(1)
})
