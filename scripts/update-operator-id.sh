#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[Update Operator ID]${NC} Fetching current operator party from Canton..."

# Wait for Canton to be ready
CANTON_URL="http://localhost:8080"
for i in {1..30}; do
  if curl -s -f "$CANTON_URL/livez" > /dev/null 2>&1; then
    break
  fi
  if [ $i -eq 30 ]; then
    echo -e "${RED}[ERROR]${NC} Canton is not running at $CANTON_URL"
    exit 1
  fi
  sleep 1
done

# Fetch the operator party ID
OPERATOR_PARTY=$(curl -s http://localhost:8080/v2/parties | python3 -c "import sys, json; parties = json.load(sys.stdin)['partyDetails']; operator = [p for p in parties if 'operator' in p['party'].lower()]; print(operator[0]['party'] if operator else '')")

if [ -z "$OPERATOR_PARTY" ]; then
  echo -e "${RED}[ERROR]${NC} Could not find operator party"
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Found operator party: ${OPERATOR_PARTY}"

# Update the backend configuration
CONFIG_FILE="be/src/main/resources/application.properties"
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}[ERROR]${NC} Config file not found: $CONFIG_FILE"
  exit 1
fi

# Update the operator party ID in the config file
sed -i "s|^canton.api.operator-party-id=.*|canton.api.operator-party-id=${OPERATOR_PARTY}|" "$CONFIG_FILE"

echo -e "${GREEN}[SUCCESS]${NC} Updated $CONFIG_FILE with new operator party ID"
echo -e "${YELLOW}[INFO]${NC} Please restart the backend for changes to take effect"
