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

Before running, you need to configure the Canton package ID in `src/main/resources/application.properties`:

```properties
canton.api.package-id=<YOUR_PACKAGE_ID>
```

To find your package ID:

1. Build your Daml project: `daml build`
2. The `.dar` file will contain the package ID
3. You can also query it from Canton JSON API or check the codegen output

## Running the Application

### Development Mode

```bash
./mvnw quarkus:dev
```

The API will be available at `http://localhost:9090`

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
- Must contain a `sub` (subject) claim with the party ID
- Signature is **NOT** validated (unrealistic API for development)
- Should have `aud` claim set to `"daml_ledger_api"` (not enforced)

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
- `401 Unauthorized`: Missing subject claim in token
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
3. API extracts party ID from token's `sub` claim
4. API calls Canton JSON API at `localhost:7575/v2/state/active-contracts`
5. Canton API filters for `RETVN.Role:UserAccount` templates for the party
6. API returns Canton's response to the client

## Canton JSON API Request Format

The API constructs this request body:

```json
{
  "filter": {
    "filtersByParty": {
      "<PARTY_ID>": {
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
  "verbose": false,
  "activeAtOffset": "0"
}
```

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
1. UserAccount contracts exist for the party ID
2. Package ID is correct
3. Party ID in JWT token matches contracts
4. Canton API is accessible and responding

## License

MIT
