# RETVN Docker - Quick Start

Get the entire RETVN platform running with Docker in under 5 minutes.

## Prerequisites

- Docker Desktop 20.10+ or Docker Engine with Docker Compose
- 8GB RAM available for Docker
- 10GB disk space

## One-Command Start

```bash
make quickstart
```

This will:
1. Build the Daml project
2. Generate TypeScript bindings
3. Install frontend dependencies
4. Build all Docker images
5. Start all services

Then wait 60 seconds and visit: **http://localhost:3000**

## Manual Steps (if Make is not available)

```bash
# 1. Build Daml
daml build

# 2. Generate codegen
cd fe && npm run codegen && cd ..

# 3. Install frontend deps
cd fe && npm install && cd ..

# 4. Create environment file
cp .env.example .env

# 5. Build Docker images
docker-compose build

# 6. Start services
docker-compose up -d

# 7. Check status
docker-compose ps
```

## Access the Application

After services start (wait ~60 seconds):

- **Frontend**: http://localhost:3000
- **Canton Admin API**: http://localhost:5011
- **JSON API**: http://localhost:7575
- **PostgreSQL**: localhost:5432

## Login

Use one of the pre-configured users:

- `operator` - Unlockit Operator (admin)
- `maria` - Maria Rodriguez (Realtor Agent)
- `john` - John Doe (Realtor Agent)
- `sarah` - Sarah Chen (Private Citizen)
- `broker_bob` - Bob Smith (Realtor Broker)

## Common Commands

```bash
# View logs
make logs-f

# Check service health
make health

# Stop services
make down

# Restart services
make restart

# Reset everything
make clean && make up
```

## What's Running?

| Service | Purpose | Port |
|---------|---------|------|
| PostgreSQL | Database | 5432 |
| Canton | Daml ledger | 5011, 5021 |
| JSON API | HTTP API | 7575 |
| Frontend | React UI | 3000 |

## Troubleshooting

### Services not starting?

```bash
# Check logs
make logs-f

# Check status
make status

# Try restarting
make restart
```

### Port conflicts?

Edit `docker-compose.yml` and change the port mappings:

```yaml
ports:
  - "3001:80"  # Changed from 3000:80
```

### Out of disk space?

```bash
# Clean up Docker
make prune
```

### Database errors?

```bash
# Reset database (WARNING: deletes all data)
make db-reset

# Then restart
make up
```

## Next Steps

1. Read full documentation: [DOCKER.md](./DOCKER.md)
2. Learn about the API: [fe/README.md](./fe/README.md)
3. Understand Daml contracts: [daml/RETVN/README.md](./daml/RETVN/README.md)

## Stopping

```bash
# Stop services (keeps data)
make down

# Stop and remove data
make clean
```

## Production Deployment

For production with SSL:

```bash
# Generate SSL certificates (development)
./scripts/generate-ssl-certs.sh

# Or place real certificates in docker/nginx/ssl/

# Start with Nginx proxy
make prod
```

Access at: https://localhost

## Getting Help

```bash
# Show all available commands
make help

# Check service health
make health

# View specific service logs
make logs-canton
make logs-frontend
make logs-db
```

## Architecture

```
Browser
   ↓
Frontend (React) :3000
   ↓
JSON API (Daml HTTP) :7575
   ↓
Canton (Ledger) :5021
   ↓
PostgreSQL :5432
```

That's it! You now have a fully functional RETVN platform running locally in Docker.
