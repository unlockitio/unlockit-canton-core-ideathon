#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[Configure Application Props]${NC} Fetching Canton configuration..."

# Wait for Canton to be ready
CANTON_URL="${CANTON_JSON_API_URL:-http://localhost:8080}"
echo -e "${YELLOW}[INFO]${NC} Waiting for Canton to be ready at $CANTON_URL..."

TIMEOUT=60
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
  if curl -s -f "$CANTON_URL/livez" > /dev/null 2>&1; then
    echo -e "${GREEN}[SUCCESS]${NC} Canton is ready!"
    break
  fi
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo -e "${RED}[ERROR]${NC} Timeout: Canton is not running at $CANTON_URL after ${TIMEOUT}s"
    exit 1
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Wait for operator party to be seeded (polling until found)
echo -e "${YELLOW}[INFO]${NC} Waiting for operator party to be seeded..."
OPERATOR_PARTY=""
ELAPSED=0
while [ -z "$OPERATOR_PARTY" ] && [ $ELAPSED -lt $TIMEOUT ]; do
  OPERATOR_PARTY=$(curl -s "$CANTON_URL/v2/parties" 2>/dev/null | python3 -c "import sys, json; parties = json.load(sys.stdin).get('partyDetails', []); operator = [p for p in parties if 'operator' in p.get('party', '').lower()]; print(operator[0]['party'] if operator else '')" 2>/dev/null || echo "")

  if [ -n "$OPERATOR_PARTY" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Found operator party: ${OPERATOR_PARTY}"
    break
  fi

  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo -e "${RED}[ERROR]${NC} Timeout: Operator party not found after ${TIMEOUT}s"
    exit 1
  fi

  echo -e "${YELLOW}[INFO]${NC} Waiting for seeding to complete... (${ELAPSED}s elapsed)"
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Fetch the package ID
echo -e "${YELLOW}[INFO]${NC} Fetching package ID from /v2/packages..."
PACKAGE_ID=""
ELAPSED=0
while [ -z "$PACKAGE_ID" ] && [ $ELAPSED -lt $TIMEOUT ]; do
  PACKAGE_ID=$(curl -s "$CANTON_URL/v2/packages" 2>/dev/null | python3 -c "import sys, json; packages = json.load(sys.stdin).get('packageIds', []); print(packages[0] if packages else '')" 2>/dev/null || echo "")

  if [ -n "$PACKAGE_ID" ]; then
    echo -e "${GREEN}[SUCCESS]${NC} Found package ID: ${PACKAGE_ID}"
    break
  fi

  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo -e "${RED}[ERROR]${NC} Timeout: Package ID not found after ${TIMEOUT}s"
    exit 1
  fi

  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# Update the backend configuration
CONFIG_FILE="src/main/resources/application.properties"
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}[ERROR]${NC} Config file not found: $CONFIG_FILE"
  exit 1
fi

echo -e "${YELLOW}[INFO]${NC} Updating $CONFIG_FILE..."

# Update both properties
sed -i.bak "s|^canton.api.package-id=.*|canton.api.package-id=${PACKAGE_ID}|" "$CONFIG_FILE"
sed -i.bak "s|^canton.api.operator-party-id=.*|canton.api.operator-party-id=${OPERATOR_PARTY}|" "$CONFIG_FILE"

# Remove backup file
rm -f "${CONFIG_FILE}.bak"

echo -e "${GREEN}[SUCCESS]${NC} Updated configuration:"
echo -e "  ${YELLOW}Package ID:${NC} ${PACKAGE_ID}"
echo -e "  ${YELLOW}Operator Party ID:${NC} ${OPERATOR_PARTY}"
echo -e "${YELLOW}[INFO]${NC} Configuration complete!"
