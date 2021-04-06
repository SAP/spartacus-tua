import { Subject } from 'rxjs/internal/Subject';
import { take, filter, takeUntil } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input
} from '@angular/core';
import { ModalService } from '@spartacus/storefront';

import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '@spartacus/core';
import {
  GeographicAddressService,
  TmaPriceService,
  TmaProduct
} from '../../../../core';

@Component({
  selector: 'cx-product-details-dialog',
  templateUrl: './product-details-dialog.component.html',
  styleUrls: ['./product-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsDialogComponent implements OnInit {
  @Input()
  simpleProductOffering: TmaProduct;

  @Input()
  bundleProductOffering?: TmaProduct;

  childProductCodes: string[] = [];

  protected destroyed$ = new Subject();

  constructor(
    public productService: ProductService,
    public priceService: TmaPriceService,
    protected modalService: ModalService,
    protected spinner?: NgxSpinnerService,
    protected geographicAddressService?: GeographicAddressService
  ) {}

  ngOnInit(): void {
    if (this.bundleProductOffering) {
      this.getProductHierarchy(
        this.bundleProductOffering.code,
        this.simpleProductOffering.code
      );
    }
  }

  closeModal() {
    this.modalService.dismissActiveModal('Close product dialog component');
  }

  /**
   * Populate the product hierarchy in the ordered string array i.e rootProductCode has quadPlay
   * targetProductCode is fiber_internet the list is populated with [quadPlay, homeDeal, broadband,fiber_internet]
   *
   * @param rootProductCode Root product code
   *
   * @param targetProductCode Target product code
   */
  protected getProductHierarchy(
    rootProductCode: string,
    targetProductCode: string
  ): void {
    this.productService
      .get(rootProductCode)
      .pipe(
        take(2),
        filter((result: TmaProduct) => !!result),
        takeUntil(this.destroyed$)
      )
      .subscribe((result: TmaProduct) => {
        if (result) {
          const childCodes: string[] = result.children.map(child => child.code);
          if (!childCodes.includes(targetProductCode)) {
            this.childProductCodes.push(result.code);
            const childBundles: TmaProduct[] = result.children.filter(
              (child: TmaProduct) => child.isBundle
            );
            if (childBundles.length > 0) {
              result.children
                .filter((child: TmaProduct) => child.isBundle)
                .forEach((child: TmaProduct) => {
                  this.getProductHierarchy(child.code, targetProductCode);
                });
            } else {
              this.childProductCodes.pop();
            }
          } else if (childCodes.includes(targetProductCode)) {
            this.childProductCodes.push(result.code);
            this.childProductCodes.push(targetProductCode);
          }
        }
      });
  }
}
