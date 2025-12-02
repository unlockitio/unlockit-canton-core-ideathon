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

var pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 = require('@daml.js/daml-prim-DA-Types-1.0.0');
var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');

var RETVN_Role = require('../../RETVN/Role/module');


exports.QueryAggregate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MarketDataAggregate = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Transaction:MarketDataAggregate',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, postalCode: damlTypes.Text.decoder, timeRangeDays: damlTypes.Int.decoder, transactionCount: damlTypes.Int.decoder, medianPrice: damlTypes.Numeric(10).decoder, averagePrice: damlTypes.Numeric(10).decoder, medianPricePerSqft: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Numeric(10)).decoder), averageDaysOnMarket: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), propertyTypeDistribution: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(exports.PropertyType, damlTypes.Int)).decoder, averageTrustScore: damlTypes.Int.decoder, generatedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    postalCode: damlTypes.Text.encode(__typed__.postalCode),
    timeRangeDays: damlTypes.Int.encode(__typed__.timeRangeDays),
    transactionCount: damlTypes.Int.encode(__typed__.transactionCount),
    medianPrice: damlTypes.Numeric(10).encode(__typed__.medianPrice),
    averagePrice: damlTypes.Numeric(10).encode(__typed__.averagePrice),
    medianPricePerSqft: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.medianPricePerSqft),
    averageDaysOnMarket: damlTypes.Optional(damlTypes.Int).encode(__typed__.averageDaysOnMarket),
    propertyTypeDistribution: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(exports.PropertyType, damlTypes.Int)).encode(__typed__.propertyTypeDistribution),
    averageTrustScore: damlTypes.Int.encode(__typed__.averageTrustScore),
    generatedAt: damlTypes.Time.encode(__typed__.generatedAt),
  };
}
,
  Archive: {
    template: function () { return exports.MarketDataAggregate; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  QueryAggregate: {
    template: function () { return exports.MarketDataAggregate; },
    choiceName: 'QueryAggregate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.QueryAggregate.decoder; }),
    argumentEncode: function (__typed__) { return exports.QueryAggregate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.MarketDataAggregate.decoder; }),
    resultEncode: function (__typed__) { return exports.MarketDataAggregate.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarketDataAggregate, ['6968b70e7fbe01c89f3b6c5ec483d18f5263ffb504010525d5f02ed230fec0bd', '#unlockit-canton-core-ideathon']);



exports.RejectVerification = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.AcceptVerification = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.VerificationProposal = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Transaction:VerificationProposal',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, verifier: damlTypes.Party.decoder, transactionDataCid: damlTypes.ContractId(exports.TransactionData).decoder, verifierAccount: damlTypes.ContractId(RETVN_Role.UserAccount).decoder, submitterAccount: damlTypes.ContractId(RETVN_Role.UserAccount).decoder, decision: exports.VerificationDecision.decoder, notes: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), verifiedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    verifier: damlTypes.Party.encode(__typed__.verifier),
    transactionDataCid: damlTypes.ContractId(exports.TransactionData).encode(__typed__.transactionDataCid),
    verifierAccount: damlTypes.ContractId(RETVN_Role.UserAccount).encode(__typed__.verifierAccount),
    submitterAccount: damlTypes.ContractId(RETVN_Role.UserAccount).encode(__typed__.submitterAccount),
    decision: exports.VerificationDecision.encode(__typed__.decision),
    notes: damlTypes.Optional(damlTypes.Text).encode(__typed__.notes),
    verifiedAt: damlTypes.Time.encode(__typed__.verifiedAt),
  };
}
,
  AcceptVerification: {
    template: function () { return exports.VerificationProposal; },
    choiceName: 'AcceptVerification',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptVerification.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptVerification.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionData).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionData).encode(__typed__); },
  },
  RejectVerification: {
    template: function () { return exports.VerificationProposal; },
    choiceName: 'RejectVerification',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectVerification.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectVerification.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.VerificationProposal; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.VerificationProposal, ['6968b70e7fbe01c89f3b6c5ec483d18f5263ffb504010525d5f02ed230fec0bd', '#unlockit-canton-core-ideathon']);



exports.RejectSubmission = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.AcceptSubmission = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.TransactionSubmissionProposal = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionSubmissionProposal',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, submitter: damlTypes.Party.decoder, submitterRole: RETVN_Role.UserRole.decoder, submissionRight: damlTypes.ContractId(RETVN_Role.TransactionSubmissionRight).decoder, transactionId: damlTypes.Text.decoder, propertyAddress: damlTypes.Text.decoder, postalCode: damlTypes.Text.decoder, propertyType: exports.PropertyType.decoder, livingAreaSqft: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), lotSizeSqft: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), bedroomsTotal: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), bathroomsTotal: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), yearBuilt: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), salePrice: damlTypes.Numeric(10).decoder, transactionDate: damlTypes.Time.decoder, closingDate: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), financingType: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), daysOnMarket: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), proposedVerifiers: damlTypes.List(damlTypes.Party).decoder, submittedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    submitter: damlTypes.Party.encode(__typed__.submitter),
    submitterRole: RETVN_Role.UserRole.encode(__typed__.submitterRole),
    submissionRight: damlTypes.ContractId(RETVN_Role.TransactionSubmissionRight).encode(__typed__.submissionRight),
    transactionId: damlTypes.Text.encode(__typed__.transactionId),
    propertyAddress: damlTypes.Text.encode(__typed__.propertyAddress),
    postalCode: damlTypes.Text.encode(__typed__.postalCode),
    propertyType: exports.PropertyType.encode(__typed__.propertyType),
    livingAreaSqft: damlTypes.Optional(damlTypes.Int).encode(__typed__.livingAreaSqft),
    lotSizeSqft: damlTypes.Optional(damlTypes.Int).encode(__typed__.lotSizeSqft),
    bedroomsTotal: damlTypes.Optional(damlTypes.Int).encode(__typed__.bedroomsTotal),
    bathroomsTotal: damlTypes.Optional(damlTypes.Int).encode(__typed__.bathroomsTotal),
    yearBuilt: damlTypes.Optional(damlTypes.Int).encode(__typed__.yearBuilt),
    salePrice: damlTypes.Numeric(10).encode(__typed__.salePrice),
    transactionDate: damlTypes.Time.encode(__typed__.transactionDate),
    closingDate: damlTypes.Optional(damlTypes.Time).encode(__typed__.closingDate),
    financingType: damlTypes.Optional(damlTypes.Text).encode(__typed__.financingType),
    daysOnMarket: damlTypes.Optional(damlTypes.Int).encode(__typed__.daysOnMarket),
    proposedVerifiers: damlTypes.List(damlTypes.Party).encode(__typed__.proposedVerifiers),
    submittedAt: damlTypes.Time.encode(__typed__.submittedAt),
  };
}
,
  AcceptSubmission: {
    template: function () { return exports.TransactionSubmissionProposal; },
    choiceName: 'AcceptSubmission',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptSubmission.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptSubmission.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionData).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionData).encode(__typed__); },
  },
  RejectSubmission: {
    template: function () { return exports.TransactionSubmissionProposal; },
    choiceName: 'RejectSubmission',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectSubmission.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectSubmission.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TransactionSubmissionProposal; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TransactionSubmissionProposal, ['6968b70e7fbe01c89f3b6c5ec483d18f5263ffb504010525d5f02ed230fec0bd', '#unlockit-canton-core-ideathon']);



exports.TransactionDataView = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('FullView'), value: exports.TransactionData.decoder, }), jtv.object({tag: jtv.constant('AggregateView'), value: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple4(damlTypes.Text, exports.PropertyType, damlTypes.Numeric(10), damlTypes.Int).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'FullView': return {tag: __typed__.tag, value: exports.TransactionData.encode(__typed__.value)};
    case 'AggregateView': return {tag: __typed__.tag, value: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple4(damlTypes.Text, exports.PropertyType, damlTypes.Numeric(10), damlTypes.Int).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type TransactionDataView';
  }
}
,
};



exports.TransactionStatus = {
  Unverified: 'Unverified',
  PartiallyVerified: 'PartiallyVerified',
  FullyVerified: 'FullyVerified',
  DisputedTransaction: 'DisputedTransaction',
  keys: ['Unverified','PartiallyVerified','FullyVerified','DisputedTransaction',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.TransactionStatus.Unverified), jtv.constant(exports.TransactionStatus.PartiallyVerified), jtv.constant(exports.TransactionStatus.FullyVerified), jtv.constant(exports.TransactionStatus.DisputedTransaction)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.VerificationDecision = {
  Confirmed: 'Confirmed',
  ConfirmedWithNotes: 'ConfirmedWithNotes',
  Disputed: 'Disputed',
  RequestClarification: 'RequestClarification',
  keys: ['Confirmed','ConfirmedWithNotes','Disputed','RequestClarification',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.VerificationDecision.Confirmed), jtv.constant(exports.VerificationDecision.ConfirmedWithNotes), jtv.constant(exports.VerificationDecision.Disputed), jtv.constant(exports.VerificationDecision.RequestClarification)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.Verification = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({verifier: damlTypes.Party.decoder, verifierRole: RETVN_Role.UserRole.decoder, verificationWeight: damlTypes.Int.decoder, decision: exports.VerificationDecision.decoder, notes: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), verifiedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    verifier: damlTypes.Party.encode(__typed__.verifier),
    verifierRole: RETVN_Role.UserRole.encode(__typed__.verifierRole),
    verificationWeight: damlTypes.Int.encode(__typed__.verificationWeight),
    decision: exports.VerificationDecision.encode(__typed__.decision),
    notes: damlTypes.Optional(damlTypes.Text).encode(__typed__.notes),
    verifiedAt: damlTypes.Time.encode(__typed__.verifiedAt),
  };
}
,
};



exports.QueryTransaction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requester: damlTypes.Party.decoder, accessTier: RETVN_Role.DataAccessTier.decoder, }); }),
  encode: function (__typed__) {
  return {
    requester: damlTypes.Party.encode(__typed__.requester),
    accessTier: RETVN_Role.DataAccessTier.encode(__typed__.accessTier),
  };
}
,
};



exports.ApplyVerification = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({verifier: damlTypes.Party.decoder, verifierAccount: damlTypes.ContractId(RETVN_Role.UserAccount).decoder, submitterAccount: damlTypes.ContractId(RETVN_Role.UserAccount).decoder, decision: exports.VerificationDecision.decoder, notes: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), verifiedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    verifier: damlTypes.Party.encode(__typed__.verifier),
    verifierAccount: damlTypes.ContractId(RETVN_Role.UserAccount).encode(__typed__.verifierAccount),
    submitterAccount: damlTypes.ContractId(RETVN_Role.UserAccount).encode(__typed__.submitterAccount),
    decision: exports.VerificationDecision.encode(__typed__.decision),
    notes: damlTypes.Optional(damlTypes.Text).encode(__typed__.notes),
    verifiedAt: damlTypes.Time.encode(__typed__.verifiedAt),
  };
}
,
};



exports.AssignVerifier = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({verifier: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    verifier: damlTypes.Party.encode(__typed__.verifier),
  };
}
,
};



exports.TransactionData = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.Transaction:TransactionData',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, submitter: damlTypes.Party.decoder, submitterRole: RETVN_Role.UserRole.decoder, transactionId: damlTypes.Text.decoder, propertyAddress: damlTypes.Text.decoder, postalCode: damlTypes.Text.decoder, propertyType: exports.PropertyType.decoder, livingAreaSqft: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), lotSizeSqft: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), bedroomsTotal: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), bathroomsTotal: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), yearBuilt: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), salePrice: damlTypes.Numeric(10).decoder, transactionDate: damlTypes.Time.decoder, closingDate: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), financingType: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), daysOnMarket: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), assignedVerifiers: damlTypes.List(damlTypes.Party).decoder, verifications: damlTypes.List(exports.Verification).decoder, trustScore: damlTypes.Int.decoder, status: exports.TransactionStatus.decoder, submittedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    submitter: damlTypes.Party.encode(__typed__.submitter),
    submitterRole: RETVN_Role.UserRole.encode(__typed__.submitterRole),
    transactionId: damlTypes.Text.encode(__typed__.transactionId),
    propertyAddress: damlTypes.Text.encode(__typed__.propertyAddress),
    postalCode: damlTypes.Text.encode(__typed__.postalCode),
    propertyType: exports.PropertyType.encode(__typed__.propertyType),
    livingAreaSqft: damlTypes.Optional(damlTypes.Int).encode(__typed__.livingAreaSqft),
    lotSizeSqft: damlTypes.Optional(damlTypes.Int).encode(__typed__.lotSizeSqft),
    bedroomsTotal: damlTypes.Optional(damlTypes.Int).encode(__typed__.bedroomsTotal),
    bathroomsTotal: damlTypes.Optional(damlTypes.Int).encode(__typed__.bathroomsTotal),
    yearBuilt: damlTypes.Optional(damlTypes.Int).encode(__typed__.yearBuilt),
    salePrice: damlTypes.Numeric(10).encode(__typed__.salePrice),
    transactionDate: damlTypes.Time.encode(__typed__.transactionDate),
    closingDate: damlTypes.Optional(damlTypes.Time).encode(__typed__.closingDate),
    financingType: damlTypes.Optional(damlTypes.Text).encode(__typed__.financingType),
    daysOnMarket: damlTypes.Optional(damlTypes.Int).encode(__typed__.daysOnMarket),
    assignedVerifiers: damlTypes.List(damlTypes.Party).encode(__typed__.assignedVerifiers),
    verifications: damlTypes.List(exports.Verification).encode(__typed__.verifications),
    trustScore: damlTypes.Int.encode(__typed__.trustScore),
    status: exports.TransactionStatus.encode(__typed__.status),
    submittedAt: damlTypes.Time.encode(__typed__.submittedAt),
  };
}
,
  AssignVerifier: {
    template: function () { return exports.TransactionData; },
    choiceName: 'AssignVerifier',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssignVerifier.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssignVerifier.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionData).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionData).encode(__typed__); },
  },
  ApplyVerification: {
    template: function () { return exports.TransactionData; },
    choiceName: 'ApplyVerification',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApplyVerification.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApplyVerification.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TransactionData).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TransactionData).encode(__typed__); },
  },
  QueryTransaction: {
    template: function () { return exports.TransactionData; },
    choiceName: 'QueryTransaction',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.QueryTransaction.decoder; }),
    argumentEncode: function (__typed__) { return exports.QueryTransaction.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.TransactionDataView.decoder; }),
    resultEncode: function (__typed__) { return exports.TransactionDataView.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TransactionData; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TransactionData, ['6968b70e7fbe01c89f3b6c5ec483d18f5263ffb504010525d5f02ed230fec0bd', '#unlockit-canton-core-ideathon']);



exports.PropertyType = {
  SingleFamily: 'SingleFamily',
  Condo: 'Condo',
  Townhouse: 'Townhouse',
  MultiFamily: 'MultiFamily',
  Land: 'Land',
  keys: ['SingleFamily','Condo','Townhouse','MultiFamily','Land',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.PropertyType.SingleFamily), jtv.constant(exports.PropertyType.Condo), jtv.constant(exports.PropertyType.Townhouse), jtv.constant(exports.PropertyType.MultiFamily), jtv.constant(exports.PropertyType.Land)); }),
  encode: function (__typed__) { return __typed__; },
};

