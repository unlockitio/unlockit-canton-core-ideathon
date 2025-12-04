# RETVN Utility Scripts

Helper scripts for setting up, configuring, and seeding the RETVN platform.

## Scripts Overview

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `update-operator-id.sh` | Updates backend config with Canton operator party ID | After starting Canton for the first time |
| `seed-credentials.sh` | Seeds test W3C credentials (alice, bob) | Testing registration flow |
| `seed-transactions.sh` | Seeds 100 sample transactions | Testing/demos with realistic data |
| `generate-ssl-certs.sh` | Generates self-signed SSL certificates | HTTPS setup (dev only) |
| `wait-for-canton.sh` | Waits for Canton to be ready | Docker orchestration (automatic) |

## Quick Reference

### update-operator-id.sh
```bash
./scripts/update-operator-id.sh
```
Fetches operator party ID from Canton and updates `be/src/main/resources/application.properties`. Restart backend after running.

**Requirements**: Canton running, Python 3

---

### seed-credentials.sh
```bash
./scripts/seed-credentials.sh
```
Creates test credentials:
- **alice**: Government ID + Real Estate License + Brokerage Affiliation (RealtorAgent)
- **bob**: Government ID only (PrivateCitizen)

**Requirements**: Canton running, Daml CLI, DAR file built

---

### seed-transactions.sh
```bash
./scripts/seed-transactions.sh
```
Creates 100 transactions with 14 test users across all roles (5 agents, 3 brokers, 2 masters, 3 notaries, 1 tax authority, 10 citizens). Realistic pricing, property types, and dates.

**Requirements**: Canton running, Daml CLI, DAR file built

---

### generate-ssl-certs.sh
```bash
./scripts/generate-ssl-certs.sh [domain]
```
Generates self-signed SSL certificates in `docker/nginx/ssl/` (365-day validity, 2048-bit RSA).

**⚠️ Development only** - use trusted CA certificates in production.

**Requirements**: OpenSSL

---

### wait-for-canton.sh
```bash
./scripts/wait-for-canton.sh <host> <port> <command...>
```
Used by Docker Compose to wait for Canton health endpoint before starting dependent services.

**Requirements**: netcat, curl