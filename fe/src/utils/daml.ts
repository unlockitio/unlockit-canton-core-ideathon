// Utility functions for Daml/Canton integration

/**
 * Generate a unique transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TXN-${timestamp}-${random}`;
}

/**
 * Convert JavaScript Date to Daml Time (microseconds since epoch)
 */
export function dateToDamlTime(date: Date): string {
  // Daml Time is microseconds since Unix epoch
  const microseconds = date.getTime() * 1000;
  return microseconds.toString();
}

/**
 * Convert ISO date string to Daml Time
 */
export function isoStringToDamlTime(isoString: string): string {
  const date = new Date(isoString);
  return dateToDamlTime(date);
}

/**
 * Convert Daml Time to JavaScript Date
 */
export function damlTimeToDate(damlTime: string): Date {
  const microseconds = parseInt(damlTime, 10);
  const milliseconds = microseconds / 1000;
  return new Date(milliseconds);
}

/**
 * Convert empty string to Optional None, or value to Optional Some
 */
export function toOptional(value: string): string | null {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  return value;
}

/**
 * Convert form number string to optional integer
 */
export function toOptionalInt(value: string): number | null {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Daml property type mapping
 */
export const PropertyTypeMap = {
  SingleFamily: 'SingleFamily',
  Condo: 'Condo',
  Townhouse: 'Townhouse',
  MultiFamily: 'MultiFamily',
  Land: 'Land',
} as const;

/**
 * User role mapping (from RETVN.Role module)
 */
export const UserRoleMap = {
  PrivateCitizen: 'PrivateCitizen',
  RealtorAgent: 'RealtorAgent',
  RealtorBroker: 'RealtorBroker',
  RealtorMaster: 'RealtorMaster',
  NotaryPublic: 'NotaryPublic',
  TaxAuthority: 'TaxAuthority',
} as const;

/**
 * Get verification weight for a given role
 */
export function getVerificationWeight(role: keyof typeof UserRoleMap): number {
  const weights = {
    PrivateCitizen: 5,
    RealtorAgent: 8,
    RealtorBroker: 12,
    RealtorMaster: 15,
    NotaryPublic: 25,
    TaxAuthority: 40,
  };
  return weights[role];
}

/**
 * Template IDs for Canton API calls
 */
export const TemplateIds = {
  UserAccount: 'RETVN.Role:UserAccount',
  TransactionSubmissionRight: 'RETVN.Role:TransactionSubmissionRight',
  TransactionSubmissionDelegation: 'RETVN.Role:TransactionSubmissionDelegation',
  TransactionSubmissionProposal: 'RETVN.Transaction:TransactionSubmissionProposal',
  TransactionData: 'RETVN.Transaction:TransactionData',
  TransactionVerificationRight: 'RETVN.Role:TransactionVerificationRight',
  TransactionVerificationDelegation: 'RETVN.Role:TransactionVerificationDelegation',
} as const;
