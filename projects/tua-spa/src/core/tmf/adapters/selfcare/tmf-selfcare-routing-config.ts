import { RoutesConfig, RoutingConfig } from '@spartacus/core';

const subscriptionsPath = `selfcare/subscriptions/:${'name'}`;
const childProductsPath = `selfcare/subscriptions/:${'name'}/childProducts`;
const agreementPath = `selfcare/subscriptions/:${'name'}/agreement`;
const accountPath = `selfcare/subscriptions/:${'name'}/account`;
const orderPath = `selfcare/subscriptions/:${'name'}/order`;
const addressPath = `selfcare/subscriptions/:${'name'}/address`;
const billingAccountDetailsPath = `selfcare/billing-accounts/:${`id`}`;
const accountBalancePath = `selfcare/billing-accounts/:${`id`}/accountBalance`;
const balanceDetailsPath = `selfcare/billing-accounts/:${`id`}/accountBalance/:${`balanceType`}`;
const billStructurePath = `selfcare/billing-accounts/:${`id`}/billStructure`;
const billStructureDetailsPath = `selfcare/billing-accounts/:${`id`}/billStructure/billDetails`;
const billingContactPath = `selfcare/billing-accounts/:${`id`}/contact`;
const billingCreditPath = `selfcare/billing-accounts/:${`name`}/credit`;
const billingPlanPath = `selfcare/billing-accounts/:${`name`}/payment`;
const billingRelatedPartyPath = `selfcare/billing-accounts/:${`name`}/relatedParty`;
const billingAgreementDetailsPath = `selfcare/billing-agreements/:${`id`}`;
const billingAgreementItem = `selfcare/billing-agreements/:${`id`}/agreementItem`;
const billingAgreementSpecification = `selfcare/billing-agreements/:${`id`}/agreementSpecification`;
const billingEngagedParty = `selfcare/billing-agreements/:${`id`}/engagedParty`;
const billingAgreementSpecificationDetails = `selfcare/billing-agreements/:${`id`}/agreementSpecification/details`;
const contactDetailsPath = `selfcare/billing-accounts/:${`id`}/contact/:${`contactMedium`}`;
const creditLimitPath = `selfcare/billing-accounts/:${`id`}/creditLimit`;
const paymentPlanPath = `selfcare/billing-accounts/:${`id`}/paymentPlan`;
const paymentPlanDetailsPath = `selfcare/billing-accounts/:${`id`}/paymentPlan/:${`paymentId`}`;
const relatedPartyPath = `selfcare/billing-accounts/:${`id`}/relatedParty`;

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
  SubscriptionsAddress: {
    paths: [`${addressPath}`],
    paramsMapping: {}
  },
  selfcareBillingAccountsDetail: {
    paths: [`${billingAccountDetailsPath}`],
    paramsMapping: {}
  },
  AccountBalance: {
    paths: [`${accountBalancePath}`],
    paramsMapping: {}
  },
  BalanceDetails: {
    paths: [`${balanceDetailsPath}`],
    paramsMapping: {}
  },
  BillStructure: {
    paths: [`${billStructurePath}`],
    paramsMapping: {}
  },
  BillStructureDetails: {
    paths: [`${billStructureDetailsPath}`],
    paramsMapping: {}
  },
  BillingContact: {
    paths: [`${billingContactPath}`],
    paramsMapping: {}
  },
  ContactDetails: {
    paths: [`${contactDetailsPath}`],
    paramsMapping: {}
  },
  CreditLimit: {
    paths: [`${creditLimitPath}`],
    paramsMapping: {}
  },
  PaymentPlan: {
    paths: [`${paymentPlanPath}`],
    paramsMapping: {}
  },
  PaymentPlanDetails: {
    paths: [`${paymentPlanDetailsPath}`],
    paramsMapping: {}
  },
  RelatedParty: {
    paths: [`${relatedPartyPath}`],
    paramsMapping: {}
  },
  selfcareBillingAgreementsDetail: {
    paths: [`${billingAgreementDetailsPath}`],
    paramsMapping: {}
  },
  AgreementItem: {
    paths: [`${billingAgreementItem}`],
    paramsMapping: {}
  },
  AgreementSpecification: {
    paths: [`${billingAgreementSpecification}`],
    paramsMapping: {}
  },
  AgreementEngagedParty: {
    paths: [`${billingEngagedParty}`],
    paramsMapping: {}
  },
  AgreementSpecificationDetails: {
    paths: [`${billingAgreementSpecificationDetails}`],
    paramsMapping: {}
  }
};

export const defaultTmaSelfcareRoutingConfig: RoutingConfig = {
  routing: {
    routes: TmaSelfcareRoutesConfig
  }
};
