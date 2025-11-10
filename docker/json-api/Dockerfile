# JSON API Dockerfile
FROM eclipse-temurin:17-jdk-jammy

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Download Daml JSON API
ARG DAML_VERSION=2.8.0
WORKDIR /opt
RUN wget https://github.com/digital-asset/daml/releases/download/v${DAML_VERSION}/daml-sdk-${DAML_VERSION}-linux.tar.gz && \
    tar -xzf daml-sdk-${DAML_VERSION}-linux.tar.gz && \
    rm daml-sdk-${DAML_VERSION}-linux.tar.gz

# Set environment variables
ENV LEDGER_HOST=canton
ENV LEDGER_PORT=5021
ENV HTTP_PORT=7575

# Expose JSON API port
EXPOSE 7575

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD curl -f http://localhost:7575/v1/health || exit 1

# Start JSON API
CMD ["/opt/sdk-${DAML_VERSION}/daml-helper", "json-api", \
     "--ledger-host", "${LEDGER_HOST}", \
     "--ledger-port", "${LEDGER_PORT}", \
     "--http-port", "${HTTP_PORT}", \
     "--allow-insecure-tokens"]
