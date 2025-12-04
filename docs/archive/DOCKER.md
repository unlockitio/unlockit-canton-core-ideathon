# RETVN Docker Setup

Complete Docker-based deployment for the Real Estate Transaction Verification Network (RETVN) platform.

## Overview

This Docker setup provides a complete, production-ready environment with:

- **PostgreSQL** - Database for Canton ledger storage
- **Canton** - Daml ledger with participant and domain nodes
- **JSON API** - HTTP/WebSocket API for Daml contracts
- **React Frontend** - User interface
- **Nginx** - Reverse proxy (production mode)

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ http://localhost:3000
       │
┌──────▼──────┐
│  Frontend   │ :3000 (Nginx serving React)
│   (React)   │
└──────┬──────┘
       │ /v1/*
       │
┌──────▼──────┐
│  JSON API   │ :7575
│   (Daml)    │
└──────┬──────┘
       │ gRPC
       │
┌──────▼──────┐
│   Canton    │ :5011 (Admin), :5021 (Ledger)
│  Participant │
└──────┬──────┘
       │ SQL
       │
┌──────▼──────┐
│ PostgreSQL  │ :5432
└─────────────┘
```

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Make (optional, for convenience commands)

### First Time Setup

```bash
# 1. Clone and navigate to project
cd unlockit-canton-core-ideathon

# 2. Run setup (builds Daml, generates codegen, installs deps)
make setup

# 3. Build Docker images
make build

# 4. Start services
make up

# 5. Wait for services to initialize (~60 seconds)
# Then visit: http://localhost:3000
```

**Alternative (without Make):**

```bash
# Build Daml
daml build

# Generate TypeScript bindings
cd fe && npm run codegen && cd ..

# Install frontend dependencies
cd fe && npm install && cd ..

# Create environment file
cp .env.example .env

# Build and start
docker-compose build
docker-compose up -d
```

## Services

### PostgreSQL (postgres)

**Purpose**: Database for Canton ledger storage

**Ports**:
- `5432` - PostgreSQL

**Environment Variables**:
- `POSTGRES_DB=canton`
- `POSTGRES_USER=canton`
- `POSTGRES_PASSWORD=canton_password`

**Volumes**:
- `postgres_data` - Persistent database storage
- `./docker/postgres/init.sql` - Initialization script

**Access**:
```bash
# Connect to database
make db-shell
# or
docker-compose exec postgres psql -U canton -d canton
```

### Canton (canton)

**Purpose**: Daml ledger with participant and domain nodes

**Ports**:
- `5011` - Admin API
- `5021` - Ledger API
- `7575` - JSON API (proxied)

**Configuration**:
- `./docker/canton/config/canton.conf` - Main configuration
- `./docker/canton/init/bootstrap.canton` - Bootstrap script

**DAR Files**:
- Automatically loaded from `.daml/dist/*.dar`

**Logs**:
```bash
make logs-canton
# or
docker-compose logs -f canton
```

**Console Access**:
```bash
make canton-console
# or
docker-compose exec canton /opt/canton/bin/canton -c /canton/config/canton.conf
```

### JSON API (json-api)

**Purpose**: HTTP/WebSocket API for Daml contracts

**Ports**:
- `7575` - HTTP API

**Endpoints**:
- `POST /v1/query` - Query contracts
- `POST /v1/create` - Create contracts
- `POST /v1/exercise` - Exercise choices
- `POST /v1/parties/allocate` - Allocate parties
- `POST /v1/user/create` - Create users
- `POST /v1/user/token` - Get auth tokens
- `WS /v1/stream/query` - Subscribe to contract updates

**Health Check**:
```bash
curl http://localhost:7575/v1/health
```

### Frontend (frontend)

**Purpose**: React-based user interface

**Ports**:
- `3000` - HTTP (via Nginx)

**Build**:
- Multi-stage Docker build
- Stage 1: Build with Node.js
- Stage 2: Serve with Nginx

**Environment Variables**:
- `VITE_CANTON_API_URL=http://localhost:7575`
- `VITE_CANTON_WS_URL=ws://localhost:7575`

**Access**:
```
http://localhost:3000
```

### Nginx (nginx) - Production Only

**Purpose**: Reverse proxy with SSL support

**Ports**:
- `80` - HTTP (redirects to HTTPS)
- `443` - HTTPS

**Features**:
- SSL/TLS termination
- Rate limiting
- CORS headers
- WebSocket support
- Static file caching
- Security headers

**Start**:
```bash
make prod
```

## Make Commands

Full list of available commands:

```bash
# Setup & Build
make setup       # First-time setup
make build       # Build Docker images
make rebuild     # Rebuild from scratch

# Running
make up          # Start all services
make down        # Stop all services
make restart     # Restart all services
make status      # Show service status

# Development
make logs        # View all logs
make logs-f      # Follow all logs
make logs-canton # Canton logs only
make logs-frontend # Frontend logs only
make logs-db     # Database logs only
make logs-api    # JSON API logs only

# Database
make db-shell    # Open PostgreSQL shell
make db-reset    # Reset database (WARNING: deletes all data)

# Maintenance
make clean       # Remove containers and volumes
make clean-all   # Remove everything
make prune       # Clean up unused Docker resources

# Testing
make test        # Run Daml tests
make test-fe     # Run frontend tests

# Production
make prod        # Start with Nginx SSL
make prod-down   # Stop production mode

# Utilities
make health      # Check all service health
make quickstart  # Complete setup and start
```

## Data Persistence

### Volumes

Two Docker volumes persist data:

1. **postgres_data** - PostgreSQL database
   - Contains all Canton ledger data
   - Survives container restarts
   - Reset with `make db-reset`

2. **canton_data** - Canton node data
   - Contains node configurations
   - Contains party/user mappings
   - Survives container restarts

### Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U canton canton > backup.sql

# Restore database
docker-compose exec -T postgres psql -U canton canton < backup.sql
```

## Configuration

### Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit values as needed:

```env
# PostgreSQL
POSTGRES_DB=canton
POSTGRES_USER=canton
POSTGRES_PASSWORD=change_this_in_production

# Canton
CANTON_DB_HOST=postgres
CANTON_DB_PORT=5432

# Frontend
VITE_CANTON_API_URL=http://localhost:7575
VITE_CANTON_WS_URL=ws://localhost:7575
```

### Canton Configuration

Edit `docker/canton/config/canton.conf` to customize:

- Storage settings
- Network ports
- Protocol versions
- Security settings

### Nginx Configuration

For production, edit `docker/nginx/nginx.conf`:

- SSL certificates
- Rate limiting
- CORS policies
- Security headers

## Initialization

### Bootstrap Script

On first start, Canton runs `docker/canton/init/bootstrap.canton`:

1. Connects participant to domain
2. Uploads DAR files from `.daml/dist/`
3. Creates operator party
4. Creates test users:
   - `operator` (Unlockit_Operator)
   - `maria` (Maria_Rodriguez)
   - `john` (John_Doe)
   - `sarah` (Sarah_Chen)
   - `broker_bob` (Bob_Smith)

### Manual Initialization

```bash
# Run bootstrap script manually
make init-canton
```

## Development Workflow

### Making Changes to Daml Contracts

```bash
# 1. Edit Daml files
vim daml/RETVN/Role.daml

# 2. Build Daml
daml build

# 3. Regenerate TypeScript bindings
cd fe && npm run codegen && cd ..

# 4. Restart Canton to load new DAR
make deploy-dar

# 5. Restart frontend to use new types
docker-compose restart frontend
```

### Making Changes to Frontend

```bash
# 1. Edit frontend files
vim fe/src/pages/Dashboard.tsx

# 2. Rebuild frontend image
docker-compose build frontend

# 3. Restart frontend
docker-compose restart frontend
```

**Tip**: For faster development, run frontend locally:

```bash
cd fe
npm run dev
```

Then access at `http://localhost:3000` with hot reload.

## Troubleshooting

### Services Won't Start

```bash
# Check service status
make status

# Check logs
make logs-f

# Check specific service
make logs-canton
make logs-db
```

### Canton Connection Errors

```bash
# Check Canton health
curl http://localhost:5011/health

# Check Canton logs
make logs-canton

# Restart Canton
docker-compose restart canton
```

### Database Connection Issues

```bash
# Check PostgreSQL
make db-shell

# Check if Canton can connect
docker-compose exec canton psql -h postgres -U canton -d canton
```

### Frontend Can't Connect to API

```bash
# Check JSON API health
curl http://localhost:7575/v1/health

# Check network connectivity
docker-compose exec frontend ping json-api

# Check environment variables
docker-compose exec frontend env | grep VITE
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5432
lsof -i :7575

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Out of Memory

```bash
# Increase Docker memory limit
# Docker Desktop > Settings > Resources > Memory

# Check current usage
docker stats

# Clean up unused resources
make prune
```

### Slow Performance

```bash
# Check resource usage
docker stats

# Optimize PostgreSQL
# Edit docker/postgres/init.sql with better values

# Use production build for frontend
docker-compose build --build-arg NODE_ENV=production frontend
```

## Production Deployment

### SSL Certificates

1. Generate certificates:

```bash
# Self-signed (development)
mkdir -p docker/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/nginx/ssl/key.pem \
  -out docker/nginx/ssl/cert.pem

# Let's Encrypt (production)
# Use certbot to generate certificates
```

2. Place certificates in `docker/nginx/ssl/`

3. Start with production profile:

```bash
make prod
```

### Environment Variables

Update `.env` for production:

```env
POSTGRES_PASSWORD=<strong_random_password>
VITE_CANTON_API_URL=https://your-domain.com
VITE_CANTON_WS_URL=wss://your-domain.com
```

### Security Checklist

- [ ] Change default database password
- [ ] Use SSL certificates (not self-signed)
- [ ] Enable Canton authentication
- [ ] Configure firewall rules
- [ ] Set up log rotation
- [ ] Enable monitoring
- [ ] Configure backups
- [ ] Review Nginx rate limits
- [ ] Update security headers

### Monitoring

```bash
# View resource usage
docker stats

# Check health endpoints
curl http://localhost:5011/health  # Canton
curl http://localhost:7575/v1/health  # JSON API
curl http://localhost:3000/health  # Frontend

# View logs
make logs-f
```

## Scaling

### Horizontal Scaling

Currently single-node setup. For production scaling:

1. **Database**: Use managed PostgreSQL (AWS RDS, Azure Database)
2. **Canton**: Add more participants
3. **JSON API**: Run multiple instances with load balancer
4. **Frontend**: Serve from CDN

### Vertical Scaling

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  canton:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

## Advanced Topics

### Custom Bootstrap

Edit `docker/canton/init/bootstrap.canton` to:

- Create additional parties
- Upload specific DAR files
- Initialize contracts
- Configure domain settings

### Network Configuration

All services communicate via `retvn-network` bridge network.

To use external Canton:

```yaml
services:
  json-api:
    environment:
      LEDGER_HOST: external-canton.example.com
      LEDGER_PORT: 5021
```

### Multiple Environments

Use different compose files:

```bash
# Development
docker-compose -f docker-compose.yml up

# Staging
docker-compose -f docker-compose.staging.yml up

# Production
docker-compose -f docker-compose.prod.yml up
```

## Support

For issues:

1. Check logs: `make logs-f`
2. Check health: `make health`
3. Check status: `make status`
4. Reset database: `make db-reset`
5. Clean restart: `make clean && make up`

## Summary

This Docker setup provides:

✅ Complete RETVN stack in containers
✅ PostgreSQL with persistence
✅ Canton with automatic DAR loading
✅ JSON API for HTTP/WebSocket access
✅ React frontend with Nginx
✅ Production-ready with SSL
✅ Make commands for easy management
✅ Automatic initialization
✅ Health checks and monitoring

Ready to deploy locally or to cloud infrastructure!
