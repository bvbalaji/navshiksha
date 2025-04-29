# Exit on error
set -e

echo "🔄 Running Prisma migrations..."
npx prisma migrate dev --name teacher_dashboard

echo "🌱 Seeding the database..."
npx prisma db seed

echo "✅ Migration and seeding completed successfully!"
