import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${colors.cyan}Starting favicon conflict resolution...${colors.reset}`)

// Check for potential favicon page files
const appDir = path.join(process.cwd(), "app")
const potentialConflictingFiles = [
  path.join(appDir, "favicon.ico"),
  path.join(appDir, "favicon.ico/page.tsx"),
  path.join(appDir, "favicon.ico/page.js"),
  path.join(appDir, "favicon.ico/route.ts"),
  path.join(appDir, "favicon.ico/route.js"),
]

let conflictFound = false

// Check and remove conflicting files
potentialConflictingFiles.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    console.log(`${colors.yellow}Found conflicting file: ${filePath}${colors.reset}`)

    // Create backup
    const backupPath = `${filePath}.backup`
    fs.copyFileSync(filePath, backupPath)
    console.log(`${colors.blue}Created backup at: ${backupPath}${colors.reset}`)

    // Remove the file
    fs.unlinkSync(filePath)
    console.log(`${colors.green}Removed conflicting file: ${filePath}${colors.reset}`)

    conflictFound = true
  }
})

// Check if favicon exists in public directory
const publicFaviconPath = path.join(process.cwd(), "public", "favicon.ico")
if (!fs.existsSync(publicFaviconPath)) {
  console.log(`${colors.yellow}No favicon.ico found in public directory${colors.reset}`)

  // Create favicon directory if it doesn't exist
  const iconsDir = path.join(process.cwd(), "public", "icons")
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true })
    console.log(`${colors.blue}Created icons directory: ${iconsDir}${colors.reset}`)
  }

  // Create a simple favicon if none exists
  console.log(`${colors.blue}Creating a default favicon.ico in public directory${colors.reset}`)

  // We'll use a simple approach to create a basic favicon
  try {
    // Create a simple HTML file that will generate our favicon
    const faviconGeneratorPath = path.join(process.cwd(), "scripts", "generate-favicon.html")
    const faviconGeneratorContent = `
    <html>
    <head>
      <title>Favicon Generator</title>
    </head>
    <body>
      <canvas id="favicon" width="16" height="16"></canvas>
      <script>
        const canvas = document.getElementById('favicon');
        const ctx = canvas.getContext('2d');
        
        // Draw a simple "N" for Navshiksha
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(0, 0, 16, 16);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('N', 3, 13);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/png');
        document.body.innerHTML = '<textarea style="width:100%;height:100px;">' + dataUrl + '</textarea>';
      </script>
    </body>
    </html>
    `

    fs.writeFileSync(faviconGeneratorPath, faviconGeneratorContent)
    console.log(`${colors.blue}Created favicon generator HTML${colors.reset}`)

    // Note: In a real environment, we would use this HTML file with a headless browser
    // For this script, we'll create a simple favicon directly

    // Create a simple favicon.ico file
    const defaultFaviconPath = path.join(process.cwd(), "public", "favicon.ico")

    // Create a very basic 1x1 transparent ICO file (just enough to prevent 404 errors)
    const basicIcoContent = Buffer.from([
      0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x16,
      0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00,
    ])

    fs.writeFileSync(defaultFaviconPath, basicIcoContent)
    console.log(`${colors.green}Created basic favicon.ico in public directory${colors.reset}`)

    // Create favicon-16x16.png and favicon-32x32.png in the icons directory
    const favicon16Path = path.join(iconsDir, "favicon-16x16.png")
    const favicon32Path = path.join(iconsDir, "favicon-32x32.png")

    // We'll create very basic PNG files (in a real scenario, you'd use a proper image library)
    // For now, we'll just copy the basic favicon to these locations
    fs.copyFileSync(defaultFaviconPath, favicon16Path)
    fs.copyFileSync(defaultFaviconPath, favicon32Path)

    console.log(`${colors.green}Created favicon PNG files in icons directory${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}Error creating favicon: ${error}${colors.reset}`)
  }
}

// Update next.config.mjs to handle favicon properly
const nextConfigPath = path.join(process.cwd(), "next.config.mjs")
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, "utf8")

  // Check if we need to add assetPrefix configuration
  if (!nextConfig.includes("assetPrefix")) {
    // Add assetPrefix configuration before the last export statement
    const updatedConfig = nextConfig.replace(
      /export default nextConfig;/,
      `// Ensure public assets like favicon.ico are properly served
// Remove this if you're not having favicon issues in production
if (process.env.NODE_ENV === 'production') {
  nextConfig.assetPrefix = '.';
}

export default nextConfig;`,
    )

    fs.writeFileSync(nextConfigPath, updatedConfig)
    console.log(`${colors.green}Updated next.config.mjs with assetPrefix configuration${colors.reset}`)
  }
}

// Create a documentation file for favicon best practices
const faviconDocsPath = path.join(process.cwd(), "docs", "favicon-best-practices.md")
const faviconDocsContent = `# Favicon Best Practices for Next.js

## Overview

Favicons are small icons associated with a website that appear in browser tabs, bookmarks, and other UI elements. Properly implementing favicons in a Next.js application requires following certain best practices to avoid conflicts.

## Common Issues

1. **Conflicting Routes**: Having both a file in the \`public\` directory and a page file with the same name creates routing conflicts.
2. **Missing Favicon**: Browsers will request \`/favicon.ico\` by default, and a 404 response can fill logs with errors.
3. **Incorrect Configuration**: Improper metadata configuration can lead to favicons not displaying correctly.

## Best Practices

### 1. Place Favicon in the Public Directory

Always place your \`favicon.ico\` file in the \`public\` directory. Next.js will automatically serve files from this directory at the root path.

\`\`\`
public/
  favicon.ico
  icons/
    favicon-16x16.png
    favicon-32x32.png
    apple-icon-180x180.png
\`\`\`

### 2. Configure Metadata in Layout

Use the metadata object in your root layout to properly configure favicons:

\`\`\`typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
}
\`\`\`

### 3. Avoid Creating Page Routes for Favicon

Never create page files or API routes that would conflict with static files:

- Avoid creating \`app/favicon.ico/\` directory
- Avoid creating \`app/favicon.ico.js\` or similar files

### 4. Use Modern Favicon Formats

Consider using modern favicon formats for better quality and compatibility:

- \`.ico\` file for legacy support
- \`.png\` files in various sizes (16x16, 32x32, etc.)
- \`.svg\` for scalable icons
- Apple Touch icons for iOS devices

### 5. Generate a Complete Favicon Set

Use tools like [RealFaviconGenerator](https://realfavicongenerator.net/) to create a complete set of favicons for all platforms.

## Troubleshooting

If you encounter favicon issues:

1. Check for conflicting routes in your application
2. Verify that favicon.ico exists in the public directory
3. Clear browser cache to see updated favicons
4. Use browser dev tools to check for 404 errors related to favicon requests
5. Ensure your metadata configuration is correct

## Additional Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Web App Manifest Specification](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [HTML Favicon Guide](https://css-tricks.com/favicon-quiz/)
`

// Ensure docs directory exists
const docsDir = path.join(process.cwd(), "docs")
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

fs.writeFileSync(faviconDocsPath, faviconDocsContent)
console.log(`${colors.green}Created favicon best practices documentation at: ${faviconDocsPath}${colors.reset}`)

// Add script to package.json
const packageJsonPath = path.join(process.cwd(), "package.json")
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  if (!packageJson.scripts["fix-favicon"]) {
    packageJson.scripts["fix-favicon"] = "ts-node scripts/fix-favicon-conflict.ts"
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(`${colors.green}Added fix-favicon script to package.json${colors.reset}`)
  }
}

// Clean the .next directory to ensure changes take effect
try {
  console.log(`${colors.blue}Cleaning .next directory to apply changes...${colors.reset}`)
  if (fs.existsSync(path.join(process.cwd(), ".next"))) {
    execSync("rm -rf .next", { stdio: "inherit" })
  }
  console.log(`${colors.green}Successfully cleaned .next directory${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error cleaning .next directory: ${error}${colors.reset}`)
}

if (conflictFound) {
  console.log(`${colors.green}✅ Successfully resolved favicon conflict!${colors.reset}`)
} else {
  console.log(
    `${colors.blue}No direct conflicts found, but updated favicon configuration for best practices.${colors.reset}`,
  )
}

console.log(`${colors.cyan}
Next steps:
1. Run 'npm run dev' to verify the changes
2. Check that favicon appears correctly in browser tabs
3. Review the favicon documentation at docs/favicon-best-practices.md
${colors.reset}`)
