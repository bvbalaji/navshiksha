import fs from "fs"
import path from "path"
import sharp from "sharp"
import chalk from "chalk"

// Configuration
const BASE_SVG_PATH = path.join(process.cwd(), "public", "icons", "icon-base.svg")
const OUTPUT_DIR = path.join(process.cwd(), "public", "icons")
const FAVICON_DIR = path.join(process.cwd(), "public")

// Icon size configurations for favicon
const FAVICON_SIZES = [16, 32, 48]

// Ensure the output directory exists
function ensureDirectoryExists(directory: string): void {
  if (!fs.existsSync(directory)) {
    console.log(chalk.blue(`Creating directory: ${directory}`))
    fs.mkdirSync(directory, { recursive: true })
  }
}

// Convert SVG to PNG with specified size
async function convertSvgToPng(svgPath: string, outputPath: string, size: number): Promise<void> {
  try {
    // Create a square background with padding
    const svgBuffer = fs.readFileSync(svgPath)

    await sharp(svgBuffer).resize(size, size).png({ quality: 90 }).toFile(outputPath)

    console.log(chalk.green(`✓ Generated: ${path.basename(outputPath)} (${size}x${size})`))
  } catch (error) {
    console.error(chalk.red(`✗ Error generating ${outputPath}: ${error}`))
    throw error
  }
}

// Generate favicon.ico with multiple sizes
async function generateFaviconIco(): Promise<void> {
  try {
    // Create temporary PNGs for each favicon size
    const tempFiles = await Promise.all(
      FAVICON_SIZES.map(async (size) => {
        const tempFile = path.join(OUTPUT_DIR, `temp-favicon-${size}.png`)
        await convertSvgToPng(BASE_SVG_PATH, tempFile, size)
        return tempFile
      }),
    )

    // Use the 32x32 size as the favicon
    const faviconPath = path.join(FAVICON_DIR, "favicon.ico")
    await sharp(path.join(OUTPUT_DIR, `temp-favicon-32.png`)).toFile(faviconPath)
    console.log(chalk.green("✓ Generated favicon.ico using sharp (32x32)"))

    // Also create standard favicon PNGs
    await Promise.all(
      FAVICON_SIZES.map((size) =>
        convertSvgToPng(BASE_SVG_PATH, path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`), size),
      ),
    )

    // Clean up temporary files
    tempFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    })
  } catch (error) {
    console.error(chalk.red(`✗ Error in generateFaviconIco: ${error}`))
  }
}

// Main function to generate favicon
async function generateFavicon(): Promise<void> {
  console.log(chalk.blue("Starting brain favicon generation..."))

  // Check if base SVG exists
  if (!fs.existsSync(BASE_SVG_PATH)) {
    console.error(chalk.red(`Base SVG not found at ${BASE_SVG_PATH}`))
    return
  }

  // Ensure output directories exist
  ensureDirectoryExists(OUTPUT_DIR)
  ensureDirectoryExists(FAVICON_DIR)

  // Generate favicon.ico
  await generateFaviconIco()

  console.log(chalk.green("\n✓ Brain favicon generation complete!"))
}
// Execute the script
;(async () => {
  try {
    await generateFavicon()
  } catch (error) {
    console.error(chalk.red("Favicon generation failed:"), error)
    process.exit(1)
  }
})()
