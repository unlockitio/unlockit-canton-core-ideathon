# Canton UserAccount API

A simple Quarkus-based Java API that proxies requests to the Canton JSON API to retrieve UserAccount contracts.

## Features

- **Unrealistic Bearer Token Authentication**: Validates JWT token format only (not signature or content)
- **Canton JSON API Integration**: Calls `/v2/state/active-contracts` endpoint
- **CORS Enabled**: For easy frontend integration
- **Simple Proxy**: Returns Canton API responses directly

## Requirements

- Java 17+
- Maven 3.8+
- Canton JSON API running on `localhost:7575`

## Configuration

Before running, you need to configure the Canton package ID and operator party ID in `src/main/resources/application.properties`:

```properties
canton.api.package-id=<YOUR_PACKAGE_ID>
canton.api.operator-party-id=<YOUR_OPERATOR_PARTY_ID>
```

To find your package ID:

1. Build your Daml project: `daml build`
2. The `.dar` file will contain the package ID
3. You can also query it from Canton JSON API or check the codegen output

To find your operator party ID:

1. Check the Canton sandbox logs when it starts
2. Query the `/v2/parties` endpoint
3. The operator party is created by the seedTestCredentials script

## Running the Application

### Development Mode

```bash
./mvnw quarkus:dev
```

The API will be available at `http://localhost:9090`

### API Documentation

When running with Docker Compose, two Swagger UI instances are available:

**Backend API (UserAccount API):**
```
http://localhost:8082
```

**Canton JSON Ledger API:**
```
http://localhost:8081
```

The Swagger UI instances allow you to:
- View all available endpoints
- See request/response schemas
- Try out API calls directly from the browser
- Generate JWT tokens for testing (Backend API)
- Explore the full Canton JSON API capabilities

### Building for Production

```bash
./mvnw clean package
java -jar target/quarkus-app/quarkus-run.jar
```

## API Endpoint

### GET /api/user-accounts

Retrieves UserAccount contracts for the authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**JWT Token Requirements (Format Only):**
- Must be a valid JWT structure (3 parts separated by dots)
- Signature is **NOT** validated (unrealistic API for development)
- Token is used for authentication only, not for party filtering
- The API always queries using the operator party ID from configuration

**Example Request:**
```bash
# First, get a token from the frontend or create one manually
TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0UGFydHkiLCJhdWQiOiJkYW1sX2xlZGdlcl9hcGkiLCJleHAiOjE3MzQzMzk2MDB9.example"

curl -X GET http://localhost:9090/api/user-accounts \
  -H "Authorization: Bearer $TOKEN"
```

**Success Response (200 OK):**
```json
{
  "result": [
    {
      "contractId": "...",
      "payload": {
        "operator": "...",
        "user": "...",
        "role": "...",
        ...
      },
      ...
    }
  ]
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid Authorization header
- `401 Unauthorized`: Invalid JWT token format
- `500 Internal Server Error`: Operator party ID not configured
- `500 Internal Server Error`: Error calling Canton API

## Token Generation (Frontend)

The frontend generates tokens using this code (from `fe/src/config.ts`):

```javascript
import { SignJWT } from 'jose'

async function makeLocalToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode('mydevsecretkeythatshouldbelongenough123')
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setAudience('daml_ledger_api')
    .setExpirationTime('2h')
    .sign(secret)
  return jwt
}
```

## How It Works

1. Client sends request with Bearer token
2. API validates token format (3-part JWT structure)
3. API calls Canton JSON API at `localhost:7575/v2/state/active-contracts` using the operator party ID
4. Canton API filters for `RETVN.Role:UserAccount` templates visible to the operator
5. API returns all UserAccount contracts (operator can see all accounts as a signatory)
6. API returns Canton's response to the client

**Note**: The operator party can see all UserAccount contracts because it's a signatory on all of them (required by the UserAccount template design).

## Canton JSON API Request Format

The API constructs this request body:

```json
{
  "filter": {
    "filtersByParty": {
      "<OPERATOR_PARTY_ID>": {
        "cumulative": [
          {
            "identifierFilter": {
              "TemplateFilter": {
                "value": {
                  "templateId": "<PACKAGE_ID>:RETVN.Role:UserAccount",
                  "includeCreatedEventBlob": true
                }
              }
            }
          }
        ]
      }
    }
  },
  "verbose": true,
  "activeAtOffset": "<LEDGER_OFFSET>"
}
```

Where:
- `<OPERATOR_PARTY_ID>` is from `canton.api.operator-party-id` config
- `<PACKAGE_ID>` is from `canton.api.package-id` config
- `<LEDGER_OFFSET>` is fetched from `/v2/state/ledger-end` endpoint

## Development Notes

- **Security Warning**: This is an **unrealistic API** for development/demo purposes only
- Token signature validation is **disabled**
- Token expiration is **not checked**
- Use proper JWT validation in production environments
- The API trusts the party ID from the token without verification

## Troubleshooting

### Package ID Not Configured

```
IllegalStateException: Package ID not configured
```

**Solution**: Set `canton.api.package-id` in `application.properties`

### Connection Refused to Canton API

```
Error calling Canton API: Connection refused
```

**Solution**: Ensure Canton JSON API is running on `localhost:7575`

### No Contracts Returned

Check:
1. UserAccount contracts exist on the ledger (run seedTestCredentials script)
2. Package ID is correct in `canton.api.package-id`
3. Operator party ID is correct in `canton.api.operator-party-id`
4. Canton API is accessible and responding

### Operator Party ID Not Configured

```
IllegalStateException: Operator party ID not configured
```

**Solution**: Set `canton.api.operator-party-id` in `application.properties`

## License

MIT
