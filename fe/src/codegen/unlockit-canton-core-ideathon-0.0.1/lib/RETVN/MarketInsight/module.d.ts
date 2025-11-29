// Generated from RETVN/MarketInsight.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

import * as RETVN_Transaction from '../../RETVN/Transaction/module';

export declare type QueryInsight = {
  requester: damlTypes.Party;
};

export declare const QueryInsight:
  damlTypes.Serializable<QueryInsight> & {
  }
;


export declare type MarketInsight = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  insightData: InsightData;
  fulfilledAt: damlTypes.Time;
};

export declare interface MarketInsightInterface {
  Archive: damlTypes.Choice<MarketInsight, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsight, undefined>>;
  QueryInsight: damlTypes.Choice<MarketInsight, QueryInsight, InsightData, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsight, undefined>>;
}
export declare const MarketInsight:
  damlTypes.Template<MarketInsight, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsight'> &
  damlTypes.ToInterface<MarketInsight, never> &
  MarketInsightInterface;

export declare namespace MarketInsight {
}



export declare type FulfillOrder = {
  filteredTransactions: damlTypes.ContractId<RETVN_Transaction.TransactionData>[];
  fulfilledAt: damlTypes.Time;
};

export declare const FulfillOrder:
  damlTypes.Serializable<FulfillOrder> & {
  }
;


export declare type PaidMarketInsightOrder = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  orderedAt: damlTypes.Time;
  paidAmount: damlTypes.Numeric;
  paidAt: damlTypes.Time;
};

export declare interface PaidMarketInsightOrderInterface {
  FulfillOrder: damlTypes.Choice<PaidMarketInsightOrder, FulfillOrder, damlTypes.ContractId<MarketInsight>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaidMarketInsightOrder, undefined>>;
  Archive: damlTypes.Choice<PaidMarketInsightOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaidMarketInsightOrder, undefined>>;
}
export declare const PaidMarketInsightOrder:
  damlTypes.Template<PaidMarketInsightOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaidMarketInsightOrder'> &
  damlTypes.ToInterface<PaidMarketInsightOrder, never> &
  PaidMarketInsightOrderInterface;

export declare namespace PaidMarketInsightOrder {
}



export declare type PayOrder = {
  paymentAmount: damlTypes.Numeric;
  paidAt: damlTypes.Time;
};

export declare const PayOrder:
  damlTypes.Serializable<PayOrder> & {
  }
;


export declare type MarketInsightOrder = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  orderedAt: damlTypes.Time;
};

export declare interface MarketInsightOrderInterface {
  PayOrder: damlTypes.Choice<MarketInsightOrder, PayOrder, damlTypes.ContractId<PaidMarketInsightOrder>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsightOrder, undefined>>;
  Archive: damlTypes.Choice<MarketInsightOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsightOrder, undefined>>;
}
export declare const MarketInsightOrder:
  damlTypes.Template<MarketInsightOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsightOrder'> &
  damlTypes.ToInterface<MarketInsightOrder, never> &
  MarketInsightOrderInterface;

export declare namespace MarketInsightOrder {
}



export declare type InsightData = {
  segments: SegmentStats[];
  totalTransactionCount: damlTypes.Int;
  generatedAt: damlTypes.Time;
};

export declare const InsightData:
  damlTypes.Serializable<InsightData> & {
  }
;


export declare type TransactionDetail = {
  address: string;
  price: damlTypes.Numeric;
  bedrooms: damlTypes.Int;
  sqft: damlTypes.Int;
  trustScore: damlTypes.Int;
  date: string;
};

export declare const TransactionDetail:
  damlTypes.Serializable<TransactionDetail> & {
  }
;


export declare type SegmentStats = {
  bedroom: damlTypes.Optional<string>;
  livingArea: damlTypes.Optional<string>;
  yearBuilt: damlTypes.Optional<string>;
  propertyType: damlTypes.Optional<string>;
  minPrice: damlTypes.Numeric;
  avgPrice: damlTypes.Numeric;
  maxPrice: damlTypes.Numeric;
  transactionCount: damlTypes.Int;
  minDaysOnMarket: damlTypes.Optional<damlTypes.Int>;
  avgDaysOnMarket: damlTypes.Optional<damlTypes.Int>;
  maxDaysOnMarket: damlTypes.Optional<damlTypes.Int>;
  transactions: TransactionDetail[];
};

export declare const SegmentStats:
  damlTypes.Serializable<SegmentStats> & {
  }
;


export declare type QueryParams = {
  postalCode: damlTypes.Optional<string>;
  qualityLevel: string;
  dataScope: string;
  timeRange: string;
  bedrooms: string[];
  livingArea: string[];
  yearBuilt: string[];
  propertyType: string[];
};

export declare const QueryParams:
  damlTypes.Serializable<QueryParams> & {
  }
;

