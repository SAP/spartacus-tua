import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import {
  TmaSelfcareBillingAccounts,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../model';

export const SELFCARE_SUBSCRIPTIONS_NORMALIZER = new InjectionToken<
  Converter<any, TmaSubscribedProductsInventory>
>('SelfcareSubscriptionsNormalizer');

export const SELFCARE_SUBSCRIBED_PRODUCT_NORMALIZER = new InjectionToken<
  Converter<any, TmaSelfcareSubscriptions>
>('SelfcareSubscribedProductNormalizer');

export const SELFCARE_BILLING_ACCOUNTS_NORMALIZER = new InjectionToken<
  Converter<any, TmaSelfcareBillingAccounts>
>('SelfcareBillingAccountsNormalizer');