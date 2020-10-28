export interface TmaTmfRelatedParty {
  id: string;
  href?: string;
  role?: string;
  name?: string;
}

export enum TmaTmfRelatedPartyRole {
  CUSTOMER = 'CUSTOMER',
  ANONYMOUS = 'ANONYMOUS',
}
