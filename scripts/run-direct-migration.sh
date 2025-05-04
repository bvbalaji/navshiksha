# Exit on error
set -e

echo "🔄 Running direct migration..."
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/direct-migration.ts

echo "✅ Direct migration completed successfully!"
