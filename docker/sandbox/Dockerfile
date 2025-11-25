# Multi-stage build for size optimization and security
# Stage 1: Builder - for building and installing DAML SDK
FROM eclipse-temurin:21-jdk-jammy AS builder

# Version variables (must be provided via build args)
ARG DAML_SDK_VERSION_SHORT
ARG DAML_SDK_VERSION_FULL
ENV DAML_SDK_VERSION_SHORT=${DAML_SDK_VERSION_SHORT}
ENV DAML_SDK_VERSION_FULL=${DAML_SDK_VERSION_FULL}

# Install necessary dependencies for build
RUN apt-get update && \
    apt-get install -y curl git unzip libtinfo6 bash make maven && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install DAML SDK
RUN set -eux; \
    URL="https://github.com/digital-asset/daml/releases/download/v${DAML_SDK_VERSION_SHORT}/daml-sdk-${DAML_SDK_VERSION_FULL}-linux.tar.gz"; \
    curl -fSL "$URL" -o /tmp/daml-sdk.tar.gz; \
    mkdir -p /opt/daml-tmp; \
    tar -xzf /tmp/daml-sdk.tar.gz -C /opt/daml-tmp; \
    SDK_DIR=$(find /opt/daml-tmp -maxdepth 1 -type d -iname "*sdk*" -print -quit || true); \
    [ -n "$SDK_DIR" ] || (echo "Extraction failed — contents:" && ls -la /opt/daml-tmp && false); \
    cd "$SDK_DIR"; bash ./install.sh

# Stage 2: Runtime - optimized final image
FROM eclipse-temurin:21-jre-jammy

# Configure environment variables
ENV DAML_SDK_VERSION_SHORT=${DAML_SDK_VERSION_SHORT}
ENV DAML_SDK_VERSION_FULL=${DAML_SDK_VERSION_FULL}
ENV PATH="/home/daml/.daml/bin:${PATH}"

# Install only necessary dependencies for runtime
RUN apt-get update && \
    apt-get install -y curl libtinfo6 bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r daml && useradd -r -g daml -m -s /bin/bash daml

# Copy DAML SDK from builder stage
COPY --from=builder /root/.daml /home/daml/.daml
RUN chown -R daml:daml /home/daml/.daml

# Set working directory
WORKDIR /app

# Create log directory with correct permissions
RUN mkdir -p /app/log && chown -R daml:daml /app

# Switch to non-root user
USER daml

# Optimized healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD daml version > /dev/null 2>&1 || exit 1

# Default command
CMD ["daml", "version"]