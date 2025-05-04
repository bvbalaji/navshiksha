import fs from "fs"
import path from "path"
import chalk from "chalk"

// Define paths
const rootDir = process.cwd()
const layoutPath = path.join(rootDir, "app", "layout.tsx")
const nextConfigPath = path.join(rootDir, "next.config.mjs")
const buildCachePath = path.join(rootDir, ".next")

console.log(chalk.blue("🔍 Starting font configuration fix process..."))

// Check if files exist
if (!fs.existsSync(layoutPath)) {
  console.error(chalk.red("❌ Error: app/layout.tsx not found!"))
  process.exit(1)
}

if (!fs.existsSync(nextConfigPath)) {
  console.error(chalk.red("❌ Error: next.config.mjs not found!"))
  process.exit(1)
}

// Read layout file
console.log(chalk.blue("📖 Reading app/layout.tsx..."))
let layoutContent = fs.readFileSync(layoutPath, "utf8")

// Fix font configuration in layout.tsx
console.log(chalk.blue("🔧 Fixing font configuration..."))

// Check for problematic font configuration
const fontConfigRegex = /const\s+\w+\s*=\s*\w+$$\s*\{[^}]*\}\s*$$/gs
const fontConfigMatch = layoutContent.match(fontConfigRegex)

if (fontConfigMatch) {
  console.log(chalk.yellow("⚠️ Found font configuration, checking for issues..."))

  // Check for assetPrefix or problematic options
  const hasAssetPrefixIssue = /assetPrefix\s*:/i.test(fontConfigMatch[0])
  const hasPathIssue = /path\s*:/i.test(fontConfigMatch[0])

  if (hasAssetPrefixIssue || hasPathIssue) {
    console.log(chalk.yellow("⚠️ Found problematic font configuration options, fixing..."))

    // Create fixed font configuration
    const fixedFontConfig = fontConfigMatch[0]
      .replace(/,\s*assetPrefix\s*:[^,}]*/, "")
      .replace(/,\s*path\s*:[^,}]*/, "")

    // Replace in layout content
    layoutContent = layoutContent.replace(fontConfigRegex, fixedFontConfig)

    // Write fixed content back to file
    fs.writeFileSync(layoutPath, layoutContent)
    console.log(chalk.green("✅ Fixed font configuration in app/layout.tsx"))
  } else {
    console.log(chalk.green("✅ Font configuration in app/layout.tsx looks good"))
  }
} else {
  console.log(chalk.yellow("⚠️ Could not find font configuration in app/layout.tsx"))
}

// Read next.config.mjs
console.log(chalk.blue("📖 Reading next.config.mjs..."))
let nextConfigContent = fs.readFileSync(nextConfigPath, "utf8")

// Check for assetPrefix in next.config.mjs
const assetPrefixRegex = /assetPrefix\s*:/
const hasAssetPrefix = assetPrefixRegex.test(nextConfigContent)

if (hasAssetPrefix) {
  console.log(chalk.yellow("⚠️ Found assetPrefix in next.config.mjs, checking if it's valid..."))

  // Check if assetPrefix is valid
  const assetPrefixValueRegex = /assetPrefix\s*:\s*['"]([^'"]*)['"]/
  const assetPrefixMatch = nextConfigContent.match(assetPrefixValueRegex)

  if (assetPrefixMatch) {
    const assetPrefixValue = assetPrefixMatch[1]

    // Check if assetPrefix starts with / or is an absolute URL
    if (
      !assetPrefixValue.startsWith("/") &&
      !assetPrefixValue.startsWith("http://") &&
      !assetPrefixValue.startsWith("https://")
    ) {
      console.log(chalk.yellow(`⚠️ Invalid assetPrefix: ${assetPrefixValue}, fixing...`))

      // Fix assetPrefix by adding leading slash if it's not empty
      const fixedAssetPrefix = assetPrefixValue ? `/${assetPrefixValue}` : ""
      nextConfigContent = nextConfigContent.replace(assetPrefixValueRegex, `assetPrefix: '${fixedAssetPrefix}'`)

      // Write fixed content back to file
      fs.writeFileSync(nextConfigPath, nextConfigContent)
      console.log(chalk.green("✅ Fixed assetPrefix in next.config.mjs"))
    } else {
      console.log(chalk.green("✅ assetPrefix in next.config.mjs is valid"))
    }
  }
} else {
  console.log(chalk.green("✅ No assetPrefix found in next.config.mjs, which is fine"))
}

// Clean build cache
console.log(chalk.blue("🧹 Cleaning build cache..."))
if (fs.existsSync(buildCachePath)) {
  try {
    fs.rmSync(buildCachePath, { recursive: true, force: true })
    console.log(chalk.green("✅ Build cache cleaned successfully"))
  } catch (error) {
    console.error(chalk.red("❌ Error cleaning build cache:"), error)
  }
} else {
  console.log(chalk.yellow("⚠️ No build cache found, skipping cleanup"))
}

// Create a backup of the current layout.tsx
const backupPath = path.join(rootDir, "app", "layout.tsx.backup")
fs.copyFileSync(layoutPath, backupPath)
console.log(chalk.green(`✅ Created backup of layout.tsx at ${backupPath}`))

// Create a simplified version of the Inter font configuration
console.log(chalk.blue("🔧 Creating simplified font configuration..."))
const simplifiedFontConfig = `
import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./css-reset.css"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'

// Load Inter font with correct configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Navshiksha - AI-Powered Learning Platform",
  description: "Personalized AI tutoring for every student",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#5bbad5" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="layout-container">{children}</div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
`

// Write the simplified layout.tsx
fs.writeFileSync(layoutPath, simplifiedFontConfig)
console.log(chalk.green("✅ Created simplified font configuration in app/layout.tsx"))

console.log(chalk.green("✅ Font configuration fix process completed successfully!"))
console.log(chalk.blue('ℹ️ You can now run "npm run build" to verify the fix.'))
