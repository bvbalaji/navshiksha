import fs from "fs"
import path from "path"
import chalk from "chalk"

// Configuration
const rootDir = process.cwd()
const nextConfigPath = path.join(rootDir, "next.config.mjs")
const prismaClientPath = path.join(rootDir, "node_modules", ".prisma", "client")
const libPrismaPath = path.join(rootDir, "lib", "prisma.ts")
const serverPrismaPath = path.join(rootDir, "lib", "server", "prisma-server.ts")

// Console styling
const log = {
  info: (message: string) => console.log(chalk.blue("ℹ️ Info:"), message),
  success: (message: string) => console.log(chalk.green("✅ Success:"), message),
  warning: (message: string) => console.log(chalk.yellow("⚠️ Warning:"), message),
  error: (message: string) => console.log(chalk.red("❌ Error:"), message),
  step: (message: string) => console.log(chalk.cyan("🔹 Step:"), message),
}

/**
 * Main function to fix Prisma issues
 */
async function fixPrismaIssues() {
  console.log(chalk.bold.blue("\n=== Prisma Fix Script ===\n"))
  log.info("Starting Prisma issue detection and fixes...")

  try {
    // Step 1: Check if Prisma client exists
    checkPrismaClient()

    // Step 2: Fix Next.js configuration
    fixNextConfig()

    // Step 3: Ensure server-only Prisma usage
    ensureServerOnlyPrisma()

    // Step 4: Check for client-side imports
    checkClientSideImports()

    // Step 5: Fix Prisma schema if needed
    fixPrismaSchema()

    // Final success message
    console.log(chalk.bold.green("\n✨ Prisma fixes completed successfully!\n"))
    console.log("Next steps:")
    console.log("1. Run", chalk.cyan("npm run regenerate-prisma"), "to regenerate the Prisma client")
    console.log("2. Run", chalk.cyan("rm -rf .next"), "to clear your Next.js build cache")
    console.log("3. Run", chalk.cyan("npm run build"), "to rebuild your application\n")
  } catch (error) {
    log.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Check if Prisma client exists and is properly generated
 */
function checkPrismaClient() {
  log.step("Checking Prisma client...")

  if (!fs.existsSync(prismaClientPath)) {
    log.warning("Prisma client not found. It needs to be generated.")
    log.info("Will be fixed by running the regenerate-prisma script.")
    return
  }

  log.success("Prisma client exists.")
}

/**
 * Fix Next.js configuration to properly handle Prisma
 */
function fixNextConfig() {
  log.step("Fixing Next.js configuration...")

  if (!fs.existsSync(nextConfigPath)) {
    log.error("next.config.mjs not found. Please create it first.")
    return
  }

  let nextConfig = fs.readFileSync(nextConfigPath, "utf8")

  // Check if config already has Prisma externals
  if (nextConfig.includes("@prisma/client") && nextConfig.includes(".prisma/client")) {
    log.success("Next.js config already has Prisma externals.")
  } else {
    // Add Prisma to webpack externals
    const externalsPrismaConfig = `
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add Prisma to externals
      config.externals = [...(config.externals || []), 
        '@prisma/client', 
        '.prisma/client'
      ];
    }

    // Add null loader for Prisma browser files
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\\.prisma\\/client\\/index-browser/,
      use: 'null-loader'
    });

    return config;
  },`

    // Check if webpack config already exists
    if (nextConfig.includes("webpack: (")) {
      log.warning("Webpack config already exists. Please manually add Prisma externals.")
      console.log(chalk.yellow("Add this to your webpack config:"))
      console.log(
        chalk.yellow(`
if (isServer) {
  config.externals = [...(config.externals || []), 
    '@prisma/client', 
    '.prisma/client'
  ];
}

// Add null loader for Prisma browser files
config.module = config.module || {};
config.module.rules = config.module.rules || [];
config.module.rules.push({
  test: /\\.prisma\\/client\\/index-browser/,
  use: 'null-loader'
});`),
      )
    } else {
      // Replace the export default with our updated config
      nextConfig = nextConfig.replace(/export default .*?({[\s\S]*?})/m, (match, configObject) => {
        // Remove trailing semicolon if present
        const cleanConfig = configObject.replace(/};$/, "}")

        // Add our webpack config
        return `export default ${cleanConfig.replace(/}$/, `,${externalsPrismaConfig}\n}`)}`
      })

      fs.writeFileSync(nextConfigPath, nextConfig)
      log.success("Updated Next.js config with Prisma externals.")
    }
  }
}

/**
 * Ensure Prisma is only used on the server
 */
function ensureServerOnlyPrisma() {
  log.step("Ensuring server-only Prisma usage...")

  // Create server directory if it doesn't exist
  const serverDir = path.join(rootDir, "lib", "server")
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true })
    log.info("Created server directory.")
  }

  // Create server-only Prisma wrapper
  if (!fs.existsSync(serverPrismaPath)) {
    const serverPrismaContent = `'use server';

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the \`global\` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
`

    fs.writeFileSync(serverPrismaPath, serverPrismaContent)
    log.success("Created server-only Prisma wrapper.")
  } else {
    log.success("Server-only Prisma wrapper already exists.")
  }

  // Update lib/prisma.ts to use server-only import
  if (fs.existsSync(libPrismaPath)) {
    const libPrismaContent = fs.readFileSync(libPrismaPath, "utf8")

    if (!libPrismaContent.includes("use server")) {
      const updatedLibPrismaContent = `'use server';

// This file re-exports the server-only Prisma client
// All Prisma usage should go through this file
import prisma from './server/prisma-server';
;
export default prisma;
`

      fs.writeFileSync(libPrismaPath, updatedLibPrismaContent)
      log.success("Updated lib/prisma.ts to use server-only import.")
    } else {
      log.success("lib/prisma.ts already has server-only directive.")
    }
  } else {
    // Create lib/prisma.ts if it doesn't exist
    const libPrismaContent = `'use server';

// This file re-exports the server-only Prisma client
// All Prisma usage should go through this file
import prisma from './server/prisma-server';
;
export default prisma;
`

    fs.writeFileSync(libPrismaPath, libPrismaContent)
    log.success("Created lib/prisma.ts with server-only directive.")
  }
}

/**
 * Check for client-side imports of Prisma
 */
function checkClientSideImports() {
  log.step("Checking for client-side Prisma imports...")

  const clientComponentsDir = path.join(rootDir, "components")
  const appDir = path.join(rootDir, "app")

  const clientSideFiles: string[] = []

  // Helper function to check a file for Prisma imports
  function checkFileForPrismaImports(filePath: string) {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return

    const content = fs.readFileSync(filePath, "utf8")

    // Check if it's a client component
    const isClientComponent = content.includes("'use client'") || content.includes('"use client"')

    // Check for Prisma imports
    const hasPrismaImport =
      content.includes("@prisma/client") || (content.includes("prisma") && !content.includes("use server"))

    if (isClientComponent && hasPrismaImport) {
      clientSideFiles.push(filePath)
    }
  }

  // Helper function to recursively check directories
  function checkDirectory(dirPath: string) {
    const files = fs.readdirSync(dirPath)

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        checkDirectory(filePath)
      } else {
        checkFileForPrismaImports(filePath)
      }
    }
  }

  // Check components and app directories
  if (fs.existsSync(clientComponentsDir)) {
    checkDirectory(clientComponentsDir)
  }

  if (fs.existsSync(appDir)) {
    checkDirectory(appDir)
  }

  // Report findings
  if (clientSideFiles.length > 0) {
    log.warning("Found Prisma imports in client components:")
    clientSideFiles.forEach((file) => {
      console.log(chalk.yellow(`  - ${path.relative(rootDir, file)}`))
    })
    console.log(chalk.yellow("\nThese files should be updated to use server actions or server components."))
  } else {
    log.success("No client-side Prisma imports found.")
  }
}

/**
 * Fix Prisma schema if needed
 */
function fixPrismaSchema() {
  log.step("Checking Prisma schema...")

  const prismaSchemaPath = path.join(rootDir, "prisma", "schema.prisma")

  if (!fs.existsSync(prismaSchemaPath)) {
    log.warning("Prisma schema not found. Skipping schema fixes.")
    return
  }

  const schemaContent = fs.readFileSync(prismaSchemaPath, "utf8")

  // Check if schema has proper generator configuration
  if (!schemaContent.includes("previewFeatures")) {
    log.info("Adding recommended preview features to Prisma schema.")

    const updatedSchema = schemaContent.replace(
      /(generator\s+client\s+{\s+provider\s+=\s+["']prisma-client-js["'])/,
      '$1\n  previewFeatures = ["filteredRelationCount", "fullTextSearch", "extendedWhereUnique"]',
    )

    fs.writeFileSync(prismaSchemaPath, updatedSchema)
    log.success("Updated Prisma schema with recommended preview features.")
  } else {
    log.success("Prisma schema already has preview features configured.")
  }
}

// Run the main function
fixPrismaIssues()
