# RETVN Backend

Quarkus-based Java backend providing REST APIs for the Real Estate Transaction Verification Network (RETVN) platform, integrating with Canton/Daml smart contracts.

## Table of Contents

- [Quick Start](#quick-start)
- [Overview](#overview)
- [API Endpoints](#api-endpoints)
- [Automation](#automation)
- [Configuration](#configuration)

---

## Quick Start

```bash
# 1. Start all services (Canton, backend, frontend)
docker compose -f docker-compose.sandbox.yml up -d
```

**API available at**: http://localhost:9090

**Swagger UI (via Docker)**:
- Backend API: http://localhost:8082
- Canton Ledger API: http://localhost:8081

---

## Overview

Quarkus-based Java API that integrates with Canton to provide:

- **User Account Management**: Retrieves UserAccount contracts from Canton
- **Rankings**: Public reputation rankings endpoint
- **Market Insights Automation**: Processes data insights
- **Payment Automation**: Processes payment workflows
- **Transaction Automation**: Approves transaction proposals
- **Verification Automation**: Processes verification proposals

**Tech Stack**: Java 17+, Quarkus 3.x, Maven 3.8+

**Requirements**: Canton running on `localhost:8080`

---

## API Endpoints

### GET /api/user-accounts

Retrieves all UserAccount contracts visible to the operator.

**Authentication**: Bearer token (JWT format validation only)

**Example**:
```bash
curl -X GET http://localhost:9090/api/user-accounts \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Response**: List of UserAccount contracts with user details, roles, and reputation.

---

### GET /api/rankings

Public endpoint for user rankings by reputation.

**Authentication**: None required

**Example**:
```bash
curl http://localhost:9090/api/rankings
```

**Response**: Array of ranking entries (name, reputation, role) sorted by reputation descending.

## Automation

The backend runs automated processors that monitor Canton contracts and execute workflows:

### PaymentPendingOrderProcessor

**Purpose**: Processes pending payment orders
**Workflow**: `PaymentPendingOrder` → `ConfirmedPaymentOrder` or `FailedPaymentOrder`
**Trigger**: On pending order detection
**Behavior**: Simulates payment processing with random success/failure

---

### PaidMarketInsightOrderProcessor

**Purpose**: Fulfills paid market insight orders
**Workflow**: `PaidMarketInsightOrder` → `MarketInsight` (delivered)
**Trigger**: On paid order detection
**Behavior**: Generates market insight data and creates MarketInsight contract

---

### TransactionProposalProcessor

**Purpose**: Auto-approves transaction submission proposals
**Workflow**: `TransactionSubmissionProposal` → `TransactionData`
**Trigger**: On new proposal detection
**Behavior**: Automatically approves and creates TransactionData contract

---

### VerificationProposalProcessor

**Purpose**: Processes verification submissions
**Workflow**: `VerificationSubmissionProposal` → Updates `TransactionData` verifications
**Trigger**: On new verification proposal
**Behavior**: Adds verification to TransactionData and recalculates trust score

---

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Canton API
canton.api.url=http://localhost:8080
canton.api.package-id=<PACKAGE_ID>
canton.api.operator-party-id=<OPERATOR_PARTY_ID>

# Quarkus
quarkus.http.port=9090
quarkus.http.cors=true
```

**Finding Package ID**:
```bash
daml damlc inspect .daml/dist/unlockit-canton-core-ideathon-0.0.1.dar | grep "package-id"
```

## Project Structure

```
be/
├── src/main/java/com/unlockit/
│   ├── api/
│   │   ├── resource/
│   │   │   ├── UserAccountResource.java     # GET /api/user-accounts
│   │   │   ├── RankingsResource.java        # GET /api/rankings
│   │   ├── service/
│   │   │   ├── UserAccountService.java
│   │   │   └── MarketInsightService.java
│   │   ├── client/
│   │   │   └── CantonApiClient.java         # Canton JSON API client
│   │   └── dto/                             # Request/response DTOs
│   └── automation/
│       ├── PaymentPendingOrderProcessor.java
│       ├── PaidMarketInsightOrderProcessor.java
│       ├── TransactionProposalProcessor.java
│       └── VerificationProposalProcessor.java
├── src/main/resources/
│   └── application.properties               # Configuration
└── pom.xml                                  # Maven dependencies
```

---

## Security Notes

**⚠️ Development API Only**

- JWT signature validation disabled
- Token expiration not checked
- All queries use operator party (sees all contracts)
- No authorization checks beyond token format