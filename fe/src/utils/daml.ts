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
 * Convert JavaScript Date to Daml Time (ISO 8601 format for Canton JSON API)
 */
export function dateToDamlTime(date: Date): string {
  // Canton JSON API expects ISO 8601 format
  return date.toISOString();
}

/**
 * Convert ISO date string to Daml Time (ensures proper ISO 8601 format)
 */
export function isoStringToDamlTime(isoString: string): string {
  const date = new Date(isoString);
  // Return ISO 8601 format that Canton expects
  return date.toISOString();
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
 * Using placeholder prefix that matches codegen (gets replaced with actual package ID at runtime)
 */
export const TemplateIds = {
  UserAccount: '#unlockit-canton-core-ideathon:RETVN.Role:UserAccount',
  RegistrationRequest: '#unlockit-canton-core-ideathon:RETVN.Role:RegistrationRequest',
  TransactionSubmissionRight: '#unlockit-canton-core-ideathon:RETVN.Role:TransactionSubmissionRight',
  TransactionSubmissionProposal: '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionSubmissionProposal',
  VerificationProposal: '#unlockit-canton-core-ideathon:RETVN.Transaction:VerificationProposal',
  TransactionData: '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionData',
  TransactionVerificationRight: '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationRight',
  TransactionVerificationDelegation: '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationDelegation',
  PresentationReceipt: '#unlockit-canton-core-ideathon:W3C.VC:PresentationReceipt',
  VerifiableCredential: '#unlockit-canton-core-ideathon:W3C.VC:VerifiableCredential',
  MarketInsightOrder: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsightOrder',
  PaymentPendingOrder: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaymentPendingOrder',
  PaidMarketInsightOrder: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaidMarketInsightOrder',
  FailedPaymentOrder: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:FailedPaymentOrder',
  MarketInsight: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsight',
  ContributorReward: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:ContributorReward',
} as const;
