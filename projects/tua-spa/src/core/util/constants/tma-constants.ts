import { TmaConstantResourceModel } from './tma-constant-resource.model';

export const LOCAL_STORAGE: TmaConstantResourceModel = {
  SEARCH: {
    QUERY: 'query:',
    FREE_TEXT: 'freeTextSearch:',
    PRODUCT_OFFERING_GROUP: 'productOfferingGroups:',
    PARENT_BPO: 'parentBundledPo:',
    CODE: 'code:',
  },
  GUIDED_SELLING: {
    CURRENT_SELECTION: {
      DASH: '-',
    },
  },
  APPOINTMENT: {
    CALL_TO_SCHEDULE: 'CALL_TO_SCHEDULE',
    REQUESTED_NUMBER_OF_TIMESLOTS: 5,
    END_DATE_OF_TIMESLOTS: 3,
    CHECKLIST_ACTION_TYPE_APPOINTMENT: 'APPOINTMENT',
  },
  JOURNEY_CHECKLIST : ['APPOINTMENT'],
  USAGE_TYPE:{
      EACH_RESPECTIVE_TIER: 'each_respective_tier',
      HIGHEST_APPLICABLE_TIER: 'highest_applicable_tier',
  },
  DECIMAL:{
      RANGE:2
  }
};
