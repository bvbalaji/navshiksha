# Next.js Font Best Practices

This document outlines best practices for using fonts in Next.js applications, particularly with the `next/font` module introduced in Next.js 13+.

## Table of Contents

- [Introduction](#introduction)
- [Using next/font](#using-nextfont)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Introduction

Next.js provides a built-in font system that automatically optimizes your fonts, including custom fonts and Google Fonts. It provides:

- Zero layout shift: Automatically self-hosted fonts
- Improved performance: Fonts are preloaded and optimized
- Privacy: No requests sent to Google from the browser

## Using next/font

### Google Fonts

\`\`\`typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

### Local Fonts

\`\`\`typescript
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
  variable: '--font-my-font',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

## Common Issues and Solutions

### assetPrefix Error

**Error**: `assetPrefix must start with a leading slash or be an absolute URL(http:// or https://)`

**Solution**:
1. Remove any `assetPrefix` option from your font configuration
2. If you need an `assetPrefix` in your Next.js config, ensure it starts with a `/` or is a full URL

\`\`\`typescript
// Correct
const nextConfig = {
  assetPrefix: '/my-prefix',
}

// Also correct
const nextConfig = {
  assetPrefix: 'https://cdn.example.com',
}

// Incorrect
const nextConfig = {
  assetPrefix: 'my-prefix',
}
\`\`\`

### Font Not Loading

**Issue**: Font is not loading or showing fallback font

**Solutions**:
1. Ensure you're using the `variable` property and applying it to your HTML element
2. Check that the font file exists and is accessible
3. Clear your browser cache and Next.js cache (`.next` folder)

### Layout Shift Issues

**Issue**: Content shifts when font loads

**Solution**:
1. Use `display: 'swap'` option
2. Ensure you're using the Next.js font system correctly
3. Consider using `font-display: optional` for less important text

## Performance Optimization

1. **Subset your fonts**: Only include the character sets you need
   \`\`\`typescript
   const inter = Inter({
     subsets: ['latin'],
     // Only latin characters
   })
   \`\`\`

2. **Preload only what you need**: For variable fonts, specify the weights you'll use
   \`\`\`typescript
   const roboto = Roboto({
     weight: ['400', '700'],
     // Only preloads these weights
   })
   \`\`\`

3. **Use variable fonts**: They combine multiple weights and styles in a single file
   \`\`\`typescript
   const inter = Inter({
     variable: '--font-inter',
     // Inter is a variable font
   })
   \`\`\`

## Troubleshooting

### Fix Script

We've provided a `fix-font-config` script that:
1. Fixes common font configuration issues
2. Ensures proper Next.js configuration
3. Cleans the build cache

Run it with:
\`\`\`bash
npm run fix-font-config
\`\`\`

### Manual Fixes

If the script doesn't resolve your issue:

1. **Check your font configuration**:
   - Remove any `assetPrefix` or `path` options
   - Ensure you're using the correct format for `src` in local fonts

2. **Check your Next.js configuration**:
   - Ensure `assetPrefix` starts with `/` or is a full URL
   - Remove any custom font loaders that might conflict

3. **Clean your build**:
   - Remove the `.next` folder: `rm -rf .next`
   - Clear your browser cache
   - Rebuild: `npm run build`

4. **Check for conflicts**:
   - Ensure you're not using multiple font loading methods
   - Check for CSS that might override your font settings

## References

- [Next.js Font Documentation](https://nextjs.org/docs/basic-features/font-optimization)
- [Google Fonts](https://fonts.google.com/)
- [Web Font Best Practices](https://web.dev/font-best-practices/)
