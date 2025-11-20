# RETVN - Real Estate Transaction Verification Network

A decentralized platform for verifying real estate transactions using Canton/Daml smart contracts and W3C Verifiable Credentials.

## Overview

RETVN enables verified real estate professionals, notaries, and government authorities to submit and verify property transaction data, creating a trusted marketplace for real estate transaction intelligence.

### Key Features

- **W3C Verifiable Credentials** - Digital credential presentation for user verification
- **Role-Based Access Control** - Six-tier system (Citizen to Tax Authority)
- **Multi-Party Verification** - Weighted trust scores from multiple verifiers
- **Privacy-Preserving** - Canton's sub-transaction privacy
- **Market Data Marketplace** - Tiered access to aggregated transaction data
- **Admin Controls** - Approval queue and user management

## Quick Start with Docker

### Sandbox Mode (Recommended for Development)

Lightweight setup with in-memory storage:

```bash
make sandbox-quickstart
```

Wait 30 seconds, then visit: **http://localhost:3000**

See [SANDBOX.md](./SANDBOX.md) for details.

### Full Canton Mode (Production)

Complete setup with PostgreSQL persistence:

```bash
make quickstart
```

Wait 60 seconds, then visit: **http://localhost:3000**

See [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) for details.

## Project Structure

```
unlockit-canton-core-ideathon/
├── daml/                       # Daml smart contracts
│   ├── W3C/                    # W3C Verifiable Credentials
│   │   ├── VC.daml            # Core VC implementation
│   │   ├── VCTest.daml        # VC test scenarios
│   │   └── README.md          # VC documentation
│   ├── RETVN/                  # RETVN platform contracts
│   │   ├── Role.daml          # RBAC system
│   │   ├── Transaction.daml   # Transaction verification
│   │   ├── RoleTest.daml      # Integration tests
│   │   └── README.md          # RETVN documentation
│
├── fe/                         # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # State management
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API integration
│   │   └── types/             # TypeScript types
│   ├── codegen/               # Daml TypeScript bindings
│   ├── Dockerfile             # Frontend container
│   └── README.md              # Frontend documentation
│
├── docker/                     # Docker configuration
│   ├── canton/                # Canton setup
│   ├── json-api/              # JSON API setup
│   ├── postgres/              # Database setup
│   └── nginx/                 # Reverse proxy
│
├── scripts/                    # Utility scripts
├── docker-compose.yml         # Main compose file
├── Makefile                   # Common commands
└── DOCKER.md                  # Docker documentation
```

## Tech Stack

### Backend
- **Canton 2.8.0** - Privacy-preserving Daml ledger
- **Daml** - Smart contract language (Haskell-based)
- **PostgreSQL 15** - Ledger storage
- **JSON API** - HTTP/WebSocket access to contracts

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Client-side routing

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **Make** - Task automation

## Documentation

### Getting Started
- [Sandbox Mode](./SANDBOX.md) - Lightweight development setup (recommended)
- [Docker Quick Start](./DOCKER_QUICKSTART.md) - Full Canton setup in 5 minutes
- [Docker Guide](./DOCKER.md) - Complete Docker documentation
- [Frontend README](./fe/README.md) - Frontend development guide

### Smart Contracts
- [W3C VC Documentation](./daml/W3C/README.md) - Verifiable credentials
- [RETVN Documentation](./daml/RETVN/README.md) - Platform contracts
- [Implementation Summary](./daml/IMPLEMENTATION_SUMMARY.md) - Technical details

### Architecture
- [Docker Implementation](./DOCKER_IMPLEMENTATION.md) - Container architecture
- [Frontend Architecture](./fe/ARCHITECTURE.md) - UI architecture
- [Concept Document](./IDEA.md) - Original concept

## Development

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Daml SDK 2.8.0 (for local development)
- Node.js 18+ (for local frontend development)

### Setup

```bash
# First-time setup
make setup

# Build Docker images
make build

# Start services
make up

# View logs
make logs-f

# Check health
make health
```

### Development Workflow

#### Daml Development
```bash
# Edit Daml files
vim daml/RETVN/Role.daml

# Build
daml build

# Test
daml test

# Deploy to Docker
make deploy-dar
```

#### Frontend Development
```bash
# Run locally with hot reload
cd fe
npm run dev

# Or rebuild Docker image
docker-compose build frontend
docker-compose restart frontend
```

### Running Tests

```bash
# Daml tests
make test

# Frontend tests
make test-fe

# All tests
daml test && cd fe && npm test
```

## Available Commands

```bash
make help          # Show all commands
make up            # Start services
make down          # Stop services
make logs-f        # Follow logs
make health        # Check service health
make db-shell      # PostgreSQL shell
make db-reset      # Reset database
make clean         # Remove containers/volumes
make prod          # Start production mode
```

See [Makefile](./Makefile) for complete list.

## Architecture

### System Overview

```
Browser (User)
      ↓
React Frontend :3000
      ↓ (HTTP/WebSocket)
Canton JSON API :7575
      ↓ (gRPC)
Canton Participant :5021
      ↓ (SQL)
PostgreSQL :5432
```

### Smart Contract Flow

```
W3C Credentials → UserAccount → Capability Rights → Delegations → Actions
```

1. User presents W3C credentials
2. Operator creates UserAccount with role
3. User requests capabilities (submit, verify, data access)
4. User delegates capabilities to specific transactions
5. Actions executed with role-based verification weights

## User Roles

| Role | Weight | Can Submit | Can Verify | Institutional Access |
|------|--------|------------|------------|---------------------|
| Private Citizen | 5 | ✅ | ❌ | ❌ |
| Realtor Agent | 8 | ✅ | ✅ | ❌ |
| Realtor Broker | 12 | ✅ | ✅ | ✅ |
| Realtor Master | 15 | ✅ | ✅ | ✅ |
| Notary Public | 25 | ✅ | ✅ | ❌ |
| Tax Authority | 40 | ✅ | ✅ | ✅ |

## Trust Score System

```
Trust Score = Σ(confirmed weights) - Σ(disputed weights × 2)
Clamped to [0, 100]
```

**Transaction Status:**
- **Unverified**: No verifications yet
- **Partially Verified**: 1+ confirmations
- **Fully Verified**: 3+ confirmations from 2+ roles
- **Disputed**: At least one dispute

## Market Data Tiers

| Tier | Price | Time Range | Data Access |
|------|-------|------------|-------------|
| Public Access | Free | 30 days | Aggregates only |
| Basic Report | $9.99 | 90 days | Aggregates only |
| Professional Report | $49.99 | 365 days | Individual transactions |
| Institutional Access | $499/mo | Unlimited | Full API access |

## Production Deployment

### SSL Setup

```bash
# Generate self-signed (development)
./scripts/generate-ssl-certs.sh

# Or place real certificates
cp cert.pem docker/nginx/ssl/
cp key.pem docker/nginx/ssl/
```

### Environment Configuration

```bash
# Copy template
cp .env.example .env

# Edit for production
vim .env
```

### Deploy

```bash
# Production mode
make prod

# Monitor
make health
make logs-f
```

## Security

### Authentication
- JWT tokens from Canton JSON API
- Stored in localStorage
- Included in all API requests

### Authorization
- Canton enforces contract-level permissions
- Signatories control contract creation
- Observers control visibility
- Role-based capability system

### Privacy
- Sub-transaction privacy (Canton)
- Observer pattern limits visibility
- Credential selective disclosure
- Aggregated market data

## API Endpoints

Base URL: `http://localhost:7575`

### Authentication
- `POST /v1/user/token` - Get auth token

### Contracts
- `POST /v1/query` - Query contracts
- `POST /v1/create` - Create contract
- `POST /v1/exercise` - Exercise choice

### Parties & Users
- `POST /v1/parties/allocate` - Allocate party
- `POST /v1/user/create` - Create user

### WebSocket
- `WS /v1/stream/query` - Subscribe to updates

See [Canton JSON API docs](https://docs.daml.com/json-api/) for details.

## Troubleshooting

### Services won't start
```bash
make logs-f      # Check logs
make health      # Check status
make restart     # Restart services
```

### Port conflicts
Edit `docker-compose.yml` port mappings.

### Database issues
```bash
make db-reset    # Reset database
make up          # Restart
```

### Frontend build fails
```bash
cd fe
rm -rf node_modules
npm install
cd ..
make rebuild
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `make test && make test-fe`
5. Submit pull request

## Roadmap

### Current (v1.0)
- ✅ W3C Verifiable Credentials
- ✅ RBAC with 6 roles
- ✅ Transaction submission and verification
- ✅ Trust score calculation
- ✅ Market data with tiered access
- ✅ Docker deployment
- ✅ React frontend

### Upcoming (v1.1)
- [ ] Real wallet integration
- [ ] WebSocket real-time updates
- [ ] Advanced search and filters
- [ ] PDF report generation
- [ ] Email notifications

### Future (v2.0)
- [ ] Zero-knowledge proofs
- [ ] Cross-domain verification
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Machine learning fraud detection

## License

See LICENSE file.

## Support

- **Documentation**: See docs in this repo
- **Issues**: Create GitHub issue
- **Docker**: See [DOCKER.md](./DOCKER.md)
- **Frontend**: See [fe/README.md](./fe/README.md)
- **Daml**: See [daml/RETVN/README.md](./daml/RETVN/README.md)

## Acknowledgments

- Built with [Canton](https://www.canton.io/)
- Smart contracts in [Daml](https://daml.com/)
- W3C Verifiable Credentials standard
- React ecosystem

---

**Ready to run?** → `make quickstart`

**Need help?** → `make help`

**Want details?** → See [DOCKER.md](./DOCKER.md)
