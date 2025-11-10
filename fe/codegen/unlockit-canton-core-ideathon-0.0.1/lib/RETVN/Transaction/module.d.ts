// Generated from RETVN/Transaction.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from '@daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

import * as RETVN_Role from '../../RETVN/Role/module';

export declare type QueryAggregate = {
};

export declare const QueryAggregate:
  damlTypes.Serializable<QueryAggregate> & {
  }
;


export declare type MarketDataAggregate = {
  operator: damlTypes.Party;
  postalCode: string;
  timeRangeDays: damlTypes.Int;
  transactionCount: damlTypes.Int;
  medianPrice: damlTypes.Numeric;
  averagePrice: damlTypes.Numeric;
  medianPricePerSqft: damlTypes.Optional<damlTypes.Numeric>;
  averageDaysOnMarket: damlTypes.Optional<damlTypes.Int>;
  propertyTypeDistribution: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<PropertyType, damlTypes.Int>[];
  averageTrustScore: damlTypes.Int;
  generatedAt: damlTypes.Time;
};

export declare interface MarketDataAggregateInterface {
  Archive: damlTypes.Choice<MarketDataAggregate, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketDataAggregate, undefined>>;
  QueryAggregate: damlTypes.Choice<MarketDataAggregate, QueryAggregate, MarketDataAggregate, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketDataAggregate, undefined>>;
}
export declare const MarketDataAggregate:
  damlTypes.Template<MarketDataAggregate, undefined, '#unlockit-canton-core-ideathon:RETVN.Transaction:MarketDataAggregate'> &
  damlTypes.ToInterface<MarketDataAggregate, never> &
  MarketDataAggregateInterface;

export declare namespace MarketDataAggregate {
  export type CreateEvent = damlLedger.CreateEvent<MarketDataAggregate, undefined, typeof MarketDataAggregate.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<MarketDataAggregate, typeof MarketDataAggregate.templateId>
  export type Event = damlLedger.Event<MarketDataAggregate, undefined, typeof MarketDataAggregate.templateId>
  export type QueryResult = damlLedger.QueryResult<MarketDataAggregate, undefined, typeof MarketDataAggregate.templateId>
}



export declare type RejectSubmission = {
  reason: string;
};

export declare const RejectSubmission:
  damlTypes.Serializable<RejectSubmission> & {
  }
;


export declare type AcceptSubmission = {
};

export declare const AcceptSubmission:
  damlTypes.Serializable<AcceptSubmission> & {
  }
;


export declare type TransactionSubmissionProposal = {
  operator: damlTypes.Party;
  submitter: damlTypes.Party;
  submitterRole: RETVN_Role.UserRole;
  submissionRight: damlTypes.ContractId<RETVN_Role.TransactionSubmissionDelegation>;
  transactionId: string;
  propertyAddress: string;
  postalCode: string;
  propertyType: PropertyType;
  livingAreaSqft: damlTypes.Optional<damlTypes.Int>;
  lotSizeSqft: damlTypes.Optional<damlTypes.Int>;
  bedroomsTotal: damlTypes.Optional<damlTypes.Int>;
  bathroomsTotal: damlTypes.Optional<damlTypes.Int>;
  yearBuilt: damlTypes.Optional<damlTypes.Int>;
  salePrice: damlTypes.Numeric;
  transactionDate: damlTypes.Time;
  closingDate: damlTypes.Optional<damlTypes.Time>;
  financingType: damlTypes.Optional<string>;
  daysOnMarket: damlTypes.Optional<damlTypes.Int>;
  proposedVerifiers: damlTypes.Party[];
  submittedAt: damlTypes.Time;
};

export declare interface TransactionSubmissionProposalInterface {
  AcceptSubmission: damlTypes.Choice<TransactionSubmissionProposal, AcceptSubmission, damlTypes.ContractId<TransactionData>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionSubmissionProposal, undefined>>;
  RejectSubmission: damlTypes.Choice<TransactionSubmissionProposal, RejectSubmission, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionSubmissionProposal, undefined>>;
  Archive: damlTypes.Choice<TransactionSubmissionProposal, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionSubmissionProposal, undefined>>;
}
export declare const TransactionSubmissionProposal:
  damlTypes.Template<TransactionSubmissionProposal, undefined, '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionSubmissionProposal'> &
  damlTypes.ToInterface<TransactionSubmissionProposal, never> &
  TransactionSubmissionProposalInterface;

export declare namespace TransactionSubmissionProposal {
  export type CreateEvent = damlLedger.CreateEvent<TransactionSubmissionProposal, undefined, typeof TransactionSubmissionProposal.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TransactionSubmissionProposal, typeof TransactionSubmissionProposal.templateId>
  export type Event = damlLedger.Event<TransactionSubmissionProposal, undefined, typeof TransactionSubmissionProposal.templateId>
  export type QueryResult = damlLedger.QueryResult<TransactionSubmissionProposal, undefined, typeof TransactionSubmissionProposal.templateId>
}



export declare type TransactionDataView =
  |  { tag: 'FullView'; value: TransactionData }
  |  { tag: 'AggregateView'; value: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple4<string, PropertyType, damlTypes.Numeric, damlTypes.Int> }
;

export declare const TransactionDataView:
  damlTypes.Serializable<TransactionDataView> & {
  }
;


export declare type TransactionStatus =
  | 'Unverified'
  | 'PartiallyVerified'
  | 'FullyVerified'
  | 'DisputedTransaction'
;

export declare const TransactionStatus:
  damlTypes.Serializable<TransactionStatus> & {
  }
& { readonly keys: TransactionStatus[] } & { readonly [e in TransactionStatus]: e }
;


export declare type VerificationDecision =
  | 'Confirmed'
  | 'ConfirmedWithNotes'
  | 'Disputed'
  | 'RequestClarification'
;

export declare const VerificationDecision:
  damlTypes.Serializable<VerificationDecision> & {
  }
& { readonly keys: VerificationDecision[] } & { readonly [e in VerificationDecision]: e }
;


export declare type Verification = {
  verifier: damlTypes.Party;
  verifierRole: RETVN_Role.UserRole;
  verificationWeight: damlTypes.Int;
  decision: VerificationDecision;
  notes: damlTypes.Optional<string>;
  verifiedAt: damlTypes.Time;
};

export declare const Verification:
  damlTypes.Serializable<Verification> & {
  }
;


export declare type QueryTransaction = {
  requester: damlTypes.Party;
  accessTier: RETVN_Role.DataAccessTier;
};

export declare const QueryTransaction:
  damlTypes.Serializable<QueryTransaction> & {
  }
;


export declare type SubmitVerification = {
  verificationDelegation: damlTypes.ContractId<RETVN_Role.TransactionVerificationDelegation>;
  decision: VerificationDecision;
  notes: damlTypes.Optional<string>;
  verifiedAt: damlTypes.Time;
};

export declare const SubmitVerification:
  damlTypes.Serializable<SubmitVerification> & {
  }
;


export declare type AssignVerifier = {
  verifier: damlTypes.Party;
};

export declare const AssignVerifier:
  damlTypes.Serializable<AssignVerifier> & {
  }
;


export declare type TransactionData = {
  operator: damlTypes.Party;
  submitter: damlTypes.Party;
  submitterRole: RETVN_Role.UserRole;
  transactionId: string;
  propertyAddress: string;
  postalCode: string;
  propertyType: PropertyType;
  livingAreaSqft: damlTypes.Optional<damlTypes.Int>;
  lotSizeSqft: damlTypes.Optional<damlTypes.Int>;
  bedroomsTotal: damlTypes.Optional<damlTypes.Int>;
  bathroomsTotal: damlTypes.Optional<damlTypes.Int>;
  yearBuilt: damlTypes.Optional<damlTypes.Int>;
  salePrice: damlTypes.Numeric;
  transactionDate: damlTypes.Time;
  closingDate: damlTypes.Optional<damlTypes.Time>;
  financingType: damlTypes.Optional<string>;
  daysOnMarket: damlTypes.Optional<damlTypes.Int>;
  assignedVerifiers: damlTypes.Party[];
  verifications: Verification[];
  trustScore: damlTypes.Int;
  status: TransactionStatus;
  submittedAt: damlTypes.Time;
};

export declare interface TransactionDataInterface {
  AssignVerifier: damlTypes.Choice<TransactionData, AssignVerifier, damlTypes.ContractId<TransactionData>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionData, undefined>>;
  SubmitVerification: damlTypes.Choice<TransactionData, SubmitVerification, damlTypes.ContractId<TransactionData>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionData, undefined>>;
  QueryTransaction: damlTypes.Choice<TransactionData, QueryTransaction, TransactionDataView, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionData, undefined>>;
  Archive: damlTypes.Choice<TransactionData, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionData, undefined>>;
}
export declare const TransactionData:
  damlTypes.Template<TransactionData, undefined, '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionData'> &
  damlTypes.ToInterface<TransactionData, never> &
  TransactionDataInterface;

export declare namespace TransactionData {
  export type CreateEvent = damlLedger.CreateEvent<TransactionData, undefined, typeof TransactionData.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TransactionData, typeof TransactionData.templateId>
  export type Event = damlLedger.Event<TransactionData, undefined, typeof TransactionData.templateId>
  export type QueryResult = damlLedger.QueryResult<TransactionData, undefined, typeof TransactionData.templateId>
}



export declare type PropertyType =
  | 'SingleFamily'
  | 'Condo'
  | 'Townhouse'
  | 'MultiFamily'
  | 'Land'
;

export declare const PropertyType:
  damlTypes.Serializable<PropertyType> & {
  }
& { readonly keys: PropertyType[] } & { readonly [e in PropertyType]: e }
;

