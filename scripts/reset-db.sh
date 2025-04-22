# Database Reset Script for Navshiksha
# This script will completely reset your database to a clean state

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}       Navshiksha Database Reset         ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "${RED}WARNING: This will DELETE ALL DATA in your database!${NC}"
echo -e "${RED}This action cannot be undone!${NC}"
echo ""

# Ask for confirmation
read -p "Are you sure you want to reset the database? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
  echo -e "${YELLOW}Database reset cancelled.${NC}"
  exit 0
fi

echo -e "\n${YELLOW}Resetting database...${NC}"

# Option 1: Use Prisma migrate reset (preferred if you have migrations)
echo -e "\n${BLUE}Attempting database reset with prisma migrate reset...${NC}"
npx prisma migrate reset --force

# Check if the previous command was successful
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}Database reset successful!${NC}"
else
  # Option 2: Fallback to db push if migrate reset fails
  echo -e "\n${YELLOW}Migrate reset failed. Trying with db push...${NC}"
  npx prisma db push --force-reset
  
  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}Database reset with db push successful!${NC}"
  else
    echo -e "\n${RED}Failed to reset database. Please check your database connection.${NC}"
    exit 1
  fi
fi

# Generate Prisma client
echo -e "\n${BLUE}Generating Prisma client...${NC}"
npx prisma generate

# Ask if user wants to seed the database
echo ""
read -p "Do you want to seed the database with initial data? (y/N): " seed
if [[ $seed == [yY] ]]; then
  echo -e "\n${BLUE}Seeding database...${NC}"
  npx prisma db seed
  
  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}Database seeded successfully!${NC}"
  else
    echo -e "\n${RED}Failed to seed database.${NC}"
  fi
fi

echo -e "\n${GREEN}All done! Your database has been reset.${NC}"
