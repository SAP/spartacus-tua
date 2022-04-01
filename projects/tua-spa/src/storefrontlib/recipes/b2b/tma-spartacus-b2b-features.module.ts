import { NgModule } from '@angular/core';
import { AsmModule } from '@spartacus/asm';
import { AsmOccModule } from '@spartacus/asm/occ';
import { CheckoutModule } from '@spartacus/checkout';
import { CheckoutCoreModule } from '@spartacus/checkout/core';
import { CheckoutOccModule } from '@spartacus/checkout/occ';
import {
  AnonymousConsentsModule,
  CartOccModule,
  CostCenterModule,
  CostCenterOccModule,
  ExternalRoutesModule,
  OrderOccModule,
  ProductModule,
  ProductOccModule,
  UserOccModule,
  UserOccTransitionalModule,
  UserTransitionalModule
} from '@spartacus/core';
import { AdministrationRootModule } from '@spartacus/organization/administration/root';
import { OrderApprovalRootModule } from '@spartacus/organization/order-approval/root';
import {
  AddressBookModule,
  AnonymousConsentManagementBannerModule,
  AnonymousConsentsDialogModule,
  BannerCarouselModule,
  BannerModule,
  BreadcrumbModule,
  CartPageEventModule,
  CategoryNavigationModule,
  CmsParagraphModule,
  ConsentManagementModule,
  FooterNavigationModule,
  HamburgerMenuModule,
  HomePageEventModule,
  JsonLdBuilderModule,
  LinkModule,
  LoginRouteModule,
  LogoutModule,
  MyCouponsModule,
  MyInterestsModule,
  NavigationEventModule,
  NavigationModule,
  NotificationPreferenceModule,
  OrderCancellationModule,
  OrderDetailsModule,
  OrderHistoryModule,
  OrderReturnModule,
  PageTitleModule,
  PaymentMethodsModule,
  ProductCarouselModule,
  ProductDetailsPageModule,
  ProductFacetNavigationModule,
  ProductImagesModule,
  ProductIntroModule,
  ProductListingPageModule,
  ProductListModule,
  ProductPageEventModule,
  ProductReferencesModule,
  ProductSummaryModule,
  ProductTabsModule,
  ReplenishmentOrderDetailsModule,
  ReplenishmentOrderHistoryModule,
  ReturnRequestDetailModule,
  ReturnRequestListModule,
  SearchBoxModule,
  SiteContextSelectorModule,
  StockNotificationModule,
  TabParagraphContainerModule,
  WishListModule
} from '@spartacus/storefront';
import {
  AppointmentModule,
  AvailabilityCheckModule,
  DeliveryModeConfigModule,
  GeographicAddressModule,
  JourneyChecklistConfigModule,
  PremiseLookupModule,
  ProductOfferingModule,
  QueryServiceQualificationModule,
  RecommendationModule,
  ReservationModule,
  SearchTimeSlotModule,
  TmaAuthModule,
  TmaBillingFrequencyConfigModule,
  TmaCartModule,
  TmaChecklistActionModule,
  TmaCheckoutOccModule,
  TmaConsumptionConfigModule,
  TmaOccCartModule,
  TmaOccProductModule,
  TmaPremiseDetailModule,
  TmaProductModule,
  TmaProductSpecificationAverageCostModule,
  TmaProductSpecificationForViewDetailsConfigModule,
  TmaTmfCartModule,
  TmaUserOccModule,
  TmfModule
} from '../../../core';
import { TmaCheckoutModule } from '../../../core/checkout';
import { TmaGlobalMessageModule } from '../../../core/global-message/tma-global-message.module';
import { SubscriptionModule } from '../../../core/subscription/subscription.module';
import { TmfAppointmentModule } from '../../../core/tmf-appointment';
import { TmfResourcePoolManagementModule } from '../../../core/tmf-resource-pool-management/tmf-resource-pool-management.module';
import { TmfQueryServiceQualificationModule } from '../../../core/tmf-service-qualification-management';
import {
  TmaCmsLibModule,
  TmaRoutingModule
} from '../../../storefrontlib';
import { TmaAsmFeatureModule } from '../features/tma-asm-feature.module';
import { TmaCheckoutFeatureModule } from '../features/tma-checkout-feature.module';
import { TmaUserFeatureModule } from '../features/tma-user-feature.module';

@NgModule({
  imports: [
    AsmModule,
    // Auth Core
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    LogoutModule, // will be come part of auth package
    LoginRouteModule, // will be come part of auth package

    // Basic Cms Components
    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    PageTitleModule,
    BreadcrumbModule,
    TmaCmsLibModule,

    // User Core
    CheckoutModule,
    CheckoutCoreModule,
    UserOccModule,
    UserTransitionalModule,
    UserOccTransitionalModule,
    // User UI
    AddressBookModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,

    // Anonymous Consents Core
    AnonymousConsentsModule.forRoot(),
    // Anonymous Consents UI
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,

    // b2b
    CostCenterModule.forRoot(),
    AdministrationRootModule,
    OrderApprovalRootModule,

    // Product Core
    ProductModule.forRoot(),
    ProductOccModule,

    // Product UI
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductIntroModule,

    // Cart Modules
    WishListModule,

    // OccModule
    AsmOccModule,
    CartOccModule,
    CheckoutOccModule,
    TmaOccCartModule,
    TmaOccProductModule,
    TmaCheckoutOccModule,
    TmaUserOccModule,
    CostCenterOccModule,

    // Order
    OrderHistoryModule,
    OrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule,
    ReplenishmentOrderHistoryModule,
    ReplenishmentOrderDetailsModule,
    OrderOccModule,

    // Page Events
    NavigationEventModule,
    HomePageEventModule,
    CartPageEventModule,
    ProductPageEventModule,

    /************************* Opt-in features *************************/

    ExternalRoutesModule.forRoot(), // to opt-in explicitly, is added by default schematics
    JsonLdBuilderModule,

    // Tma Modules
    TmfModule.forRoot(),
    PremiseLookupModule.forRoot(),
    TmfResourcePoolManagementModule.forRoot(),
    TmfAppointmentModule.forRoot(),
    TmfQueryServiceQualificationModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
    TmaProductSpecificationAverageCostModule.forRoot(),
    TmaProductSpecificationForViewDetailsConfigModule.forRoot(),
    TmaPremiseDetailModule.forRoot(),
    TmaTmfCartModule.forRoot(),
    SubscriptionModule,
    TmaChecklistActionModule.forRoot(),
    AppointmentModule.forRoot(),
    SearchTimeSlotModule.forRoot(),
    JourneyChecklistConfigModule.forRoot(),
    GeographicAddressModule.forRoot(),
    ReservationModule.forRoot(),
    AvailabilityCheckModule.forRoot(),
    RecommendationModule.forRoot(),
    TmaGlobalMessageModule.forRoot(),
    TmaConsumptionConfigModule.forRoot(),
    TmaCartModule.forRoot(),
    TmaCheckoutModule.forRoot(),
    DeliveryModeConfigModule.forRoot(),
    QueryServiceQualificationModule.forRoot(),
    ProductOfferingModule.forRoot(),
    TmaProductModule.forRoot(),

    /************************* External features *************************/
    TmaUserFeatureModule,
    TmaCheckoutFeatureModule,
    TmaAsmFeatureModule,
  ],
})
export class TmaSpartacusB2bFeaturesModule {}
