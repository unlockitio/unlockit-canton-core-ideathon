#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default to 200 transactions
TRANSACTION_COUNT=200

echo -e "${YELLOW}[Transaction Seeding]${NC} Starting transaction seeding process..."
echo -e "${YELLOW}[INFO]${NC} Will create ${GREEN}${TRANSACTION_COUNT}${NC} transactions"

# Check if Canton is running
CANTON_URL="http://localhost:8080"
echo -e "${YELLOW}[Transaction Seeding]${NC} Checking if Canton is running at $CANTON_URL..."

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
echo -e "${YELLOW}[Transaction Seeding]${NC} Running transaction seeding script..."
echo -e ""

# Run the seeding script
# Note: Port 6865 is the gRPC Ledger API port (not 8080 which is the HTTP/JSON API via Nginx)
daml script \
  --dar .daml/dist/unlockit-canton-core-ideathon-0.0.1.dar \
  --script-name SeedTransactions:seedTransactions \
  --ledger-host localhost \
  --ledger-port 6865

echo -e "${GREEN}[SUCCESS]${NC} Transactions seeded successfully!"
echo -e ""
echo -e "${YELLOW}[INFO]${NC} Transaction details:"
echo -e "  - ${GREEN}${TRANSACTION_COUNT} transactions${NC} created"
echo -e "  - Property types: SingleFamily, Condo, Townhouse, MultiFamily, Land"
echo -e "  - Locations: 100 California ZIP codes (SF, LA, SD, SJ, Oakland/Berkeley)"
echo -e "  - Sale prices: Range from \$200K to \$2M (property-type specific)"
echo -e "  - Transaction dates: Spread over the past year"
echo -e "  - Financing types: Conventional, FHA, VA, Cash, USDA"
echo -e ""
