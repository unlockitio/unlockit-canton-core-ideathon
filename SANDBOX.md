# RETVN Sandbox Mode

Lightweight development setup using Daml Sandbox instead of full Canton infrastructure.

## What is Sandbox Mode?

Sandbox mode uses the Daml Sandbox, an in-memory ledger designed for rapid development and testing. It's simpler and faster than the full Canton setup.

### Differences from Full Canton Setup

| Feature | Full Canton | Sandbox Mode |
|---------|-------------|--------------|
| Storage | PostgreSQL | In-memory |
| Architecture | Domain + Participant | Single sandbox process |
| Startup Time | ~60 seconds | ~30 seconds |
| Data Persistence | Persistent | Lost on restart |
| Best For | Production, testing | Development, demos |
| Resource Usage | Higher | Lower |

## Quick Start

Get the sandbox running in one command:

```bash
make sandbox-quickstart
```

Wait 30 seconds, then visit: **http://localhost:3000**

## Manual Setup

If you prefer step-by-step:

```bash
# 1. Build Daml and frontend (first time only)
make setup

# 2. Build sandbox Docker images
make sandbox-build

# 3. Start sandbox services
make sandbox-up

# 4. Wait for services to be ready (~30 seconds)
sleep 30

# 5. Initialize parties and users
make sandbox-init
```

Access at: **http://localhost:3000**

## Available Commands

### Starting and Stopping

```bash
make sandbox-up          # Start sandbox mode
make sandbox-down        # Stop sandbox mode
make sandbox-restart     # Restart sandbox mode
```

### Initialization

```bash
make sandbox-init        # Create parties and users
```

This creates the following users:
- `operator` - Unlockit Operator (admin)
- `maria` - Maria Rodriguez (Realtor Agent)
- `john` - John Doe (Realtor Agent)
- `sarah` - Sarah Chen (Private Citizen)
- `broker_bob` - Bob Smith (Realtor Broker)

### Monitoring

```bash
make sandbox-logs        # View all logs
make sandbox-logs-ledger # View sandbox ledger logs
make sandbox-logs-api    # View JSON API logs
make sandbox-logs-frontend # View frontend logs
make sandbox-health      # Check service health
```

### Maintenance

```bash
make sandbox-clean       # Remove containers (data is lost)
make sandbox-build       # Rebuild images
```

## Services

### Daml Sandbox
- **Container**: retvn-sandbox
- **Port**: 6865 (Ledger API)
- **Purpose**: In-memory Daml ledger
- **Data**: Lost on restart

### JSON API
- **Container**: retvn-sandbox-json-api
- **Port**: 7575
- **Purpose**: HTTP/WebSocket API for Daml
- **Connects to**: Sandbox on port 6865

### Frontend
- **Container**: retvn-sandbox-frontend
- **Port**: 3000
- **Purpose**: React web application
- **Proxies**: API calls to JSON API

## Architecture

```
Browser
   ↓
Frontend (React) :3000
   ↓ (HTTP/WebSocket)
JSON API :7575
   ↓ (gRPC Ledger API)
Daml Sandbox :6865
   ↓
In-Memory Storage
```

## When to Use Sandbox Mode

### ✅ Use Sandbox Mode For:
- **Development**: Rapid iteration on Daml contracts
- **Testing**: Quick test cycles without database setup
- **Demos**: Fast startup for demonstrations
- **Learning**: Experimenting with Daml features
- **CI/CD**: Automated testing pipelines

### ❌ Don't Use Sandbox Mode For:
- **Production**: No data persistence
- **Performance Testing**: In-memory only, not representative
- **Multi-Party Scenarios**: No domain/participant separation
- **Data Preservation**: All data lost on restart

## Development Workflow

### Typical Development Cycle

```bash
# 1. Start sandbox
make sandbox-up

# 2. Initialize users (first time only)
make sandbox-init

# 3. Make changes to Daml contracts
vim daml/RETVN/Transaction.daml

# 4. Rebuild Daml
daml build

# 5. Restart sandbox to load new DAR
make sandbox-restart

# 6. Wait for services
sleep 30

# 7. Re-initialize users
make sandbox-init

# 8. Test changes in browser
# Visit http://localhost:3000
```

### Frontend Development

```bash
# Start sandbox
make sandbox-up
make sandbox-init

# Run frontend locally with hot reload
cd fe
npm run dev

# Frontend will be at http://localhost:5173
# With hot module replacement
```

### Testing

```bash
# Run Daml tests
daml test

# Start sandbox for integration testing
make sandbox-up
make sandbox-init

# Run frontend tests (if configured)
cd fe && npm test
```

## Configuration

### Environment Variables

The sandbox services use these environment variables (configured in docker-compose.sandbox.yml):

```yaml
# Sandbox
SANDBOX_PORT=6865

# JSON API
LEDGER_HOST=daml-sandbox
LEDGER_PORT=6865
HTTP_PORT=7575

# Frontend
VITE_CANTON_API_URL=http://localhost:7575
VITE_CANTON_WS_URL=ws://localhost:7575
```

### DAR Loading

DAR files are automatically loaded from `.daml/dist/`:

```yaml
volumes:
  - ./.daml/dist:/dars
```

The sandbox starts with:
```bash
daml sandbox --port 6865 --ledgerid retvn-sandbox /dars/*.dar
```

## Troubleshooting

### Services Not Starting

```bash
# Check logs
make sandbox-logs

# Check if ports are in use
lsof -i :6865  # Sandbox
lsof -i :7575  # JSON API
lsof -i :3000  # Frontend
```

### Sandbox Fails to Start

```bash
# Rebuild from scratch
make sandbox-clean
make sandbox-build
make sandbox-up
```

### DAR Not Loading

```bash
# Ensure DAR is built
daml build
ls -la .daml/dist/

# Restart sandbox
make sandbox-restart
```

### Users Not Created

```bash
# Re-run initialization
make sandbox-init

# Check logs for errors
make sandbox-logs-api
```

### Frontend Can't Connect

```bash
# Check JSON API is running
make sandbox-health

# Check API directly
curl http://localhost:7575/v1/health

# Check frontend logs
make sandbox-logs-frontend
```

### Port Conflicts

Edit `docker-compose.sandbox.yml`:

```yaml
services:
  daml-sandbox:
    ports:
      - "6866:6865"  # Changed from 6865
  json-api:
    ports:
      - "7576:7575"  # Changed from 7575
  frontend:
    ports:
      - "3001:80"    # Changed from 3000
```

## Migrating Between Modes

### From Full Canton to Sandbox

```bash
# Stop full Canton
make down

# Start sandbox
make sandbox-up
make sandbox-init
```

**Note**: Data is not migrated. Sandbox starts fresh.

### From Sandbox to Full Canton

```bash
# Stop sandbox
make sandbox-down

# Start full Canton
make up
```

**Note**: Full Canton has persistent storage. Data survives restarts.

## Advanced Usage

### Custom Initialization

Edit `docker/sandbox/init-sandbox.sh` to add custom parties or users:

```bash
# Add a new party and user
custom_party=$(allocate_party "Custom_Party_Name")
create_user "custom_user" "$custom_party"
```

### Running Multiple Sandboxes

You can run multiple isolated sandboxes by:

1. Copy `docker-compose.sandbox.yml` to `docker-compose.sandbox2.yml`
2. Change all port mappings
3. Change network name
4. Start with: `docker-compose -f docker-compose.sandbox2.yml up -d`

### Accessing Ledger API Directly

The sandbox exposes gRPC Ledger API on port 6865:

```bash
# Using grpcurl
grpcurl -plaintext localhost:6865 list

# Using Daml Script
daml script --ledger-host localhost --ledger-port 6865
```

### Custom DAR Files

To load additional DAR files:

```bash
# Copy DAR to dist directory
cp /path/to/custom.dar .daml/dist/

# Restart sandbox
make sandbox-restart
```

## Performance

### Resource Usage

Typical resource consumption:

- **CPU**: 0.5-1.0 cores (idle)
- **Memory**: 1-2 GB total
  - Sandbox: 512 MB - 1 GB
  - JSON API: 256 MB - 512 MB
  - Frontend: 50 MB - 100 MB
- **Disk**: ~500 MB (images)

### Startup Time

- **Initial build**: 3-5 minutes
- **Subsequent starts**: 20-30 seconds
- **DAR loading**: 5-10 seconds

### Comparison

| Metric | Full Canton | Sandbox |
|--------|-------------|---------|
| Build Time | 5-8 min | 3-5 min |
| Startup | 60 sec | 30 sec |
| Memory | 3-4 GB | 1-2 GB |
| Disk | 1-2 GB | 500 MB |

## Security

### Development Only

The sandbox setup includes:

```bash
--allow-insecure-tokens
```

This is **NOT SECURE** and should **NEVER** be used in production.

### No Authentication

Party allocation and user creation have no authentication in sandbox mode.

### In-Memory Only

All data is lost when the sandbox stops. No persistent sensitive data.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test with Sandbox

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Daml
        run: |
          curl -sSL https://get.daml.com/ | sh

      - name: Build Daml
        run: daml build

      - name: Start Sandbox
        run: make sandbox-up

      - name: Wait for services
        run: sleep 30

      - name: Initialize
        run: make sandbox-init

      - name: Run tests
        run: daml test

      - name: Stop sandbox
        run: make sandbox-down
```

## Comparison with Full Setup

### File Differences

**Sandbox** (`docker-compose.sandbox.yml`):
- 3 services (sandbox, json-api, frontend)
- No PostgreSQL
- No Canton domain/participant
- Simpler configuration

**Full Canton** (`docker-compose.yml`):
- 5 services (postgres, canton, json-api, frontend, nginx)
- PostgreSQL for persistence
- Domain and participant nodes
- Production-ready configuration

### Command Differences

| Action | Full Canton | Sandbox |
|--------|-------------|---------|
| Start | `make up` | `make sandbox-up` |
| Stop | `make down` | `make sandbox-down` |
| Logs | `make logs-f` | `make sandbox-logs` |
| Init | Automatic | `make sandbox-init` |
| Clean | `make clean` | `make sandbox-clean` |

## FAQ

**Q: Will my data persist across restarts?**
A: No. Sandbox uses in-memory storage. All data is lost when stopped.

**Q: Can I use sandbox for production?**
A: No. Sandbox is for development only. Use full Canton for production.

**Q: How do I switch between sandbox and full Canton?**
A: Just stop one and start the other. They use the same ports, so can't run simultaneously.

**Q: Why do I need to run `make sandbox-init` separately?**
A: Party allocation requires the services to be fully started, which takes time.

**Q: Can I load custom DAR files?**
A: Yes. Place them in `.daml/dist/` and restart the sandbox.

**Q: How do I reset everything?**
A: `make sandbox-down && make sandbox-up` - all data is cleared automatically.

## Next Steps

- Try the full Canton setup: [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)
- Learn about the Daml contracts: [daml/RETVN/README.md](./daml/RETVN/README.md)
- Explore the frontend: [fe/README.md](./fe/README.md)
- Read the full Docker guide: [DOCKER.md](./DOCKER.md)

---

**Quick Start**: `make sandbox-quickstart`

**Need Help?**: `make help`

**Check Health**: `make sandbox-health`
