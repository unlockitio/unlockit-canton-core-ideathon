# RETVN Frontend

React-based frontend application for the Real Estate Transaction Verification Network (RETVN) platform, integrated with Canton/Daml smart contracts via the Canton JSON API.

## Table of Contents

- [Quick Start](#quick-start)
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [User Flows](#user-flows)
- [Canton JSON API Integration](#canton-json-api-integration)

---

## Quick Start

### Option 1: Running with Docker (Recommended)

```bash
# 1. Start all services (Canton, backend, frontend)
docker compose -f docker-compose.sandbox.yml up -d

# 2. Access the application
open http://localhost:3000
```

The Docker setup automatically:
- Starts Canton with sandbox mode
- Builds and serves the frontend
- Starts the backend API

### Option 2: Local Development

**Prerequisites:**
- Node.js 18+ installed

**Installation:**

```bash
# 1. Navigate to frontend directory
cd fe

# 2. Install dependencies
npm install

# 3. Generate Daml TypeScript bindings (if any changes to daml code exists)
daml codegen js ../.daml/dist/unlockit-canton-core-ideathon-0.0.1.dar -o src/codegen

# 4. Create environment file (optional - uses defaults)
cp .env.example .env

# 5. Start development server
npm run dev
```

**Application will be available at:** http://localhost:3000

## Overview

This application provides a complete user interface for:
- User authentication and registration with W3C Verifiable Credentials 
  - Admin approval queue for user registrations
  - User directory and account management
- Transaction submission and verification workflow
- Market data insights
- Rankings and leaderboards
- Digital wallet for credentials, payments, and rewards


## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Canton JSON API** - Daml ledger integration
- **Daml Codegen** - Type-safe Daml contract bindings

---

## Project Structure

```
fe/
├── src/
│   ├── components/
│   │   └── Layout.tsx              # Main layout with navigation
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── pages/
│   │   ├── Login.tsx               # User login
│   │   ├── Register.tsx            # Registration with credential selection
│   │   ├── Dashboard.tsx           # User dashboard
│   │   ├── SubmitTransaction.tsx   # 3-step transaction submission
│   │   ├── VerifyTransactions.tsx  # Transaction verification interface
│   │   ├── Insights.tsx            # Market insights and data access
│   │   ├── Rankings.tsx            # Trust score rankings
│   │   ├── LedgerDebug.tsx         # Ledger debugging tool
│   │   ├── TransactionDetail.tsx   # Transaction detail view
│   │   ├── WalletCredentials.tsx   # Digital credentials wallet
│   │   ├── WalletPayments.tsx      # Payment history
│   │   ├── WalletRewards.tsx       # Contributor rewards
│   │   ├── AdminApprovals.tsx      # Admin approval queue
│   │   └── AdminUsers.tsx          # User directory
│   ├── services/
│   │   └── cantonApi.ts            # Canton JSON API integration
│   ├── types/
│   │   └── canton.ts               # TypeScript types for Canton API
│   ├── utils/
│   │   └── daml.ts                 # Daml utilities and template IDs
│   ├── codegen/                    # Generated Daml TypeScript bindings
│   ├── App.tsx                     # Main app with routing
│   ├── App.css                     # Global styles
│   ├── config.ts                   # Configuration
│   └── main.tsx                    # Entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── README.md                       # This file
```

---

## Features

### Authentication & Registration
- **Login**: Select from existing users (simplified Canton user management)
- **Registration**: Multi-step credential presentation flow
  - Step 1: Connect digital wallet (Mocked)
  - Step 2: Select credentials to present (Government ID, Real Estate License, Brokerage, etc.)
  - Step 3: Await admin approval

### Dashboard
- Quick stats overview (transactions, verifications, trust score)

### Transaction Management
- **Submit Transaction**: 3-step form
  - Property information (address, type, size, beds/baths, year built)
  - Transaction details (price, dates, financing, days on market)
  - Review and submit
- **Verify Transactions**: Review and verify submitted transactions
  - View complete transaction details
  - Select verification decision (Confirmed, Disputed, Confirmed with Notes, Request Clarification)
  - Add optional notes
  - Submit verification (weighted by role)
- **Transaction Detail**: Deep dive into individual transactions
  - Property and transaction information
  - Verification history with verifier roles
  - Trust score breakdown
  - Verifier details

### Market Data Insights
- **View Aggregated Data**: Market statistics by postal code
  - Transaction count, median/average prices
  - Price per sqft, days on market
  - Property type distribution
- **Access Tiers**: 4 pricing tiers
  - Public Access (Free, 30 days, aggregates)
  - Basic Report ($9.99, 90 days, aggregates)
  - Professional Report ($49.99, 365 days, individual transactions)
  - Institutional Access ($499/mo, unlimited, API access)
- **Order Management**: Purchase and track market data orders

### Rankings & Leaderboards
- **Trust Score Rankings**: Top contributors ranked by trust score
- **Verification Activity**: Most active verifiers
- **Contribution Metrics**: Submission and verification counts
- **Role-based Rankings**: Filter by user role

### Digital Wallet
- **Credentials**: View and manage W3C Verifiable Credentials
  - Government ID
  - Real Estate License
  - Brokerage Affiliation
  - Credential status and expiration
- **Payments**: Track market insight order payments
  - Payment history
  - Order status (confirmed, failed, pending)
  - Total spending
- **Rewards**: Contributor rewards for data submissions and verifications
  - Reward history
  - Total earnings
  - Reward reasons

### Admin Interface
- **Approval Queue**: Review credential presentations
  - View submitted credentials
  - Approve or reject registrations
  - Provide rejection reasons
- **User Directory**: Manage registered users
  - Search and filter users
  - View user details and activity
  - Suspend/reactivate accounts

### Development Tools
- **Ledger Debug**: Query and inspect Canton ledger state
  - Query contracts by template ID
  - View contract payloads
  - Debug contract visibility

---

## User Flows

### 1. Registration Flow

**Steps:**
1. User navigates to `/register`
2. Clicks "Connect Wallet" (simulated wallet connection)
3. Selects credentials to present:
   - **Government ID** (required) - Proves identity
   - **Real Estate License** (optional) - Unlocks Realtor roles
   - **Brokerage Affiliation** (optional) - Required for higher-tier roles
4. Reviews selected credentials
5. Submits registration request
6. Waits for admin approval

**Admin Side:**
1. Admin reviews request in `/admin/approvals`
2. Verifies credential authenticity
3. Approves → Creates `UserAccount` contract with appropriate role
4. User receives notification and can now login

**Roles Assigned Based on Credentials:**
- Gov ID only → PrivateCitizen
- Gov ID + RE License → RealtorAgent
- Gov ID + Broker License → RealtorBroker
- Gov ID + Principal Broker → RealtorMaster

### 2. Login Flow

**Steps:**
1. User navigates to `/login`
2. Selects their username from dropdown
3. System generates JWT token
4. Redirects to Dashboard

**What Happens:**
- Token stored in localStorage
- Party ID associated with user
- AuthContext updated
- Protected routes become accessible

### 3. Dashboard

**Overview Display:**
- **Stats Cards**: Transactions submitted, verifications performed, current trust score
- **Recent Activity**: Latest transactions and verifications
- **Quick Actions**: Role-based action buttons
  - Submit Transaction (all roles)
  - Verify Transactions (verifier roles only)
  - View Insights (all roles)
  - Admin Tools (operator only)

**Role-Based Features:**
- **PrivateCitizen**: Can submit and view transactions
- **Verifier Roles**: Can also verify transactions
- **Operator**: Full admin access

### 4. Transaction Submission Flow

**Steps:**
1. User clicks "Submit Transaction" from dashboard
2. **Step 1: Property Information**
   - Address (street, city, state, postal code)
   - Property type (Single Family, Condo, Townhouse, Multi-Family, Land)
   - Living area (sqft), lot size (sqft)
   - Bedrooms, bathrooms, year built
3. **Step 2: Transaction Details**
   - Sale price
   - Transaction date, closing date
   - Financing type (Conventional, FHA, VA, Cash, USDA)
   - Days on market
4. **Step 3: Review & Submit**
   - Review all entered information
   - Confirm and submit

**Backend Processing:**
1. Creates `TransactionSubmissionProposal` contract
2. Operator auto-accepts (backend automation)
3. Creates `TransactionData` contract
4. Assigns random verifiers
5. Transaction appears in "Verify Transactions" for assigned verifiers

### 5. Transaction Verification Flow

**Steps:**
1. Verifier navigates to `/verify`
2. Sees list of pending transactions assigned to them
3. Clicks on transaction to view details
4. Reviews:
   - Property information
   - Transaction details
   - Map location (if available)
   - Existing verifications
5. Selects verification decision:
   - **Confirmed** - All data is accurate
   - **Confirmed with Notes** - Accurate but needs context
   - **Disputed** - Data is incorrect
   - **Request Clarification** - Need more information
6. Adds optional notes
7. Submits verification

**Trust Score Calculation:**
```
Trust Score = Σ(confirmed weights) - Σ(disputed weights × 2)
Clamped to [0, 100]
```

**Verifier Weights:**
- PrivateCitizen: 5 (cannot verify)
- RealtorAgent: 8
- RealtorBroker: 12
- RealtorMaster: 15
- NotaryPublic: 25
- TaxAuthority: 40

**Transaction Status:**
- **Unverified**: No verifications yet
- **Partially Verified**: 1+ confirmations
- **Fully Verified**: 3+ confirmations from 2+ different roles
- **Disputed**: At least one dispute

### 6. Market Insights Flow

**Steps:**
1. User navigates to `/insights`
2. Enters postal code to query
3. Selects data quality level:
   - **Public Access** (Free) - 30 days, aggregates only
   - **Basic Report** ($9.99) - 90 days, aggregates only
   - **Professional Report** ($49.99) - 365 days, individual transactions
   - **Institutional Access** ($499/mo) - Unlimited, full API access
4. Reviews pricing and features
5. Clicks "Purchase Report"

**Backend Processing:**
1. Creates `MarketInsightOrder` contract
2. Creates `PaymentPendingOrder` contract
3. Backend automation processes payment (simulated)
4. Creates `ConfirmedPaymentOrder` or `FailedPaymentOrder`
5. If confirmed, creates `PaidMarketInsightOrder`
6. Generates `MarketInsight` contract with requested data

**User Receives:**
- Aggregated statistics (all tiers)
- Individual transaction data (Professional/Institutional only)
- Historical trends
- Property type distribution

### 7. Rankings Flow

**Steps:**
1. User navigates to `/rankings`
2. Views leaderboards:
   - **Trust Score Rankings**: Top contributors by trust score
   - **Most Active Verifiers**: Highest verification counts
   - **Top Submitters**: Most transactions submitted
3. Filters by role (optional)
4. Searches for specific users

**Ranking Criteria:**
- Trust Score: Cumulative score from verified transactions
- Verification Count: Total verifications performed
- Submission Count: Total transactions submitted
- Contribution Score: Combined metric

### 8. Wallet - Credentials Flow

**Steps:**
1. User navigates to `/wallet` → Credentials tab
2. Views all W3C Verifiable Credentials:
   - **Government ID**: Identity credential
   - **Real Estate License**: Professional credential
   - **Brokerage Affiliation**: Organizational credential
3. Each credential shows:
   - Credential type and icon
   - Issuer (DMV, State RE Commission, Brokerage)
   - Issuance date
   - Expiration date
   - Status (Active, Expired, Suspended, Revoked)

**Credential Actions:**
- View credential details

### 9. Wallet - Payments Flow

**Steps:**
1. User navigates to `/wallet` → Payments tab
2. Views payment history for market insight orders:
   - Order ID
   - Postal code queried
   - Data tier purchased
   - Payment amount
   - Payment date
   - Status (Confirmed, Failed, Pending)
3. Total spending displayed
4. Filter by status or date range

**Payment Status:**
- **Confirmed**: Payment successful, insight delivered
- **Failed**: Payment declined, no charge
- **Pending**: Processing (transitional state)

### 10. Wallet - Rewards Flow

**Steps:**
1. User navigates to `/wallet` → Rewards tab
2. Views contributor rewards:
   - Reward ID
   - Amount earned
   - Date received
   - Reason (Transaction Submission, Verification Contribution)
3. Total earnings displayed
4. Rewards history over time

**Reward Criteria:**
- **Transaction Submission**: Reward for submitting verified transactions
- **Verification Contribution**: Reward for performing verifications
- **Trust Score Bonus**: Additional rewards for high trust score
- Amount based on contribution quality and role weight

---

