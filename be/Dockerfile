# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS builder

# Version variables (must be provided via build args)
ARG DAML_SDK_VERSION_SHORT
ARG DAML_SDK_VERSION_FULL
ENV DAML_SDK_VERSION_SHORT=${DAML_SDK_VERSION_SHORT}
ENV DAML_SDK_VERSION_FULL=${DAML_SDK_VERSION_FULL}

# Install necessary dependencies for build
RUN apt-get update && \
    apt-get install -y curl git unzip libtinfo6 bash make && \
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

# Configure environment variables
ENV PATH="/root/.daml/bin:${PATH}"

WORKDIR /build

# Copy Maven wrapper
COPY be/.mvn ./.mvn
COPY be/mvnw ./

# Copy pom.xml and download dependencies (cached layer)
COPY be/pom.xml .
RUN mvn dependency:resolve -B

# Copy source code
COPY be/src ./src

# Copy DAR file for codegen
COPY .daml/dist/*.dar /build/dar/

# Generate sources and compile
RUN mvn clean compile -DskipTests -Ddaml.dar.path=/build/dar/unlockit-canton-core-ideathon-0.0.1.dar

# Pre-warm Maven cache with dev mode dependencies
RUN timeout 60 mvn quarkus:dev -Dquarkus.http.host=0.0.0.0 || true

# Stage 2: Runtime image (using JDK for Quarkus dev mode compilation)
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Install curl and python3 for configuration script
RUN apt-get update && \
    apt-get install -y curl python3 libtinfo6 && \
    rm -rf /var/lib/apt/lists/*

# Copy DAML SDK from builder (needed for Quarkus dev mode codegen)
COPY --from=builder /root/.daml /root/.daml
ENV PATH="/root/.daml/bin:${PATH}"

# Copy Maven cache from builder to avoid re-downloading
COPY --from=builder /root/.m2 /root/.m2

# Copy Maven wrapper and pom.xml
COPY --from=builder /build/.mvn ./.mvn
COPY --from=builder /build/mvnw ./
COPY --from=builder /build/pom.xml ./

# Copy compiled classes and generated sources
COPY --from=builder /build/target ./target

# Copy source (needed for Quarkus dev mode)
COPY be/src ./src

# Copy DAR file to expected location for dev mode codegen (pom.xml uses ${project.basedir}/../.daml/dist)
RUN mkdir -p /.daml/dist
COPY .daml/dist/*.dar /.daml/dist/

# Copy application properties template
COPY be/src/main/resources/application.properties ./src/main/resources/

# Copy configuration script
COPY be/scripts/configureApplicationProps.sh /app/scripts/
RUN chmod +x /app/scripts/configureApplicationProps.sh

# Expose backend port
EXPOSE 9090

# Entry point: configure then run
CMD ["sh", "-c", "/app/scripts/configureApplicationProps.sh && ./mvnw quarkus:dev -Dquarkus.http.host=0.0.0.0 -Dquarkus.analytics.disabled=true"]
