# RETVN Frontend - Quick Start Guide

Get the RETVN frontend up and running in minutes.

## Prerequisites

- Node.js 18+ installed
- Canton instance with JSON API running (port 7575)
- Daml project built (`daml build`)

## Installation

```bash
# 1. Navigate to frontend directory
cd /Users/marado/Documents/Unlockit/Code/canton-core-ideathon/unlockit-canton-core-ideathon/fe

# 2. Install dependencies
npm install

# 3. Generate Daml TypeScript bindings
npm run codegen

# 4. Create environment file (optional - uses defaults)
cp .env.example .env
```

## Running the Application

```bash
# Start development server
npm run dev

# Application will be available at:
# http://localhost:3000
```

## First Login

1. Open http://localhost:3000
2. You'll see the login page
3. Select a user from the dropdown:
   - `operator` - Unlockit Operator (admin)
   - `maria` - Maria Rodriguez (Realtor Agent)
   - `john` - John Doe (Realtor Agent)
   - `sarah` - Sarah Chen (Private Citizen)
   - `broker_bob` - Bob Smith (Realtor Broker)
4. Click "Login"

## Try the Flows

### User Registration Flow

1. Go to http://localhost:3000/register
2. Click "Connect Wallet"
3. Select credentials (Government ID is required)
4. Click "Submit for Approval"
5. See success message

### Submit a Transaction

1. Login as any user
2. Navigate to "Submit Transaction"
3. Fill out the 3-step form:
   - Step 1: Property Info
   - Step 2: Transaction Details
   - Step 3: Review & Submit
4. Submit transaction

### Verify a Transaction

1. Login as a user with verification rights (not Private Citizen)
2. Navigate to "Verify Transactions"
3. Select a pending transaction
4. Choose verification decision
5. Add optional notes
6. Submit verification

### View Market Data

1. Navigate to "Market Data"
2. Enter a postal code (e.g., 94102)
3. View aggregated statistics
4. Click "View Pricing Tiers" to see access levels

### Admin Functions

1. Login as `operator`
2. Navigate to "Admin" > "Registration Approvals"
3. Review pending registrations
4. Approve or reject users
5. Go to "View All Users" to see user directory

## Project Structure

```
src/
├── components/       # Reusable components
├── context/          # React context providers
├── pages/            # Page components (routes)
├── services/         # API integration
├── types/            # TypeScript types
├── App.tsx           # Main app with routing
├── App.css           # Global styles
└── main.tsx          # Entry point
```

## Available Pages

- `/login` - User login
- `/register` - New user registration
- `/` - Dashboard (after login)
- `/submit` - Submit new transaction
- `/verify` - Verify transactions
- `/market-data` - Market data and pricing
- `/admin/approvals` - Admin approval queue
- `/admin/users` - User directory

## Mock Data vs Real Canton

Currently the app uses **mock data** for demonstration. To connect to real Canton:

1. Ensure Canton JSON API is running on port 7575
2. Update `src/services/cantonApi.ts` to make real API calls
3. Replace mock data arrays in components with Canton queries
4. Wire up contract creation and exercise calls

## Development Tips

### Hot Module Replacement
Vite provides fast HMR - just save files and see changes instantly.

### TypeScript Errors
If you see TypeScript errors from codegen:
```bash
npm run codegen  # Regenerate bindings
```

### Clear Cache
If you encounter build issues:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Output will be in `dist/` directory.

## Next Steps

1. Connect to real Canton instance
2. Implement actual API calls
3. Add WebSocket subscriptions for real-time updates
4. Customize styling to match your brand
5. Add more features based on requirements

## Getting Help

- See full README.md for detailed documentation
- Check Canton JSON API docs for ledger integration
- Review Daml codegen output in `codegen/` for contract types

## Common Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
vite --port 3001
```

**Canton API not reachable**
- Check Canton is running
- Verify JSON API is on port 7575
- Check proxy config in `vite.config.ts`

**TypeScript errors**
- Ensure Daml project is built: `daml build`
- Regenerate codegen: `npm run codegen`
- Restart dev server

Enjoy building with RETVN! 🏠
