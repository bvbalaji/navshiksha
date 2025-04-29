# Exit on error
set -e

echo "🔄 Initializing database..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push the schema to the database (this creates tables without migrations)
echo "Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "✅ Database initialization completed successfully!"
