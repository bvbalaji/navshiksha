# Exit on error
set -e

echo "🔄 Running direct migration..."
npx ts-node  prisma/direct-migration.ts

echo "✅ Direct migration completed successfully!"
