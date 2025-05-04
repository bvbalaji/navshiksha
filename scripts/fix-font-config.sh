# Set error handling
set -e

# Print banner
echo "========================================"
echo "Next.js Font Configuration Fix Script"
echo "========================================"

# Run the TypeScript script
echo "Running font configuration fix script..."
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/fix-font-config.ts

# Clean the Next.js cache
echo "Cleaning Next.js cache..."
rm -rf .next

echo "Font configuration fix completed!"
echo "You can now run 'npm run build' to verify the fix."
