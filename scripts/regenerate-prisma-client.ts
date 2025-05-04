import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import chalk from "chalk"

// Configuration
const rootDir = process.cwd()
const prismaClientPath = path.join(rootDir, "node_modules", ".prisma", "client")
const prismaSchemaPath = path.join(rootDir, "prisma", "schema.prisma")

// Console styling
const log = {
  info: (message: string) => console.log(chalk.blue("ℹ️ Info:"), message),
  success: (message: string) => console.log(chalk.green("✅ Success:"), message),
  warning: (message: string) => console.log(chalk.yellow("⚠️ Warning:"), message),
  error: (message: string) => console.log(chalk.red("❌ Error:"), message),
  step: (message: string) => console.log(chalk.cyan("🔹 Step:"), message),
}

/**
 * Main function to regenerate Prisma client
 */
async function regeneratePrismaClient() {
  console.log(chalk.bold.blue("\n=== Prisma Client Regeneration ===\n"))
  log.info("Starting Prisma client regeneration process...")

  try {
    // Step 1: Check if Prisma schema exists
    checkPrismaSchema()

    // Step 2: Clean up existing Prisma client
    cleanupPrismaClient()

    // Step 3: Regenerate Prisma client
    generatePrismaClient()

    // Step 4: Verify the generated client
    verifyPrismaClient()

    // Final success message
    console.log(chalk.bold.green("\n✨ Prisma client regenerated successfully!\n"))
    console.log("Next steps:")
    console.log("1. Run", chalk.cyan("rm -rf .next"), "to clear your Next.js build cache")
    console.log("2. Run", chalk.cyan("npm run build"), "to rebuild your application\n")
  } catch (error) {
    log.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

/**
 * Check if Prisma schema exists
 */
function checkPrismaSchema() {
  log.step("Checking Prisma schema...")

  if (!fs.existsSync(prismaSchemaPath)) {
    throw new Error("Prisma schema not found at prisma/schema.prisma. Please create it first.")
  }

  log.success("Prisma schema found.")
}

/**
 * Clean up existing Prisma client
 */
function cleanupPrismaClient() {
  log.step("Cleaning up existing Prisma client...")

  // Remove the Prisma client directory if it exists
  if (fs.existsSync(prismaClientPath)) {
    try {
      // Use rimraf-like recursive removal
      const deleteFolderRecursive = (folderPath: string) => {
        if (fs.existsSync(folderPath)) {
          fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file)
            if (fs.lstatSync(curPath).isDirectory()) {
              // Recursive call
              deleteFolderRecursive(curPath)
            } else {
              // Delete file
              fs.unlinkSync(curPath)
            }
          })
          fs.rmdirSync(folderPath)
        }
      }

      deleteFolderRecursive(prismaClientPath)
      log.success("Existing Prisma client removed.")
    } catch (error) {
      log.warning(`Could not remove existing Prisma client: ${error instanceof Error ? error.message : String(error)}`)
      log.info("Continuing with regeneration anyway...")
    }
  } else {
    log.info("No existing Prisma client found. Proceeding with generation.")
  }
}

/**
 * Generate Prisma client
 */
function generatePrismaClient() {
  log.step("Generating Prisma client...")

  try {
    // Run prisma generate with verbose output
    const output = execSync("npx prisma generate --verbose", { encoding: "utf8" })
    log.info("Prisma client generation output:")
    console.log(chalk.gray(output))
    log.success("Prisma client generated.")
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate Prisma client: ${error.message}`)
    } else {
      throw new Error(`Failed to generate Prisma client: ${String(error)}`)
    }
  }
}

/**
 * Verify the generated Prisma client
 */
function verifyPrismaClient() {
  log.step("Verifying Prisma client...")

  if (!fs.existsSync(prismaClientPath)) {
    throw new Error("Prisma client was not generated properly. Check for errors above.")
  }

  // Check for index-browser.js which is often the source of issues
  const indexBrowserPath = path.join(prismaClientPath, "index-browser.js")
  if (!fs.existsSync(indexBrowserPath)) {
    log.warning("index-browser.js not found. This might cause issues with browser compatibility.")
    log.info("Make sure your Next.js config properly excludes Prisma from client bundles.")
  } else {
    log.success("index-browser.js found.")
  }

  // Check for the main index.js
  const indexPath = path.join(prismaClientPath, "index.js")
  if (!fs.existsSync(indexPath)) {
    throw new Error("Main Prisma client index.js not found. Generation failed.")
  }

  log.success("Prisma client verified successfully.")
}

// Run the main function
regeneratePrismaClient()
