/**
 * Ledger Context - Provides access to DAML ledger functionality
 * Exports the necessary hooks and components for interacting with the DAML ledger
 */

export type {
  FetchResult,
  LedgerContext,
  QueryResult,
  FetchByKeysResult,
} from "@daml/react";

export {
  createLedgerContext,
} from "@daml/react";

import DamlLedger, {
  useParty,
  useUser,
  useLedger,
  useQuery,
  useFetch,
  useFetchByKey,
  useStreamQuery,
  useStreamQueries,
  useStreamFetchByKey,
  useStreamFetchByKeys,
  useReload,
} from "@daml/react";

export {
  useParty,
  useUser,
  useLedger,
  useQuery,
  useFetch,
  useFetchByKey,
  useStreamQuery,
  useStreamQueries,
  useStreamFetchByKey,
  useStreamFetchByKeys,
  useReload,
};

export default DamlLedger;
