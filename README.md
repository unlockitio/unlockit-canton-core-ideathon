# RETVN - Real Estate Transaction Verification Network

A decentralized platform for verifying real estate transactions using Canton/Daml smart contracts and W3C Verifiable Credentials.

## Project Overview

### Unlockit Trust Layer: Canton-Powered Data Rail for Real Estate

Unlockit is the trust data infrastructure for real estate: a decentralized Canton-based rail where profiles, reviews, verifications and transactions become verifiable digital assets. We create a shared ledger where reference data (what a property is), transactional data (what actually happened), and verified profiles (who did what) live as Canton smart contracts, with fine-grained privacy.

On top of this rail we run Smart Transactions, Smart Profiles and Smart Rental contracts, and enable data monetization and property-backed financial instruments where contributors earn whenever verified data is used or bought.

### The Problem

Real estate today runs on disconnected systems:

**No shared "truth" about properties or actors**
- Data sits in CRMs, portals, registries, PDFs and emails with no unified standard or verification layer
- Each stakeholder sees a different version of the same property and transaction

**Decisions based on listings, not real verified transactions**
- Pricing, risk and policy rely on listing sites and delayed statistics instead of immutable, transaction-level data
- This leads to mispricing, slower price discovery and poor housing policy

**High friction, duplicated compliance and fraud risk**
- KYC, ownership checks, permits and documentation are repeated by every bank, notary, lawyer and broker
- Manual review with inconsistent outcomes
- Fraud and misrepresentation (fake listings, false claims) are hard to detect early

**Data is a liability, not an asset, for those who create it**
- Agents, brokers and masters generate the most granular market data, but portals and institutions capture most of the value
- No neutral rail or revenue-sharing model that pays contributors when their verified data is reused

**Citizens and governments operate in the dark**
- Citizens cannot easily access complete, trusted property histories or agent reputations
- Governments and regulators lack a live, auditable view of the market for supervision, subsidies or fighting speculation

### The Solution

**Canton-based Trust Layer as the neutral data rail**
- A permissioned ledger where identities, properties and transactions are modeled as Canton smart contracts
- Privacy-preserving partitions for each party (banks, portals, agents, regulators)
- The "SWIFT + core banking" equivalent for real estate data: one integration, many use cases

**Unified reference and transactional data with verification**
- Unique property registry combining reference data (ownership, attributes, permits) and transactional data (sales, rentals, contracts)
- Strict verification and authentication rules, including eIDAS-compliant identity providers
- Every record has provenance (who contributed, who verified), is immutable and auditable

**Smart workflows with embedded compliance and audit trails**
- Real estate workflows (sale, rent, due diligence, registration) run as smart contracts
- Enforce conditions (KYC, licensing, document checks) before money or ownership moves
- Every step leaves a tamper-proof trail of "who did what, when"

**Application layer: products on top of the same rail**
- **ÍRIS - Smart Transactions**: 360º transaction engine for agents and brokers, citizen-centric, with secure document exchange
- **CLARA - Smart Profiles & Reviews**: 360º reputation for agents, brokers and institutions based on verified transactions
- **AURORA - Smart Rent**: End-to-end leasing (screening, contracts, payments, lifecycle) on verified data

**Data-as-an-asset and revenue-sharing model**
- Data owners, contributors and verifiers (agents, brokers, masters, institutions, citizens) earn revenue when their verified data is used
- Time-decay, weighting and reputation rules align incentives for long-term, high-quality contributions
- Penalize fake or low-quality data

**Realistic adoption path, starting with Portugal, designed to scale**
- Connects to existing CRMs, portals and institutional systems via APIs
- No need to replace current tools
- Portugal is the pilot; model, governance and contracts designed to be replicated in other markets

### Why Canton is Critical

Without Canton, you either:
- Put everything on a public chain → privacy and regulatory problems, or
- Stay in traditional siloed databases → no shared trust, no composability

**Canton provides:**
- **Fine-grained privacy and data partitions**: A regulator sees anonymized market data; a bank sees transaction details for its customers; an agent sees their deals. All on the same network, without leaking unnecessary information.
- **Regulator-grade auditability**: Every transaction, rule and change is traceable. Ideal for supervision, licensing and compliance.
- **Interoperability between institutions**: Banks, insurers, portals, franchisors, regulators and startups can build on the same rail with strong guarantees on contracts and data.
- **Realistic deployment path**: Existing systems (CRMs, registries, banking systems) connect via APIs. We don't ask the industry to "throw everything away" - we give them a way to synchronize critical truth while keeping their systems.

### The Disruption

Real estate today is a collection of local, manual, inconsistent processes.

**Unlockit Trust Layer on Canton turns it into a shared, programmable, privacy-preserving infrastructure, where:**
- Truth is verifiable
- Compliance is built-in
- Those who create and verify data finally share in the value it generates

---

## What Has Been Built

This repository contains a **Proof of Concept** demonstrating the feasibility of the Unlockit Trust Layer concept. The PoC showcases the core capabilities of a Canton-based data rail for real estate:

### Transaction Submission & Verification

**Stakeholders can submit transaction data and assign verifiers**
- Real estate professionals (agents, brokers, masters) and citizens submit property transaction details
- Submitters can assign specific verifiers by role to validate their transaction data
- All transaction data is stored as immutable Canton smart contracts with full provenance

**Verifiers provide value guarantees**
- Assigned verifiers review transaction details (property info, pricing, dates, financing)
- Each verifier submits a decision: Confirmed, Confirmed with Notes, Disputed, or Request Clarification
- Verifications are cryptographically signed and permanently recorded on the ledger

### Trust Score System

**Trust scores increase with verification quality**
- Each user role has a verification weight (Private Citizen: 5, Realtor Agent: 8, Broker: 12, Master: 15, Notary: 25, Tax Authority: 40)
- Trust Score = Σ(confirmed weights) - Σ(disputed weights × 2), clamped to [0, 100]
- Transactions progress through statuses: Unverified → Partially Verified → Fully Verified (3+ confirmations from 2+ roles)
- Higher trust scores indicate more reliable data for insights and monetization

### Market Insights & Data Monetization

**Verified data produces valuable insights**
- Collected transactional data is aggregated to create market intelligence
- Users request insights with configurable parameters:
  - **Quality level**: Basic, Verified, Premium (affects pricing)
  - **Data scope**: Basic, Standard, Detailed coverage
  - **Time range**: Recent, Year, Historic data
  - **Segmentation**: Property type, postal code, price range filters

**Revenue sharing for contributors and verifiers**
- Insight requests create payment orders tracked through the system
- When paid, orders generate MarketInsight contracts with the requested data
- The system automatically distributes rewards to:
  - **Data contributors**: Those who submitted the underlying transaction data
  - **Verifiers**: Those who validated the data quality
- Reward amounts are proportional to contribution quality and verification weight

### Reputation & Trust Registry

**System tracks stakeholder reputation**
- User reputation scores are calculated based on:
  - Quality of submitted transactions (verified vs disputed)
  - Accuracy of verifications provided
  - Consistency and activity over time
- Public rankings showcase top contributors by reputation

**Identification of bad actors**
- Disputed transactions negatively impact submitter reputation
- Incorrect verifications damage verifier credibility
- Reputation decay mechanisms prevent gaming the system

**Registry of trustworthy stakeholders**
- Verified track record of all participants based on actual transactions, not self-declared credentials
- Trust built on data and immutable audit trails, not hearsay
- Institutions and citizens can identify reliable partners based on verified performance

### W3C Verifiable Credentials Integration

**Identity verification at the foundation**
- Users register by presenting W3C Verifiable Credentials (Government ID, Real Estate License, Brokerage Affiliation)
- Credential presentation creates an immutable record of identity verification
- Role assignment (Agent, Broker, Master, Notary, Tax Authority) based on verified credentials
- Credentials can be suspended or revoked, automatically affecting user permissions

### Technical Implementation

This PoC demonstrates:
- **Canton privacy model**: Fine-grained visibility controls (submitters, verifiers, and operators see relevant data)
- **Smart contract workflows**: Multi-party approval flows for transactions, verifications, and payments
- **Immutable audit trails**: Every action (submission, verification, payment, reward) is permanently recorded
- **Automated processors**: Backend automation handles payment processing, insight fulfillment, and proposal approvals
- **API integration**: REST endpoints for external systems to query data and submit transactions

**The PoC proves that a Canton-based trust layer can:**
1. Enable collaborative, verifiable data creation across multiple stakeholders
2. Implement role-based verification with cryptographic guarantees
3. Automatically calculate trust scores and reputation metrics
4. Support data monetization with fair revenue distribution
5. Maintain fine-grained privacy while ensuring auditability

---

## Roadmap

### Business Development

**Expanded data sets beyond transactions**
- **Collective intelligence integration**: Environment metrics, amenities, school rankings, crime statistics, and other geographic data
- **Reference data separation**: Distinct handling of transactional data (what happened) vs reference data (property attributes, permits, ownership)
- **Fine-grained contribution model**: More granular tracking and rewarding of different data types and quality levels

**Enhanced reputation & verification systems**
- **Deeper reputation capture**: Beyond consensus-based scoring to include transaction reviews of all stakeholders involved
- **Stakeholder performance tracking**: Agents, brokers, notaries, and institutions rated based on actual transaction outcomes
- **Penalty mechanisms**: Users who provide or verify incorrect information are penalized based on peer consensus
- **Fair reward algorithms**: Distribution of compensation that accounts for:
  - Data quality and verification depth
  - Role and expertise level
  - Contribution frequency and consistency
  - Historical accuracy and reputation
- **Transparent compensation**: Clear, auditable rules for how rewards are calculated and distributed

**Dynamic data visualization & user interfaces**
- **Prompt-driven reporting**: Users generate custom reports through natural language queries
- **Demand-driven dashboards**: Dynamic, personalized views instead of static interfaces
- **Greater user control**: Flexible data exploration and visualization options
- **AI-powered insights**: Intelligent analysis and recommendations based on user prompts

### Canton Ecosystem Integration

**Identity & wallet providers**
- **dfns integration**: Exploring integration with dfns for custody and wallet solutions, providing greater user control over credentials and keys
- **W3C VC compliance**: Open to any third-party credential issuers that follow W3C Verifiable Credentials standards
- **Decentralized identity**: Enhanced user sovereignty and privacy through compatible identity providers

**Payment systems**
- **Stablecoin integration**: Support for stablecoin payments for services and rewards redemption
- **Canton Coin adoption**: Potential integration with Canton Coin for native network payments
- **Multi-currency support**: Flexible payment options across different asset types

**Data & analytics partnerships**
- **TheTie integration**: Exploring data visualization and analytics partnerships for consuming generated data points
- **Third-party data consumers**: APIs for external platforms to access verified real estate data
- **Canton Network expansion**: Active discussions to grow connections within the Canton ecosystem

**Ecosystem collaboration**
- Building relationships with Canton Network participants
- Exploring interoperability with other Canton-based applications
- Contributing to Canton standards and best practices

### Technical Evolution

**Production readiness**

The current PoC was built for demonstration purposes. Production deployment requires:

**Historical data querying**
- **PQS (Participant Query Store) integration**: Enable efficient historical contract querying and analytics
- **Indexed data access**: Fast retrieval of historical transactions, verifications, and reputation changes

**Daml architecture enhancements**
- **Daml-finance inspired templates**: Separation of operator and provider parties
- **White-labeling capability**: Template design that allows multiple providers to run instances of the platform
- **Governance decoupling**: Separate the system operator (governance) from service providers (business operations)
- **Multi-tenancy support**: Enable different institutions to run their own instances while sharing the trust layer

**Security & access management**
- **Production-grade authentication**: Proper JWT signature validation and session management
- **Authorization framework**: Fine-grained access control based on roles and permissions (or even W3C VCs)
- **Data encryption**: Encryption at rest and in transit for sensitive information
- **Key management**: Secure handling of cryptographic keys and credentials

**Scalability & performance**
- **Optimized contract queries**: Improved indexing and caching strategies

---

**Note**: This roadmap represents the main immediate priorities and is not an exhaustive list. The vision for the Unlockit ecosystem incorporates numerous additional improvements and actively embraces collaboration to compose our applications with any other systems that can add value to the Canton Network and the real estate industry.

---

## How to Run

### Starting the Development Environment

```bash
# 1. Start Canton and Docker services
docker compose -f docker-compose.sandbox.yml up -d
```

**Access the application**: http://localhost:3000

### Stopping the Development Environment

```bash
# Stop Docker services
docker compose -f docker-compose.sandbox.yml down
```

### Service URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:9090
- **Canton JSON API**: http://localhost:8080
- **Canton gRPC**: http://localhost:6865
- **Swagger UI - Canton API**: http://localhost:8081
- **Swagger UI - Backend API**: http://localhost:8082

---

## Using the PoC

### Pre-Seeded Data

The system automatically seeds on startup:
- **Multiple test users** across all role types (agents, brokers, masters, notaries, tax authorities, citizens)
- **100 sample transactions** with realistic property data
- **W3C Verifiable Credentials** for test users

**You can login and logout of multiple users at will to explore different perspectives.**

### Important Note

**This PoC has been built following a happy path approach.** While we've attempted to handle some edge cases, it's possible to encounter unhappy paths. The focus is on demonstrating core functionality and Canton integration patterns.

---

### Suggested Testing Workflow

#### Step 1: Explore Pre-Seeded Data

1. **Login as any user** (the system shows available users on the login screen)
2. **Navigate to the Dashboard** to see:
   - Transaction statistics
   - Verification counts
   - Trust score
   - Pending verifications
3. **Browse the Transactions page** to see the 100 pre-seeded transactions
4. **Check the Rankings page** to see reputation scores across stakeholders

#### Step 2: Submit a New Transaction

**Login as a Real Estate Agent** (e.g., `alice` or any agent from the user list)

1. Navigate to **Transactions** page
2. Click **Submit Transaction** button
3. Fill out the 4-step form:

**Suggested test data** (chosen to demonstrate insights later):
- **Property Address**: 123 Test Street, Los Angeles, CA
- **Postal Code**: `90001`
- **Property Type**: `Condo`
- **Living Area**: `1400` sqft (between 1200-1600)
- **Bedrooms**: `2`
- **Bathrooms**: `2`
- **Year Built**: `1985` (1980s-1990s range)
- **Sale Price**: `450000`
- **Closing Date**: Any recent date
- **Financing Type**: Conventional
- **Days on Market**: `30`

4. **Assign Verifiers** (optional - select verifiers by role)
5. **Review and Submit**

The transaction will be created and visible in the Transactions list.

#### Step 3: Verify the Transaction

**Logout and login as a Notary or Tax Authority** (higher verification weight)

1. Navigate to **Transactions** page
2. Find the transaction you just created (it will show as "Unverified" or "Partially Verified")
3. Click on the transaction to open **Transaction Detail** page
4. Click **Verify Transaction** button
5. Select a verification decision:
   - **Confirmed** - Data is accurate
   - **Confirmed with Notes** - Accurate with additional context
   - **Disputed** - Data is incorrect
   - **Request Clarification** - Need more information
6. Add optional notes
7. **Submit Verification**

**Observe the changes:**
- **Transaction trust score updates**: Calculated as Σ(confirmed weights) - Σ(disputed weights × 2), clamped to [0, 100]
  - Each role has a verification weight (Citizen: 5, Agent: 8, Broker: 12, Master: 15, Notary: 25, Tax Authority: 40)
  - Confirming adds your role's weight to the score
  - Disputing subtracts 2× your role's weight
- **Transaction status changes**: Unverified → Partially Verified (1+ confirmations) → Fully Verified (3+ confirmations from 2+ different roles)
- **User reputation is affected**:
  - Transaction submitter's reputation increases when their data is confirmed by verifiers
  - Verifier's reputation increases when their verification aligns with consensus
  - Disputed transactions or incorrect verifications damage reputation

**Note**: The current scoring algorithms are simplistic for PoC demonstration. Production implementation should make these configurable with more sophisticated weighting, time-decay, and reputation mechanisms.

#### Step 4: Request Market Insights

Now that you have transaction data in the `90001` postal code range:

**Login as any user** and navigate to **Insights** page

1. Click **Request Insight** button
2. Configure the request:
   - **Postal Code**: `90001`
   - **Quality Level**: `Basic`
   - **Data Scope**: `Basic`
   - **Time Range**: `Historic` (important - this ensures we include the test data)
   - **Segments**: Select filters that match your test transaction:
     - Property Type: `Condo`
     - Bedrooms: `2`
     - Living Area: `1200-1600 sqft`
     - Year Built: `1980-1990`

3. **Review the calculated price** (based on quality level, scope, time range, and segment complexity)
4. **Submit the order**

The system creates a **PaymentPendingOrder**.

#### Step 5: Payment Processing & Rewards

**The backend automation processes payments automatically.**

1. Navigate to **Wallet → Payments** page
2. Wait a few seconds and refresh the page
3. The payment will be processed:
   - **80% chance of success** → Creates `ConfirmedPaymentOrder`
   - **20% chance of failure** → Creates `FailedPaymentOrder`

**If payment fails:**
- You'll see the failure reason (e.g., "Insufficient funds", "Payment gateway timeout")
- **Feel free to try again** - submit another insight request and wait for processing

**When payment succeeds:**
- The order becomes a **PaidMarketInsightOrder**
- Backend automation generates the **MarketInsight** contract
- Navigate to **Insights** page to see your purchased insight with aggregated data

4. Navigate to **Wallet → Rewards** page
5. **Check for new rewards** distributed to:
   - **Data contributors** who submitted transactions in that postal code/segment
   - **Verifiers** who validated the transaction data
   - Reward amounts are proportional to contribution quality and verification weight

#### Step 6: Explore Reputation System

1. Navigate to **Rankings** page
2. **Filter by role** to see top contributors
3. Notice how reputation scores reflect:
   - Quality of submitted transactions
   - Accuracy of verifications
   - Overall contribution to the platform

**Test reputation changes:**
- Submit multiple transactions as one user and have them verified → **submitter reputation increases**
- Verify transactions correctly (aligned with consensus) → **verifier reputation increases**
- Submit a transaction with incorrect data that gets disputed → **submitter reputation decreases**
- Dispute a transaction incorrectly (against consensus) → **verifier reputation decreases**
- Check the **Rankings** page to see updated reputation scores after these actions

**Note**: Reputation calculations in this PoC are basic. Future iterations will implement configurable algorithms that account for historical accuracy, contribution frequency, role expertise, and time-weighted decay.

---

### Additional Features to Explore

**Wallet → Credentials**
- View W3C Verifiable Credentials for the logged-in user
- See credential status (Active, Suspended, Revoked)
- Check credential expiration dates

**Transaction Detail Page**
- Deep dive into individual transactions
- See complete verification history
- View all verifiers and their decisions
- Understand trust score calculation

**Admin Features** (login as `operator`)
- User approval queue
- User directory
- System-wide oversight

---

### Known Limitations (PoC Scope)

1. **Authentication**: JWT signature validation is disabled (development mode)
2. **Payment simulation**: 20% random failure rate for demonstration
3. **No persistent storage**: Data resets when Docker containers restart
4. **Limited error handling**: Focus on happy path scenarios
5. **No production security**: For demo purposes only

---

### Troubleshooting

**Services won't start or backend shows errors**

The backend requires Canton to be fully initialized and seeded before it can start. Use this **staged startup approach** if the delays incorporated to take this into account are not sufficient:

```bash
# Step 1: Start Canton, nginx-cors, and frontend first
docker compose -f docker-compose.sandbox.yml up canton-sandbox nginx-cors frontend -d

# Step 2: Follow Canton logs to wait for seeding completion
docker logs retvn-canton-sandbox -f

# Wait for these messages:
# - "Canton sandbox is ready"
# - "Test credentials seeded successfully!"
# - "Transaction seeding completed!"

# Step 3: Once seeding is complete (Ctrl+C to exit logs), start backend
docker compose -f docker-compose.sandbox.yml up backend -d
```

---

## Project Structure

```
unlockit-canton-core-ideathon/
├── be/                 # Quarkus backend - automation and APIs
├── fe/                 # React frontend - user interface
├── daml/               # Daml smart contracts (W3C VC + RETVN)
├── docker/             # Docker configuration and services
├── scripts/            # Utility scripts for setup and seeding
└── README.md          # This file
```

## Documentation

Each component has detailed documentation in its respective folder:

- **[Backend Documentation](./be/README.md)** - Quarkus backend setup, APIs, and automation
- **[Frontend Documentation](./fe/README.md)** - React app architecture and development
- **[Daml Contracts](./daml/README.md)** - Smart contracts, seeding, and querying
- **[Docker Setup](./docker/README.md)** - Container deployment and configuration
- **[Scripts](./scripts/README.md)** - Utility scripts documentation

## User Roles

| Role | Weight | Can Submit | Can Verify | Data Access |
|------|--------|------------|------------|-------------|
| Private Citizen | 5 | ✅ | ❌ | Basic |
| Realtor Agent | 8 | ✅ | ✅ | Basic |
| Realtor Broker | 12 | ✅ | ✅ | Professional |
| Realtor Master | 15 | ✅ | ✅ | Professional |
| Notary Public | 25 | ✅ | ✅ | Basic |
| Tax Authority | 40 | ✅ | ✅ | Institutional |

## Trust Score System

```
Trust Score = Σ(confirmed weights) - Σ(disputed weights × 2)
Clamped to [0, 100]
```

**Transaction Statuses:**
- **Unverified**: No verifications yet
- **Partially Verified**: 1+ confirmations
- **Fully Verified**: 3+ confirmations from 2+ roles
- **Disputed**: At least one dispute