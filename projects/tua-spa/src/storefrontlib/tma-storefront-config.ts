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

class SkipLinkConfig {
}

export type TmaStorefrontConfig =
  | AnonymousConsentsConfig
  | AuthConfig
  | CmsConfig
  | OccConfig
  | TmfConfig
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
  | SkipLinkConfig;
