FROM eclipse-temurin:17-jdk-jammy

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    netcat \
    && rm -rf /var/lib/apt/lists/*

ARG DAML_VERSION=2.8.0

RUN wget https://github.com/digital-asset/daml/releases/download/v${DAML_VERSION}/daml-sdk-${DAML_VERSION}-linux.tar.gz && \
    tar -xzf daml-sdk-${DAML_VERSION}-linux.tar.gz -C /opt && \
    rm daml-sdk-${DAML_VERSION}-linux.tar.gz

ENV PATH="/opt/sdk-${DAML_VERSION}/daml:${PATH}"
ENV DAML_HOME="/opt/sdk-${DAML_VERSION}"

WORKDIR /sandbox

RUN mkdir -p /dars

EXPOSE 6865

HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=30s \
  CMD curl -f http://localhost:6865/readyz || exit 1

CMD ["sh", "-c", "daml sandbox --port 6865 --ledgerid retvn-sandbox /dars/*.dar"]
