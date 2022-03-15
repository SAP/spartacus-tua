import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseSiteService, PaginationModel, SearchConfig } from '@spartacus/core';
import { TmaProductOrderService } from '../../../../core/product-order/facade';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TmaPaginatedProductOrder } from '../../../../core/model';
import { takeUntil } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Component({
  selector: 'cx-order-approval-list',
  templateUrl: './tma-order-approval-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tma-order-approval-list.component.scss']
})
export class TmaOrderApprovalListComponent implements OnInit, OnDestroy {

  paginatedProductOrder$: Observable<TmaPaginatedProductOrder>;
  currentPage = 0;

  protected PAGE_SIZE = 5;
  protected destroyed$ = new Subject();

  constructor(
    protected productOrderService: TmaProductOrderService,
    protected baseSiteService: BaseSiteService,
    protected userAccountFacade: UserAccountFacade
  ) {
  }

  ngOnInit(): void {
    const fetchParams: SearchConfig = {
      currentPage: 0,
      pageSize: this.PAGE_SIZE
    };

    combineLatest([this.userAccountFacade.get(), this.baseSiteService.getActive()])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((values: any[]) =>
        this.productOrderService.loadProductOrders(values[0].uid, values[1], fetchParams)
      );

    this.paginatedProductOrder$ = this.productOrderService.getPaginatedProductOrders();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Returns a PaginationModel representing the state which has to be displayed by cx-pagination component
   * @param totalCount Represents the total amount of ProductOrders available in the DB in BE
   * @return PaginationModel containing the up to date information about the paginated data to be displayed
   */
  getPagination(totalCount: number): PaginationModel {
    return {
      currentPage: this.currentPage,
      pageSize: this.PAGE_SIZE,
      totalPages: Math.ceil(totalCount / this.PAGE_SIZE),
      totalResults: totalCount
    };
  }

  /**
   * Called when the viewPageEvent is caught. Makes a call to the BE and updates the state.
   * @param page The number corresponding to the new page
   */
  pageChange(page: number): void {
    const fetchParams: SearchConfig = {
      currentPage: page,
      pageSize: this.PAGE_SIZE
    };

    this.currentPage = page;

    combineLatest([this.userAccountFacade.get(), this.baseSiteService.getActive()])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((values: any[]) =>
        this.productOrderService.loadProductOrders(values[0].uid, values[1], fetchParams)
      );
  }

}
