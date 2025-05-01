# Exit on error
set -e

# First, initialize the database
echo "🔄 Initializing database..."
./scripts/init-db.sh

# Then seed the database
echo "🌱 Seeding the database..."
npx prisma db seed

echo "✅ Migration and seeding completed successfully!"
