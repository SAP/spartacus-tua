import { Component, ElementRef } from "@angular/core";
import { RoutingService } from "@spartacus/core";
import { HamburgerMenuService, KeyboardFocusService, StorefrontComponent } from "@spartacus/storefront";

@Component({
    selector: 'cx-storefront',
    templateUrl: './tma-storefront.component.html',
  })
  export class TmaStorefrontComponent extends StorefrontComponent {
    
    constructor(
      private tmaHamburgerMenuService: HamburgerMenuService,
      private tmaRoutingService: RoutingService,
      protected elementRef: ElementRef<HTMLElement>,
      protected keyboardFocusService: KeyboardFocusService
    ) { super (tmaHamburgerMenuService, tmaRoutingService, elementRef, keyboardFocusService); }
  }