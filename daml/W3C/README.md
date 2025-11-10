# W3C Verifiable Credentials in Daml

This module implements the [W3C Verifiable Credentials Data Model 1.1](https://www.w3.org/TR/vc-data-model/) in Daml for the Canton ledger.

## Overview

Verifiable Credentials (VCs) are a standard way to express credentials on the web in a secure, privacy-respecting manner. This implementation allows issuers to create digital credentials that holders can present to verifiers, with cryptographic proof of authenticity.

## Module Structure

```
W3C/
├── VC.daml           # Core credential templates and data types
├── VCTest.daml       # Test scenarios and examples
└── README.md         # This file
```

## Core Templates

### 1. `VerifiableCredential`

The main template representing a W3C Verifiable Credential.

**Key Fields:**
- `credentialId`: Unique identifier (URI)
- `credentialType`: Array of credential types (e.g., `["VerifiableCredential", "RealEstateLicenseCredential"]`)
- `issuer`: Party that issued the credential (signatory)
- `subject`: The credential subject with claims (DID + key-value pairs)
- `holder`: Party that holds the credential (observer)
- `proof`: Cryptographic proof of the credential
- `status`: Current status (Active, Suspended, Revoked)
- `issuanceDate`: When issued
- `expirationDate`: When it expires (optional)

**Choices:**
- `IsValid`: Check if credential is currently valid (not expired, status is Active)
- `Suspend`: Temporarily suspend the credential
- `Reactivate`: Reactivate a suspended credential
- `Revoke`: Permanently revoke the credential (archives it)
- `TransferCredential`: Transfer to a new holder (requires both holder and issuer consent)
- `AddVerifier`: Add a party who can verify this credential
- `PresentCredential`: Present credential to a verifier (non-consuming, creates PresentationReceipt)

### 2. `PresentationReceipt`

Created when a credential is presented to a verifier.

**Key Fields:**
- `credentialId`: ID of the presented credential
- `holder`: Who presented it
- `verifier`: Who it was presented to
- `presentedAt`: Timestamp
- `challenge`: Challenge nonce (prevents replay attacks)
- `presentationProof`: Holder's proof of possession

**Choices:**
- `AcknowledgePresentation`: Verifier acknowledges the presentation

### 3. `CredentialIssuanceRequest`

A request from a subject to an issuer for a credential.

**Key Fields:**
- `requestId`: Unique request identifier
- `issuer`: Party to issue the credential
- `subject`: Party requesting the credential
- `requestedCredentialType`: Types of credential requested
- `requestedClaims`: Claims the subject wants in the credential
- `supportingDocuments`: URIs/hashes of supporting documents

**Choices:**
- `ApproveAndIssue`: Issuer approves and creates the `VerifiableCredential`
- `RejectRequest`: Issuer rejects with a reason

### 4. `RevocationRegistryEntry`

Public record that a credential has been revoked.

**Key Fields:**
- `credentialId`: ID of revoked credential
- `issuer`: Who revoked it
- `revokedAt`: When it was revoked
- `reason`: Optional reason

**Choices:**
- `IsRevoked`: Check if a credential ID matches this entry

## Data Types

### `CredentialSubject`
```daml
data CredentialSubject = CredentialSubject
  with
    id : DID                    -- Decentralized Identifier
    claims : [(Text, Text)]     -- Key-value claims
```

### `Proof`
```daml
data Proof = Proof
  with
    proofType : Text            -- e.g., "Ed25519Signature2020"
    created : Time
    proofPurpose : Text         -- e.g., "assertionMethod"
    verificationMethod : Text   -- DID URL
    proofValue : Text           -- Signature
```

### `CredentialStatus`
```daml
data CredentialStatus
  = Active      -- Valid and usable
  | Suspended   -- Temporarily suspended (can be reactivated)
  | Revoked     -- Permanently revoked (cannot be reactivated)
```

## Usage Examples

### Example 1: Issue a Real Estate License

```daml
-- 1. Subject requests credential
requestId <- submit maria do
  createCmd CredentialIssuanceRequest with
    requestId = "REQ-2024-001"
    issuer = caDRE
    subject = maria
    requestedCredentialType = ["VerifiableCredential", "RealEstateLicenseCredential"]
    requestedClaims =
      [ ("licenseType", "Real Estate Agent")
      , ("licenseNumber", "02056789")
      , ("jurisdiction", "California")
      ]
    supportingDocuments = ["hash://license-exam"]

-- 2. Issuer approves and creates credential
credential <- submit caDRE do
  exerciseCmd requestId ApproveAndIssue with
    credentialId = "urn:uuid:credential-re-02056789"
    issuanceDate = currentTime
    expirationDate = Some expirationTime
    proof = Proof with
      proofType = "Ed25519Signature2020"
      created = currentTime
      proofPurpose = "assertionMethod"
      verificationMethod = "did:example:ca-dre#key-1"
      proofValue = "signature-data"
    subjectDid = "did:example:maria"
    credentialSchema = Some "https://ca.gov/schemas/re-license.json"
    credentialContext = ["https://www.w3.org/2018/credentials/v1"]
```

### Example 2: Present Credential to Verifier

```daml
-- 1. Add verifier
credential <- submit issuer do
  exerciseCmd credential AddVerifier with
    verifier = retvnPlatform

-- 2. Holder presents credential
receipt <- submit maria do
  exerciseCmd credential PresentCredential with
    verifier = retvnPlatform
    challenge = "retvn-challenge-12345"
    presentationProof = "proof-of-possession"

-- 3. Verifier acknowledges
submit retvnPlatform do
  exerciseCmd receipt AcknowledgePresentation
```

### Example 3: Revoke a Credential

```daml
-- 1. Revoke the credential (archives it)
submit issuer do
  exerciseCmd credential Revoke

-- 2. Create public revocation record
submit issuer do
  createCmd RevocationRegistryEntry with
    credentialId = "urn:uuid:credential-id"
    issuer = issuer
    revokedAt = currentTime
    reason = Some "License suspended"
```

## Real Estate Use Case: RETVN Platform

For the RETVN platform, credentials are used for:

1. **Identity Verification** (Government ID)
   - Issuer: DMV, State Department
   - Holder: Individual citizen
   - Claims: License number, date of birth, state

2. **Professional Licenses** (Real Estate Agent/Broker)
   - Issuer: State Real Estate Commission
   - Holder: Real estate professional
   - Claims: License number, type, jurisdiction, status

3. **Brokerage Affiliation**
   - Issuer: Real estate brokerage
   - Holder: Agent affiliated with brokerage
   - Claims: Affiliation ID, agent license number

4. **Notary Commission**
   - Issuer: Secretary of State
   - Holder: Notary public
   - Claims: Commission number, jurisdiction, expiration

5. **Tax Authority**
   - Issuer: Government agency
   - Holder: Tax official
   - Claims: Agency ID, jurisdiction, authority level

## Workflow

### Registration Flow

1. **User connects digital wallet** containing their verifiable credentials
2. **User selects credentials** to present (e.g., Government ID + Real Estate License)
3. **Platform reads credentials** and determines expected role
4. **User submits for review** - credentials are presented to platform
5. **Admin reviews credentials**:
   - Verifies cryptographic signatures
   - Checks issuer is trusted
   - Validates not revoked
   - Confirms not expired
6. **Admin approves** - user gains access with assigned role

### Trust Verification

When verifying a credential:
1. Check cryptographic signature (`proof.proofValue`)
2. Verify issuer is trusted (check DID registry)
3. Confirm credential not expired (`expirationDate`)
4. Check status is `Active`
5. Verify not in revocation registry

## Security Considerations

1. **Issuer Trust**: Only credentials from trusted issuers are accepted
2. **Cryptographic Proof**: All credentials must have valid proofs
3. **Expiration**: Credentials with expiration dates are automatically invalid after expiry
4. **Revocation**: Revoked credentials cannot be used
5. **Challenge-Response**: Presentations include challenges to prevent replay attacks
6. **Privacy**: Selective disclosure - only necessary claims are shared

## Testing

Run the test scenarios:

```bash
daml test --files W3C/VCTest.daml
```

Test scenarios include:
- `testRealEstateCredential`: Complete lifecycle of a real estate agent credential
- `testGovernmentIDCredential`: Government-issued ID credential
- `testCredentialRevocation`: Credential revocation workflow
- `testMultipleCredentials`: User with multiple credentials (ID + License + Brokerage)

## Future Extensions

1. **Selective Disclosure**: Zero-knowledge proofs to reveal only specific claims
2. **Credential Schemas**: Validate credential claims against schemas
3. **Status List 2021**: Efficient revocation checking using bitstring status lists
4. **Credential Refresh**: Automatic renewal before expiration
5. **Delegation**: Allow credential holders to delegate verification rights
6. **Composite Credentials**: Credentials that depend on other credentials
7. **Privacy-Preserving Verification**: Verifiers don't learn unnecessary information

## References

- [W3C Verifiable Credentials Data Model 1.1](https://www.w3.org/TR/vc-data-model/)
- [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/)
- [DID Method Registry](https://www.w3.org/TR/did-spec-registries/)
- [Verifiable Credentials Use Cases](https://www.w3.org/TR/vc-use-cases/)
