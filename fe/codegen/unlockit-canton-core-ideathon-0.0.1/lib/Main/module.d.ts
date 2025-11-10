// Generated from Main.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from '@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type Give = {
  newOwner: damlTypes.Party;
};

export declare const Give:
  damlTypes.Serializable<Give> & {
  }
;


export declare type Asset = {
  issuer: damlTypes.Party;
  owner: damlTypes.Party;
  name: string;
};

export declare interface AssetInterface {
  Archive: damlTypes.Choice<Asset, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Asset, undefined>>;
  Give: damlTypes.Choice<Asset, Give, damlTypes.ContractId<Asset>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Asset, undefined>>;
}
export declare const Asset:
  damlTypes.Template<Asset, undefined, '#unlockit-canton-core-ideathon:Main:Asset'> &
  damlTypes.ToInterface<Asset, never> &
  AssetInterface;

export declare namespace Asset {
  export type CreateEvent = damlLedger.CreateEvent<Asset, undefined, typeof Asset.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Asset, typeof Asset.templateId>
  export type Event = damlLedger.Event<Asset, undefined, typeof Asset.templateId>
  export type QueryResult = damlLedger.QueryResult<Asset, undefined, typeof Asset.templateId>
}


