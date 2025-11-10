// Generated from W3C/VC.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from '@daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type IsRevoked = {
  queryCredentialId: string;
};

export declare const IsRevoked:
  damlTypes.Serializable<IsRevoked> & {
  }
;


export declare type RevocationRegistryEntry = {
  credentialId: string;
  issuer: damlTypes.Party;
  revokedAt: damlTypes.Time;
  reason: damlTypes.Optional<string>;
};

export declare interface RevocationRegistryEntryInterface {
  Archive: damlTypes.Choice<RevocationRegistryEntry, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RevocationRegistryEntry, undefined>>;
  IsRevoked: damlTypes.Choice<RevocationRegistryEntry, IsRevoked, boolean, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RevocationRegistryEntry, undefined>>;
}
export declare const RevocationRegistryEntry:
  damlTypes.Template<RevocationRegistryEntry, undefined, '#unlockit-canton-core-ideathon:W3C.VC:RevocationRegistryEntry'> &
  damlTypes.ToInterface<RevocationRegistryEntry, never> &
  RevocationRegistryEntryInterface;

export declare namespace RevocationRegistryEntry {
  export type CreateEvent = damlLedger.CreateEvent<RevocationRegistryEntry, undefined, typeof RevocationRegistryEntry.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<RevocationRegistryEntry, typeof RevocationRegistryEntry.templateId>
  export type Event = damlLedger.Event<RevocationRegistryEntry, undefined, typeof RevocationRegistryEntry.templateId>
  export type QueryResult = damlLedger.QueryResult<RevocationRegistryEntry, undefined, typeof RevocationRegistryEntry.templateId>
}



export declare type RejectRequest = {
  reason: string;
};

export declare const RejectRequest:
  damlTypes.Serializable<RejectRequest> & {
  }
;


export declare type ApproveAndIssue = {
  credentialId: string;
  issuanceDate: damlTypes.Time;
  expirationDate: damlTypes.Optional<damlTypes.Time>;
  proof: Proof;
  subjectDid: string;
  credentialSchema: damlTypes.Optional<string>;
  credentialContext: string[];
};

export declare const ApproveAndIssue:
  damlTypes.Serializable<ApproveAndIssue> & {
  }
;


export declare type CredentialIssuanceRequest = {
  requestId: string;
  issuer: damlTypes.Party;
  subject: damlTypes.Party;
  requestedCredentialType: string[];
  requestedClaims: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, string>[];
  supportingDocuments: string[];
};

export declare interface CredentialIssuanceRequestInterface {
  ApproveAndIssue: damlTypes.Choice<CredentialIssuanceRequest, ApproveAndIssue, damlTypes.ContractId<VerifiableCredential>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CredentialIssuanceRequest, undefined>>;
  RejectRequest: damlTypes.Choice<CredentialIssuanceRequest, RejectRequest, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CredentialIssuanceRequest, undefined>>;
  Archive: damlTypes.Choice<CredentialIssuanceRequest, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CredentialIssuanceRequest, undefined>>;
}
export declare const CredentialIssuanceRequest:
  damlTypes.Template<CredentialIssuanceRequest, undefined, '#unlockit-canton-core-ideathon:W3C.VC:CredentialIssuanceRequest'> &
  damlTypes.ToInterface<CredentialIssuanceRequest, never> &
  CredentialIssuanceRequestInterface;

export declare namespace CredentialIssuanceRequest {
  export type CreateEvent = damlLedger.CreateEvent<CredentialIssuanceRequest, undefined, typeof CredentialIssuanceRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CredentialIssuanceRequest, typeof CredentialIssuanceRequest.templateId>
  export type Event = damlLedger.Event<CredentialIssuanceRequest, undefined, typeof CredentialIssuanceRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CredentialIssuanceRequest, undefined, typeof CredentialIssuanceRequest.templateId>
}



export declare type AcknowledgePresentation = {
};

export declare const AcknowledgePresentation:
  damlTypes.Serializable<AcknowledgePresentation> & {
  }
;


export declare type PresentationReceipt = {
  credentialId: string;
  holder: damlTypes.Party;
  verifier: damlTypes.Party;
  presentedAt: damlTypes.Time;
  challenge: string;
  presentationProof: string;
};

export declare interface PresentationReceiptInterface {
  AcknowledgePresentation: damlTypes.Choice<PresentationReceipt, AcknowledgePresentation, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PresentationReceipt, undefined>>;
  Archive: damlTypes.Choice<PresentationReceipt, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PresentationReceipt, undefined>>;
}
export declare const PresentationReceipt:
  damlTypes.Template<PresentationReceipt, undefined, '#unlockit-canton-core-ideathon:W3C.VC:PresentationReceipt'> &
  damlTypes.ToInterface<PresentationReceipt, never> &
  PresentationReceiptInterface;

export declare namespace PresentationReceipt {
  export type CreateEvent = damlLedger.CreateEvent<PresentationReceipt, undefined, typeof PresentationReceipt.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PresentationReceipt, typeof PresentationReceipt.templateId>
  export type Event = damlLedger.Event<PresentationReceipt, undefined, typeof PresentationReceipt.templateId>
  export type QueryResult = damlLedger.QueryResult<PresentationReceipt, undefined, typeof PresentationReceipt.templateId>
}



export declare type PresentCredential = {
  verifier: damlTypes.Party;
  challenge: string;
  presentationProof: string;
};

export declare const PresentCredential:
  damlTypes.Serializable<PresentCredential> & {
  }
;


export declare type AddVerifier = {
  verifier: damlTypes.Party;
};

export declare const AddVerifier:
  damlTypes.Serializable<AddVerifier> & {
  }
;


export declare type TransferCredential = {
  newHolder: damlTypes.Party;
};

export declare const TransferCredential:
  damlTypes.Serializable<TransferCredential> & {
  }
;


export declare type Revoke = {
};

export declare const Revoke:
  damlTypes.Serializable<Revoke> & {
  }
;


export declare type Reactivate = {
};

export declare const Reactivate:
  damlTypes.Serializable<Reactivate> & {
  }
;


export declare type Suspend = {
};

export declare const Suspend:
  damlTypes.Serializable<Suspend> & {
  }
;


export declare type IsValid = {
  currentTime: damlTypes.Time;
};

export declare const IsValid:
  damlTypes.Serializable<IsValid> & {
  }
;


export declare type VerifiableCredential = {
  credentialId: string;
  credentialType: string[];
  issuer: damlTypes.Party;
  issuanceDate: damlTypes.Time;
  expirationDate: damlTypes.Optional<damlTypes.Time>;
  subject: CredentialSubject;
  proof: Proof;
  status: CredentialStatus;
  holder: damlTypes.Party;
  verifiers: damlTypes.Party[];
  credentialSchema: damlTypes.Optional<string>;
  credentialContext: string[];
};

export declare interface VerifiableCredentialInterface {
  IsValid: damlTypes.Choice<VerifiableCredential, IsValid, boolean, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  Suspend: damlTypes.Choice<VerifiableCredential, Suspend, damlTypes.ContractId<VerifiableCredential>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  Reactivate: damlTypes.Choice<VerifiableCredential, Reactivate, damlTypes.ContractId<VerifiableCredential>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  Revoke: damlTypes.Choice<VerifiableCredential, Revoke, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  TransferCredential: damlTypes.Choice<VerifiableCredential, TransferCredential, damlTypes.ContractId<VerifiableCredential>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  AddVerifier: damlTypes.Choice<VerifiableCredential, AddVerifier, damlTypes.ContractId<VerifiableCredential>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  PresentCredential: damlTypes.Choice<VerifiableCredential, PresentCredential, damlTypes.ContractId<PresentationReceipt>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
  Archive: damlTypes.Choice<VerifiableCredential, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<VerifiableCredential, undefined>>;
}
export declare const VerifiableCredential:
  damlTypes.Template<VerifiableCredential, undefined, '#unlockit-canton-core-ideathon:W3C.VC:VerifiableCredential'> &
  damlTypes.ToInterface<VerifiableCredential, never> &
  VerifiableCredentialInterface;

export declare namespace VerifiableCredential {
  export type CreateEvent = damlLedger.CreateEvent<VerifiableCredential, undefined, typeof VerifiableCredential.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<VerifiableCredential, typeof VerifiableCredential.templateId>
  export type Event = damlLedger.Event<VerifiableCredential, undefined, typeof VerifiableCredential.templateId>
  export type QueryResult = damlLedger.QueryResult<VerifiableCredential, undefined, typeof VerifiableCredential.templateId>
}



export declare type Proof = {
  proofType: string;
  created: damlTypes.Time;
  proofPurpose: string;
  verificationMethod: string;
  proofValue: string;
};

export declare const Proof:
  damlTypes.Serializable<Proof> & {
  }
;


export declare type CredentialSubject = {
  id: string;
  claims: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, string>[];
};

export declare const CredentialSubject:
  damlTypes.Serializable<CredentialSubject> & {
  }
;


export declare type CredentialStatus =
  | 'Active'
  | 'Suspended'
  | 'Revoked'
;

export declare const CredentialStatus:
  damlTypes.Serializable<CredentialStatus> & {
  }
& { readonly keys: CredentialStatus[] } & { readonly [e in CredentialStatus]: e }
;

