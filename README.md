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

## Key Features

- **W3C Verifiable Credentials** - Digital credential presentation for user verification
- **Role-Based Access Control** - Six-tier system (Citizen to Tax Authority)
- **Multi-Party Verification** - Weighted trust scores from multiple verifiers
- **Privacy-Preserving** - Canton's sub-transaction privacy
- **Market Data Marketplace** - Tiered access to aggregated transaction data
- **Payment System** - Integrated payment workflow with confirmed/failed orders

## Tech Stack

- **Backend**: Quarkus, Java 17, Maven
- **Frontend**: React 18, TypeScript, Vite
- **Smart Contracts**: Daml 3.4.0-rc2
- **Infrastructure**: Docker, Docker Compose

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

## Common Commands

```bash
# View logs
docker logs retvn-canton-sandbox -f   # Canton logs
docker logs retvn-frontend -f         # Frontend logs
docker logs retvn-backend -f          # Backend logs

# Health checks
curl http://localhost:8080/livez      # Canton health
curl http://localhost:9090/q/health   # Backend health

# Full restart with fresh ledger
docker compose -f docker-compose.sandbox.yml down
docker compose -f docker-compose.sandbox.yml up -d
```