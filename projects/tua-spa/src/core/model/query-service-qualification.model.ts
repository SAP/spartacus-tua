import { TimePeriod } from "./time-period.model";
import { GeographicAddress } from './geographic-address.model';

export interface QueryServiceQualification {
  id?: string;
  href?: string;
  description?: string;
  effectiveQualificationDate?: TimePeriod;
  estimatedResponseDate?: TimePeriod;
  expectedQualificationDate?: TimePeriod;
  expirationDate?: TimePeriod;
  externalId?: string;
  instantSyncQualification?: boolean;
  queryServiceQualificationDate?: TimePeriod;
  searchCriteria: ServiceQualificationItem;
  serviceQualificationItem?: ServiceQualificationItem[];
  state?: string;
  type: string;
}

export interface ServiceQualificationItem {
  id?: string;
  service: ServiceRefOrValue;
  type: string;
}

export interface ServiceRefOrValue {
  place?: RelatedPlaceRefOrValue[];
  serviceSpecification?: ServiceSpecificationRef;
  serviceCharacteristic?: ServiceCharacteristic[];
}

export interface ServiceSpecificationRef {
  id: string;
  href: string;
  name: string;
  type: string;
}

export interface ServiceCharacteristic {
  name: string;
  valueType: string;
  value: any;
}

export interface RelatedPlaceRefOrValue {
  role: string;
  city?: string;
  postcode?: string;
  streetName?: string;
  streetType?: string;
  streetNr?: string;
  country?: string;
  stateOfProvince?: string;
  geographicAddress?: GeographicAddress[];
  '@type'?: string;
}

