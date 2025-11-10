# RETVN Frontend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Application                        │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │    Pages     │  │  Components  │  │   Context    │     │ │
│  │  │              │  │              │  │              │     │ │
│  │  │ • Login      │  │ • Layout     │  │ • AuthContext│     │ │
│  │  │ • Register   │  │ • Navbar     │  │              │     │ │
│  │  │ • Dashboard  │  │              │  │              │     │ │
│  │  │ • Submit     │  │              │  │              │     │ │
│  │  │ • Verify     │  │              │  │              │     │ │
│  │  │ • MarketData │  │              │  │              │     │ │
│  │  │ • Admin      │  │              │  │              │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │              React Router v6                          │  │ │
│  │  │  /login  /register  /  /submit  /verify  /admin      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           Canton API Service Layer                    │  │ │
│  │  │                                                        │  │ │
│  │  │  • allocateParty()                                    │  │ │
│  │  │  • createUser()                                       │  │ │
│  │  │  • getToken()                                         │  │ │
│  │  │  • query<T>()                                         │  │ │
│  │  │  • create<T>()                                        │  │ │
│  │  │  • exercise<TChoice, TResult>()                       │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────┬─────────────────────────────────────┘ │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                     Vite Dev Server (Dev)                            │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Proxy Configuration                        │   │
│  │                                                                │   │
│  │  /v1/* ────────────► http://localhost:7575                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ HTTP/JSON
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                      Canton JSON API                                  │
│                      (Port 7575)                                      │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  POST /v1/query        - Query contracts                      │   │
│  │  POST /v1/create       - Create contracts                     │   │
│  │  POST /v1/exercise     - Exercise choices                     │   │
│  │  POST /v1/parties/allocate - Allocate parties                 │   │
│  │  POST /v1/user/create  - Create users                         │   │
│  │  POST /v1/user/token   - Get auth tokens                      │   │
│  │  WS   /v1/stream/query - Subscribe to contract updates        │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                      Canton Ledger                                    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Daml Smart Contracts                       │   │
│  │                                                                │   │
│  │  RETVN.Role                  RETVN.Transaction                │   │
│  │  ├── UserAccount             ├── TransactionData              │   │
│  │  ├── RegistrationRequest     ├── TransactionSubmission...    │   │
│  │  ├── TransactionSubmission...├── Verification                 │   │
│  │  ├── TransactionVerification...└── MarketDataAggregate       │   │
│  │  └── MarketDataAccessRight                                    │   │
│  │                                                                │   │
│  │  W3C.VC                                                        │   │
│  │  ├── VerifiableCredential                                     │   │
│  │  ├── PresentationReceipt                                      │   │
│  │  └── CredentialIssuanceRequest                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Login (Public Route)
│       ├── Register (Public Route)
│       └── Layout (Private Routes)
│           ├── Navbar
│           │   ├── Brand Link
│           │   ├── Navigation Menu
│           │   └── User Info + Logout
│           └── Outlet (Page Content)
│               ├── Dashboard
│               │   ├── Stats Cards
│               │   ├── Quick Actions
│               │   └── Recent Activity
│               ├── SubmitTransaction
│               │   ├── Step Indicator
│               │   ├── Step 1: Property Info Form
│               │   ├── Step 2: Transaction Details Form
│               │   └── Step 3: Review & Submit
│               ├── VerifyTransactions
│               │   ├── Pending Transactions List
│               │   └── Transaction Detail + Verification Form
│               ├── MarketData
│               │   ├── Search Bar
│               │   ├── Market Overview Stats
│               │   ├── Property Type Distribution
│               │   └── Pricing Tiers
│               ├── AdminApprovals
│               │   ├── Pending Requests List
│               │   └── Request Detail + Approval Form
│               └── AdminUsers
│                   ├── Search & Filter
│                   ├── User Table
│                   └── User Detail Panel
```

## Data Flow

### Authentication Flow

```
┌──────┐                ┌──────────┐              ┌────────┐
│ User │                │ Frontend │              │ Canton │
└──┬───┘                └────┬─────┘              └───┬────┘
   │                         │                        │
   │  Select User            │                        │
   ├────────────────────────►│                        │
   │                         │  getToken(userId)      │
   │                         ├───────────────────────►│
   │                         │                        │
   │                         │  Return JWT Token      │
   │                         │◄───────────────────────┤
   │                         │                        │
   │                         │  Set Auth State        │
   │                         │  Store in localStorage │
   │  Redirect to Dashboard  │                        │
   │◄────────────────────────┤                        │
   │                         │                        │
```

### Registration Flow

```
┌──────┐         ┌──────────┐         ┌──────────┐         ┌────────┐
│ User │         │ Frontend │         │ Operator │         │ Canton │
└──┬───┘         └────┬─────┘         └────┬─────┘         └───┬────┘
   │                  │                     │                   │
   │ Connect Wallet   │                     │                   │
   ├─────────────────►│                     │                   │
   │                  │                     │                   │
   │ Select Credentials                     │                   │
   ├─────────────────►│                     │                   │
   │                  │                     │                   │
   │ Submit           │                     │                   │
   ├─────────────────►│                     │                   │
   │                  │  create             │                   │
   │                  │  RegistrationRequest│                   │
   │                  ├─────────────────────┴──────────────────►│
   │                  │                     │                   │
   │                  │                     │  Query Pending    │
   │                  │                     │  Requests         │
   │                  │                     ├──────────────────►│
   │                  │                     │                   │
   │                  │                     │  Return Requests  │
   │                  │                     │◄──────────────────┤
   │                  │                     │                   │
   │                  │                     │  Review           │
   │                  │                     │  Credentials      │
   │                  │                     │                   │
   │                  │                     │  exercise         │
   │                  │                     │  ApproveRegistration
   │                  │                     ├──────────────────►│
   │                  │                     │                   │
   │                  │                     │  UserAccount      │
   │                  │                     │  Created          │
   │                  │                     │◄──────────────────┤
   │                  │                     │                   │
   │  Notification    │                     │                   │
   │◄─────────────────┴─────────────────────┤                   │
   │                  │                     │                   │
```

### Transaction Submission Flow

```
┌──────┐         ┌──────────┐         ┌──────────┐         ┌────────┐
│ User │         │ Frontend │         │ Operator │         │ Canton │
└──┬───┘         └────┬─────┘         └────┬─────┘         └───┬────┘
   │                  │                     │                   │
   │ Fill Form        │                     │                   │
   │ (3 steps)        │                     │                   │
   ├─────────────────►│                     │                   │
   │                  │                     │                   │
   │ Submit           │                     │                   │
   ├─────────────────►│                     │                   │
   │                  │  exercise           │                   │
   │                  │  RequestSubmissionRight                 │
   │                  ├─────────────────────┴──────────────────►│
   │                  │                     │                   │
   │                  │  TransactionSubmissionRight             │
   │                  │◄────────────────────┬──────────────────┤
   │                  │                     │                   │
   │                  │  exercise           │                   │
   │                  │  DelegateSubmission │                   │
   │                  ├─────────────────────┴──────────────────►│
   │                  │                     │                   │
   │                  │  create             │                   │
   │                  │  TransactionSubmissionProposal          │
   │                  ├─────────────────────┴──────────────────►│
   │                  │                     │                   │
   │                  │                     │  exercise         │
   │                  │                     │  AcceptSubmission │
   │                  │                     ├──────────────────►│
   │                  │                     │                   │
   │                  │                     │  TransactionData  │
   │                  │                     │  Created          │
   │                  │                     │◄──────────────────┤
   │  Success         │                     │                   │
   │◄─────────────────┴─────────────────────┤                   │
   │                  │                     │                   │
```

### Verification Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────┐
│Verifier  │     │ Frontend │     │ Operator │     │ Canton │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └───┬────┘
     │                │                 │               │
     │ Select Transaction               │               │
     ├───────────────►│                 │               │
     │                │  query          │               │
     │                │  TransactionData│               │
     │                ├─────────────────┴──────────────►│
     │                │                 │               │
     │                │  Return Transaction             │
     │                │◄────────────────┬──────────────┤
     │                │                 │               │
     │ Submit Verification              │               │
     ├───────────────►│                 │               │
     │                │  exercise       │               │
     │                │  DelegateVerification           │
     │                ├─────────────────┴──────────────►│
     │                │                 │               │
     │                │                 │  exercise     │
     │                │                 │  SubmitVerification
     │                │                 ├──────────────►│
     │                │                 │               │
     │                │                 │  Updated      │
     │                │                 │  TransactionData
     │                │                 │  (new trust score)
     │                │                 │◄──────────────┤
     │  Success       │                 │               │
     │◄───────────────┴─────────────────┤               │
     │                │                 │               │
```

## State Management

### AuthContext State

```typescript
{
  party: string | null,         // Canton party ID
  userId: string | null,        // User identifier
  token: string | null,         // JWT token
  isAuthenticated: boolean,     // Computed from token
  login: (userId) => Promise<void>,
  logout: () => void,
  isLoading: boolean           // Initial auth check
}
```

### Local Storage

```
localStorage
├── party      - Canton party ID
├── userId     - User identifier
└── token      - JWT authentication token
```

## API Service Methods

### cantonApi.ts

```typescript
class CantonApiService {
  // Authentication
  setAuth(token: string, party: string): void
  getParty(): string | null
  clearAuth(): void

  // Party & User Management
  allocateParty(displayName: string, identifierHint?: string): Promise<{ party: string }>
  createUser(userId: string, primaryParty: string): Promise<{ userId: string }>
  getToken(userId: string): Promise<string>

  // Contract Operations
  query<T>(templateId: string, query?: Record<string, any>): Promise<Contract<T>[]>
  create<T>(templateId: string, payload: T): Promise<Contract<T>>
  exercise<TChoice, TResult>(
    templateId: string,
    contractId: string,
    choice: string,
    argument: TChoice
  ): Promise<ExerciseResult<TResult>>

  // Internal
  private request<T>(endpoint: string, options?: RequestInit): Promise<T>
}
```

## Routing Structure

```
/                           (Public)
├── /login                  (Public)
├── /register               (Public)
└── /                       (Protected - requires auth)
    ├── / (Dashboard)
    ├── /submit
    ├── /verify
    ├── /market-data
    └── /admin
        ├── /admin/approvals
        └── /admin/users
```

## Build Pipeline

```
Source Code (TypeScript/React)
         │
         ├── TypeScript Compiler
         │   └── Type checking
         │
         ├── Vite Build
         │   ├── Tree shaking
         │   ├── Code splitting
         │   ├── Asset optimization
         │   └── Minification
         │
         └── Output
             ├── dist/
             │   ├── index.html
             │   ├── assets/
             │   │   ├── index.[hash].js
             │   │   ├── index.[hash].css
             │   │   └── vendor.[hash].js
             │   └── ...
             └── Ready for deployment
```

## Development Workflow

```
1. Edit Source Files
   ↓
2. Vite HMR (Hot Module Replacement)
   ↓
3. Browser Auto-refresh
   ↓
4. See Changes Immediately

For Daml Changes:
1. Edit Daml Files
   ↓
2. daml build
   ↓
3. npm run codegen
   ↓
4. Restart dev server
   ↓
5. New types available
```

## Security Architecture

### Authentication
- JWT token stored in localStorage
- Token included in all API requests via Authorization header
- Protected routes check authentication status
- Automatic redirect to login if not authenticated

### Authorization
- Role-based access control via Daml templates
- Canton enforces contract-level permissions
- UI hides/disables features based on role
- Backend validates all actions via signatories

### Data Privacy
- Observer pattern limits contract visibility
- Only authorized parties see sensitive data
- Market data has tiered access levels
- Credentials presented selectively

## Performance Considerations

### Code Splitting
- React.lazy() for route-based splitting
- Vendor bundle separate from app code
- Chunks loaded on-demand

### Caching
- API responses cached where appropriate
- LocalStorage for authentication state
- Browser caching for static assets

### Optimization
- Tree shaking removes unused code
- Minification reduces bundle size
- Image optimization (if images added)
- Lazy loading for large lists

## Error Handling

```
API Call
   │
   ├── Success
   │   └── Update UI State
   │
   └── Error
       ├── Network Error
       │   └── Show "Connection Failed" message
       ├── Auth Error (401)
       │   └── Clear auth & redirect to login
       ├── Validation Error (400)
       │   └── Show field-specific errors
       └── Server Error (500)
           └── Show "Something went wrong" message
```

## Future Scalability

### WebSocket Integration
- Real-time contract updates
- Live transaction status changes
- Instant verification notifications

### Caching Layer
- React Query for data fetching
- Optimistic updates
- Background refetching

### State Management
- Consider Redux/Zustand for complex state
- Normalized data structures
- Computed selectors

### Testing
- Unit tests (Jest + React Testing Library)
- Integration tests (MSW for API mocking)
- E2E tests (Playwright/Cypress)

This architecture provides a solid foundation for a production-ready application that can scale with the RETVN platform's growth.
