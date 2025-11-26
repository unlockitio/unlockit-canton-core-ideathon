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

# Extract package ID from DAR file
echo -e "${YELLOW}[INFO]${NC} Extracting package ID from DAR file..."
DAR_FILE="/.daml/dist/unlockit-canton-core-ideathon-0.0.1.dar"

if [ ! -f "$DAR_FILE" ]; then
  echo -e "${RED}[ERROR]${NC} DAR file not found: $DAR_FILE"
  exit 1
fi

PACKAGE_ID=$(daml damlc inspect-dar "$DAR_FILE" | tail -1 | grep -oE '[a-f0-9]{64}' | head -1)

if [ -z "$PACKAGE_ID" ]; then
  echo -e "${RED}[ERROR]${NC} Failed to extract package ID from DAR file"
  exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Extracted package ID from DAR: ${PACKAGE_ID}"

# Update the backend configuration
CONFIG_FILE="src/main/resources/application.properties"
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}[ERROR]${NC} Config file not found: $CONFIG_FILE"
  exit 1
fi

echo -e "${YELLOW}[INFO]${NC} Updating $CONFIG_FILE..."

# Get environment variables with defaults
GRPC_HOST="${CANTON_GRPC_HOST:-localhost}"
GRPC_PORT="${CANTON_GRPC_PORT:-6865}"

# Update all Canton properties
sed -i.bak "s|^canton.api.url=.*|canton.api.url=${CANTON_URL}|" "$CONFIG_FILE"
sed -i.bak "s|^quarkus.rest-client.canton-api.url=.*|quarkus.rest-client.canton-api.url=${CANTON_URL}|" "$CONFIG_FILE"
sed -i.bak "s|^canton.grpc.host=.*|canton.grpc.host=${GRPC_HOST}|" "$CONFIG_FILE"
sed -i.bak "s|^canton.grpc.port=.*|canton.grpc.port=${GRPC_PORT}|" "$CONFIG_FILE"
sed -i.bak "s|^canton.api.package-id=.*|canton.api.package-id=${PACKAGE_ID}|" "$CONFIG_FILE"
sed -i.bak "s|^canton.api.operator-party-id=.*|canton.api.operator-party-id=${OPERATOR_PARTY}|" "$CONFIG_FILE"

# Remove backup file
rm -f "${CONFIG_FILE}.bak"

echo -e "${GREEN}[SUCCESS]${NC} Updated configuration:"
echo -e "  ${YELLOW}Canton API URL:${NC} ${CANTON_URL}"
echo -e "  ${YELLOW}Canton gRPC Host:${NC} ${GRPC_HOST}"
echo -e "  ${YELLOW}Canton gRPC Port:${NC} ${GRPC_PORT}"
echo -e "  ${YELLOW}Package ID:${NC} ${PACKAGE_ID}"
echo -e "  ${YELLOW}Operator Party ID:${NC} ${OPERATOR_PARTY}"
echo -e "${YELLOW}[INFO]${NC} Configuration complete!"
