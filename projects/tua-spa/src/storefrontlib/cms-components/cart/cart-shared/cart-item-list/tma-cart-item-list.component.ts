import { Component, OnInit } from '@angular/core';
import { CartItemListComponent } from '@spartacus/storefront';
import { CartService, FeatureConfigService, SelectiveCartService } from '@spartacus/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './tma-cart-item-list.component.html'
})
export class TmaCartItemListComponent extends CartItemListComponent implements OnInit {

  form: FormGroup = this.fb.group({});

  constructor(
    protected cartService: CartService,
    protected fb: FormBuilder,
    protected selectiveCartService?: SelectiveCartService,
    protected tmaFeatureConfig?: FeatureConfigService
  ) {
    super(cartService, fb, selectiveCartService, tmaFeatureConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
