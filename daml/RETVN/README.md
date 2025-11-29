# RETVN Role-Based Access Control System

This directory contains the Daml smart contracts for the Real Estate Transaction Verification Network (RETVN) role-based access control and transaction management system.

## Architecture Overview

The RETVN system implements a credential-based capability model where:

1. **Users obtain verifiable credentials** from trusted issuers (W3C.VC module)
2. **Users present credentials** to the RETVN platform operator
3. **Operator creates UserAccount** based on credential verification
4. **Users request specific capabilities** from their account
5. **Users delegate capabilities** to specific transactions

```
W3C Credentials → UserAccount → Capability Rights → Delegations → Actions
```

## Module Structure

### Role.daml

Defines the role-based access control system with six user roles:

| Role | Verification Weight | Required Credentials | Can Verify |
|------|-------------------|---------------------|------------|
| PrivateCitizen | 5 | Government ID | ❌ |
| RealtorAgent | 8 | Government ID + RE License + Brokerage Affiliation | ✅ |
| RealtorBroker | 12 | Government ID + Broker License + Brokerage Registration | ✅ |
| RealtorMaster | 15 | Government ID + Principal Broker + Business Registration | ✅ |
| NotaryPublic | 25 | Government ID + Notary Commission | ✅ |
| TaxAuthority | 40 | Government Agency Credential | ✅ |

#### Templates

**UserAccount**
- Core identity contract for platform users
- Created after operator verifies credential presentations
- Signatories: operator, user
- Non-consuming choices to request capabilities:
  - `RequestSubmissionRight` - Ability to submit transactions
  - `RequestVerificationRight` - Ability to verify transactions (if role allows)
  - `RequestMarketDataAccess` - Ability to query market data

**RegistrationRequest**
- User proposes account creation with credential presentations
- Operator exercises `ApproveRegistration` to create UserAccount
- Operator exercises `RejectRegistration` if credentials invalid

**TransactionSubmissionRight**
- Capability to submit transaction data
- Can be delegated to specific transaction via `DelegateSubmission`
- Creates TransactionSubmissionDelegation

**TransactionVerificationRight**
- Capability to verify transactions
- Only available to roles where `canVerifyTransactions` returns True
- Can be delegated to specific transaction via `DelegateVerification`
- Creates TransactionVerificationDelegation

**MarketDataAccessRight**
- Capability to query market data
- Four access tiers:
  - **PublicAccess**: 30 days, aggregates only
  - **BasicReport**: 90 days, aggregates only ($9.99)
  - **ProfessionalReport**: 365 days, individual transactions ($49.99)
  - **InstitutionalAccess**: Unlimited, API access ($499/mo, broker+ only)

### Transaction.daml

Defines transaction data submission and verification system.

#### Templates

**TransactionData**
- Stores real estate transaction information (RESO standard aligned)
- Property details: address, type, sqft, bedrooms, bathrooms, year built
- Transaction details: price, date, financing, days on market
- Verification system: assigned verifiers, verifications list, trust score
- Signatories: operator, submitter
- Observers: assignedVerifiers

**TransactionSubmissionProposal**
- User proposes transaction submission
- Requires TransactionSubmissionDelegation
- Operator exercises `AcceptSubmission` to create TransactionData
- Initial trust score comes from submitter's verification weight

**Verification System**
- Verifiers submit verification via `SubmitVerification` choice
- Requires TransactionVerificationDelegation (single use)
- Four verification decisions:
  - `Confirmed` - All data accurate
  - `ConfirmedWithNotes` - Accurate with context
  - `Disputed` - Data is incorrect
  - `RequestClarification` - Need more info

**Trust Score Calculation**
```
Trust Score = Σ(confirmed weights) - Σ(disputed weights × 2)
Clamped to [0, 100]
```

**Transaction Status**
- `Unverified` - No verifications yet
- `PartiallyVerified` - Some verifications, no disputes
- `FullyVerified` - 3+ confirmations from 2+ different roles
- `DisputedTransaction` - At least one dispute

**MarketDataAggregate**
- Operator-created aggregate statistics for postal code
- Median/average prices, price per sqft, days on market
- Property type distribution
- Average trust score
- Public, non-consuming query

## Complete User Flow Example

### 1. Maria (Realtor Agent) Registration

```daml
-- Maria obtains credentials from trusted issuers
govIdCred <- DMV issues GovernmentIDCredential
licenseCred <- CA_DRE issues RealEstateLicenseCredential
brokerageCred <- KellerWilliams issues BrokerageAffiliationCredential

-- Maria presents credentials to RETVN
govIdReceipt <- Maria presents govIdCred to operator
licenseReceipt <- Maria presents licenseCred to operator
brokerageReceipt <- Maria presents brokerageCred to operator

-- Maria requests account
regRequest <- Maria creates RegistrationRequest with
  credentialPresentations = [govIdReceipt, licenseReceipt, brokerageReceipt]

-- Operator approves
mariaAccount <- Operator approves registration
  role = RealtorAgent
  verificationWeight = 8
```

### 2. Maria Submits Transaction

```daml
-- Maria requests submission capability
submissionRight <- Maria requests TransactionSubmissionRight

-- Maria delegates to specific transaction
delegation <- Maria delegates to "TXN-2024-001"

-- Maria creates proposal
proposal <- Maria creates TransactionSubmissionProposal with
  transactionId = "TXN-2024-001"
  propertyAddress = "123 Main St"
  salePrice = 850000.0
  proposedVerifiers = [john, sarah]

-- Operator accepts
transaction <- Operator accepts submission
  trustScore = 8  -- Initial score from Maria's weight
  status = Unverified
```

### 3. John (Another Agent) Verifies

```daml
-- John requests verification capability
verificationRight <- John requests TransactionVerificationRight

-- John delegates to specific transaction
verificationDelegation <- John delegates to "TXN-2024-001"

-- Operator submits John's verification
transaction <- Operator submits verification with
  verificationDelegation = verificationDelegation
  decision = Confirmed
  notes = Some "I represented the buyer"

-- Trust score updated
-- trustScore = 8 (Maria) + 8 (John) = 16
-- status = PartiallyVerified (1 confirmation)
```

### 4. Notary Verifies

```daml
-- Notary verifies (weight = 25)
transaction <- Operator submits notary verification with
  decision = Confirmed

-- Trust score updated
-- trustScore = 8 + 8 + 25 = 41
-- status = FullyVerified (3+ confirmations from 2+ roles)
```

## Key Design Principles

### 1. Operator as Central Authority
- All capability templates have `operator : Party` as signatory
- Ensures Unlockit controls capability grants
- Prevents users from self-granting capabilities

### 2. Non-Consuming Capabilities
- UserAccount choices are non-consuming
- Users can request multiple capabilities from same account
- Account remains active for future capability requests

### 3. Single-Use Delegations
- Delegations are consumed when used
- Prevents replay of submission/verification rights
- Each transaction action requires fresh delegation

### 4. Role-Based Verification Weights
- Higher authority roles have higher weights
- Tax Authority (40) > Notary (25) > Brokers (12-15) > Agents (8) > Citizens (5)
- Disputed verifications penalized at 2x weight

### 5. Privacy-Preserving Design
- Transaction observers limited to assignedVerifiers
- Credential presentations only visible to holder and operator
- Market data aggregates hide individual transaction details

## Access Control Matrix

| Action | Private Citizen | Realtor Agent | Realtor Broker | Notary | Tax Authority |
|--------|----------------|---------------|----------------|--------|---------------|
| Submit Transaction | ✅ | ✅ | ✅ | ✅ | ✅ |
| Verify Transaction | ❌ | ✅ | ✅ | ✅ | ✅ |
| Public Data Access | ✅ | ✅ | ✅ | ✅ | ✅ |
| Basic Report | ✅ | ✅ | ✅ | ✅ | ✅ |
| Professional Report | ✅ | ✅ | ✅ | ✅ | ✅ |
| Institutional Access | ❌ | ❌ | ✅ | ❌ | ✅ |

## Testing

Three comprehensive test scenarios demonstrate the complete system:

### testCompleteRetvnFlow
Complete end-to-end flow:
1. Maria (Agent) obtains 3 credentials
2. Maria presents credentials and registers
3. John (Agent) registers with 2 credentials
4. Sarah (Citizen) registers with 1 credential
5. Maria submits transaction
6. John verifies transaction
7. Sarah cannot verify (PrivateCitizen)

**Result**: 18 active contracts, 40 transactions

### testPrivateCitizenCannotVerify
Verifies that citizens cannot request verification rights.

**Result**: 3 active contracts, 7 transactions

### testMarketDataAccess
Demonstrates market data access by broker with institutional tier.

**Result**: 7 active contracts, 12 transactions

## Running Tests

```bash
cd /Users/marado/Documents/Unlockit/Code/canton-core-ideathon/unlockit-canton-core-ideathon
daml test --files daml/RETVN/RoleTest.daml
```

All tests should pass:
```
testPrivateCitizenCannotVerify: ok, 3 active contracts, 7 transactions.
testMarketDataAccess: ok, 7 active contracts, 12 transactions.
testCompleteRetvnFlow: ok, 18 active contracts, 40 transactions.
```

## Integration with W3C Verifiable Credentials

The RETVN system builds on the W3C.VC module:

1. **Credential Issuance**: Trusted issuers create VerifiableCredential contracts
2. **Credential Presentation**: Users exercise `PresentCredential` (non-consuming)
3. **Presentation Receipt**: Creates PresentationReceipt with challenge-response
4. **Account Creation**: Operator uses receipts to create UserAccount
5. **Capability Grant**: Account enables requesting specific rights

See `daml/W3C/README.md` for credential system details.

## Future Enhancements

1. **Credential Expiry Handling**: Auto-suspend accounts when credentials expire
2. **Batch Operations**: Submit multiple verifications in one transaction
3. **Dispute Resolution**: Formal process for resolving disputed transactions
4. **Analytics**: Advanced market data queries with filters
5. **Revenue Distribution**: Smart contract for payment splitting (70/20/10)
6. **Reputation Scoring**: Track verifier accuracy over time
