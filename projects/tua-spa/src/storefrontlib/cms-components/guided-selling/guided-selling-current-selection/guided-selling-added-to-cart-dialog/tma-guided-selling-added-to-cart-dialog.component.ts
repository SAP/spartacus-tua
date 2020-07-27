import { Component, Input, OnInit } from '@angular/core';
import { TmaActiveCartService, TmaCartPriceService, TmaCartService } from '../../../../../core/cart/facade';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyService } from '@spartacus/core';
import { TmaOrderEntry, TmaProduct, TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaAddedToCartDialogComponent } from '../../../cart';
import { ModalService, PromotionService } from '@spartacus/storefront';
import { TmaGuidedSellingCurrentSelectionsService } from '../../../../../core/guided-selling/facade';
import { TmaPriceService } from '../../../../../core/product/facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-guided-selling-added-to-cart-dialog',
  templateUrl: './tma-guided-selling-added-to-cart-dialog.component.html',
  styleUrls: ['./tma-guided-selling-added-to-cart-dialog.component.scss']
})
export class TmaGuidedSellingAddedToCartDialogComponent extends TmaAddedToCartDialogComponent implements OnInit {

  @Input()
  parentBpo: TmaProduct;

  @Input()
  entries: TmaOrderEntry[];

  constructor(
    public cartPriceService: TmaCartPriceService,
    protected modalService: ModalService,
    protected cartService: TmaCartService,
    protected activeCartService: TmaActiveCartService,
    protected fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected promotionService: PromotionService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected priceService: TmaPriceService
  ) {
    super(cartPriceService, modalService, cartService, fb, currencyService, promotionService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
    this.entries = this.processEntries();
  }

  /**
   * Clears the current selection list.
   */
  clearCurrentSelections(): void {
    this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
  }

  /**
   * Returns the sum of one time charges as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getPayNowPrice(price: TmaProductOfferingPrice[]): string {
    if (!price || price.length === 0) {
      return '-';
    }

    const oneTimePrices: TmaProductOfferingPrice[] = this.priceService.getOneTimeCharges(price[0]);
    if (!oneTimePrices || oneTimePrices.length === 0) {
      return '-';
    }

    return this.priceService.getFormattedPrice(this.priceService.getSumOfPrices(oneTimePrices));
  }

  /**
   * Returns the first recurring charge as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getRecurringPrice(price: TmaProductOfferingPrice[]): string {
    if (!price || price.length === 0 || !price[0].bundledPop) {
      return '-';
    }

    const recurringPrices: TmaProductOfferingPrice[] = this.priceService.getRecurringPrices(price[0].bundledPop);
    if (!recurringPrices || recurringPrices.length === 0 || !recurringPrices[0].price) {
      return '-';
    }

    return this.priceService.getFormattedPrice(recurringPrices[0].price);
  }

  /**
   * Returns the entry for the provided number.
   *
   * @param entryNumber - The identifier of the entry
   * @return A {@link TmaOrderEntry} as an {@link Observable}
   */
  getEntryForEntryNumber(entryNumber: number): Observable<TmaOrderEntry> {
    return this.activeCartService.getEntryForEntryNumber(entryNumber);
  }

  protected processEntries(): TmaOrderEntry[] {
    if (!this.entries || this.entries.length === 0) {
      return;
    }

    this.entries.forEach((entry: TmaOrderEntry) => {
      if (entry) {
        const code: string = entry.entryNumber.toString();
        if (!this.form.controls[code]) {
          this.form.setControl(code, this.createFormGroupForEntry(entry));
        }
        else {
          const entryForm = this.form.controls[code] as FormGroup;
          entryForm.controls.quantity.setValue(entry.quantity);
        }

        this.form.markAsPristine();
        if (!this.modalIsOpen) {
          this.modalIsOpen = true;
        }
      }
    });

    return this.entries;
  }

  protected createFormGroupForEntry(entry: TmaOrderEntry): FormGroup {
    return this.fb.group({
      entryNumber: entry.entryNumber,
      quantity: entry.quantity
    });
  }
}
