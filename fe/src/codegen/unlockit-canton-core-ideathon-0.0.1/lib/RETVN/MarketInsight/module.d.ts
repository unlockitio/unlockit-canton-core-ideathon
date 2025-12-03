// Generated from RETVN/MarketInsight.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from '@daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

import * as RETVN_Transaction from '../../RETVN/Transaction/module';

export declare type AddContributions = {
  newContributions: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, TransactionContribution>[];
  newRewardAmount: damlTypes.Numeric;
};

export declare const AddContributions:
  damlTypes.Serializable<AddContributions> & {
  }
;


export declare type RedeemReward = {
  amountToRedeem: damlTypes.Numeric;
  redeemedAt: damlTypes.Time;
};

export declare const RedeemReward:
  damlTypes.Serializable<RedeemReward> & {
  }
;


export declare type ContributorReward = {
  operator: damlTypes.Party;
  recipient: damlTypes.Party;
  contributionCount: damlTypes.Int;
  rewardAmount: damlTypes.Numeric;
  redeemedAmount: damlTypes.Numeric;
  createdAt: damlTypes.Time;
  contributions: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, TransactionContribution[]>[];
};

export declare interface ContributorRewardInterface {
  RedeemReward: damlTypes.Choice<ContributorReward, RedeemReward, damlTypes.ContractId<ContributorReward>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ContributorReward, undefined>>;
  AddContributions: damlTypes.Choice<ContributorReward, AddContributions, damlTypes.ContractId<ContributorReward>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ContributorReward, undefined>>;
  Archive: damlTypes.Choice<ContributorReward, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ContributorReward, undefined>>;
}
export declare const ContributorReward:
  damlTypes.Template<ContributorReward, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:ContributorReward'> &
  damlTypes.ToInterface<ContributorReward, never> &
  ContributorRewardInterface;

export declare namespace ContributorReward {
}



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
  QueryInsight: damlTypes.Choice<MarketInsight, QueryInsight, InsightData, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsight, undefined>>;
  Archive: damlTypes.Choice<MarketInsight, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsight, undefined>>;
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
  paidOrderCid: damlTypes.ContractId<PaidMarketInsightOrder>;
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
  paymentReference: string;
};

export declare interface PaidMarketInsightOrderInterface {
  FulfillOrder: damlTypes.Choice<PaidMarketInsightOrder, FulfillOrder, pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<damlTypes.ContractId<MarketInsight>, damlTypes.ContractId<ContributorReward>[]>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaidMarketInsightOrder, undefined>>;
  Archive: damlTypes.Choice<PaidMarketInsightOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaidMarketInsightOrder, undefined>>;
}
export declare const PaidMarketInsightOrder:
  damlTypes.Template<PaidMarketInsightOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaidMarketInsightOrder'> &
  damlTypes.ToInterface<PaidMarketInsightOrder, never> &
  PaidMarketInsightOrderInterface;

export declare namespace PaidMarketInsightOrder {
}



export declare type ConfirmedPaymentOrder = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  orderedAt: damlTypes.Time;
  paymentAmount: damlTypes.Numeric;
  paymentInitiatedAt: damlTypes.Time;
  paymentReference: string;
  confirmedAt: damlTypes.Time;
};

export declare interface ConfirmedPaymentOrderInterface {
  Archive: damlTypes.Choice<ConfirmedPaymentOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<ConfirmedPaymentOrder, undefined>>;
}
export declare const ConfirmedPaymentOrder:
  damlTypes.Template<ConfirmedPaymentOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:ConfirmedPaymentOrder'> &
  damlTypes.ToInterface<ConfirmedPaymentOrder, never> &
  ConfirmedPaymentOrderInterface;

export declare namespace ConfirmedPaymentOrder {
}



export declare type CancelOrder = {
};

export declare const CancelOrder:
  damlTypes.Serializable<CancelOrder> & {
  }
;


export declare type RetryPayment = {
  newPaymentReference: string;
  retriedAt: damlTypes.Time;
};

export declare const RetryPayment:
  damlTypes.Serializable<RetryPayment> & {
  }
;


export declare type FailedPaymentOrder = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  orderedAt: damlTypes.Time;
  paymentAmount: damlTypes.Numeric;
  paymentInitiatedAt: damlTypes.Time;
  paymentReference: string;
  rejectedAt: damlTypes.Time;
  failureReason: string;
};

export declare interface FailedPaymentOrderInterface {
  Archive: damlTypes.Choice<FailedPaymentOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<FailedPaymentOrder, undefined>>;
  CancelOrder: damlTypes.Choice<FailedPaymentOrder, CancelOrder, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<FailedPaymentOrder, undefined>>;
  RetryPayment: damlTypes.Choice<FailedPaymentOrder, RetryPayment, damlTypes.ContractId<PaymentPendingOrder>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<FailedPaymentOrder, undefined>>;
}
export declare const FailedPaymentOrder:
  damlTypes.Template<FailedPaymentOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:FailedPaymentOrder'> &
  damlTypes.ToInterface<FailedPaymentOrder, never> &
  FailedPaymentOrderInterface;

export declare namespace FailedPaymentOrder {
}



export declare type RejectPayment = {
  rejectedAt: damlTypes.Time;
  failureReason: string;
};

export declare const RejectPayment:
  damlTypes.Serializable<RejectPayment> & {
  }
;


export declare type ConfirmPayment = {
  confirmedAt: damlTypes.Time;
};

export declare const ConfirmPayment:
  damlTypes.Serializable<ConfirmPayment> & {
  }
;


export declare type PaymentPendingOrder = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  orderedAt: damlTypes.Time;
  paymentAmount: damlTypes.Numeric;
  paymentInitiatedAt: damlTypes.Time;
  paymentReference: string;
};

export declare interface PaymentPendingOrderInterface {
  Archive: damlTypes.Choice<PaymentPendingOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaymentPendingOrder, undefined>>;
  ConfirmPayment: damlTypes.Choice<PaymentPendingOrder, ConfirmPayment, pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<damlTypes.ContractId<PaidMarketInsightOrder>, damlTypes.ContractId<ConfirmedPaymentOrder>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaymentPendingOrder, undefined>>;
  RejectPayment: damlTypes.Choice<PaymentPendingOrder, RejectPayment, damlTypes.ContractId<FailedPaymentOrder>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PaymentPendingOrder, undefined>>;
}
export declare const PaymentPendingOrder:
  damlTypes.Template<PaymentPendingOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:PaymentPendingOrder'> &
  damlTypes.ToInterface<PaymentPendingOrder, never> &
  PaymentPendingOrderInterface;

export declare namespace PaymentPendingOrder {
}



export declare type InitiatePayment = {
  paymentAmount: damlTypes.Numeric;
  paymentReference: string;
  initiatedAt: damlTypes.Time;
};

export declare const InitiatePayment:
  damlTypes.Serializable<InitiatePayment> & {
  }
;


export declare type MarketInsightOrder = {
  operator: damlTypes.Party;
  buyer: damlTypes.Party;
  queryParams: QueryParams;
  orderedAt: damlTypes.Time;
};

export declare interface MarketInsightOrderInterface {
  InitiatePayment: damlTypes.Choice<MarketInsightOrder, InitiatePayment, damlTypes.ContractId<PaymentPendingOrder>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsightOrder, undefined>>;
  Archive: damlTypes.Choice<MarketInsightOrder, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarketInsightOrder, undefined>>;
}
export declare const MarketInsightOrder:
  damlTypes.Template<MarketInsightOrder, undefined, '#unlockit-canton-core-ideathon:RETVN.MarketInsight:MarketInsightOrder'> &
  damlTypes.ToInterface<MarketInsightOrder, never> &
  MarketInsightOrderInterface;

export declare namespace MarketInsightOrder {
}



export declare type TransactionContribution = {
  paidOrderContractId: damlTypes.ContractId<PaidMarketInsightOrder>;
  amountReceived: damlTypes.Numeric;
  receivedAt: damlTypes.Time;
};

export declare const TransactionContribution:
  damlTypes.Serializable<TransactionContribution> & {
  }
;


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

