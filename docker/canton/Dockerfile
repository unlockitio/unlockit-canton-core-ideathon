# Canton Dockerfile
FROM eclipse-temurin:17-jdk-jammy

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Download and install Canton
ARG CANTON_VERSION=2.8.0
WORKDIR /opt
RUN wget https://www.canton.io/releases/canton-open-source-${CANTON_VERSION}.tar.gz && \
    tar -xzf canton-open-source-${CANTON_VERSION}.tar.gz && \
    mv canton-open-source-${CANTON_VERSION} canton && \
    rm canton-open-source-${CANTON_VERSION}.tar.gz

# Create Canton directories
RUN mkdir -p /canton/config /canton/init /canton/data /canton/dars

# Copy configuration files
COPY config/* /canton/config/
COPY init/* /canton/init/

# Set permissions
RUN chmod -R 755 /canton

WORKDIR /canton

# Expose ports
# 5011 - Admin API
# 5021 - Ledger API
# 7575 - JSON API
EXPOSE 5011 5021 7575

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:5011/health || exit 1

# Start Canton with configuration
CMD ["/opt/canton/bin/canton", "daemon", "-c", "/canton/config/canton.conf"]
