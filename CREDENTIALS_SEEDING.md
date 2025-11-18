# Verifiable Credentials Seeding Guide

This guide explains how to seed test W3C Verifiable Credentials to the Canton ledger for testing the registration flow.

## Overview

The registration page now uses **real W3C Verifiable Credentials** instead of mockup data. To test the registration flow, you need to seed the ledger with test credentials.

## What Changed

### Before (Mockup)
- Hardcoded credentials in `MOCK_CREDENTIALS` array
- No actual ledger interaction during registration
- `handleSubmit` just had a `setTimeout` delay

### After (Real W3C VCs)
- Credentials follow W3C VC 1.1 specification
- `handleSubmit` creates `PresentationReceipt` contracts on the ledger
- `handleSubmit` creates `RegistrationRequest` contract with credential presentations
- Credentials have proper structure: issuer, claims, proofs, expiration dates

## Files Modified

1. **`fe/src/pages/Register.tsx`**
   - Updated `Credential` interface to `CredentialDisplay` with W3C VC fields
   - Replaced `MOCK_CREDENTIALS` with `MOCK_W3C_CREDENTIALS` (realistic structure)
   - Updated `handleSubmit` to:
     - Authenticate with Canton API
     - Create `PresentationReceipt` contracts for each selected credential
     - Determine user role based on credentials
     - Create `RegistrationRequest` contract with presentations
   - Updated credential display to show issuer, claims, and expiration

2. **`daml/SeedCredentials.daml`** (NEW)
   - DAML script to seed test credentials to the ledger
   - Creates credentials for two test users: `alice` and `bob`

3. **`scripts/seed-credentials.sh`** (NEW)
   - Shell script to run the DAML seeding script
   - Checks if Canton is running before seeding

## Test Credentials

### For User: `alice` (Realtor Agent)

1. **Government ID** (Required)
   - Type: `GovernmentIDCredential`
   - Issuer: `CA_DMV`
   - License Number: `D1234567`
   - Expires: 2026-12-15

2. **Real Estate License**
   - Type: `RealEstateLicenseCredential`
   - Issuer: `CA_DRE`
   - License Number: `02056789`
   - Expires: 2025-06-30

3. **Brokerage Affiliation**
   - Type: `BrokerageAffiliationCredential`
   - Issuer: `KELLER_WILLIAMS`
   - Affiliation ID: `KW-CA-12345`
   - No expiration

**Expected Role**: `RealtorAgent` (has RE license + brokerage affiliation)

---

### For User: `bob` (Private Citizen)

1. **Government ID** (Required)
   - Type: `GovernmentIDCredential`
   - Issuer: `CA_DMV`
   - License Number: `D7654321`
   - Expires: 2029-03-20

**Expected Role**: `PrivateCitizen` (only has government ID)

---

## How to Use

### Step 1: Start Canton

First, make sure Canton is running:

```bash
docker compose -f docker-compose.sandbox.yml up
```

Wait for Canton to be fully initialized (check logs for "Canton is ready").

### Step 2: Run the Seeding Script

Run the seeding script to populate the ledger with test credentials:

```bash
./scripts/seed-credentials.sh
```

This script will:
1. Check if Canton is running
2. Build the DAML project (if needed)
3. Run the `SeedCredentials:seedTestCredentials` script
4. Create `VerifiableCredential` contracts for alice and bob

### Step 3: Register a Test User

1. Open the application frontend (usually http://localhost:5173)
2. Go to the Register page
3. Connect a wallet (select "dfns" or "bron")
4. Enter username: **`alice`** or **`bob`**
5. Enter any password
6. Click "Continue"
7. Select credentials to present (all credentials shown are from the seeded data)
8. Click "Submit for Approval"

The registration will now:
- Create `PresentationReceipt` contracts on the ledger
- Create a `RegistrationRequest` contract
- Show success message

### Step 4: Verify on Ledger (Optional)

You can verify the contracts were created using the Canton console or by querying the API:

```bash
# Query PresentationReceipts
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:W3C.VC:PresentationReceipt"]
    }
  }'

# Query RegistrationRequests
curl -X POST http://localhost:8080/v2/state/active-contracts \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "templateIds": ["#unlockit-canton-core-ideathon:RETVN.Role:RegistrationRequest"]
    }
  }'
```

## Next Steps

To fully integrate with real credentials from the ledger, you would:

1. **Query credentials from ledger** in `Register.tsx`:
   ```typescript
   useEffect(() => {
     const fetchCredentials = async () => {
       const token = await cantonApi.getToken(username);
       cantonApi.setAuth(token, username);

       const vcs = await cantonApi.query<VerifiableCredential>(
         VerifiableCredential.templateId,
         { holder: username }
       );

       setCredentials(vcs.map(vc => convertToDisplay(vc)));
     };

     if (username) fetchCredentials();
   }, [username]);
   ```

2. **Exercise PresentCredential choice** instead of creating receipts directly:
   ```typescript
   const receipt = await cantonApi.exercise(
     VerifiableCredential.templateId,
     cred.contractId,
     'PresentCredential',
     {
       verifier: 'operator',
       challenge: `registration-${username}-${Date.now()}`,
       presentationProof: 'proof-of-possession'
     }
   );
   ```

3. **Admin approval flow** in `AdminApprovals.tsx`:
   - Query `RegistrationRequest` contracts
   - Exercise `ApproveRegistration` choice to create `UserAccount`

## Troubleshooting

**Canton not running**: Make sure you started Canton with the sandbox compose file:
```bash
docker compose -f docker-compose.sandbox.yml up
```

**DAML build fails**: Make sure you have DAML SDK installed:
```bash
daml version
```

**Script fails**: Check Canton logs for errors:
```bash
docker compose -f docker-compose.sandbox.yml logs -f
```

**Credentials not showing**: The frontend still uses `MOCK_W3C_CREDENTIALS` hardcoded array. To see real credentials from the ledger, you need to implement the query logic mentioned in "Next Steps" above.
