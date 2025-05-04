import fs from "fs"
import path from "path"
import chalk from "chalk"
import sharp from "sharp"

// Configuration
const ICONS_DIR = path.join(process.cwd(), "public", "icons")
const FAVICON_PATH = path.join(process.cwd(), "public", "favicon.ico")

// Expected icon files
const EXPECTED_FILES = [
  // Favicons
  { path: FAVICON_PATH, name: "favicon.ico" },
  ...["16", "32", "48"].map((size) => ({
    path: path.join(ICONS_DIR, `favicon-${size}x${size}.png`),
    name: `favicon-${size}x${size}.png`,
    width: Number.parseInt(size),
    height: Number.parseInt(size),
  })),

  // App icons
  ...["72", "96", "128", "144", "152", "192", "384", "512"].map((size) => ({
    path: path.join(ICONS_DIR, `icon-${size}x${size}.png`),
    name: `icon-${size}x${size}.png`,
    width: Number.parseInt(size),
    height: Number.parseInt(size),
  })),

  // Apple touch icons
  ...["57", "60", "72", "76", "114", "120", "144", "152", "180"].map((size) => ({
    path: path.join(ICONS_DIR, `apple-icon-${size}x${size}.png`),
    name: `apple-icon-${size}x${size}.png`,
    width: Number.parseInt(size),
    height: Number.parseInt(size),
  })),

  // Microsoft tiles
  ...["70", "144", "150", "310"].map((size) => ({
    path: path.join(ICONS_DIR, `ms-icon-${size}x${size}.png`),
    name: `ms-icon-${size}x${size}.png`,
    width: Number.parseInt(size),
    height: Number.parseInt(size),
  })),
]

// Verify that all expected files exist
async function verifyIcons(): Promise<void> {
  console.log(chalk.blue("Verifying icon files..."))

  let allValid = true
  let missing = 0
  let wrongSize = 0

  for (const file of EXPECTED_FILES) {
    if (!fs.existsSync(file.path)) {
      console.error(chalk.red(`✗ Missing: ${file.name}`))
      missing++
      allValid = false
      continue
    }

    // Check dimensions for PNG files
    if (file.path.endsWith(".png") && file.width && file.height) {
      try {
        const metadata = await sharp(file.path).metadata()
        if (metadata.width !== file.width || metadata.height !== file.height) {
          console.error(
            chalk.red(
              `✗ Wrong size: ${file.name} - Expected ${file.width}x${file.height}, got ${metadata.width}x${metadata.height}`,
            ),
          )
          wrongSize++
          allValid = false
          continue
        }
      } catch (error) {
        console.error(chalk.red(`✗ Error checking dimensions of ${file.name}: ${error}`))
        allValid = false
        continue
      }
    }

    console.log(chalk.green(`✓ Verified: ${file.name}`))
  }

  if (allValid) {
    console.log(chalk.green("\n✓ All icon files verified successfully!"))
  } else {
    console.log(chalk.yellow(`\n⚠ Verification completed with issues:`))
    console.log(chalk.yellow(`  - Missing files: ${missing}`))
    console.log(chalk.yellow(`  - Wrong dimensions: ${wrongSize}`))
    console.log(chalk.blue('\nRun "npm run generate-icons" to generate missing or incorrect icons.'))
  }
}
// Execute the script
;(async () => {
  try {
    await verifyIcons()
  } catch (error) {
    console.error(chalk.red("Icon verification failed:"), error)
    process.exit(1)
  }
})()
