# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Running favicon conflict resolution script...${NC}"

# Check if ts-node is installed
if ! command -v ts-node &> /dev/null; then
    echo -e "${YELLOW}ts-node is not installed. Installing it now...${NC}"
    npm install -g ts-node typescript
fi

# Run the TypeScript script
ts-node scripts/fix-favicon-conflict.ts

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Favicon conflict resolution completed successfully!${NC}"
else
    echo -e "${RED}Error running favicon conflict resolution script.${NC}"
    exit 1
fi

# Remind about next steps
echo -e "${BLUE}Remember to restart your development server to apply changes.${NC}"
