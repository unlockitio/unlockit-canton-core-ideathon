-- PostgreSQL initialization script for Canton

-- Create databases if they don't exist
SELECT 'CREATE DATABASE canton'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'canton')\gexec

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE canton TO canton;

-- Connect to canton database
\c canton

-- Create schemas for Canton
CREATE SCHEMA IF NOT EXISTS participant1;
CREATE SCHEMA IF NOT EXISTS domain1;

-- Grant permissions on schemas
GRANT ALL PRIVILEGES ON SCHEMA participant1 TO canton;
GRANT ALL PRIVILEGES ON SCHEMA domain1 TO canton;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA participant1 GRANT ALL PRIVILEGES ON TABLES TO canton;
ALTER DEFAULT PRIVILEGES IN SCHEMA domain1 GRANT ALL PRIVILEGES ON TABLES TO canton;

-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Performance tuning for Canton
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';
