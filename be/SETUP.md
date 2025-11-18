# Setup Guide

## Finding the Package ID

Before running the API, you need to configure the Canton package ID. Here's how to find it:

### Option 1: From the .dar file

1. Build your Daml project:
   ```bash
   cd /path/to/canton-core-ideathon/unlockit-canton-core-ideathon
   daml build
   ```

2. The package ID is embedded in the `.dar` file name or you can inspect it:
   ```bash
   # The .dar file should be in .daml/dist/
   unzip -l .daml/dist/unlockit-canton-core-ideathon-0.0.1.dar | grep "package"
   ```

### Option 2: From Canton JSON API

1. Ensure Canton is running with your DAR loaded
2. Query the packages endpoint:
   ```bash
   curl http://localhost:7575/v2/packages
   ```

3. Look for the package with name "unlockit-canton-core-ideathon"

### Option 3: From the frontend codegen

1. Check the generated code in `fe/codegen/`:
   ```bash
   cat fe/codegen/package.json
   ```

2. The package ID might be visible in the generated TypeScript files

### Option 4: Using daml damlc inspect

```bash
cd /path/to/canton-core-ideathon/unlockit-canton-core-ideathon
daml damlc inspect .daml/dist/unlockit-canton-core-ideathon-0.0.1.dar | grep "package-id"
```

## Configuring the API

Once you have the package ID, update `src/main/resources/application.properties`:

```properties
canton.api.package-id=<YOUR_PACKAGE_ID_HERE>
```

Example:
```properties
canton.api.package-id=abc123def456-unlockit-canton-core-ideathon-0.0.1
```

## Running the API

```bash
./mvnw quarkus:dev
```

The API will be available at `http://localhost:9090/api/user-accounts`
