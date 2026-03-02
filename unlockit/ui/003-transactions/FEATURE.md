# FEATURE-LM-2: Buy Real Estate Transaction

**Reference:** See @COMMON.md for API documentation and technical context.

## Overview
Implementation of a new transaction type called "Buy Real Estate Transaction" that leverages existing infrastructure from the "Sell Real Estate Transaction" while providing a dynamic and extensible framework for future transaction types.

## Core Requirements

### Transaction Type Framework
- Create extensible backend architecture to support new transaction types beyond current scope
- Abstract transaction type creation for future use cases not currently considered
- Leverage existing "Sell Real Estate Transaction" infrastructure where applicable

### Document Management System
- Enable authorized users to define document types for different transaction categories
- Support dynamic document requirements per transaction type (not limited to Buy transactions)
- Implement flexible document categorization and validation

### Internationalization Support
- Multi-language support for transaction participants from different regions
- Localized document types and transaction workflows
- Language-specific validation and messaging

### User Role Management
- Define user permissions for transaction type configuration
- Role-based access to document type definition capabilities
- Administrative controls for transaction type creation and modification

## Technical Considerations

### Abstraction Requirements
- Abstract all entities following established patterns (e.g., Profile vs User_Profile/Broker_Profile)
- Ensure reusability across different transaction contexts
- Maintain consistency with RESO Data Standard where applicable

### Scalability
- Design for future transaction types beyond real estate
- Modular architecture supporting plugin-style transaction definitions
- Database schema that accommodates varying transaction requirements

## Implementation Areas

1. **Backend Core**
   - Transaction type registry system
   - Document type management API
   - Internationalization framework

2. **User Interface**
   - Transaction type configuration panels
   - Document requirement definition tools
   - Multi-language transaction workflows

3. **Data Model**
   - Flexible transaction schema
   - Document type relationships
   - Localization tables

4. **Integration Points**
   - Existing Sell Real Estate Transaction compatibility
   - RESO Data Standard compliance
   - API endpoint extensions

## Backend Architecture Requirements

### Transaction Type Registry System
- **API Endpoint**: `GET /api/transaction-types` to dynamically fetch available transaction types
- **Transaction Type Model**: Database table with fields like `id`, `name`, `description`, `category`, `is_active`, `display_order`
- **Category Classification**: Logic to separate primary types (Buy, Sell, Rental) from "Other" types

### Dynamic Transaction Type Management
- **CRUD APIs** for transaction types:
  - `POST /api/transaction-types` - Create new transaction types
  - `PUT /api/transaction-types/:id` - Update existing types
  - `DELETE /api/transaction-types/:id` - Deactivate types
- **Admin Interface APIs** for authorized users to manage transaction types
- **Validation Logic** to ensure transaction type consistency

### Role-Based Access Control
- **Permission System** to control who can:
  - View certain transaction types
  - Create new transaction types
  - Configure document requirements per type
- **User Role Validation** middleware for transaction type management endpoints

### Document Type Association System
- **Document Type Model** linked to transaction types
- **API**: `GET /api/transaction-types/:id/document-requirements`
- **Dynamic Document Validation** based on selected transaction type
- **Document Template Management** per transaction type

### Internationalization Infrastructure
- **Localization Tables** for transaction type names and descriptions
- **Language Detection** and content serving based on user locale
- **API**: `GET /api/transaction-types?locale=en-US`
- **Multi-language Document Requirements**

### Workflow Configuration System
- **Workflow Templates** per transaction type
- **Step Configuration APIs** to define transaction-specific workflows
- **State Management** for different transaction type processes
- **Integration Points** with existing Sell Real Estate Transaction workflows

### API Integration Points
- **Route Handler** for `/workflows/create/select-type` endpoint
- **Transaction Creation Logic** that adapts based on selected type
- **Backward Compatibility** with existing transaction types
- **RESO Data Standard Integration** for real estate-specific types

## UI/UX Requirements

### Dynamic Transaction Type Selection Interface
- **2x2 Grid Layout**: Primary transaction types (Buy, Sell, Rental, Other) displayed as uniform squares
- **Expandable "Other" Category**: Additional transaction types (Contract, Recruitment) appear below when selected
- **Visual State Management**: Primary row fades when "Other" is expanded
- **Responsive Design**: Maintains consistency across different screen sizes
- **Consistent Card Sizing**: All transaction type cards maintain identical dimensions (300px × 180px)

### Consolidated Menu Structure
- **Transaction Navigation**: Sidebar menu item with hover submenu for quick filtering by transaction type
- **Unified Transaction Management**: Contracts integrated as transaction type rather than separate menu
- **Organization Configuration**: Dedicated administrative interface for system configuration

## Organization Configuration System

### Administrative Menu Structure
Suggested organization under "**Transaction Management**" section in the organization dashboard:

#### Core Configuration Menus:
1. **Transaction Types**
   - Create, edit, and manage available transaction types
   - Configure transaction states and workflow progression
   - Set display preferences and categorization

2. **Document Types**
   - Define document templates and requirements
   - Associate document types with specific transaction types
   - Configure validation rules and required fields

3. **Workflow Templates**
   - Design custom workflows for each transaction type
   - Configure approval processes and state transitions
   - Set role-based permissions and actions

4. **Integration Settings**
   - RESO Data Standard mappings
   - External system integrations
   - API configuration and webhooks

#### Advanced Configuration:
5. **Localization Management**
   - Multi-language content management
   - Regional compliance settings
   - Currency and format preferences

6. **User Roles & Permissions**
   - Transaction-specific role definitions
   - Document access controls
   - Workflow permission matrices

### Transaction Type Configuration Requirements

#### Core Properties:
- **Basic Information**: Name, description, category, display order
- **Status Management**: Active/inactive, visibility controls
- **Categorization**: Primary types vs "Other" grouping

#### Transaction States Configuration:
- **State Definitions**: Custom states per transaction type (e.g., "Raising Approval", "Documentation Review")
- **State Transitions**: Define allowed progression paths
- **State Properties**: Color coding, progress percentage, required actions
- **Conditional Logic**: State requirements based on document completion or approvals

#### Workflow Integration:
- **Step Templates**: Reusable workflow steps
- **Role Assignments**: Define who can perform actions at each state
- **Automation Rules**: Trigger conditions for state transitions
- **Notification Settings**: Email/SMS alerts for state changes

### Document Type Configuration Requirements

#### Document Properties:
- **Basic Metadata**: Name, description, category, file type restrictions
- **Validation Rules**: Required fields, format specifications, size limits
- **Language Support**: Multi-language versions and translations

#### Transaction Type Association:
- **Binding Rules**: Which document types are required/optional for each transaction type
- **State Dependencies**: Documents required at specific transaction states
- **Conditional Requirements**: Documents needed based on transaction properties (e.g., property value, location)

#### Document Lifecycle:
- **Version Control**: Track document revisions and approval status
- **Approval Workflows**: Multi-step approval processes for critical documents
- **Expiration Management**: Time-sensitive documents and renewal requirements
- **Digital Signatures**: Integration with signature platforms and validation

#### Advanced Features:
- **Template Management**: Pre-filled document templates with dynamic fields
- **Compliance Checking**: Automated validation against regulatory requirements
- **Integration Points**: Connection with external document management systems
- **Audit Trails**: Complete document access and modification history

### Menu Naming Conventions

Recommended organization within the existing sidebar structure:

**Current Structure Enhancement:**
```
Organization Dashboard
├── Billing (existing)
├── General Settings (existing)
├── Other Settings (existing)
└── Transaction Management (NEW SECTION)
    ├── Transaction Types
    ├── Document Types
    ├── Workflow Templates
    ├── Integration Settings
    └── Localization
```

**Alternative Grouping:**
```
Organization Dashboard
├── System Configuration (NEW SECTION)
│   ├── Transaction Types
│   ├── Document Types
│   └── Workflow Templates
├── Integration & Compliance (NEW SECTION)
│   ├── External Integrations
│   ├── RESO Data Mapping
│   └── Localization Settings
└── [Existing sections remain]
```