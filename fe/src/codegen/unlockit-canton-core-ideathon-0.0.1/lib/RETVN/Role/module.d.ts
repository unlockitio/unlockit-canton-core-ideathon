// Generated from RETVN/Role.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

import * as W3C_VC from '../../W3C/VC/module';

export declare type DataAccessTier =
  | 'PublicAccess'
  | 'BasicReport'
  | 'ProfessionalReport'
  | 'InstitutionalAccess'
;

export declare const DataAccessTier:
  damlTypes.Serializable<DataAccessTier> & {
  }
& { readonly keys: DataAccessTier[] } & { readonly [e in DataAccessTier]: e }
;


export declare type MarketDataQueryReceipt = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  role: UserRole;
  tier: DataAccessTier;
  postalCode: string;
  queriedAt: damlTypes.Time;
};

export declare interface MarketDataQueryReceiptInterface {
  Archive: damlTypes.Choice<MarketDataQueryReceipt, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketDataQueryReceipt, undefined>>;
}
export declare const MarketDataQueryReceipt:
  damlTypes.Template<MarketDataQueryReceipt, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:MarketDataQueryReceipt'> &
  damlTypes.ToInterface<MarketDataQueryReceipt, never> &
  MarketDataQueryReceiptInterface;

export declare namespace MarketDataQueryReceipt {
}



export declare type QueryMarketData = {
  postalCode: string;
  timeRange: damlTypes.Int;
};

export declare const QueryMarketData:
  damlTypes.Serializable<QueryMarketData> & {
  }
;


export declare type MarketDataAccessRight = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  role: UserRole;
  tier: DataAccessTier;
  grantedAt: damlTypes.Time;
};

export declare interface MarketDataAccessRightInterface {
  QueryMarketData: damlTypes.Choice<MarketDataAccessRight, QueryMarketData, damlTypes.ContractId<MarketDataQueryReceipt>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketDataAccessRight, undefined>>;
  Archive: damlTypes.Choice<MarketDataAccessRight, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketDataAccessRight, undefined>>;
}
export declare const MarketDataAccessRight:
  damlTypes.Template<MarketDataAccessRight, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:MarketDataAccessRight'> &
  damlTypes.ToInterface<MarketDataAccessRight, never> &
  MarketDataAccessRightInterface;

export declare namespace MarketDataAccessRight {
}



export declare type TransactionVerificationDelegation = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  role: UserRole;
  verificationWeight: damlTypes.Int;
  transactionId: string;
};

export declare interface TransactionVerificationDelegationInterface {
  Archive: damlTypes.Choice<TransactionVerificationDelegation, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionVerificationDelegation, undefined>>;
}
export declare const TransactionVerificationDelegation:
  damlTypes.Template<TransactionVerificationDelegation, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationDelegation'> &
  damlTypes.ToInterface<TransactionVerificationDelegation, never> &
  TransactionVerificationDelegationInterface;

export declare namespace TransactionVerificationDelegation {
}



export declare type DelegateVerification = {
  transactionId: string;
};

export declare const DelegateVerification:
  damlTypes.Serializable<DelegateVerification> & {
  }
;


export declare type TransactionVerificationRight = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  role: UserRole;
  verificationWeight: damlTypes.Int;
};

export declare interface TransactionVerificationRightInterface {
  Archive: damlTypes.Choice<TransactionVerificationRight, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionVerificationRight, undefined>>;
  DelegateVerification: damlTypes.Choice<TransactionVerificationRight, DelegateVerification, damlTypes.ContractId<TransactionVerificationDelegation>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionVerificationRight, undefined>>;
}
export declare const TransactionVerificationRight:
  damlTypes.Template<TransactionVerificationRight, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationRight'> &
  damlTypes.ToInterface<TransactionVerificationRight, never> &
  TransactionVerificationRightInterface;

export declare namespace TransactionVerificationRight {
}



export declare type TransactionSubmissionRight = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  role: UserRole;
  verificationWeight: damlTypes.Int;
};

export declare interface TransactionSubmissionRightInterface {
  Archive: damlTypes.Choice<TransactionSubmissionRight, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TransactionSubmissionRight, undefined>>;
}
export declare const TransactionSubmissionRight:
  damlTypes.Template<TransactionSubmissionRight, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:TransactionSubmissionRight'> &
  damlTypes.ToInterface<TransactionSubmissionRight, never> &
  TransactionSubmissionRightInterface;

export declare namespace TransactionSubmissionRight {
}



export declare type RejectRegistration = {
  reason: string;
};

export declare const RejectRegistration:
  damlTypes.Serializable<RejectRegistration> & {
  }
;


export declare type ApproveRegistration = {
};

export declare const ApproveRegistration:
  damlTypes.Serializable<ApproveRegistration> & {
  }
;


export declare type RegistrationRequest = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  requestedRole: UserRole;
  credentialPresentations: damlTypes.ContractId<W3C_VC.PresentationReceipt>[];
  requestedAt: damlTypes.Time;
};

export declare interface RegistrationRequestInterface {
  Archive: damlTypes.Choice<RegistrationRequest, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegistrationRequest, undefined>>;
  RejectRegistration: damlTypes.Choice<RegistrationRequest, RejectRegistration, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegistrationRequest, undefined>>;
  ApproveRegistration: damlTypes.Choice<RegistrationRequest, ApproveRegistration, damlTypes.ContractId<UserAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RegistrationRequest, undefined>>;
}
export declare const RegistrationRequest:
  damlTypes.Template<RegistrationRequest, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:RegistrationRequest'> &
  damlTypes.ToInterface<RegistrationRequest, never> &
  RegistrationRequestInterface;

export declare namespace RegistrationRequest {
}



export declare type AccountStatus =
  | 'AccountActive'
  | 'AccountSuspended'
  | 'AccountPendingReview'
;

export declare const AccountStatus:
  damlTypes.Serializable<AccountStatus> & {
  }
& { readonly keys: AccountStatus[] } & { readonly [e in AccountStatus]: e }
;


export declare type IncrementTransactionsSubmitted = {
};

export declare const IncrementTransactionsSubmitted:
  damlTypes.Serializable<IncrementTransactionsSubmitted> & {
  }
;


export declare type UpdateReputation = {
  reputationChange: damlTypes.Int;
};

export declare const UpdateReputation:
  damlTypes.Serializable<UpdateReputation> & {
  }
;


export declare type ArchiveAccount = {
};

export declare const ArchiveAccount:
  damlTypes.Serializable<ArchiveAccount> & {
  }
;


export declare type ReactivateAccount = {
};

export declare const ReactivateAccount:
  damlTypes.Serializable<ReactivateAccount> & {
  }
;


export declare type SuspendAccount = {
};

export declare const SuspendAccount:
  damlTypes.Serializable<SuspendAccount> & {
  }
;


export declare type RequestMarketDataAccess = {
  tier: DataAccessTier;
};

export declare const RequestMarketDataAccess:
  damlTypes.Serializable<RequestMarketDataAccess> & {
  }
;


export declare type RequestVerificationRight = {
};

export declare const RequestVerificationRight:
  damlTypes.Serializable<RequestVerificationRight> & {
  }
;


export declare type RequestSubmissionRight = {
};

export declare const RequestSubmissionRight:
  damlTypes.Serializable<RequestSubmissionRight> & {
  }
;


export declare type UserAccount = {
  operator: damlTypes.Party;
  user: damlTypes.Party;
  role: UserRole;
  verificationWeight: damlTypes.Int;
  credentialPresentations: damlTypes.ContractId<W3C_VC.PresentationReceipt>[];
  registeredAt: damlTypes.Time;
  status: AccountStatus;
  reputation: damlTypes.Int;
  reputationCap: damlTypes.Int;
  transactionsSubmitted: damlTypes.Int;
};

export declare interface UserAccountInterface {
  UpdateReputation: damlTypes.Choice<UserAccount, UpdateReputation, damlTypes.ContractId<UserAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  RequestMarketDataAccess: damlTypes.Choice<UserAccount, RequestMarketDataAccess, damlTypes.ContractId<MarketDataAccessRight>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  Archive: damlTypes.Choice<UserAccount, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  ArchiveAccount: damlTypes.Choice<UserAccount, ArchiveAccount, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  RequestSubmissionRight: damlTypes.Choice<UserAccount, RequestSubmissionRight, damlTypes.ContractId<TransactionSubmissionRight>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  RequestVerificationRight: damlTypes.Choice<UserAccount, RequestVerificationRight, damlTypes.ContractId<TransactionVerificationRight>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  SuspendAccount: damlTypes.Choice<UserAccount, SuspendAccount, damlTypes.ContractId<UserAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  ReactivateAccount: damlTypes.Choice<UserAccount, ReactivateAccount, damlTypes.ContractId<UserAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
  IncrementTransactionsSubmitted: damlTypes.Choice<UserAccount, IncrementTransactionsSubmitted, damlTypes.ContractId<UserAccount>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAccount, undefined>>;
}
export declare const UserAccount:
  damlTypes.Template<UserAccount, undefined, '#unlockit-canton-core-ideathon:RETVN.Role:UserAccount'> &
  damlTypes.ToInterface<UserAccount, never> &
  UserAccountInterface;

export declare namespace UserAccount {
}



export declare type UserRole =
  | 'PrivateCitizen'
  | 'RealtorAgent'
  | 'RealtorBroker'
  | 'RealtorMaster'
  | 'NotaryPublic'
  | 'TaxAuthority'
;

export declare const UserRole:
  damlTypes.Serializable<UserRole> & {
  }
& { readonly keys: UserRole[] } & { readonly [e in UserRole]: e }
;

