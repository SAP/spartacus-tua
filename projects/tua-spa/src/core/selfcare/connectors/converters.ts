import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
} from '../../model';

export const SUBSCRIPTIONS_NORMALIZER = new InjectionToken<
  Converter<any, TmaSubscribedProductsInventory>
>('SubscriptionsNormalizer');

export const SUBSCRIBED_PRODUCT_NORMALIZER = new InjectionToken<
  Converter<any, TmaSubscriptions>
>('SubscribedProductNormalizer');

export const BILLING_ACCOUNTS_NORMALIZER = new InjectionToken<
  Converter<any, TmaBillingAccounts>
>('BillingAccountsNormalizer');

export const BILLING_AGREEMENTS_NORMALIZER = new InjectionToken<
  Converter<any, TmaBillingAgreements>
>('BillingAgreementsNormalizer');
