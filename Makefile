# RETVN Makefile - Common Docker operations

.PHONY: help build up down restart logs clean test deploy

# Default target
help:
	@echo "RETVN Docker Commands"
	@echo "====================="
	@echo ""
	@echo "Setup & Build:"
	@echo "  make setup       - First-time setup (build Daml, codegen, install deps)"
	@echo "  make build       - Build all Docker images"
	@echo "  make rebuild     - Rebuild all images from scratch"
	@echo ""
	@echo "Running:"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make status      - Show service status"
	@echo ""
	@echo "Development:"
	@echo "  make logs        - View logs from all services"
	@echo "  make logs-f      - Follow logs from all services"
	@echo "  make logs-canton - View Canton logs"
	@echo "  make logs-frontend - View frontend logs"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell    - Open PostgreSQL shell"
	@echo "  make db-reset    - Reset database"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean       - Remove containers and volumes"
	@echo "  make clean-all   - Remove everything (containers, volumes, images)"
	@echo "  make prune       - Clean up unused Docker resources"
	@echo ""
	@echo "Testing:"
	@echo "  make test        - Run Daml tests"
	@echo "  make test-fe     - Run frontend tests"
	@echo ""
	@echo "Production:"
	@echo "  make prod        - Start in production mode (with Nginx)"
	@echo "  make prod-down   - Stop production mode"
	@echo ""
	@echo "Sandbox Mode (Lightweight Development):"
	@echo "  make sandbox-build    - Build sandbox Docker images"
	@echo "  make sandbox-up       - Start sandbox mode (no PostgreSQL)"
	@echo "  make sandbox-down     - Stop sandbox mode"
	@echo "  make sandbox-restart  - Restart sandbox mode"
	@echo "  make sandbox-init     - Initialize sandbox with parties/users"
	@echo "  make sandbox-logs     - View sandbox logs"
	@echo "  make sandbox-clean    - Clean sandbox containers"
	@echo "  make sandbox-quickstart - Quick start sandbox mode"

# Setup - first time only
setup:
	@echo "Building Daml project..."
	daml build
	@echo "Generating TypeScript bindings..."
	cd fe && npm run codegen
	@echo "Installing frontend dependencies..."
	cd fe && npm install
	@echo "Creating .env file..."
	cp .env.example .env
	@echo "Setup complete!"

# Build all images
build:
	@echo "Building Docker images..."
	docker-compose build

# Rebuild from scratch
rebuild:
	@echo "Rebuilding Docker images from scratch..."
	docker-compose build --no-cache

# Start services
up:
	@echo "Starting RETVN services..."
	docker-compose up -d
	@echo ""
	@echo "Services starting... This may take a minute."
	@echo "Access the application at: http://localhost:3000"
	@echo "Canton Admin API: http://localhost:5011"
	@echo "JSON API: http://localhost:7575"
	@echo ""
	@echo "Run 'make logs-f' to follow logs"
	@echo "Run 'make status' to check service health"

# Stop services
down:
	@echo "Stopping RETVN services..."
	docker-compose down

# Restart services
restart: down up

# Show service status
status:
	@docker-compose ps

# View logs
logs:
	docker-compose logs

# Follow logs
logs-f:
	docker-compose logs -f

# Canton logs
logs-canton:
	docker-compose logs -f canton

# Frontend logs
logs-frontend:
	docker-compose logs -f frontend

# PostgreSQL logs
logs-db:
	docker-compose logs -f postgres

# JSON API logs
logs-api:
	docker-compose logs -f json-api

# Open database shell
db-shell:
	docker-compose exec postgres psql -U canton -d canton

# Reset database
db-reset:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker volume rm unlockit-canton-core-ideathon_postgres_data unlockit-canton-core-ideathon_canton_data || true; \
		echo "Database reset complete. Run 'make up' to start fresh."; \
	fi

# Clean up
clean:
	@echo "Removing containers and volumes..."
	docker-compose down -v

# Clean everything
clean-all:
	@echo "WARNING: This will remove all containers, volumes, and images!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v --rmi all; \
		echo "Cleanup complete."; \
	fi

# Prune unused resources
prune:
	docker system prune -f
	docker volume prune -f

# Run Daml tests
test:
	@echo "Running Daml tests..."
	daml test

# Run frontend tests (if configured)
test-fe:
	@echo "Running frontend tests..."
	cd fe && npm test

# Production mode with Nginx
prod:
	@echo "Starting RETVN in production mode..."
	docker-compose --profile production up -d
	@echo ""
	@echo "Production services started!"
	@echo "Access the application at: https://localhost"

# Stop production mode
prod-down:
	docker-compose --profile production down

# Initialize Canton with bootstrap script
init-canton:
	@echo "Initializing Canton..."
	docker-compose exec canton /opt/canton/bin/canton \
		-c /canton/config/canton.conf \
		--bootstrap /canton/init/bootstrap.canton

# Execute Canton console
canton-console:
	docker-compose exec canton /opt/canton/bin/canton \
		-c /canton/config/canton.conf

# Build and upload DAR
deploy-dar:
	@echo "Building and deploying DAR..."
	daml build
	docker-compose restart canton
	@echo "DAR deployed. Canton will load it on startup."

# Health check all services
health:
	@echo "Checking service health..."
	@echo ""
	@echo "PostgreSQL:"
	@docker-compose exec postgres pg_isready -U canton || echo "  ❌ Not ready"
	@echo ""
	@echo "Canton:"
	@curl -f http://localhost:5011/health 2>/dev/null && echo "  ✅ Healthy" || echo "  ❌ Not healthy"
	@echo ""
	@echo "JSON API:"
	@curl -f http://localhost:7575/v1/health 2>/dev/null && echo "  ✅ Healthy" || echo "  ❌ Not healthy"
	@echo ""
	@echo "Frontend:"
	@curl -f http://localhost:3000/health 2>/dev/null && echo "  ✅ Healthy" || echo "  ❌ Not healthy"

# Quick start - setup and run
quickstart: setup build up
	@echo ""
	@echo "RETVN is starting up!"
	@echo "Please wait about 60 seconds for all services to initialize."
	@echo ""
	@echo "Then visit: http://localhost:3000"
	@echo ""
	@echo "Run 'make logs-f' to watch the logs"
	@echo "Run 'make health' to check service health"

# Sandbox Mode Commands
# Build sandbox images
sandbox-build:
	@echo "Building sandbox Docker images..."
	docker-compose -f docker-compose.sandbox.yml build

# Start sandbox mode
sandbox-up:
	@echo "Starting RETVN in sandbox mode..."
	docker-compose -f docker-compose.sandbox.yml up -d
	@echo ""
	@echo "Sandbox mode starting... This should take about 30 seconds."
	@echo "Access the application at: http://localhost:3000"
	@echo "Daml Sandbox Ledger API: http://localhost:6865"
	@echo "JSON API: http://localhost:7575"
	@echo ""
	@echo "Run 'make sandbox-init' to initialize parties and users"
	@echo "Run 'make sandbox-logs' to follow logs"

# Stop sandbox mode
sandbox-down:
	@echo "Stopping sandbox services..."
	docker-compose -f docker-compose.sandbox.yml down

# Restart sandbox mode
sandbox-restart: sandbox-down sandbox-up

# Initialize sandbox with parties and users
sandbox-init:
	@echo "Initializing sandbox with parties and users..."
	@docker run --rm --network unlockit-canton-core-ideathon_retvn-sandbox-network \
		-e LEDGER_HOST=daml-sandbox \
		-e LEDGER_PORT=6865 \
		-e JSON_API_HOST=json-api \
		-e JSON_API_PORT=7575 \
		--entrypoint /bin/bash \
		-v $(PWD)/docker/sandbox/init-sandbox.sh:/init-sandbox.sh \
		curlimages/curl:latest \
		/init-sandbox.sh

# View sandbox logs
sandbox-logs:
	docker-compose -f docker-compose.sandbox.yml logs -f

# View specific sandbox service logs
sandbox-logs-ledger:
	docker-compose -f docker-compose.sandbox.yml logs -f daml-sandbox

sandbox-logs-api:
	docker-compose -f docker-compose.sandbox.yml logs -f json-api

sandbox-logs-frontend:
	docker-compose -f docker-compose.sandbox.yml logs -f frontend

# Clean sandbox containers
sandbox-clean:
	@echo "Removing sandbox containers..."
	docker-compose -f docker-compose.sandbox.yml down -v

# Check sandbox health
sandbox-health:
	@echo "Checking sandbox service health..."
	@echo ""
	@echo "Daml Sandbox:"
	@curl -f http://localhost:6865/readyz 2>/dev/null && echo "  ✅ Healthy" || echo "  ❌ Not healthy"
	@echo ""
	@echo "JSON API:"
	@curl -f http://localhost:7575/v1/health 2>/dev/null && echo "  ✅ Healthy" || echo "  ❌ Not healthy"
	@echo ""
	@echo "Frontend:"
	@curl -f http://localhost:3000/health 2>/dev/null && echo "  ✅ Healthy" || echo "  ❌ Not healthy"

# Quick start sandbox mode
sandbox-quickstart: setup sandbox-build sandbox-up
	@echo ""
	@echo "Waiting for services to be ready..."
	@sleep 20
	@make sandbox-init
	@echo ""
	@echo "RETVN Sandbox is ready!"
	@echo "Visit: http://localhost:3000"
	@echo ""
	@echo "Run 'make sandbox-logs' to watch the logs"
	@echo "Run 'make sandbox-health' to check service health"
