import {
  AnonymousConsentsConfig, AsmConfig,
  AuthConfig,
  CmsConfig, ExternalRoutesConfig, GlobalMessageConfig,
  I18nConfig, KymaConfig,
  OccConfig, PersonalizationConfig,
  RoutingConfig,
  SiteContextConfig,
  StateConfig
} from '@spartacus/core';
import { TmfConfig } from '../core/tmf/config/tmf-config';
import { CheckoutConfig, IconConfig, LayoutConfig, PWAModuleConfig, QualtricsConfig, ViewConfig } from '@spartacus/storefront';
import { FeatureToggles } from '@spartacus/storefront/feature-toggles';
import { TmaBillingFrequencyConfig } from '../core/billing-frequency/config';
import { TmfAppointmentConfig } from '../core/tmf-appointment';
import { TmfResourcePoolManagementConfig } from '../core/tmf-resource-pool-management';
import { JourneyChecklistConfig } from '../core/journey-checklist-config';


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
  | TmfResourcePoolManagementConfig
  | JourneyChecklistConfig;
