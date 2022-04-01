import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { TmaBillingAccounts } from '../../../../../../core/model';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { BILLING_ACCOUNTS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-credit-limit',
  templateUrl: './credit-limit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class CreditLimitComponent {
  readonly domainType = BILLING_ACCOUNTS.CREDIT_LIMIT_DOMAIN_TYPE;
  readonly model$: Observable<TmaBillingAccounts> = this.getCurrentKey().pipe(
    switchMap((code) => this.selfcareService.getBillingAccountDetails(code))
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
      .pipe(pluck(BILLING_ACCOUNTS.KEY), distinctUntilChanged());
  }
}
