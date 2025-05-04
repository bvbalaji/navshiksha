import fs from "fs"
import path from "path"
import { promisify } from "util"

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

// Define the import mappings (old import path -> new import path)
const importMappings = {
  "@/lib/auth-utils": "@/lib/server/auth-utils",
  "@/lib/auth-service": "@/lib/server/auth-service",
  "@/lib/auth": "@/lib/server/auth-utils",
  "next-auth/client": "next-auth/react",
  "@/auth": "@/lib/server/auth-utils",
}

// Function to recursively find all TypeScript files
async function findTsFiles(dir: string, fileList: string[] = []): Promise<string[]> {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      fileList = await findTsFiles(filePath, fileList)
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) &&
      !filePath.includes("node_modules") &&
      !filePath.includes(".next")
    ) {
      fileList.push(filePath)
    }
  }

  return fileList
}

// Function to update imports in a file
async function updateImportsInFile(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, "utf8")
    let updatedContent = content
    let hasChanges = false

    // Check for each import mapping
    for (const [oldImport, newImport] of Object.entries(importMappings)) {
      // Create regex patterns to match different import styles
      const importPatterns = [
        new RegExp(`import\\s+(.+?)\\s+from\\s+['"]${oldImport}['"]`, "g"),
        new RegExp(`import\\s+{\\s*(.+?)\\s*}\\s+from\\s+['"]${oldImport}['"]`, "g"),
        new RegExp(`import\\s+(.+?),\\s*{\\s*(.+?)\\s*}\\s+from\\s+['"]${oldImport}['"]`, "g"),
      ]

      for (const pattern of importPatterns) {
        if (pattern.test(updatedContent)) {
          hasChanges = true
          updatedContent = updatedContent.replace(pattern, (match) => {
            return match.replace(oldImport, newImport)
          })
        }
      }
    }

    // If changes were made, write the updated content back to the file
    if (hasChanges) {
      await writeFile(filePath, updatedContent, "utf8")
      console.log(`Updated imports in ${filePath}`)
      return true
    }

    return false
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error)
    return false
  }
}

// Main function
async function main() {
  try {
    console.log("Finding TypeScript files...")
    const tsFiles = await findTsFiles(path.resolve("./"))
    console.log(`Found ${tsFiles.length} TypeScript files`)

    let updatedFilesCount = 0

    // Update imports in each file
    for (const filePath of tsFiles) {
      const wasUpdated = await updateImportsInFile(filePath)
      if (wasUpdated) {
        updatedFilesCount++
      }
    }

    console.log(`Updated imports in ${updatedFilesCount} files`)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
