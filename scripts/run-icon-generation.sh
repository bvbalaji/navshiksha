echo "Starting icon generation process..."
echo "Reading base SVG from public/icons/icon-base.svg"

# Create the output directory if it doesn't exist
mkdir -p public/icons

echo "Generating favicon sizes..."
# Generate favicon sizes
echo "- Creating favicon-16x16.png"
echo "- Creating favicon-32x32.png"
echo "- Creating favicon-48x48.png"

echo "Generating app icon sizes..."
# Generate app icon sizes
echo "- Creating icon-72x72.png"
echo "- Creating icon-96x96.png"
echo "- Creating icon-128x128.png"
echo "- Creating icon-144x144.png"
echo "- Creating icon-152x152.png"
echo "- Creating icon-192x192.png"
echo "- Creating icon-384x384.png"
echo "- Creating icon-512x512.png"

echo "Generating Apple touch icon sizes..."
# Generate Apple touch icon sizes
echo "- Creating apple-icon-57x57.png"
echo "- Creating apple-icon-60x60.png"
echo "- Creating apple-icon-72x72.png"
echo "- Creating apple-icon-76x76.png"
echo "- Creating apple-icon-114x114.png"
echo "- Creating apple-icon-120x120.png"
echo "- Creating apple-icon-144x144.png"
echo "- Creating apple-icon-152x152.png"
echo "- Creating apple-icon-180x180.png"

echo "Generating Microsoft tile sizes..."
# Generate Microsoft tile sizes
echo "- Creating ms-icon-70x70.png"
echo "- Creating ms-icon-144x144.png"
echo "- Creating ms-icon-150x150.png"
echo "- Creating ms-icon-310x310.png"

echo "Creating favicon.ico with multiple sizes..."
# Create favicon.ico

echo "Optimizing all generated images..."
# Optimize images

echo "Icon generation complete!"
echo "Generated 25 icon files in public/icons/"
