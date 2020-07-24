import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { ProductSearchService } from '@spartacus/core';
import { ProductListComponentService } from '@spartacus/storefront';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LOCAL_STORAGE } from '../../../../core/util/constants';
import { TmaGuidedSellingStep } from '../../../../core/model';
import { TmaGuidedSellingStepsService } from '../../../../core/guided-selling/facade';

const { QUERY, FREE_TEXT, PRODUCT_OFFERING_GROUP, PARENT_BPO } = LOCAL_STORAGE.SEARCH;

@Component({
  selector: 'cx-guided-selling-steps',
  templateUrl: './tma-guided-selling-steps.component.html',
  styleUrls: ['./tma-guided-selling-steps.component.scss']
})
export class TmaGuidedSellingStepsComponent implements OnInit, OnDestroy {

  @Input()
  bpoCode: string;

  guidedSellingSteps: TmaGuidedSellingStep[];

  protected destroyed$ = new Subject();

  constructor(
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected productSearchService: ProductSearchService,
    protected productListComponentService: ProductListComponentService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.guidedSellingSteps = this.guidedSellingStepsService.getGuidedSellingSteps(this.bpoCode);

    if (this.guidedSellingSteps && this.guidedSellingSteps.length !== 0) {
      const activeStep: TmaGuidedSellingStep = this.guidedSellingSteps.find((step: TmaGuidedSellingStep) => step.active === true);

      if (activeStep) {
        this.displayProducts(activeStep.id, activeStep.inProductGroup);
      }
    }

    this.guidedSellingStepsService.guidedSellingSteps$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value: TmaGuidedSellingStep[]) => {
        this.guidedSellingSteps = value;
        const activeStep: TmaGuidedSellingStep = this.guidedSellingSteps.find((step: TmaGuidedSellingStep) => step.active === true);

        if (activeStep) {
          this.displayProducts(activeStep.id, activeStep.inProductGroup);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Changes the active step.
   *
   * @param id - The identifier of the step which will become active
   * @param inProductGroup - Flag indicating if step is part of a product offering group or not
   */
  changeActiveStep(id: string, inProductGroup: boolean): void {
    this.guidedSellingSteps.forEach((step: TmaGuidedSellingStep) =>
      step.active = step.id === id
    );

    this.displayProducts(id, inProductGroup);
  }

  protected displayProducts(id: string, inProductGroup: boolean): void {
    if (inProductGroup) {
      this.productListComponentService.setQuery(QUERY + FREE_TEXT + PRODUCT_OFFERING_GROUP + id);
      this.productSearchService.search(QUERY + FREE_TEXT + PRODUCT_OFFERING_GROUP + id, { pageSize: 10 });
    }
    else {
      this.productListComponentService.setQuery(QUERY + FREE_TEXT + PARENT_BPO + id);
      this.productSearchService.search(QUERY + FREE_TEXT + PARENT_BPO + id, { pageSize: 10 });
    }
  }
}
