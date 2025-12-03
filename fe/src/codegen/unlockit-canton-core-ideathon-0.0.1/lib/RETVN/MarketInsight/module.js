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

var RETVN_Transaction = require('../../RETVN/Transaction/module');


exports.AddContributions = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newContributions: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, exports.TransactionContribution)).decoder, newRewardAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    newContributions: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, exports.TransactionContribution)).encode(__typed__.newContributions),
    newRewardAmount: damlTypes.Numeric(10).encode(__typed__.newRewardAmount),
  };
}
,
};



exports.RedeemReward = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amountToRedeem: damlTypes.Numeric(10).decoder, redeemedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    amountToRedeem: damlTypes.Numeric(10).encode(__typed__.amountToRedeem),
    redeemedAt: damlTypes.Time.encode(__typed__.redeemedAt),
  };
}
,
};



exports.ContributorReward = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:ContributorReward',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, recipient: damlTypes.Party.decoder, contributionCount: damlTypes.Int.decoder, rewardAmount: damlTypes.Numeric(10).decoder, redeemedAmount: damlTypes.Numeric(10).decoder, createdAt: damlTypes.Time.decoder, contributions: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.List(exports.TransactionContribution))).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    recipient: damlTypes.Party.encode(__typed__.recipient),
    contributionCount: damlTypes.Int.encode(__typed__.contributionCount),
    rewardAmount: damlTypes.Numeric(10).encode(__typed__.rewardAmount),
    redeemedAmount: damlTypes.Numeric(10).encode(__typed__.redeemedAmount),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    contributions: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.List(exports.TransactionContribution))).encode(__typed__.contributions),
  };
}
,
  RedeemReward: {
    template: function () { return exports.ContributorReward; },
    choiceName: 'RedeemReward',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RedeemReward.decoder; }),
    argumentEncode: function (__typed__) { return exports.RedeemReward.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ContributorReward).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ContributorReward).encode(__typed__); },
  },
  AddContributions: {
    template: function () { return exports.ContributorReward; },
    choiceName: 'AddContributions',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AddContributions.decoder; }),
    argumentEncode: function (__typed__) { return exports.AddContributions.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ContributorReward).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ContributorReward).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ContributorReward; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ContributorReward, ['3484f6c7f459255732b7734c761035413b0993af5a8afc4e71f5b310f8e685e2', '#unlockit-canton-core-ideathon']);



exports.QueryInsight = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requester: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    requester: damlTypes.Party.encode(__typed__.requester),
  };
}
,
};



exports.MarketInsight = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsight',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, queryParams: exports.QueryParams.decoder, insightData: exports.InsightData.decoder, fulfilledAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    queryParams: exports.QueryParams.encode(__typed__.queryParams),
    insightData: exports.InsightData.encode(__typed__.insightData),
    fulfilledAt: damlTypes.Time.encode(__typed__.fulfilledAt),
  };
}
,
  QueryInsight: {
    template: function () { return exports.MarketInsight; },
    choiceName: 'QueryInsight',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.QueryInsight.decoder; }),
    argumentEncode: function (__typed__) { return exports.QueryInsight.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.InsightData.decoder; }),
    resultEncode: function (__typed__) { return exports.InsightData.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.MarketInsight; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarketInsight, ['3484f6c7f459255732b7734c761035413b0993af5a8afc4e71f5b310f8e685e2', '#unlockit-canton-core-ideathon']);



exports.FulfillOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({filteredTransactions: damlTypes.List(damlTypes.ContractId(RETVN_Transaction.TransactionData)).decoder, fulfilledAt: damlTypes.Time.decoder, paidOrderCid: damlTypes.ContractId(exports.PaidMarketInsightOrder).decoder, }); }),
  encode: function (__typed__) {
  return {
    filteredTransactions: damlTypes.List(damlTypes.ContractId(RETVN_Transaction.TransactionData)).encode(__typed__.filteredTransactions),
    fulfilledAt: damlTypes.Time.encode(__typed__.fulfilledAt),
    paidOrderCid: damlTypes.ContractId(exports.PaidMarketInsightOrder).encode(__typed__.paidOrderCid),
  };
}
,
};



exports.PaidMarketInsightOrder = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaidMarketInsightOrder',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, queryParams: exports.QueryParams.decoder, orderedAt: damlTypes.Time.decoder, paidAmount: damlTypes.Numeric(10).decoder, paidAt: damlTypes.Time.decoder, paymentReference: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    queryParams: exports.QueryParams.encode(__typed__.queryParams),
    orderedAt: damlTypes.Time.encode(__typed__.orderedAt),
    paidAmount: damlTypes.Numeric(10).encode(__typed__.paidAmount),
    paidAt: damlTypes.Time.encode(__typed__.paidAt),
    paymentReference: damlTypes.Text.encode(__typed__.paymentReference),
  };
}
,
  FulfillOrder: {
    template: function () { return exports.PaidMarketInsightOrder; },
    choiceName: 'FulfillOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FulfillOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.FulfillOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.ContractId(exports.MarketInsight), damlTypes.List(damlTypes.ContractId(exports.ContributorReward))).decoder; }),
    resultEncode: function (__typed__) { return pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.ContractId(exports.MarketInsight), damlTypes.List(damlTypes.ContractId(exports.ContributorReward))).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.PaidMarketInsightOrder; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PaidMarketInsightOrder, ['3484f6c7f459255732b7734c761035413b0993af5a8afc4e71f5b310f8e685e2', '#unlockit-canton-core-ideathon']);



exports.CancelOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RetryPayment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newPaymentReference: damlTypes.Text.decoder, retriedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    newPaymentReference: damlTypes.Text.encode(__typed__.newPaymentReference),
    retriedAt: damlTypes.Time.encode(__typed__.retriedAt),
  };
}
,
};



exports.FailedPaymentOrder = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:FailedPaymentOrder',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, queryParams: exports.QueryParams.decoder, orderedAt: damlTypes.Time.decoder, paymentAmount: damlTypes.Numeric(10).decoder, paymentInitiatedAt: damlTypes.Time.decoder, paymentReference: damlTypes.Text.decoder, rejectedAt: damlTypes.Time.decoder, failureReason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    queryParams: exports.QueryParams.encode(__typed__.queryParams),
    orderedAt: damlTypes.Time.encode(__typed__.orderedAt),
    paymentAmount: damlTypes.Numeric(10).encode(__typed__.paymentAmount),
    paymentInitiatedAt: damlTypes.Time.encode(__typed__.paymentInitiatedAt),
    paymentReference: damlTypes.Text.encode(__typed__.paymentReference),
    rejectedAt: damlTypes.Time.encode(__typed__.rejectedAt),
    failureReason: damlTypes.Text.encode(__typed__.failureReason),
  };
}
,
  Archive: {
    template: function () { return exports.FailedPaymentOrder; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CancelOrder: {
    template: function () { return exports.FailedPaymentOrder; },
    choiceName: 'CancelOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RetryPayment: {
    template: function () { return exports.FailedPaymentOrder; },
    choiceName: 'RetryPayment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RetryPayment.decoder; }),
    argumentEncode: function (__typed__) { return exports.RetryPayment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PaymentPendingOrder).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PaymentPendingOrder).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.FailedPaymentOrder, ['3484f6c7f459255732b7734c761035413b0993af5a8afc4e71f5b310f8e685e2', '#unlockit-canton-core-ideathon']);



exports.RejectPayment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({rejectedAt: damlTypes.Time.decoder, failureReason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    rejectedAt: damlTypes.Time.encode(__typed__.rejectedAt),
    failureReason: damlTypes.Text.encode(__typed__.failureReason),
  };
}
,
};



exports.ConfirmPayment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({confirmedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    confirmedAt: damlTypes.Time.encode(__typed__.confirmedAt),
  };
}
,
};



exports.PaymentPendingOrder = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaymentPendingOrder',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, queryParams: exports.QueryParams.decoder, orderedAt: damlTypes.Time.decoder, paymentAmount: damlTypes.Numeric(10).decoder, paymentInitiatedAt: damlTypes.Time.decoder, paymentReference: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    queryParams: exports.QueryParams.encode(__typed__.queryParams),
    orderedAt: damlTypes.Time.encode(__typed__.orderedAt),
    paymentAmount: damlTypes.Numeric(10).encode(__typed__.paymentAmount),
    paymentInitiatedAt: damlTypes.Time.encode(__typed__.paymentInitiatedAt),
    paymentReference: damlTypes.Text.encode(__typed__.paymentReference),
  };
}
,
  Archive: {
    template: function () { return exports.PaymentPendingOrder; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ConfirmPayment: {
    template: function () { return exports.PaymentPendingOrder; },
    choiceName: 'ConfirmPayment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmPayment.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfirmPayment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PaidMarketInsightOrder).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PaidMarketInsightOrder).encode(__typed__); },
  },
  RejectPayment: {
    template: function () { return exports.PaymentPendingOrder; },
    choiceName: 'RejectPayment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectPayment.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectPayment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FailedPaymentOrder).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FailedPaymentOrder).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PaymentPendingOrder, ['3484f6c7f459255732b7734c761035413b0993af5a8afc4e71f5b310f8e685e2', '#unlockit-canton-core-ideathon']);



exports.InitiatePayment = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({paymentAmount: damlTypes.Numeric(10).decoder, paymentReference: damlTypes.Text.decoder, initiatedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    paymentAmount: damlTypes.Numeric(10).encode(__typed__.paymentAmount),
    paymentReference: damlTypes.Text.encode(__typed__.paymentReference),
    initiatedAt: damlTypes.Time.encode(__typed__.initiatedAt),
  };
}
,
};



exports.MarketInsightOrder = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsightOrder',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, queryParams: exports.QueryParams.decoder, orderedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    queryParams: exports.QueryParams.encode(__typed__.queryParams),
    orderedAt: damlTypes.Time.encode(__typed__.orderedAt),
  };
}
,
  InitiatePayment: {
    template: function () { return exports.MarketInsightOrder; },
    choiceName: 'InitiatePayment',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.InitiatePayment.decoder; }),
    argumentEncode: function (__typed__) { return exports.InitiatePayment.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PaymentPendingOrder).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PaymentPendingOrder).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.MarketInsightOrder; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarketInsightOrder, ['3484f6c7f459255732b7734c761035413b0993af5a8afc4e71f5b310f8e685e2', '#unlockit-canton-core-ideathon']);



exports.TransactionContribution = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({paidOrderContractId: damlTypes.ContractId(exports.PaidMarketInsightOrder).decoder, amountReceived: damlTypes.Numeric(10).decoder, receivedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    paidOrderContractId: damlTypes.ContractId(exports.PaidMarketInsightOrder).encode(__typed__.paidOrderContractId),
    amountReceived: damlTypes.Numeric(10).encode(__typed__.amountReceived),
    receivedAt: damlTypes.Time.encode(__typed__.receivedAt),
  };
}
,
};



exports.InsightData = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({segments: damlTypes.List(exports.SegmentStats).decoder, totalTransactionCount: damlTypes.Int.decoder, generatedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    segments: damlTypes.List(exports.SegmentStats).encode(__typed__.segments),
    totalTransactionCount: damlTypes.Int.encode(__typed__.totalTransactionCount),
    generatedAt: damlTypes.Time.encode(__typed__.generatedAt),
  };
}
,
};



exports.TransactionDetail = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({address: damlTypes.Text.decoder, price: damlTypes.Numeric(10).decoder, bedrooms: damlTypes.Int.decoder, sqft: damlTypes.Int.decoder, trustScore: damlTypes.Int.decoder, date: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    address: damlTypes.Text.encode(__typed__.address),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    bedrooms: damlTypes.Int.encode(__typed__.bedrooms),
    sqft: damlTypes.Int.encode(__typed__.sqft),
    trustScore: damlTypes.Int.encode(__typed__.trustScore),
    date: damlTypes.Text.encode(__typed__.date),
  };
}
,
};



exports.SegmentStats = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({bedroom: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), livingArea: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), yearBuilt: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), propertyType: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), minPrice: damlTypes.Numeric(10).decoder, avgPrice: damlTypes.Numeric(10).decoder, maxPrice: damlTypes.Numeric(10).decoder, transactionCount: damlTypes.Int.decoder, minDaysOnMarket: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), avgDaysOnMarket: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), maxDaysOnMarket: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Int).decoder), transactions: damlTypes.List(exports.TransactionDetail).decoder, }); }),
  encode: function (__typed__) {
  return {
    bedroom: damlTypes.Optional(damlTypes.Text).encode(__typed__.bedroom),
    livingArea: damlTypes.Optional(damlTypes.Text).encode(__typed__.livingArea),
    yearBuilt: damlTypes.Optional(damlTypes.Text).encode(__typed__.yearBuilt),
    propertyType: damlTypes.Optional(damlTypes.Text).encode(__typed__.propertyType),
    minPrice: damlTypes.Numeric(10).encode(__typed__.minPrice),
    avgPrice: damlTypes.Numeric(10).encode(__typed__.avgPrice),
    maxPrice: damlTypes.Numeric(10).encode(__typed__.maxPrice),
    transactionCount: damlTypes.Int.encode(__typed__.transactionCount),
    minDaysOnMarket: damlTypes.Optional(damlTypes.Int).encode(__typed__.minDaysOnMarket),
    avgDaysOnMarket: damlTypes.Optional(damlTypes.Int).encode(__typed__.avgDaysOnMarket),
    maxDaysOnMarket: damlTypes.Optional(damlTypes.Int).encode(__typed__.maxDaysOnMarket),
    transactions: damlTypes.List(exports.TransactionDetail).encode(__typed__.transactions),
  };
}
,
};



exports.QueryParams = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({postalCode: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), qualityLevel: damlTypes.Text.decoder, dataScope: damlTypes.Text.decoder, timeRange: damlTypes.Text.decoder, bedrooms: damlTypes.List(damlTypes.Text).decoder, livingArea: damlTypes.List(damlTypes.Text).decoder, yearBuilt: damlTypes.List(damlTypes.Text).decoder, propertyType: damlTypes.List(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    postalCode: damlTypes.Optional(damlTypes.Text).encode(__typed__.postalCode),
    qualityLevel: damlTypes.Text.encode(__typed__.qualityLevel),
    dataScope: damlTypes.Text.encode(__typed__.dataScope),
    timeRange: damlTypes.Text.encode(__typed__.timeRange),
    bedrooms: damlTypes.List(damlTypes.Text).encode(__typed__.bedrooms),
    livingArea: damlTypes.List(damlTypes.Text).encode(__typed__.livingArea),
    yearBuilt: damlTypes.List(damlTypes.Text).encode(__typed__.yearBuilt),
    propertyType: damlTypes.List(damlTypes.Text).encode(__typed__.propertyType),
  };
}
,
};

