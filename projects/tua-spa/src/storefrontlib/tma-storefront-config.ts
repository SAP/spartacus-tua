import {
  AnonymousConsentsConfig,
  AsmConfig,
  AuthConfig,
  CartConfig,
  CmsConfig, ExternalRoutesConfig, GlobalMessageConfig,
  I18nConfig,
  OccConfig, PersonalizationConfig,
  RoutingConfig,
  SiteContextConfig,
  StateConfig
} from '@spartacus/core';
import { TmfConfig } from '../core/tmf/config/tmf-config';
import { CheckoutConfig, DirectionConfig, IconConfig, LayoutConfig, MediaConfig, PaginationConfig, PWAModuleConfig, QualtricsConfig, ViewConfig } from '@spartacus/storefront';
import { FeatureToggles } from '@spartacus/storefront/feature-toggles';
import { TmfAppointmentConfig } from '../core/tmf-appointment';
import { TmfResourcePoolManagementConfig } from '../core/tmf-resource-pool-management';
import { SeoConfig } from '@spartacus/storefront/cms-structure/seo/config';
import { TmaBillingFrequencyConfig } from '../core/config/billing-frequency';
import { JourneyChecklistConfig } from '../core/config/journey-checklist-config';
import { TmfQueryServiceQualificationConfig } from '../core/tmf-service-qualification-management';

class SkipLinkConfig {}

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
  | GlobalMessageConfig
  | ExternalRoutesConfig
  | ViewConfig
  | FeatureToggles
  | AsmConfig
  | SkipLinkConfig
  | TmfAppointmentConfig
  | TmfResourcePoolManagementConfig
  | JourneyChecklistConfig
  | DirectionConfig
  | MediaConfig
  | PaginationConfig
  | CartConfig
  | SeoConfig
  | TmfQueryServiceQualificationConfig;
