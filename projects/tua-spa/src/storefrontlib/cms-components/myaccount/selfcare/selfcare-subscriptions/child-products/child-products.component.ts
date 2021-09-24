import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { TmaSelfcareSubscriptions } from '../../../../../../core/model';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { SUBSCRIPTIONS, CHILD_PRODUCTS_DOMAIN_TYPE } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-selfcare-child-products',
  templateUrl: './child-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class ChildProductsComponent {
  readonly domainType = SUBSCRIPTIONS.CHILD_PRODUCTS_DOMAIN_TYPE;
  readonly model$: Observable<TmaSelfcareSubscriptions> =
    this.getCurrentKey().pipe(
      switchMap((code) => this.selfcareService.getSubscribedProduct(code))
    );

  constructor(
    protected selfcareService: SelfcareService,
    protected routingService: RoutingService
  ) {}

  /**
   * Represents Get Current key
   * @returns Current Key
   */
  private getCurrentKey(): Observable<string> {
    return this.routingService
      .getParams()
      .pipe(pluck(SUBSCRIPTIONS.KEY), distinctUntilChanged());
  }
}
