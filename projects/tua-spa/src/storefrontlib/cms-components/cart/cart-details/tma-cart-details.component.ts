import { CartDetailsComponent } from '@spartacus/storefront';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TmaCartService } from '../../../../core/cart/facade';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './tma-cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCartDetailsComponent extends CartDetailsComponent implements OnInit {

  constructor(protected tmaCartService: TmaCartService) {
    super(tmaCartService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.tmaCartService.loadCart();
    this.cart$ = this.tmaCartService.getActive();

    this.entries$ = this.tmaCartService
      .getEntries()
      .pipe(filter(entries => entries.length > 0));

    this.cartLoaded$ = this.tmaCartService.getLoaded();
  }

}
