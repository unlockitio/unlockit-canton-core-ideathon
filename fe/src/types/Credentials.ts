// Credentials type for DAML authentication
// This is used to find the public party.
// On DAML Hub, we use @daml/hub-react for this.
// Locally we infer it from the token.

export type PublicParty = {
  usePublicParty: () => string | undefined;
  setup: () => void;
};

export type User = {
  userId: string;
  primaryParty: string;
};

export type Credentials = {
  party: string;
  token: string;
  user: User;
  getPublicParty: () => PublicParty;
};

export default Credentials;
