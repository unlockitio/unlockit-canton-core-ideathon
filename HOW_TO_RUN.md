# RETVN Development Setup

Quick reference for starting and stopping the development environment.

## Starting the Development Environment

### 1. Start Canton and Docker Services
```bash
docker compose -f docker-compose.sandbox.yml up -d
```

Wait ~10 seconds for Canton to initialize and seed test data.

### 2. Update Operator Party ID
```bash
./scripts/update-operator-id.sh
```

This fetches the current operator party ID from Canton and updates the backend configuration.

### 3. Start Backend
```bash
./be/mvnw quarkus:dev
```

Backend will start on **http://localhost:9090**

### 4. Access Frontend
Frontend is already running via Docker on **http://localhost:3000**

## Stopping the Development Environment

### Stop Backend
Press `Ctrl+C` in the backend terminal, or:
```bash
pkill -f "quarkus:dev"
```

### Stop Docker Services
```bash
docker compose -f docker-compose.sandbox.yml down
```

## Full Restart

If you need to completely restart with a fresh ledger:

```bash
# Stop everything
docker compose -f docker-compose.sandbox.yml down
pkill -f "quarkus:dev"

# Start everything
docker compose -f docker-compose.sandbox.yml up -d
./scripts/update-operator-id.sh
cd be && ./mvnw quarkus:dev
```

## Service URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:9090
- **Canton JSON API**: http://localhost:8080
- **Canton gRPC**: http://localhost:6865
- **Swagger UI (Canton)**: http://localhost:8081
- **Swagger UI (Backend)**: http://localhost:8082

## Useful Commands

### View Logs
```bash
# Backend logs (if running in background)
tail -f /tmp/backend.log

# Canton logs
docker logs retvn-canton-sandbox -f

# Frontend logs
docker logs retvn-frontend -f
```

### Check Service Status
```bash
# Canton health
curl http://localhost:8080/livez

# Backend health
curl http://localhost:9090/q/health

# List all parties
curl http://localhost:8080/v2/parties

# List user accounts
curl -H "Authorization: Bearer <token>" http://localhost:9090/api/user-accounts
```

## Troubleshooting

### No users showing up in login?

Run the update script and restart the backend:
```bash
./scripts/update-operator-id.sh
pkill -f "quarkus:dev"
cd be && ./mvnw quarkus:dev
```

### Canton not responding?

Check if Canton is running:
```bash
docker ps | grep canton
docker logs retvn-canton-sandbox
```

### Backend won't start?

Make sure port 9090 is not in use:
```bash
lsof -i :9090
```
