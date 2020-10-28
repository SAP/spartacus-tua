import { TmaQuantity } from './tma-product.model';
import { TimePeriod } from './time-period.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface Appointment {
  id?: string;
  href?: string;
  category?: string;
  creationTime?: Date;
  description?: string;
  externalId?: string;
  lastUpdate?: Date;
  status?: AppointmentStateType;
  validFor?: TimePeriod;
  calenderEvent?: CalenderEventRef;
  note?: Note[];
  relatedEntity?: TmaTmfRelatedParty[];
  attachment?: AttachmentRef[];
  contactMedium?: ContactMedium[];
  relatedParty?: TmaTmfRelatedParty[];
  relatedPlace?: RelatedPlaceRef;
}

export enum AppointmentStateType {
  INITIALIZED = 'initialized',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface CalenderEventRef {
  id: string;
  href: string;
  name: string;
}

export interface Note {
  id: string;
  author: string;
  date: Date;
  text: string;
}

export interface AttachmentRef {
  id: string;
  href: string;
  attachmentType: string;
  description: string;
  isRef: boolean;
  mimeType: string;
  name: string;
  url: string;
  size: TmaQuantity;
  validFor: TimePeriod;
}

export interface ContactMedium {
  mediumType: string;
  preferred: string;
  validFor: string;
  characteristic: MediumCharacteristic;
}

export interface RelatedPlaceRef {
  id: string;
  href: string;
  name: string;
  role: string;
  isRef: boolean;
}

export interface MediumCharacteristic {
  city: string;
  country: string;
  emailAddress: string;
  faxNumber: string;
  phoneNumber: string;
  postCode: string;
  socialNetworkId: string;
  stateOrProvince: string;
  street1: string;
  street2: string;
  type: string;
}
