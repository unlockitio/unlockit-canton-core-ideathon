export interface Party {
  party: string;
}

export interface User {
  userId: string;
  primaryParty: string;
}

export interface AuthToken {
  token: string;
  userId: string;
  party: string;
}

export interface Contract<T> {
  templateId: string;
  contractId: string;
  payload: T;
  signatories: string[];
  observers: string[];
  agreementText: string;
}

export interface CreateEvent<T> {
  created: Contract<T>;
}

export interface ArchiveEvent {
  archived: {
    contractId: string;
    templateId: string;
  };
}

export interface QueryResult<T> {
  status: number;
  result: Contract<T>[];
}

export interface ExerciseResult<T> {
  status: number;
  result: {
    exerciseResult: T;
    events: (CreateEvent<any> | ArchiveEvent)[];
  };
}

export interface CreateResult<T> {
  status: number;
  result: Contract<T>;
}
