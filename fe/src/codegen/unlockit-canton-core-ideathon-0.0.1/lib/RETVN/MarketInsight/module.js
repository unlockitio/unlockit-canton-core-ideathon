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

var RETVN_Transaction = require('../../RETVN/Transaction/module');


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
  Archive: {
    template: function () { return exports.MarketInsight; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  QueryInsight: {
    template: function () { return exports.MarketInsight; },
    choiceName: 'QueryInsight',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.QueryInsight.decoder; }),
    argumentEncode: function (__typed__) { return exports.QueryInsight.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.InsightData.decoder; }),
    resultEncode: function (__typed__) { return exports.InsightData.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarketInsight, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



exports.FulfillOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({filteredTransactions: damlTypes.List(damlTypes.ContractId(RETVN_Transaction.TransactionData)).decoder, fulfilledAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    filteredTransactions: damlTypes.List(damlTypes.ContractId(RETVN_Transaction.TransactionData)).encode(__typed__.filteredTransactions),
    fulfilledAt: damlTypes.Time.encode(__typed__.fulfilledAt),
  };
}
,
};



exports.PaidMarketInsightOrder = damlTypes.assembleTemplate(
{
  templateId: '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaidMarketInsightOrder',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, queryParams: exports.QueryParams.decoder, orderedAt: damlTypes.Time.decoder, paidAmount: damlTypes.Numeric(10).decoder, paidAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    queryParams: exports.QueryParams.encode(__typed__.queryParams),
    orderedAt: damlTypes.Time.encode(__typed__.orderedAt),
    paidAmount: damlTypes.Numeric(10).encode(__typed__.paidAmount),
    paidAt: damlTypes.Time.encode(__typed__.paidAt),
  };
}
,
  FulfillOrder: {
    template: function () { return exports.PaidMarketInsightOrder; },
    choiceName: 'FulfillOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FulfillOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.FulfillOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarketInsight).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarketInsight).encode(__typed__); },
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


damlTypes.registerTemplate(exports.PaidMarketInsightOrder, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



exports.PayOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({paymentAmount: damlTypes.Numeric(10).decoder, paidAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    paymentAmount: damlTypes.Numeric(10).encode(__typed__.paymentAmount),
    paidAt: damlTypes.Time.encode(__typed__.paidAt),
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
  PayOrder: {
    template: function () { return exports.MarketInsightOrder; },
    choiceName: 'PayOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.PayOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.PayOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PaidMarketInsightOrder).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PaidMarketInsightOrder).encode(__typed__); },
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


damlTypes.registerTemplate(exports.MarketInsightOrder, ['3b8845dbc083601b421bdd16e6c4a1326be7516e30fb079baba9120fc2b99699', '#unlockit-canton-core-ideathon']);



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

