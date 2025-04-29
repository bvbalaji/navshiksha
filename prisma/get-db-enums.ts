import { PrismaClient } from "@prisma/client"

// This script retrieves the actual enum values from the PostgreSQL database
async function getDbEnums() {
  console.log("🔍 Retrieving actual enum values from PostgreSQL...")

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })

  try {
    // Get all enum types and their values from PostgreSQL
    const enumTypes = await prisma.$queryRaw`
      SELECT 
        t.typname AS enum_name,
        e.enumlabel AS enum_value
      FROM 
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE 
        n.nspname = 'public'
      ORDER BY 
        enum_name, e.enumsortorder;
    `

    console.log("Enum values in PostgreSQL database:")
    console.log(JSON.stringify(enumTypes, null, 2))

    // Group enum values by enum name for easier reading
    const groupedEnums: any = {}
    for (const item of enumTypes as any[]) {
      if (!groupedEnums[item.enum_name]) {
        groupedEnums[item.enum_name] = []
      }
      groupedEnums[item.enum_name].push(item.enum_value)
    }

    console.log("\nGrouped enum values:")
    for (const [enumName, values] of Object.entries(groupedEnums)) {
      console.log(`${enumName}: ${values}`)
    }

    return enumTypes
  } catch (error) {
    console.error("❌ Error retrieving enum values:", error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

// Run the function
getDbEnums().catch((e) => {
  console.error("Fatal error:", e)
  process.exit(1)
})
