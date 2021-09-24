import { RoutesConfig, RoutingConfig } from '@spartacus/core';

const subscriptionsPath = `selfcare/subscriptions/:${'name'}`;
const childProductsPath = `selfcare/subscriptions/:${'name'}/childProducts`;
const agreementPath = `selfcare/subscriptions/:${'name'}/agreement`;
const accountPath = `selfcare/subscriptions/:${'name'}/account`;
const orderPath = `selfcare/subscriptions/:${'name'}/order`;
const billingAccountsPath = `selfcare/billing-accounts/:${`name`}`;

export const TmaSelfcareRoutesConfig: RoutesConfig = {
  selfcareSubscriptionsDetail: {
    paths: [`${subscriptionsPath}`],
    paramsMapping: {}
  },
  SubscriptionsChildProducts: {
    paths: [`${childProductsPath}`],
    paramsMapping: {}
  },
  SubscriptionsAgreement: {
    paths: [`${agreementPath}`],
    paramsMapping: {}
  },
  SubscriptionsAccount: {
    paths: [`${accountPath}`],
    paramsMapping: {}
  },
  SubscriptionsOrder: {
    paths: [`${orderPath}`],
    paramsMapping: {}
  },
  selfcareBillingAccountsDetail: {
    paths: [`${billingAccountsPath}`],
    paramsMapping: {}
  }
};

export const defaultTmaSelfcareRoutingConfig: RoutingConfig = {
  routing: {
    routes: TmaSelfcareRoutesConfig
  }
};
