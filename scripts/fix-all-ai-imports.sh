#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting comprehensive AI imports fix...${NC}"

# Check if OpenAI package is installed
if ! npm list openai | grep -q "openai"; then
  echo -e "${YELLOW}Installing OpenAI package...${NC}"
  npm install openai
fi

# Check if glob package is installed (needed for the script)
if ! npm list glob | grep -q "glob"; then
  echo -e "${YELLOW}Installing glob package for the script...${NC}"
  npm install -D glob @types/glob
fi

# Run the TypeScript script
echo -e "${YELLOW}Running fix script...${NC}"
npx ts-node scripts/fix-all-ai-imports.ts

# Check if the script succeeded
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Successfully fixed AI imports!${NC}"
  
  # Remind about environment variable
  echo -e "${YELLOW}IMPORTANT: Make sure you have set the OPENAI_API_KEY environment variable.${NC}"
  
  # Build the project to verify changes
  echo -e "${YELLOW}Building project to verify changes...${NC}"
  npm run build
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful! All AI import issues have been fixed.${NC}"
  else
    echo -e "${RED}Build failed. Some issues might still need manual fixing.${NC}"
  fi
else
  echo -e "${RED}Failed to fix AI imports. Please check the error messages above.${NC}"
fi
