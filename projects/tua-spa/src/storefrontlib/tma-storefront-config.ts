import {
  AnonymousConsentsConfig,
  AsmConfig,
  AuthConfig,
  CmsConfig,
  ExternalRoutesConfig,
  GlobalMessageConfig,
  I18nConfig,
  KymaConfig,
  OccConfig,
  PersonalizationConfig,
  RoutingConfig,
  SiteContextConfig,
  StateConfig
} from '@spartacus/core';
import { CheckoutConfig, IconConfig, LayoutConfig, PWAModuleConfig, QualtricsConfig, ViewConfig } from '@spartacus/storefront';
import { FeatureToggles } from '@spartacus/storefront/feature-toggles';
import { TmaBillingFrequencyConfig, TmfAppointmentConfig, TmfConfig } from '../core';
import { JourneyChecklistConfig } from '../core/journey-checklist-config';
import { PremiseLookupConfig } from '../core/premiselookup';
import { TmfResourcePoolManagementConfig } from '../core/tmf-resource-pool-management';


class SkipLinkConfig {
}

export type TmaStorefrontConfig =
  | AnonymousConsentsConfig
  | AuthConfig
  | CmsConfig
  | OccConfig
  | TmfConfig
  | TmaBillingFrequencyConfig
  | QualtricsConfig
  | StateConfig
  | PWAModuleConfig
  | SiteContextConfig
  | LayoutConfig
  | RoutingConfig
  | I18nConfig
  | PersonalizationConfig
  | IconConfig
  | CheckoutConfig
  | KymaConfig
  | GlobalMessageConfig
  | ExternalRoutesConfig
  | ViewConfig
  | FeatureToggles
  | AsmConfig
  | SkipLinkConfig
  | TmfAppointmentConfig
  | PremiseLookupConfig
  | TmfResourcePoolManagementConfig
  | JourneyChecklistConfig;
