# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up simplified authentication system...${NC}"

# Run the TypeScript setup script
npx ts-node scripts/setup-simple-auth.ts

echo -e "${YELLOW}Don't forget to restart your development server!${NC}"
