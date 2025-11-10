#!/bin/bash
set -e

LEDGER_HOST="${LEDGER_HOST:-localhost}"
LEDGER_PORT="${LEDGER_PORT:-6865}"

echo "Waiting for sandbox to be ready..."
max_attempts=30
attempt=0
until curl -sf http://${LEDGER_HOST}:${LEDGER_PORT}/readyz > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "Sandbox failed to start after ${max_attempts} attempts"
    exit 1
  fi
  echo "Waiting for sandbox... (${attempt}/${max_attempts})"
  sleep 2
done

echo "Sandbox is ready!"

JSON_API_HOST="${JSON_API_HOST:-localhost}"
JSON_API_PORT="${JSON_API_PORT:-7575}"

echo "Waiting for JSON API to be ready..."
attempt=0
until curl -sf http://${JSON_API_HOST}:${JSON_API_PORT}/v1/health > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "JSON API failed to start after ${max_attempts} attempts"
    exit 1
  fi
  echo "Waiting for JSON API... (${attempt}/${max_attempts})"
  sleep 2
done

echo "JSON API is ready!"

allocate_party() {
  local party_hint=$1
  echo "Allocating party: ${party_hint}"

  response=$(curl -s -X POST \
    http://${JSON_API_HOST}:${JSON_API_PORT}/v1/parties/allocate \
    -H "Content-Type: application/json" \
    -d "{\"identifierHint\": \"${party_hint}\"}")

  party_id=$(echo "$response" | grep -o '"identifier":"[^"]*"' | cut -d'"' -f4)
  echo "Party allocated: ${party_id}"
  echo "$party_id"
}

create_user() {
  local user_id=$1
  local party_id=$2
  echo "Creating user: ${user_id} with party: ${party_id}"

  curl -s -X POST \
    http://${JSON_API_HOST}:${JSON_API_PORT}/v1/user/create \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"${user_id}\",
      \"primaryParty\": \"${party_id}\",
      \"rights\": [{
        \"type\": \"CanActAs\",
        \"party\": \"${party_id}\"
      }]
    }" > /dev/null

  echo "User created: ${user_id}"
}

echo "Setting up parties and users..."

operator_party=$(allocate_party "Unlockit_Operator")
create_user "operator" "$operator_party"

maria_party=$(allocate_party "Maria_Rodriguez")
create_user "maria" "$maria_party"

john_party=$(allocate_party "John_Doe")
create_user "john" "$john_party"

sarah_party=$(allocate_party "Sarah_Chen")
create_user "sarah" "$sarah_party"

bob_party=$(allocate_party "Bob_Smith")
create_user "broker_bob" "$bob_party"

echo ""
echo "Sandbox initialization completed successfully!"
echo "Operator party: ${operator_party}"
echo "Users created: operator, maria, john, sarah, broker_bob"
