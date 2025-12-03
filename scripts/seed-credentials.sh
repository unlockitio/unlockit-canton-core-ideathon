#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[Credential Seeding]${NC} Starting credential seeding process..."

# Check if Canton is running
CANTON_URL="http://localhost:8080"
echo -e "${YELLOW}[Credential Seeding]${NC} Checking if Canton is running at $CANTON_URL..."

if ! curl -s -f "$CANTON_URL/livez" > /dev/null 2>&1; then
  echo -e "${RED}[ERROR]${NC} Canton is not running at $CANTON_URL"
  echo -e "${YELLOW}[INFO]${NC} Please start Canton with: docker compose -f docker-compose.sandbox.yml up"
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Canton is running!"

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Check if DAR file exists (built by docker compose)
DAR_FILE=".daml/dist/unlockit-canton-core-ideathon-0.0.1.dar"
if [ ! -f "$DAR_FILE" ]; then
  echo -e "${RED}[ERROR]${NC} DAR file not found at $DAR_FILE"
  echo -e "${YELLOW}[INFO]${NC} Make sure docker compose is running and has built the project"
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Found DAR file!"
echo -e "${YELLOW}[Credential Seeding]${NC} Running credential seeding script..."

# Run the seeding script
# Note: Port 6865 is the gRPC Ledger API port (not 8080 which is the HTTP/JSON API via Nginx)
daml script \
  --dar .daml/dist/unlockit-canton-core-ideathon-0.0.1.dar \
  --script-name SeedCredentials:seedTestCredentials \
  --ledger-host localhost \
  --ledger-port 6865

echo -e "${GREEN}[SUCCESS]${NC} Credentials seeded successfully!"
echo -e ""
echo -e "${YELLOW}[INFO]${NC} Credential setup completed:"
echo -e ""
echo -e "${YELLOW}[Parties with VCs ONLY - No Users, No UserAccount]${NC}"
echo -e "  - ${GREEN}alice${NC}: Government ID, Real Estate License, Brokerage Affiliation"
echo -e "  - ${GREEN}bob${NC}: Government ID"
echo -e "  ${YELLOW}Note: Alice and Bob are parties (own VCs) but not users (won't show in /v2/users/)${NC}"
echo -e ""
echo -e "${YELLOW}[UserAccounts WITH Credentials]${NC}"
echo -e "  - ${GREEN}Agents (agent1-5)${NC}: Government ID, Real Estate License, Brokerage Affiliation"
echo -e "  - ${GREEN}Brokers (broker1-3)${NC}: Government ID, Real Estate License, Brokerage Affiliation"
echo -e "  - ${GREEN}Masters (master1-2)${NC}: Government ID, Real Estate License"
echo -e "  - ${GREEN}Notaries (notary1-3)${NC}: Government ID"
echo -e "  - ${GREEN}Tax Authority (taxAuth)${NC}: Government ID"
echo -e ""
echo -e "${YELLOW}[NEXT STEPS]${NC}"
echo -e "  1. Open the frontend at http://localhost:5173"
echo -e "  2. Go to Register page"
echo -e "  3. Connect wallet (dfns or bron)"
echo -e "  4. Enter username (e.g., ${GREEN}agent1${NC}, ${GREEN}broker1${NC}, ${GREEN}master1${NC}, etc.)"
echo -e "  5. ${YELLOW}Note:${NC} Don't use ${GREEN}alice${NC} or ${GREEN}bob${NC} for registration (they're parties, not users)"
echo -e ""
