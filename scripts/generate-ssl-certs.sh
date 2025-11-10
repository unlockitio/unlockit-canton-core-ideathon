#!/bin/bash
# Generate self-signed SSL certificates for development

set -e

CERT_DIR="docker/nginx/ssl"
DOMAIN="${1:-localhost}"

echo "Generating self-signed SSL certificates for $DOMAIN..."

# Create directory if it doesn't exist
mkdir -p "$CERT_DIR"

# Generate private key
openssl genrsa -out "$CERT_DIR/key.pem" 2048

# Generate certificate signing request
openssl req -new -key "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.csr" \
  -subj "/C=US/ST=California/L=San Francisco/O=Unlockit/OU=RETVN/CN=$DOMAIN"

# Generate self-signed certificate
openssl x509 -req -days 365 -in "$CERT_DIR/cert.csr" \
  -signkey "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem"

# Remove CSR
rm "$CERT_DIR/cert.csr"

echo "✓ SSL certificates generated in $CERT_DIR"
echo ""
echo "IMPORTANT: These are self-signed certificates for development only."
echo "For production, use certificates from a trusted CA (Let's Encrypt, etc.)"
echo ""
echo "Files created:"
echo "  - $CERT_DIR/key.pem  (Private key)"
echo "  - $CERT_DIR/cert.pem (Certificate)"
