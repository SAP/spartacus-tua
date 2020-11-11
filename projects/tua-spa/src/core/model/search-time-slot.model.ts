import { TimePeriod } from './time-period.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface SearchTimeSlot {
  id?: string;
  availableTimeSlot?: TimeSlot[];
  searchResult?: string;
  status?: string;
  requestedTimeSlot?: TimeSlot[];
}

export interface TimeSlot {
  id?: string;
  href?: string;
  relatedParty?: TmaTmfRelatedParty;
  validFor?: TimePeriod;
}
