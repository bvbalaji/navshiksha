# Icon Generation for Navshiksha

This document provides instructions for generating all the required favicon and app icons for the Navshiksha platform.

## Required Tools

- [Sharp](https://sharp.pixelplumbing.com/) - For image processing
- [svg2png](https://www.npmjs.com/package/svg2png) - For converting SVG to PNG
- [real-favicon](https://www.npmjs.com/package/real-favicon) - For generating a complete favicon package

## Generating Icons Manually

1. Start with a high-resolution SVG icon (at least 512x512 pixels)
2. Generate PNG versions in the following sizes:
   - 16x16 (favicon-16x16.png)
   - 32x32 (favicon-32x32.png)
   - 48x48 (favicon-48x48.png)
   - 72x72 (icon-72x72.png)
   - 96x96 (icon-96x96.png)
   - 128x128 (icon-128x128.png)
   - 144x144 (icon-144x144.png)
   - 152x152 (icon-152x152.png)
   - 192x192 (icon-192x192.png)
   - 384x384 (icon-384x384.png)
   - 512x512 (icon-512x512.png)
   - 70x70 (ms-icon-70x70.png)
   - 150x150 (ms-icon-150x150.png)
   - 310x310 (ms-icon-310x310.png)
   - 180x180 (apple-icon-180x180.png)

3. Generate a favicon.ico file that includes the following sizes:
   - 16x16
   - 32x32
   - 48x48

## Using the Automated Script

We've provided a script to automate this process:

\`\`\`bash
npm run generate-icons
\`\`\`

This script will:
1. Take the base SVG icon from `/public/icons/icon-base.svg`
2. Generate all required PNG sizes
3. Create a favicon.ico file
4. Place all files in the correct locations

## Verifying Icons

After generating the icons, you can verify them using:

1. [Favicon Checker](https://realfavicongenerator.net/favicon_checker)
2. [PWA Builder](https://www.pwabuilder.com/)

## Icon Design Guidelines

When designing your icon:

1. Use a simple, recognizable design
2. Ensure it works well at small sizes
3. Use your brand colors
4. Include padding around the edges (about 10% of the width)
5. Test how it looks on different backgrounds
\`\`\`

Let's create a simple script to help with icon generation:
