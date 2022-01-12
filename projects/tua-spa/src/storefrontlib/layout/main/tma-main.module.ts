import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FeaturesConfigModule } from "@spartacus/core";
import {
  AnonymousConsentsDialogModule,
  GlobalMessageComponentModule,
  KeyboardFocusModule,
  MainModule,
  OutletModule,
  OutletRefModule,
  PageSlotModule,
  PwaModule,
  SeoModule,
  SkipLinkModule
} from "@spartacus/storefront";
import { TmaPageLayoutModule } from "../../cms-structure/page";
import { TmaStorefrontComponent } from "./tma-storefront.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GlobalMessageComponentModule,
    OutletModule,
    OutletRefModule,
    PwaModule,
    TmaPageLayoutModule,
    SeoModule,
    PageSlotModule,
    AnonymousConsentsDialogModule,
    FeaturesConfigModule,

    SkipLinkModule,
    KeyboardFocusModule
  ],
  declarations: [TmaStorefrontComponent],
  exports: [TmaStorefrontComponent],
})
export class TmaMainModule extends MainModule { }
