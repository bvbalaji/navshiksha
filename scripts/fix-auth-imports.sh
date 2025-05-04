# Run the TypeScript script to fix auth imports
echo "Fixing auth-related imports..."
npx ts-node scripts/fix-auth-imports.ts

# Rebuild the project
echo "Rebuilding the project..."
npm run build

echo "Auth imports fixed successfully!"
