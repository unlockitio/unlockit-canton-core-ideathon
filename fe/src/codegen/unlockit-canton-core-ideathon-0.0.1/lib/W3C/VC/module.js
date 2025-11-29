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


exports.IsRevoked = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({queryCredentialId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    queryCredentialId: damlTypes.Text.encode(__typed__.queryCredentialId),
  };
}
,
};



exports.RevocationRegistryEntry = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:W3C.VC:RevocationRegistryEntry',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({credentialId: damlTypes.Text.decoder, issuer: damlTypes.Party.decoder, revokedAt: damlTypes.Time.decoder, reason: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), }); }),
  encode: function (__typed__) {
  return {
    credentialId: damlTypes.Text.encode(__typed__.credentialId),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    revokedAt: damlTypes.Time.encode(__typed__.revokedAt),
    reason: damlTypes.Optional(damlTypes.Text).encode(__typed__.reason),
  };
}
,
  Archive: {
    template: function () { return exports.RevocationRegistryEntry; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  IsRevoked: {
    template: function () { return exports.RevocationRegistryEntry; },
    choiceName: 'IsRevoked',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.IsRevoked.decoder; }),
    argumentEncode: function (__typed__) { return exports.IsRevoked.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Bool.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Bool.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RevocationRegistryEntry, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



exports.RejectRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    reason: damlTypes.Text.encode(__typed__.reason),
  };
}
,
};



exports.ApproveAndIssue = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({credentialId: damlTypes.Text.decoder, issuanceDate: damlTypes.Time.decoder, expirationDate: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), proof: exports.Proof.decoder, subjectDid: damlTypes.Text.decoder, credentialSchema: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), credentialContext: damlTypes.List(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    credentialId: damlTypes.Text.encode(__typed__.credentialId),
    issuanceDate: damlTypes.Time.encode(__typed__.issuanceDate),
    expirationDate: damlTypes.Optional(damlTypes.Time).encode(__typed__.expirationDate),
    proof: exports.Proof.encode(__typed__.proof),
    subjectDid: damlTypes.Text.encode(__typed__.subjectDid),
    credentialSchema: damlTypes.Optional(damlTypes.Text).encode(__typed__.credentialSchema),
    credentialContext: damlTypes.List(damlTypes.Text).encode(__typed__.credentialContext),
  };
}
,
};



exports.CredentialIssuanceRequest = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:W3C.VC:CredentialIssuanceRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requestId: damlTypes.Text.decoder, issuer: damlTypes.Party.decoder, subject: damlTypes.Party.decoder, requestedCredentialType: damlTypes.List(damlTypes.Text).decoder, requestedClaims: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).decoder, supportingDocuments: damlTypes.List(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    requestId: damlTypes.Text.encode(__typed__.requestId),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    subject: damlTypes.Party.encode(__typed__.subject),
    requestedCredentialType: damlTypes.List(damlTypes.Text).encode(__typed__.requestedCredentialType),
    requestedClaims: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).encode(__typed__.requestedClaims),
    supportingDocuments: damlTypes.List(damlTypes.Text).encode(__typed__.supportingDocuments),
  };
}
,
  ApproveAndIssue: {
    template: function () { return exports.CredentialIssuanceRequest; },
    choiceName: 'ApproveAndIssue',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveAndIssue.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveAndIssue.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.VerifiableCredential).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.VerifiableCredential).encode(__typed__); },
  },
  RejectRequest: {
    template: function () { return exports.CredentialIssuanceRequest; },
    choiceName: 'RejectRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.CredentialIssuanceRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CredentialIssuanceRequest, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



exports.AcknowledgePresentation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.PresentationReceipt = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:W3C.VC:PresentationReceipt',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({credentialId: damlTypes.Text.decoder, holder: damlTypes.Party.decoder, verifier: damlTypes.Party.decoder, presentedAt: damlTypes.Time.decoder, challenge: damlTypes.Text.decoder, presentationProof: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    credentialId: damlTypes.Text.encode(__typed__.credentialId),
    holder: damlTypes.Party.encode(__typed__.holder),
    verifier: damlTypes.Party.encode(__typed__.verifier),
    presentedAt: damlTypes.Time.encode(__typed__.presentedAt),
    challenge: damlTypes.Text.encode(__typed__.challenge),
    presentationProof: damlTypes.Text.encode(__typed__.presentationProof),
  };
}
,
  AcknowledgePresentation: {
    template: function () { return exports.PresentationReceipt; },
    choiceName: 'AcknowledgePresentation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcknowledgePresentation.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcknowledgePresentation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.PresentationReceipt; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PresentationReceipt, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



exports.PresentCredential = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({verifier: damlTypes.Party.decoder, challenge: damlTypes.Text.decoder, presentationProof: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    verifier: damlTypes.Party.encode(__typed__.verifier),
    challenge: damlTypes.Text.encode(__typed__.challenge),
    presentationProof: damlTypes.Text.encode(__typed__.presentationProof),
  };
}
,
};



exports.AddVerifier = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({verifier: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    verifier: damlTypes.Party.encode(__typed__.verifier),
  };
}
,
};



exports.TransferCredential = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newHolder: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    newHolder: damlTypes.Party.encode(__typed__.newHolder),
  };
}
,
};



exports.Revoke = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Reactivate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Suspend = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.IsValid = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({currentTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    currentTime: damlTypes.Time.encode(__typed__.currentTime),
  };
}
,
};



exports.VerifiableCredential = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:W3C.VC:VerifiableCredential',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({credentialId: damlTypes.Text.decoder, credentialType: damlTypes.List(damlTypes.Text).decoder, issuer: damlTypes.Party.decoder, issuanceDate: damlTypes.Time.decoder, expirationDate: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), subject: exports.CredentialSubject.decoder, proof: exports.Proof.decoder, status: exports.CredentialStatus.decoder, holder: damlTypes.Party.decoder, verifiers: damlTypes.List(damlTypes.Party).decoder, credentialSchema: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), credentialContext: damlTypes.List(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    credentialId: damlTypes.Text.encode(__typed__.credentialId),
    credentialType: damlTypes.List(damlTypes.Text).encode(__typed__.credentialType),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    issuanceDate: damlTypes.Time.encode(__typed__.issuanceDate),
    expirationDate: damlTypes.Optional(damlTypes.Time).encode(__typed__.expirationDate),
    subject: exports.CredentialSubject.encode(__typed__.subject),
    proof: exports.Proof.encode(__typed__.proof),
    status: exports.CredentialStatus.encode(__typed__.status),
    holder: damlTypes.Party.encode(__typed__.holder),
    verifiers: damlTypes.List(damlTypes.Party).encode(__typed__.verifiers),
    credentialSchema: damlTypes.Optional(damlTypes.Text).encode(__typed__.credentialSchema),
    credentialContext: damlTypes.List(damlTypes.Text).encode(__typed__.credentialContext),
  };
}
,
  IsValid: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'IsValid',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.IsValid.decoder; }),
    argumentEncode: function (__typed__) { return exports.IsValid.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Bool.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Bool.encode(__typed__); },
  },
  Suspend: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'Suspend',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Suspend.decoder; }),
    argumentEncode: function (__typed__) { return exports.Suspend.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.VerifiableCredential).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.VerifiableCredential).encode(__typed__); },
  },
  Reactivate: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'Reactivate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Reactivate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Reactivate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.VerifiableCredential).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.VerifiableCredential).encode(__typed__); },
  },
  Revoke: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'Revoke',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Revoke.decoder; }),
    argumentEncode: function (__typed__) { return exports.Revoke.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  TransferCredential: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'TransferCredential',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TransferCredential.decoder; }),
    argumentEncode: function (__typed__) { return exports.TransferCredential.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.VerifiableCredential).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.VerifiableCredential).encode(__typed__); },
  },
  AddVerifier: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'AddVerifier',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddVerifier.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddVerifier.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.VerifiableCredential).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.VerifiableCredential).encode(__typed__); },
  },
  PresentCredential: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'PresentCredential',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.PresentCredential.decoder; }),
    argumentEncode: function (__typed__) { return exports.PresentCredential.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PresentationReceipt).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PresentationReceipt).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.VerifiableCredential; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.VerifiableCredential, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



exports.Proof = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({proofType: damlTypes.Text.decoder, created: damlTypes.Time.decoder, proofPurpose: damlTypes.Text.decoder, verificationMethod: damlTypes.Text.decoder, proofValue: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    proofType: damlTypes.Text.encode(__typed__.proofType),
    created: damlTypes.Time.encode(__typed__.created),
    proofPurpose: damlTypes.Text.encode(__typed__.proofPurpose),
    verificationMethod: damlTypes.Text.encode(__typed__.verificationMethod),
    proofValue: damlTypes.Text.encode(__typed__.proofValue),
  };
}
,
};



exports.CredentialSubject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: damlTypes.Text.decoder, claims: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: damlTypes.Text.encode(__typed__.id),
    claims: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.Text)).encode(__typed__.claims),
  };
}
,
};



exports.CredentialStatus = {
  Active: 'Active',
  Suspended: 'Suspended',
  Revoked: 'Revoked',
  keys: ['Active','Suspended','Revoked',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.CredentialStatus.Active), jtv.constant(exports.CredentialStatus.Suspended), jtv.constant(exports.CredentialStatus.Revoked)); }),
  encode: function (__typed__) { return __typed__; },
};

