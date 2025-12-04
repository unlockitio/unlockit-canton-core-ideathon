# RETVN Daml Smart Contracts

Complete documentation for the Daml smart contracts powering the Real Estate Transaction Verification Network (RETVN).

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [W3C Verifiable Credentials](#w3c-verifiable-credentials)
- [RETVN Platform Contracts](#retvn-platform-contracts)
- [Seeding Scripts](#seeding-scripts)
- [Querying Contracts](#querying-contracts)
- [Testing](#testing)

---

## Overview

The RETVN platform uses Daml smart contracts organized into two main modules:

1. **W3C** - W3C Verifiable Credentials standard implementation
2. **RETVN** - Platform contracts for roles, transactions, and market data

### Project Structure

```
daml/
├── W3C/
│   ├── VC.daml              # Verifiable Credentials implementation
│   └── VCTest.daml          # VC test scenarios
├── RETVN/
│   ├── Role.daml            # User roles and RBAC
│   ├── Transaction.daml     # Transaction verification system
│   ├── MarketInsight.daml   # Market data and payments
│   └── RoleTest.daml        # Integration tests
├── SeedCredentials.daml      # Seed test credentials
├── SeedTransactions.daml     # Seed sample transactions
└── README.md                 # This file
```

---

## Quick Start

### Build Contracts

```bash
daml build
```

Output: `.daml/dist/unlockit-canton-core-ideathon-0.0.1.dar`

### Run Tests

```bash
daml test
```

### Deploy

```bash
# Sandbox mode (automatic via Docker)
docker compose -f docker-compose.sandbox.yml up -d
```

The image seeds the sandbox with multiple users and contracts of all sorts

## W3C Verifiable Credentials

Implementation of the [W3C Verifiable Credentials Data Model 1.1](https://www.w3.org/TR/vc-data-model/).

### Core Templates

#### VerifiableCredential

Digital credentials (Government ID, licenses, etc.) issued by trusted parties.

**Key Fields:**
- `credentialId` - Unique URI identifier
- `credentialType` - Array of types (e.g., `["VerifiableCredential", "RealEstateLicenseCredential"]`)
- `issuer` - Party that issued (signatory)
- `holder` - Party that holds (observer)
- `subject` - DID + claims as key-value pairs
- `proof` - Cryptographic proof
- `status` - Active | Suspended | Revoked
- `issuanceDate` - When issued
- `expirationDate` - When expires (optional)

**Key Choices:**
- `PresentCredential` - Present to verifier (non-consuming, creates PresentationReceipt)
- `Suspend` / `Reactivate` - Temporary suspension
- `Revoke` - Permanent revocation (archives contract)
- `TransferCredential` - Transfer to new holder (requires issuer + holder consent)

#### PresentationReceipt

Proof that a credential was presented to a verifier.

**Key Fields:**
- `credentialId` - Which credential
- `holder` - Who presented
- `verifier` - Who received
- `presentedAt` - Timestamp
- `challenge` - Anti-replay nonce
- `presentationProof` - Holder's proof of possession

#### CredentialIssuanceRequest

Request workflow for obtaining credentials from issuers.

**Choices:**
- `ApproveAndIssue` - Creates VerifiableCredential
- `RejectRequest` - Rejects with reason

### Real Estate Credential Types

| Credential Type | Issuer | Holder | Used For |
|----------------|---------|---------|----------|
| GovernmentIDCredential | DMV, State Dept | Citizen | Identity verification |
| RealEstateLicenseCredential | State RE Commission | RE Professional | Professional verification |
| BrokerageAffiliationCredential | RE Brokerage | Agent | Brokerage affiliation |
| NotaryCommissionCredential | Secretary of State | Notary | Notary verification |
| TaxAuthorityCredential | Government Agency | Tax Official | Authority verification |

---

## RETVN Platform Contracts

### Architecture

```
W3C Credentials → UserAccount → Capability Rights → Delegations → Actions
```

### User Roles

| Role | Weight | Required Credentials | Can Verify |
|------|--------|---------------------|------------|
| PrivateCitizen | 5 | Government ID | ❌ |
| RealtorAgent | 8 | Gov ID + RE License + Brokerage | ✅ |
| RealtorBroker | 12 | Gov ID + Broker License + Brokerage Reg | ✅ |
| RealtorMaster | 15 | Gov ID + Principal Broker + Biz Reg | ✅ |
| NotaryPublic | 25 | Gov ID + Notary Commission | ✅ |
| TaxAuthority | 40 | Government Agency Credential | ✅ |

### Role Module (Role.daml)

#### UserAccount

Core identity contract created after credential verification.

**Choices (non-consuming):**
- `RequestSubmissionRight` - Ability to submit transactions
- `RequestVerificationRight` - Ability to verify (if role allows)
- `RequestMarketDataAccess` - Ability to query market data

**Signatories:** operator, user

#### RegistrationRequest

User proposes account creation with credential presentations.

**Choices:**
- `ApproveRegistration` → Creates UserAccount
- `RejectRegistration` → Rejects with reason

#### TransactionSubmissionRight

Capability to submit transaction data.

**Choice:**
- `DelegateSubmission` → Creates single-use delegation for specific transaction

#### TransactionVerificationRight

Capability to verify transactions (role-dependent).

**Choice:**
- `DelegateVerification` → Creates single-use delegation for specific transaction

#### MarketDataAccessRight

Capability to query market data with tiered access:

| Tier | Time Range | Data Access | Price |
|------|-----------|-------------|-------|
| PublicAccess | 30 days | Aggregates only | Free |
| BasicReport | 90 days | Aggregates only | $9.99 |
| ProfessionalReport | 365 days | Individual transactions | $49.99 |
| InstitutionalAccess | Unlimited | Full API access | $499/mo |

### Transaction Module (Transaction.daml)

#### TransactionData

Stores real estate transaction information (RESO standard aligned).

**Property Details:**
- address, postalCode, propertyType
- livingAreaSqft, lotSizeSqft
- bedroomsTotal, bathroomsTotal, yearBuilt

**Transaction Details:**
- salePrice, transactionDate, closingDate
- financingType, daysOnMarket

**Verification System:**
- assignedVerifiers, verifications list
- trustScore (0-100), status

**Signatories:** operator, submitter
**Observers:** assignedVerifiers

**Choice:**
- `SubmitVerification` - Verifier submits decision

#### Verification Decisions

- `Confirmed` - All data accurate
- `ConfirmedWithNotes` - Accurate with context
- `Disputed` - Data incorrect
- `RequestClarification` - Need more info

#### Trust Score Calculation

```
Trust Score = Σ(confirmed weights) - Σ(disputed weights × 2)
Clamped to [0, 100]
```

#### Transaction Status

- **Unverified** - No verifications yet
- **PartiallyVerified** - 1+ confirmations
- **FullyVerified** - 3+ confirmations from 2+ roles
- **DisputedTransaction** - At least one dispute

### MarketInsight Module (MarketInsight.daml)

#### Payment Workflow

1. `MarketInsightOrder` - User orders market data
2. `PaymentPendingOrder` - Payment initiated
3. Either:
   - `ConfirmedPaymentOrder` - Payment successful
   - `FailedPaymentOrder` - Payment failed
4. `PaidMarketInsightOrder` - Ready for fulfillment
5. `MarketInsight` - Data delivered

#### ContributorReward

Rewards for data contributors and verifiers.

**Signatories:** operator
**Observers:** recipient

---

## Seeding Scripts

### SeedCredentials.daml

Creates test W3C Verifiable Credentials.

**Run with:**
```bash
./scripts/seed-credentials.sh
```

**Creates credentials for:**
- `alice` - RealtorAgent (Gov ID + RE License + Brokerage)
- `bob` - PrivateCitizen (Gov ID only)

### SeedTransactions.daml

Creates 100 realistic transaction records.

**Run with:**
```bash
./scripts/seed-transactions.sh
```

**Creates:**
- 100 transactions across 5 property types
- 14 users with realistic roles
- 2-year date spread
- Realistic pricing by property type

---

## Testing

### Run All Tests

```bash
daml test
```

### Run Specific Tests

```bash
# W3C VC tests
daml test --files W3C/VCTest.daml

# RETVN platform tests
daml test --files RETVN/RoleTest.daml
```

### Test Scenarios

**W3C Module:**
- `testRealEstateCredential` - Complete agent license lifecycle
- `testGovernmentIDCredential` - Government ID workflow
- `testCredentialRevocation` - Revocation workflow
- `testMultipleCredentials` - Multi-credential verification

**RETVN Module:**
- `testCompleteRetvnFlow` - End-to-end platform flow
- `testPrivateCitizenCannotVerify` - Access control verification
- `testMarketDataAccess` - Market data queries

---

## Contract Design Patterns

### Privacy Pattern

```daml
template TransactionData
  with
    operator : Party
    submitter : Party
    assignedVerifiers : [Party]
  where
    signatory operator, submitter
    observer assignedVerifiers
```

**Result:** Only operator, submitter, and assigned verifiers can see the contract.

### Capability Pattern

```daml
template TransactionSubmissionRight
  with
    operator : Party
    user : Party
  where
    signatory operator
    observer user

    choice SubmitTransaction : ContractId TransactionSubmissionProposal
      controller user
      do ...
```

**Result:** User must have the right to perform actions.

### Multi-Party Verification

Multiple parties verify with role-based weights, creating a trust score.

---

## Package Information

- **Package Name**: `unlockit-canton-core-ideathon`
- **Version**: `0.0.1`
- **Daml Version**: `3.4.0-rc2`
- **DAR Location**: `.daml/dist/unlockit-canton-core-ideathon-0.0.1.dar`

---

## See Also

- [Canton Documentation](https://docs.daml.com/canton/)
- [Daml Documentation](https://docs.daml.com/)
- [W3C VC Standard](https://www.w3.org/TR/vc-data-model/)
