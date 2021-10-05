import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { ProductSearchService } from '@spartacus/core';
import { ProductListComponentService, SearchCriteria } from '@spartacus/storefront';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LOCAL_STORAGE } from '../../../../core/util/constants';
import { TmaGuidedSellingStep, TmaProcessTypeEnum } from '../../../../core/model';
import { TmaGuidedSellingStepsService } from '../../../../core/guided-selling/facade';
import { ActivatedRoute, Router } from '@angular/router';

const { QUERY, FREE_TEXT, PRODUCT_OFFERING_GROUP, PARENT_BPO, PROCESS_TYPE } = LOCAL_STORAGE.SEARCH;

@Component({
  selector: 'cx-guided-selling-steps',
  templateUrl: './tma-guided-selling-steps.component.html',
  styleUrls: ['./tma-guided-selling-steps.component.scss']
})
export class TmaGuidedSellingStepsComponent implements OnInit, OnDestroy {

  @Input()
  bpoCode: string;

  @Input()
  isSubscription: boolean;

  guidedSellingSteps: TmaGuidedSellingStep[];

  protected destroyed$ = new Subject();

  constructor(
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected productSearchService: ProductSearchService,
    protected productListComponentService: ProductListComponentService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router

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
    let query = QUERY + FREE_TEXT + PRODUCT_OFFERING_GROUP + id;
    let bpoQuery = QUERY + FREE_TEXT + PARENT_BPO + id;
    if(this.isSubscription){
      const process = TmaProcessTypeEnum.RETENTION;
      const processFilterQuery = ':'+ PROCESS_TYPE + process;
      query = query + processFilterQuery;
      bpoQuery = bpoQuery + processFilterQuery;
    }
    if (inProductGroup) {
      this.tmaSetQuery(query);
      this.productSearchService.search(query);
    }
    else {
      this.tmaSetQuery(query);
      this.productSearchService.search(bpoQuery, { pageSize: 10 });
    }
  }

  tmaSetQuery(query: string): void {
    this.tmaRoute({ query, currentPage: undefined });
  }

  tmaRoute(queryParams: SearchCriteria): void {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }
}
