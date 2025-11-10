#!/bin/bash
# Wait for Canton to be ready before starting dependent services

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for Canton at $host:$port..."

while ! nc -z "$host" "$port"; do
  echo "Canton is unavailable - sleeping"
  sleep 2
done

echo "Canton is up - checking health endpoint..."

max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if curl -f "http://$host:5011/health" 2>/dev/null; then
    echo "Canton is healthy!"
    break
  fi

  attempt=$((attempt + 1))
  echo "Canton health check failed (attempt $attempt/$max_attempts) - waiting..."
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "Canton failed to become healthy after $max_attempts attempts"
  exit 1
fi

echo "Executing command: $cmd"
exec $cmd
