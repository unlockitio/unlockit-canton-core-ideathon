# Docker Setup for RETVN

Docker-based deployment for the Real Estate Transaction Verification Network (RETVN) platform.

## Quick Start

```bash
# Start all services (Canton sandbox, backend, frontend)
docker compose -f docker-compose.sandbox.yml up -d

# Access the application
open http://localhost:3000
```

Wait ~30 seconds for Canton to initialize and seed test data.

---

## Services

The sandbox setup runs 6 containers:

### canton-sandbox
- **Purpose**: In-memory Daml ledger for development
- **Ports**: 6865 (Ledger API), 7575 (JSON API)
- **Storage**: In-memory (lost on restart)
- **Auto-seeding**: Test credentials and 100 sample transactions on startup

### nginx-cors
- **Purpose**: CORS proxy for Canton JSON API
- **Port**: 8080
- **Proxies**: Canton JSON API (7575) with CORS headers

### frontend
- **Purpose**: React web application
- **Port**: 3000
- **Build**: Vite + TypeScript

### backend
- **Purpose**: Quarkus Java API with automation processors
- **Port**: 9090
- **Features**: User accounts, rankings, automations

### swagger-ui-canton
- **Purpose**: Canton JSON API documentation
- **Port**: 8081

### swagger-ui-backend
- **Purpose**: Backend API documentation
- **Port**: 8082

---

## Common Operations

**Start services**:
```bash
docker compose -f docker-compose.sandbox.yml up -d
```

**Stop services**:
```bash
docker compose -f docker-compose.sandbox.yml down
```

**View logs**:
```bash
docker compose -f docker-compose.sandbox.yml logs -f
docker logs retvn-canton-sandbox -f      # Canton only
docker logs retvn-backend -f             # Backend only
```

**Restart services**:
```bash
docker compose -f docker-compose.sandbox.yml restart
```

**Clean up** (removes containers and volumes):
```bash
docker compose -f docker-compose.sandbox.yml down -v
```

---

## Architecture

```
Browser → Frontend (React) :3000
           ↓
        Backend API :9090
           ↓
        Nginx CORS Proxy :8080
           ↓
        Canton JSON API :7575
           ↓ (gRPC)
        Canton Sandbox :6865
           ↓
        In-Memory Storage
```

---

## Directory Structure

```
docker/
├── sandbox/              # Canton sandbox configuration
│   └── Dockerfile        # Daml SDK image
└── README.md             # This file
```

**Note**: Other directories (`canton/`, `json-api/`, `nginx/`, `postgres/`) are for full Canton mode (not used in sandbox).

---

## Ports

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 3000 | React web app |
| Canton Sandbox (Ledger) | 6865 | Daml gRPC API |
| Canton Sandbox (JSON) | 7575 | Daml HTTP API |
| Nginx CORS Proxy | 8080 | Canton JSON API with CORS |
| Swagger Canton | 8081 | Canton API docs |
| Swagger Backend | 8082 | Backend API docs |
| Backend | 9090 | Quarkus REST API |

---