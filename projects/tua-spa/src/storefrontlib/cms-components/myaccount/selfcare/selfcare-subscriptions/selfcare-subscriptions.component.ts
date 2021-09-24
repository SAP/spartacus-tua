import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  OnDestroy,
  OnInit
} from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { TableLayout, TableStructure } from '@spartacus/storefront';
import { TmfSelfcareTreeService } from '../../../../../core/tmf/adapters/selfcare';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import {
  EntitiesModel,
  ProductRef,
  TmaSelfcareSubscriptions,
  TmaSubscribedProductsInventory
} from '../../../../../core/model';
import { SelfcareService } from '../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../core/util/constants';
import { TmaCellComponent } from '../../../shared/tma-table/tma-cell.component';
import { TmaStatusCellComponent } from '../../../shared/tma-table/tma-status/tma-status-cell.component';
import { TmaToggleLinkCellComponent } from '../../../shared/tma-table/tma-toggle-link/tma-toggle-link-cell.component';

const { SUBSCRIPTIONS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-selfcare-table',
  templateUrl: 'selfcare-subscriptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class SelfcareSubscriptionsComponent implements OnInit, OnDestroy {
  readonly key = SUBSCRIPTIONS.KEY;
  protected destroyed$ = new Subject();
  readonly domainType = SUBSCRIPTIONS.DOMAIN_TYPE;
  public listData$: Observable<EntitiesModel<TmaSelfcareSubscriptions>>;
  public structure$: TableStructure;

  constructor(
    protected selfcareService: SelfcareService,
    protected selfcareTreeService: TmfSelfcareTreeService,
    protected routing: RoutingService
  ) {}

  ngOnInit() {
    this.structure$ = this.getTableStructure();
    this.listData$ = this.getSelfcareSubscriptions();
  }

  /**
   * Get selfcare subscriptions
   * @returns TmaSelfcareSubscriptions
   */
  protected getSelfcareSubscriptions(): Observable<
    EntitiesModel<TmaSelfcareSubscriptions>
  > {
    return this.selfcareService.getSelfcareSubscriptions().pipe(
      switchMap((tree) =>
        this.selfcareTreeService.treeToggle$.pipe(map(() => tree))
      ),
      map((tree: TmaSubscribedProductsInventory) => this.convertListItem(tree))
    );
  }

  /**
   * Destroy Component
   */
  ngOnDestroy(): void {
    this.selfcareService.clearSelfcareSubscriptionsState();
  }

  /**
   * Represents Get Current key
   * @returns Current Key
   */
  public getCurrentKey(): Observable<string> {
    return this.routing
      .getParams()
      .pipe(pluck(SUBSCRIPTIONS.KEY), distinctUntilChanged());
  }

  /**
   * Navigates to the detailed view of the selected list item.
   */
  public launchItem(item: TmaSelfcareSubscriptions): void {
    const cxRoute = SUBSCRIPTIONS.ROUTE;
    const params = item;
    if (cxRoute && item && Object.keys(item).length > 0) {
      window.scroll(0, 0);
      this.routing.go({ cxRoute, params });
    }
  }

  /**
   * Convert List Item
   * @param subscriptions
   * @returns Selfcare Subcriptions Model with exapnded value
   */
  private convertListItem(
    subscriptions: TmaSubscribedProductsInventory
  ): EntitiesModel<TmaSelfcareSubscriptions> {
    let values: TmaSelfcareSubscriptions[] = [];
    if (!subscriptions) return;
    for (let i = 0; i < subscriptions.subscribedProducts.length; i++) {
      const result = this.getItem(
        subscriptions.subscribedProducts[i],
        subscriptions
      );
      values = [...values, ...result.values];
    }
    return { values };
  }

  /**
   * Implements Get Item
   * @param subscription
   * @param subscriptions
   * @param depthLevel
   * @returns Formatted value of Selfcare subscriptions model
   */
  private getItem(
    subscription: TmaSelfcareSubscriptions,
    subscriptions: TmaSubscribedProductsInventory,
    depthLevel = 0
  ): any {
    let values = [];
    const node: any = {
      ...subscription,
      count: subscription.product?.length ?? 0,
      expanded: this.selfcareTreeService.isExpanded(
        subscription.id,
        depthLevel
      ),
      depthLevel,
      // tmp, should be normalized
      uid: subscription.id,
      products: subscription.product
        ? [...subscription.product].sort((productA, productB) =>
            productA.name.localeCompare(productB.name)
          )
        : []
    };

    values.push(node);

    node.products.forEach((childUnit) => {
      const item = subscriptions.childrens.find(
        (product: ProductRef) => product.id === childUnit.id
      );
      const childList = this.getItem(
        item,
        subscriptions,
        depthLevel + 1
      )?.values;
      if (node.expanded && childList.length > 0) {
        values = values.concat(childList);
      }
    });

    return { values };
  }

  /**
   * Implements getTableStructure
   * @returns Table Structure
   */
  private getTableStructure(): TableStructure {
    const structure: TableStructure = {
      type: SUBSCRIPTIONS.CELL_DOMAIN_TYPE,
      cells: SUBSCRIPTIONS.CELLS,
      options: {
        layout: TableLayout.VERTICAL,
        cells: {
          name: {
            dataComponent: TmaToggleLinkCellComponent
          },
          status: {
            dataComponent: TmaStatusCellComponent
          },
          id: {
            dataComponent: TmaCellComponent
          }
        }
      }
    };
    return structure;
  }
}
