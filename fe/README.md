# RETVN Frontend

React-based frontend application for the Real Estate Transaction Verification Network (RETVN) platform, integrated with Canton/Daml smart contracts via the Canton JSON API.

## Overview

This application provides a complete user interface for:
- User authentication and registration with W3C Verifiable Credentials
- Transaction submission and verification workflow
- Market data visualization and access tier management
- Admin approval queue for user registrations
- User directory and account management

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Canton JSON API** - Daml ledger integration
- **Daml Codegen** - Type-safe Daml contract bindings

## Project Structure

```
fe/
├── src/
│   ├── components/
│   │   └── Layout.tsx              # Main layout with navigation
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication state management
│   ├── pages/
│   │   ├── Login.tsx               # User login (select existing user)
│   │   ├── Register.tsx            # Registration with credential selection
│   │   ├── Dashboard.tsx           # User dashboard
│   │   ├── SubmitTransaction.tsx   # 3-step transaction submission
│   │   ├── VerifyTransactions.tsx  # Transaction verification interface
│   │   ├── MarketData.tsx          # Market data and pricing tiers
│   │   ├── AdminApprovals.tsx      # Admin approval queue
│   │   └── AdminUsers.tsx          # User directory
│   ├── services/
│   │   └── cantonApi.ts            # Canton JSON API integration
│   ├── types/
│   │   └── canton.ts               # TypeScript types for Canton API
│   ├── App.tsx                     # Main app with routing
│   ├── App.css                     # Global styles
│   ├── config.ts                   # Configuration
│   └── main.tsx                    # Entry point
├── codegen/                        # Daml codegen output
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── README.md                       # This file
```

## Features

### Authentication
- **Login**: Select from existing users (simplified Canton user management)
- **Registration**: Multi-step credential presentation flow
  - Step 1: Connect digital wallet
  - Step 2: Select credentials to present
  - Step 3: Await admin approval

### Transaction Management
- **Submit Transaction**: 3-step form
  - Property information (address, type, size, etc.)
  - Transaction details (price, date, financing)
  - Review and submit
- **Verify Transactions**: Review and verify submitted transactions
  - View transaction details
  - Select verification decision (Confirmed, Disputed, etc.)
  - Add optional notes
  - Submit verification (weighted by role)

### Market Data
- **View Aggregated Data**: Market statistics by postal code
  - Transaction count, median/average prices
  - Price per sqft, days on market
  - Property type distribution
- **Access Tiers**: 4 pricing tiers
  - Public Access (Free, 30 days, aggregates)
  - Basic Report ($9.99, 90 days, aggregates)
  - Professional Report ($49.99, 365 days, individual transactions)
  - Institutional Access ($499/mo, unlimited, API access)

### Admin Interface
- **Approval Queue**: Review credential presentations
  - View submitted credentials
  - Approve or reject registrations
  - Provide rejection reasons
- **User Directory**: Manage registered users
  - Search and filter users
  - View user details and activity
  - Suspend/reactivate accounts

## Setup

### Prerequisites
- Node.js 18+ and npm
- Canton instance running with JSON API on port 7575
- Daml SDK (for codegen)

### Installation

```bash
# Navigate to frontend directory
cd fe

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your Canton JSON API URL if different
```

### Generate Daml TypeScript Bindings

```bash
# From the project root
cd ..
daml build

# Generate TypeScript bindings
cd fe
npm run codegen
```

This generates TypeScript types and functions for all Daml templates in `codegen/`.

### Development

```bash
# Start development server
npm run dev

# Vite will start on http://localhost:3000
# API requests to /v1/* are proxied to Canton JSON API
```

### Build for Production

```bash
npm run build

# Output in dist/
npm run preview  # Preview production build
```

## Canton JSON API Integration

### Configuration

The app connects to Canton JSON API via proxy (see `vite.config.ts`):
- Development: `http://localhost:7575`
- Configure via `VITE_CANTON_API_URL` environment variable

### API Service

`src/services/cantonApi.ts` provides methods for:

```typescript
// Party and user management
allocateParty(displayName: string): Promise<{ party: string }>
createUser(userId: string, primaryParty: string): Promise<{ userId: string }>
getToken(userId: string): Promise<string>

// Contract operations
query<T>(templateId: string, query?: object): Promise<Contract<T>[]>
create<T>(templateId: string, payload: T): Promise<Contract<T>>
exercise<TChoice, TResult>(
  templateId: string,
  contractId: string,
  choice: string,
  argument: TChoice
): Promise<ExerciseResult<TResult>>
```

### Example Usage

```typescript
import { cantonApi } from './services/cantonApi';
import { RegistrationRequest } from '@daml/unlockit-canton-core-ideathon-0.0.1/lib/RETVN/Role';

// Login
const token = await cantonApi.getToken('maria');
cantonApi.setAuth(token, 'maria');

// Query contracts
const requests = await cantonApi.query<RegistrationRequest>(
  'RETVN.Role:RegistrationRequest'
);

// Exercise choice
await cantonApi.exercise(
  'RETVN.Role:RegistrationRequest',
  contractId,
  'ApproveRegistration',
  {}
);
```

## User Flow Examples

### 1. New User Registration

1. User navigates to `/register`
2. Clicks "Connect Wallet" (simulated)
3. Selects credentials to present:
   - Government ID (required)
   - Real Estate License (optional)
   - Brokerage Affiliation (optional)
4. Submits for approval
5. Admin reviews in `/admin/approvals`
6. Admin approves → `UserAccount` contract created
7. User can now login and access platform

### 2. Transaction Submission

1. User logs in (`/login`)
2. Navigates to Submit Transaction (`/submit`)
3. Fills property info (address, type, sqft, etc.)
4. Fills transaction details (price, date, financing)
5. Reviews and submits
6. Creates `TransactionSubmissionProposal`
7. Operator accepts → `TransactionData` contract created

### 3. Transaction Verification

1. Verifier logs in
2. Navigates to Verify Transactions (`/verify`)
3. Selects pending transaction
4. Reviews property and transaction details
5. Selects decision (Confirmed, Disputed, etc.)
6. Adds optional notes
7. Submits verification
8. Trust score updated based on verifier's weight

## Mock Data

Currently uses mock data for demonstration. To integrate with real Canton:

1. Update `cantonApi.ts` methods to use actual Canton JSON API
2. Replace mock data in components with real queries
3. Wire up contract creation/exercise calls
4. Implement WebSocket subscriptions for real-time updates

### Mock Users (Login)

- `operator` - Unlockit Operator
- `maria` - Maria Rodriguez (Realtor Agent)
- `john` - John Doe (Realtor Agent)
- `sarah` - Sarah Chen (Private Citizen)
- `broker_bob` - Bob Smith (Realtor Broker)

## Daml Integration Points

### Templates Used

From `RETVN.Role`:
- `RegistrationRequest` - User registration with credentials
- `UserAccount` - Core user identity
- `TransactionSubmissionRight` - Capability to submit
- `TransactionVerificationRight` - Capability to verify
- `MarketDataAccessRight` - Capability to query data

From `RETVN.Transaction`:
- `TransactionSubmissionProposal` - Proposed transaction
- `TransactionData` - Verified transaction record
- `Verification` - Verification record
- `MarketDataAggregate` - Aggregated statistics

From `W3C.VC`:
- `VerifiableCredential` - W3C credential
- `PresentationReceipt` - Proof of credential presentation
- `CredentialIssuanceRequest` - Request for new credential

### Workflow Integration

```
Frontend                Canton Ledger               Backend
   │                         │                         │
   │  Login (select user)    │                         │
   ├────────────────────────>│  getToken()             │
   │                         │                         │
   │  Register               │                         │
   ├─ Present credentials ──>│  create                 │
   │                         │  PresentationReceipt    │
   │                         │                         │
   │  Admin approves         │                         │
   │                         │<─ exercise              │
   │                         │  ApproveRegistration    │
   │                         │  → UserAccount          │
   │                         │                         │
   │  Submit Transaction     │                         │
   ├────────────────────────>│  create                 │
   │                         │  TransactionSubmission  │
   │                         │  Proposal               │
   │                         │                         │
   │  Operator accepts       │                         │
   │                         │<─ exercise              │
   │                         │  AcceptSubmission       │
   │                         │  → TransactionData      │
   │                         │                         │
   │  Verify Transaction     │                         │
   ├────────────────────────>│  exercise               │
   │                         │  SubmitVerification     │
   │                         │  → updated              │
   │                         │     TransactionData     │
```

## Styling

Custom CSS with:
- Modern, clean design
- Card-based layouts
- Responsive grid system
- Color-coded status badges
- Gradient backgrounds for auth pages
- Consistent spacing and typography

Primary color: `#5850ec` (purple)
Success: `#48bb78` (green)
Warning: `#f6ad55` (orange)
Danger: `#f56565` (red)

## Next Steps

### Immediate
1. Connect to running Canton instance
2. Implement real API calls (replace mock data)
3. Add WebSocket subscriptions for real-time updates
4. Implement proper error handling

### Short-term
1. Add loading states and spinners
2. Implement pagination for lists
3. Add search/filter for transactions
4. Credential verification with issuer signatures
5. File upload for supporting documents

### Long-term
1. Real wallet integration (MetaMask-style)
2. QR code credential presentation
3. Advanced data visualization (charts, graphs)
4. Export functionality (PDF reports)
5. Notification system
6. Mobile responsive optimization

## Troubleshooting

### Canton JSON API not available
- Ensure Canton is running: `canton -c canton-config.conf`
- Check JSON API port: default 7575
- Verify proxy config in `vite.config.ts`

### TypeScript errors from codegen
- Regenerate codegen: `npm run codegen`
- Rebuild Daml: `daml build`
- Clear node_modules and reinstall

### Vite build errors
- Clear cache: `rm -rf node_modules/.vite`
- Rebuild: `npm run build`

## License

See main project LICENSE file.
