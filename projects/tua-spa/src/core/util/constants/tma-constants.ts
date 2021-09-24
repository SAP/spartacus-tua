import { TmaConstantResourceModel } from './tma-constant-resource.model';

export const LOCAL_STORAGE: TmaConstantResourceModel = {
  SEARCH: {
    QUERY: 'query:',
    FREE_TEXT: 'freeTextSearch:',
    PRODUCT_OFFERING_GROUP: 'productOfferingGroups:',
    PARENT_BPO: 'parentBundledPo:',
    CODE: 'code:',
    PROCESS_TYPE: 'process:'
  },
  GUIDED_SELLING: {
    CURRENT_SELECTION: {
      DASH: '-'
    }
  },
  MSISDN_RESERVATION: {
    MSISDN_TYPE: 'phone number',
    CHECKLIST_ACTION_TYPE_MSISDN: 'MSISDN',
    RESOURCE_ITEM_RESERVATION: 'resourceItemReservation'
  },
  APPOINTMENT: {
    REQUESTED_NUMBER_OF_TIMESLOTS: 5,
    END_DATE_OF_TIMESLOTS: 3,
    CHECKLIST_ACTION_TYPE_APPOINTMENT: 'APPOINTMENT',
    INTERVENTION_ADDRESS: 'interventionAddress',
    APPOINTMENT_TYPE: 'Appointment'
  },
  USAGE_TYPE: {
    EACH_RESPECTIVE_TIER: 'each_respective_tier',
    HIGHEST_APPLICABLE_TIER: 'highest_applicable_tier'
  },
  DECIMAL: {
    RANGE: 2
  },
  CART_ACTION_TYPE: {
    REMOVE_ACTION_TYPE: 'REMOVE'
  },
  INSTALLATION_ADDRESS: {
    CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS: 'INSTALLATION_ADDRESS',
    QUERY_SERVICE_QUALIFICATION: 'QueryServiceQualification',
    SEARCH_CRITERIA: 'SearchCriteria',
    INSTALLATION_PLACE: 'Installation Place',
    GEOGRAPHIC_ADDRESS: 'GeographicAddress'
  },
  PAGES: {
    CART_PAGE: 'cartPage',
    CHECKOUT_REVIEW_PAGE: 'CheckoutReviewOrder'
  },
  ORDER_PROCESSING: {
    ORDER_PROCESSING_ERROR: 'OrderProcessingError'
  },
  ILLEGAL_ARGUMENT: {
    ILLEGAL_ARGUMENT_ERROR: 'IllegalArgumentError'
  },
  COMMERCE_CART_MODIFICATION: {
    COMMERCE_CART_MODIFICATION_ERROR: 'CommerceCartModificationError'
  },
  ENDPOINT: {
    SLASH: '/',
    QUESTION_MARK: '?'
  },
  COMMON: {
    SLASH: '/',
    QUESTION_MARK: '?'
  },
  SELFCARE: {
    SUBSCRIPTIONS: {
      KEY: 'name',
      CELLS: ['name', 'status', 'id'],
      DOMAIN_TYPE: 'selfcare.subscriptions',
      CELL_DOMAIN_TYPE: 'selfcareSubscriptions',
      ROUTE: 'selfcareSubscriptionsDetail',
      CHILD_PRODUCTS_DOMAIN_TYPE: 'selfcare.subscriptions.details.childProducts',
      ACCOUNT_DOMAIN_TYPE: 'selfcare.subscriptions.details.account',
      AGREEMENT_DOMAIN_TYPE: 'selfcare.subscriptions.details.agreement',
      ORDER_DOMAIN_TYPE: 'selfcare.subscriptions.details.order'
    },
    BILLING_ACCOUNTS: {
      KEY: 'name',
      CELLS: ['name', 'accountType', 'paymentStatus', 'id'],
      DOMAIN_TYPE: 'selfcare.billingAccounts',
      CELL_DOMAIN_TYPE: 'selfcareBillingAccounts',
      ROUTE: 'selfcareBillingAccountsDetail'
    },
    BILLING_AGREEMENTS: {

    }
  }
};
