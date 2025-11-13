-- PostgreSQL initialization script for Canton

-- Create separate databases for each Canton component
CREATE DATABASE canton_sequencer;
CREATE DATABASE canton_unlockit_participant;
CREATE DATABASE canton_mediator;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE canton_sequencer TO canton;
GRANT ALL PRIVILEGES ON DATABASE canton_unlockit_participant TO canton;
GRANT ALL PRIVILEGES ON DATABASE canton_mediator TO canton;

-- Connect to canton_sequencer database
\c canton_sequencer

-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to canton_unlockit_participant database
\c canton_unlockit_participant

-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to canton_mediator database
\c canton_mediator

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
