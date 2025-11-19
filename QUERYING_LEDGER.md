# How to Query the Canton Ledger

This guide shows you how to check contracts on the Canton ledger.

## Quick Script (Recommended)

Run the automated query script to see all contracts:

```bash
./scripts/query-ledger.sh
```

This will show:
1. All parties on the ledger
2. VerifiableCredential contracts
3. PresentationReceipt contracts
4. RegistrationRequest contracts
5. UserAccount contracts

---

## Manual Queries (Using curl)

### 1. Get All Parties

```bash
curl -X GET http://localhost:8080/v2/parties | python3 -m json.tool
```

**What it shows**: All party identifiers on the ledger (alice, bob, CA_DMV, CA_DRE, etc.)

---

### 2. Query VerifiableCredential Contracts

```bash
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:W3C.VC:VerifiableCredential"]
    },
    "activeAtOffset": "0",
    "verbose": true
  }' | python3 -m json.tool
```

**What it shows**: All W3C Verifiable Credentials (Gov IDs, RE Licenses, etc.)

**Response fields**:
- `credentialId`: Unique credential identifier (URN)
- `credentialType`: Type array (e.g., ["VerifiableCredential", "GovernmentIDCredential"])
- `issuer`: Who issued it (CA_DMV, CA_DRE, etc.)
- `holder`: Who holds it (alice, bob, etc.)
- `subject.claims`: Key-value pairs with credential data
- `expirationDate`: When it expires
- `status`: Active | Suspended | Revoked

---

### 3. Query PresentationReceipt Contracts

```bash
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:W3C.VC:PresentationReceipt"]
    },
    "activeAtOffset": "0",
    "verbose": true
  }' | python3 -m json.tool
```

**What it shows**: Receipts proving credentials were presented to a verifier

**When created**: When a user submits credentials during registration

**Response fields**:
- `credentialId`: Which credential was presented
- `holder`: Who presented it
- `verifier`: Who it was presented to (usually "operator")
- `presentedAt`: Timestamp
- `challenge`: Anti-replay challenge string

---

### 4. Query RegistrationRequest Contracts

```bash
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:RETVN.Role:RegistrationRequest"]
    },
    "activeAtOffset": "0",
    "verbose": true
  }' | python3 -m json.tool
```

**What it shows**: User registration requests pending approval

**When created**: When a user completes registration and clicks "Submit for Approval"

**Response fields**:
- `user`: Party requesting registration
- `operator`: Admin party who can approve
- `requestedRole`: Role requested (PrivateCitizen, RealtorAgent, etc.)
- `credentialPresentations`: Array of PresentationReceipt contract IDs
- `requestedAt`: Timestamp

---

### 5. Query UserAccount Contracts

```bash
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:RETVN.Role:UserAccount"]
    },
    "activeAtOffset": "0",
    "verbose": true
  }' | python3 -m json.tool
```

**What it shows**: Approved user accounts

**When created**: When an admin approves a RegistrationRequest

**Response fields**:
- `operator`: Admin party
- `user`: The user party
- `role`: Assigned role
- `credentialPresentations`: Linked credential receipts
- `verificationWeight`: Role-based verification power

---

## Query for a Specific Party

To see only contracts where a specific party is involved:

```bash
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:W3C.VC:VerifiableCredential"],
      "filtersByParty": {
        "alice::PARTY_ID_SUFFIX": {}
      }
    },
    "activeAtOffset": "0",
    "verbose": true
  }' | python3 -m json.tool
```

**Note**: Replace `PARTY_ID_SUFFIX` with the actual party ID from step 1.

---

## Understanding the Response

Each query returns a JSON array of contracts. Each contract has:

```json
{
  "offset": "...",
  "templateId": "#package:Module.Template:TemplateName",
  "contractId": "...",
  "payload": {
    // Contract fields here
  },
  "signatories": ["party1", "party2"],
  "observers": ["party3"],
  "agreementText": "",
  "createdEventBlob": "..."
}
```

**Key fields**:
- `contractId`: Unique identifier for this contract instance
- `payload`: The actual contract data
- `signatories`: Parties who signed (authorizers)
- `observers`: Parties who can see it

---

## Filtering Tips

### By Template Type
```json
{
  "filter": {
    "templateIds": ["#package:Module:Template"]
  }
}
```

### By Party
```json
{
  "filter": {
    "templateIds": ["..."],
    "filtersByParty": {
      "partyId": {}
    }
  }
}
```

### Verbose Mode
Set `"verbose": true` to get full contract details including blobs.

---

## Using jq Instead of python

If you have `jq` installed, you can use it for prettier output:

```bash
curl ... | jq '.'
```

Or to get just the count:

```bash
curl ... | jq 'length'
```

Or to extract specific fields:

```bash
curl ... | jq '.[].payload.credentialId'
```

---

## Troubleshooting

**Error: "filtersByParty and filtersForAnyParty cannot be empty simultaneously"**
- Solution: Add `"filtersByParty": {"partyId": {}}`

**Error: "Missing required field at 'activeAtOffset'"**
- Solution: Add `"activeAtOffset": "0"`

**Empty response `[]`**
- The query is correct, but no contracts of that type exist yet
- Run the seed script: `./scripts/seed-credentials.sh`
- Or complete a registration flow to create contracts

**Connection refused**
- Make sure Canton is running: `docker compose -f docker-compose.sandbox.yml up`

---

## API Endpoints Reference

- **Get parties**: `GET /v2/parties`
- **Query contracts**: `POST /v2/state/active-contracts`
- **Submit commands**: `POST /v2/commands/submit-and-wait`
- **Get users**: `GET /v2/users`
- **Create user**: `POST /v2/users`

Full API docs: https://docs.daml.com/json-api/index.html
