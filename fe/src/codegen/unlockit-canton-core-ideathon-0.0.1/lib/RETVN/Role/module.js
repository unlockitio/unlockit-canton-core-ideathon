"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');

var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');

var W3C_VC = require('../../W3C/VC/module');


exports.DataAccessTier = {
  PublicAccess: 'PublicAccess',
  BasicReport: 'BasicReport',
  ProfessionalReport: 'ProfessionalReport',
  InstitutionalAccess: 'InstitutionalAccess',
  keys: ['PublicAccess','BasicReport','ProfessionalReport','InstitutionalAccess',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.DataAccessTier.PublicAccess), jtv.constant(exports.DataAccessTier.BasicReport), jtv.constant(exports.DataAccessTier.ProfessionalReport), jtv.constant(exports.DataAccessTier.InstitutionalAccess)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.MarketDataQueryReceipt = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:MarketDataQueryReceipt',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, role: exports.UserRole.decoder, tier: exports.DataAccessTier.decoder, postalCode: damlTypes.Text.decoder, queriedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    role: exports.UserRole.encode(__typed__.role),
    tier: exports.DataAccessTier.encode(__typed__.tier),
    postalCode: damlTypes.Text.encode(__typed__.postalCode),
    queriedAt: damlTypes.Time.encode(__typed__.queriedAt),
  };
}
,
  Archive: {
    template: function () { return exports.MarketDataQueryReceipt; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarketDataQueryReceipt, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.QueryMarketData = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({postalCode: damlTypes.Text.decoder, timeRange: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    postalCode: damlTypes.Text.encode(__typed__.postalCode),
    timeRange: damlTypes.Int.encode(__typed__.timeRange),
  };
}
,
};



exports.MarketDataAccessRight = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:MarketDataAccessRight',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, role: exports.UserRole.decoder, tier: exports.DataAccessTier.decoder, grantedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    role: exports.UserRole.encode(__typed__.role),
    tier: exports.DataAccessTier.encode(__typed__.tier),
    grantedAt: damlTypes.Time.encode(__typed__.grantedAt),
  };
}
,
  QueryMarketData: {
    template: function () { return exports.MarketDataAccessRight; },
    choiceName: 'QueryMarketData',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.QueryMarketData.decoder; }),
    argumentEncode: function (__typed__) { return exports.QueryMarketData.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarketDataQueryReceipt).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarketDataQueryReceipt).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.MarketDataAccessRight; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarketDataAccessRight, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.TransactionVerificationDelegation = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationDelegation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, role: exports.UserRole.decoder, verificationWeight: damlTypes.Int.decoder, transactionId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    role: exports.UserRole.encode(__typed__.role),
    verificationWeight: damlTypes.Int.encode(__typed__.verificationWeight),
    transactionId: damlTypes.Text.encode(__typed__.transactionId),
  };
}
,
  Archive: {
    template: function () { return exports.TransactionVerificationDelegation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TransactionVerificationDelegation, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.DelegateVerification = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({transactionId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    transactionId: damlTypes.Text.encode(__typed__.transactionId),
  };
}
,
};



exports.TransactionVerificationRight = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:TransactionVerificationRight',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, role: exports.UserRole.decoder, verificationWeight: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    role: exports.UserRole.encode(__typed__.role),
    verificationWeight: damlTypes.Int.encode(__typed__.verificationWeight),
  };
}
,
  Archive: {
    template: function () { return exports.TransactionVerificationRight; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  DelegateVerification: {
    template: function () { return exports.TransactionVerificationRight; },
    choiceName: 'DelegateVerification',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DelegateVerification.decoder; }),
    argumentEncode: function (__typed__) { return exports.DelegateVerification.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionVerificationDelegation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionVerificationDelegation).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TransactionVerificationRight, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.TransactionSubmissionRight = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:TransactionSubmissionRight',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, role: exports.UserRole.decoder, verificationWeight: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    role: exports.UserRole.encode(__typed__.role),
    verificationWeight: damlTypes.Int.encode(__typed__.verificationWeight),
  };
}
,
  Archive: {
    template: function () { return exports.TransactionSubmissionRight; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TransactionSubmissionRight, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.RejectRegistration = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.ApproveRegistration = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RegistrationRequest = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:RegistrationRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, requestedRole: exports.UserRole.decoder, credentialPresentations: damlTypes.List(damlTypes.ContractId(W3C_VC.PresentationReceipt)).decoder, requestedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    requestedRole: exports.UserRole.encode(__typed__.requestedRole),
    credentialPresentations: damlTypes.List(damlTypes.ContractId(W3C_VC.PresentationReceipt)).encode(__typed__.credentialPresentations),
    requestedAt: damlTypes.Time.encode(__typed__.requestedAt),
  };
}
,
  Archive: {
    template: function () { return exports.RegistrationRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RejectRegistration: {
    template: function () { return exports.RegistrationRequest; },
    choiceName: 'RejectRegistration',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectRegistration.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectRegistration.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ApproveRegistration: {
    template: function () { return exports.RegistrationRequest; },
    choiceName: 'ApproveRegistration',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveRegistration.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveRegistration.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UserAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UserAccount).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RegistrationRequest, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.AccountStatus = {
  AccountActive: 'AccountActive',
  AccountSuspended: 'AccountSuspended',
  AccountPendingReview: 'AccountPendingReview',
  keys: ['AccountActive','AccountSuspended','AccountPendingReview',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.AccountStatus.AccountActive), jtv.constant(exports.AccountStatus.AccountSuspended), jtv.constant(exports.AccountStatus.AccountPendingReview)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.IncrementTransactionsSubmitted = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UpdateReputation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reputationChange: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    reputationChange: damlTypes.Int.encode(__typed__.reputationChange),
  };
}
,
};



exports.ArchiveAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ReactivateAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.SuspendAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RequestMarketDataAccess = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tier: exports.DataAccessTier.decoder, }); }),
  encode: function (__typed__) {
  return {
    tier: exports.DataAccessTier.encode(__typed__.tier),
  };
}
,
};



exports.RequestVerificationRight = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RequestSubmissionRight = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UserAccount = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Role:UserAccount',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, user: damlTypes.Party.decoder, role: exports.UserRole.decoder, verificationWeight: damlTypes.Int.decoder, credentialPresentations: damlTypes.List(damlTypes.ContractId(W3C_VC.PresentationReceipt)).decoder, registeredAt: damlTypes.Time.decoder, status: exports.AccountStatus.decoder, reputation: damlTypes.Int.decoder, reputationCap: damlTypes.Int.decoder, transactionsSubmitted: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    user: damlTypes.Party.encode(__typed__.user),
    role: exports.UserRole.encode(__typed__.role),
    verificationWeight: damlTypes.Int.encode(__typed__.verificationWeight),
    credentialPresentations: damlTypes.List(damlTypes.ContractId(W3C_VC.PresentationReceipt)).encode(__typed__.credentialPresentations),
    registeredAt: damlTypes.Time.encode(__typed__.registeredAt),
    status: exports.AccountStatus.encode(__typed__.status),
    reputation: damlTypes.Int.encode(__typed__.reputation),
    reputationCap: damlTypes.Int.encode(__typed__.reputationCap),
    transactionsSubmitted: damlTypes.Int.encode(__typed__.transactionsSubmitted),
  };
}
,
  UpdateReputation: {
    template: function () { return exports.UserAccount; },
    choiceName: 'UpdateReputation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateReputation.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateReputation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UserAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UserAccount).encode(__typed__); },
  },
  RequestMarketDataAccess: {
    template: function () { return exports.UserAccount; },
    choiceName: 'RequestMarketDataAccess',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestMarketDataAccess.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestMarketDataAccess.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarketDataAccessRight).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarketDataAccessRight).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.UserAccount; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ArchiveAccount: {
    template: function () { return exports.UserAccount; },
    choiceName: 'ArchiveAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ArchiveAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.ArchiveAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RequestSubmissionRight: {
    template: function () { return exports.UserAccount; },
    choiceName: 'RequestSubmissionRight',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestSubmissionRight.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestSubmissionRight.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionSubmissionRight).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionSubmissionRight).encode(__typed__); },
  },
  RequestVerificationRight: {
    template: function () { return exports.UserAccount; },
    choiceName: 'RequestVerificationRight',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestVerificationRight.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestVerificationRight.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionVerificationRight).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionVerificationRight).encode(__typed__); },
  },
  SuspendAccount: {
    template: function () { return exports.UserAccount; },
    choiceName: 'SuspendAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SuspendAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.SuspendAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UserAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UserAccount).encode(__typed__); },
  },
  ReactivateAccount: {
    template: function () { return exports.UserAccount; },
    choiceName: 'ReactivateAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ReactivateAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.ReactivateAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UserAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UserAccount).encode(__typed__); },
  },
  IncrementTransactionsSubmitted: {
    template: function () { return exports.UserAccount; },
    choiceName: 'IncrementTransactionsSubmitted',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.IncrementTransactionsSubmitted.decoder; }),
    argumentEncode: function (__typed__) { return exports.IncrementTransactionsSubmitted.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UserAccount).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UserAccount).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.UserAccount, ['b919ab0836ef285aa313fa34566638088a101dd305bf3173b62add0499c0e860', '#unlockit-canton-core-ideathon']);



exports.UserRole = {
  PrivateCitizen: 'PrivateCitizen',
  RealtorAgent: 'RealtorAgent',
  RealtorBroker: 'RealtorBroker',
  RealtorMaster: 'RealtorMaster',
  NotaryPublic: 'NotaryPublic',
  TaxAuthority: 'TaxAuthority',
  keys: ['PrivateCitizen','RealtorAgent','RealtorBroker','RealtorMaster','NotaryPublic','TaxAuthority',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.UserRole.PrivateCitizen), jtv.constant(exports.UserRole.RealtorAgent), jtv.constant(exports.UserRole.RealtorBroker), jtv.constant(exports.UserRole.RealtorMaster), jtv.constant(exports.UserRole.NotaryPublic), jtv.constant(exports.UserRole.TaxAuthority)); }),
  encode: function (__typed__) { return __typed__; },
};

