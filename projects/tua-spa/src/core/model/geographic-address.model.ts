import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface GeographicAddress {
  id?: string;
  href?: string;
  streetNr?: string;
  streetNrLast?: string;
  streetNrLastSuffix?: string;
  streetName?: string;
  streetType?: string;
  streetSuffix?: string;
  postcode?: string;
  locality?: string;
  city?: string;
  stateOfProvince?: string;
  country?: string;
  relatedParty?: TmaTmfRelatedParty;
  geographicSubAddress?: GeographicSubAddress;
  isInstallationAddress?: boolean;
  isUnloadingAddress?: boolean;
  isContactAddress?: boolean;
  isShippingAddress?: boolean;
  isBillingAddress?: boolean;
}

export interface GeographicSubAddress {
  id?: string;
  href?: string;
  name?: string;
  type?: string;
  subUnitType?: string;
  subUnitNumber?: string;
  levelType?: string;
  levelNumber?: string;
  buildingName?: string;
  privateStreetNumber?: string;
  privateStreetName?: string;
}