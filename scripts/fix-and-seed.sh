# Exit on error
set -e

echo "🔍 Checking database state..."

# Check if users table exists
USER_TABLE_EXISTS=$(npx ts-node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  try {
    const result = await prisma.\$queryRaw\`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    \`;
    console.log(result[0].exists);
  } catch (e) {
    console.log(false);
  } finally {
    await prisma.\$disconnect();
  }
}
check();
")

if [ "$USER_TABLE_EXISTS" = "true" ]; then
  echo "✅ Users table exists, running direct migration..."
  ./scripts/run-direct-migration.sh
else
  echo "❌ Users table does not exist, initializing database..."
  ./scripts/init-db.sh
fi

# Seed the database
echo "🌱 Seeding the database..."
npx prisma db seed

echo "✅ Database setup completed successfully!"
