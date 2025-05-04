import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import sharp from "sharp"
import chalk from "chalk"

// Configuration
const BASE_SVG_PATH = path.join(process.cwd(), "public", "icons", "icon-base.svg")
const OUTPUT_DIR = path.join(process.cwd(), "public", "icons")
const FAVICON_DIR = path.join(process.cwd(), "public")

// Icon size configurations
const FAVICON_SIZES = [16, 32, 48]
const APP_ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const APPLE_ICON_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180]
const MS_ICON_SIZES = [70, 144, 150, 310]

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
    await sharp(svgPath).resize(size, size).png({ quality: 90 }).toFile(outputPath)

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

    // Use sharp to create a multi-size ICO file
    console.log(chalk.blue("Creating favicon.ico with multiple sizes..."))

    // For favicon.ico, we'll use the ImageMagick convert command if available
    // Otherwise, we'll just use the 32x32 size as the favicon
    try {
      const faviconPath = path.join(FAVICON_DIR, "favicon.ico")

      try {
        // Try using ImageMagick if available
        const convertCommand = `convert ${tempFiles.join(" ")} ${faviconPath}`
        execSync(convertCommand)
        console.log(chalk.green("✓ Generated favicon.ico using ImageMagick"))
      } catch (error) {
        // Fallback to using sharp for a single-size favicon
        console.log(chalk.yellow("ImageMagick not available, using sharp for favicon.ico"))
        await sharp(path.join(OUTPUT_DIR, `temp-favicon-32.png`)).toFile(faviconPath)
        console.log(chalk.green("✓ Generated favicon.ico using sharp (32x32 only)"))
      }
    } catch (error) {
      console.error(chalk.red(`✗ Error generating favicon.ico: ${error}`))
    }

    // Clean up temporary files
    tempFiles.forEach((file) => {
      fs.unlinkSync(file)
    })
  } catch (error) {
    console.error(chalk.red(`✗ Error in generateFaviconIco: ${error}`))
  }
}

// Main function to generate all icons
async function generateIcons(): Promise<void> {
  console.log(chalk.blue("Starting icon generation process..."))

  // Check if base SVG exists
  if (!fs.existsSync(BASE_SVG_PATH)) {
    console.error(chalk.red(`Base SVG not found at ${BASE_SVG_PATH}`))
    console.log(chalk.yellow("Please create a base SVG file at public/icons/icon-base.png"))
    return
  }

  // Ensure output directories exist
  ensureDirectoryExists(OUTPUT_DIR)
  ensureDirectoryExists(FAVICON_DIR)

  // Generate favicon PNGs
  console.log(chalk.blue("\nGenerating favicon sizes..."))
  await Promise.all(
    FAVICON_SIZES.map((size) =>
      convertSvgToPng(BASE_SVG_PATH, path.join(OUTPUT_DIR, `favicon-${size}x${size}.png`), size),
    ),
  )

  // Generate app icon PNGs
  console.log(chalk.blue("\nGenerating app icon sizes..."))
  await Promise.all(
    APP_ICON_SIZES.map((size) =>
      convertSvgToPng(BASE_SVG_PATH, path.join(OUTPUT_DIR, `icon-${size}x${size}.png`), size),
    ),
  )

  // Generate Apple touch icon PNGs
  console.log(chalk.blue("\nGenerating Apple touch icon sizes..."))
  await Promise.all(
    APPLE_ICON_SIZES.map((size) =>
      convertSvgToPng(BASE_SVG_PATH, path.join(OUTPUT_DIR, `apple-icon-${size}x${size}.png`), size),
    ),
  )

  // Generate Microsoft tile PNGs
  console.log(chalk.blue("\nGenerating Microsoft tile sizes..."))
  await Promise.all(
    MS_ICON_SIZES.map((size) =>
      convertSvgToPng(BASE_SVG_PATH, path.join(OUTPUT_DIR, `ms-icon-${size}x${size}.png`), size),
    ),
  )

  // Generate favicon.ico
  await generateFaviconIco()

  // Generate manifest.json icons array
  generateManifestIcons()

  console.log(chalk.green("\n✓ Icon generation complete!"))
  console.log(
    chalk.blue(
      `Generated ${FAVICON_SIZES.length + APP_ICON_SIZES.length + APPLE_ICON_SIZES.length + MS_ICON_SIZES.length} icon files in ${OUTPUT_DIR}`,
    ),
  )
}

// Generate or update the icons array in manifest.json
function generateManifestIcons(): void {
  const manifestPath = path.join(process.cwd(), "public", "manifest.json")

  try {
    if (fs.existsSync(manifestPath)) {
      console.log(chalk.blue("\nUpdating manifest.json with icon definitions..."))

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

      // Create icons array for manifest
      manifest.icons = APP_ICON_SIZES.map((size) => ({
        src: `/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
      }))

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
      console.log(chalk.green("✓ Updated manifest.json with icon definitions"))
    } else {
      console.log(chalk.yellow("manifest.json not found, skipping manifest update"))
    }
  } catch (error) {
    console.error(chalk.red(`✗ Error updating manifest.json: ${error}`))
  }
}

// Create a sample SVG if it doesn't exist
function createSampleSvgIfNeeded(): void {
  if (!fs.existsSync(BASE_SVG_PATH)) {
    ensureDirectoryExists(path.dirname(BASE_SVG_PATH))

    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#4f46e5" rx="128" ry="128" />
  <path d="M 128,256 L 384,256 M 256,128 L 256,384" stroke="white" stroke-width="48" stroke-linecap="round" />
</svg>`

    fs.writeFileSync(BASE_SVG_PATH, sampleSvg)
    console.log(chalk.yellow("Created a sample SVG icon at " + BASE_SVG_PATH))
    console.log(chalk.yellow("Please replace it with your actual icon before generating production icons."))
  }
}
// Execute the script
;(async () => {
  try {
    createSampleSvgIfNeeded()
    await generateIcons()
  } catch (error) {
    console.error(chalk.red("Icon generation failed:"), error)
    process.exit(1)
  }
})()
