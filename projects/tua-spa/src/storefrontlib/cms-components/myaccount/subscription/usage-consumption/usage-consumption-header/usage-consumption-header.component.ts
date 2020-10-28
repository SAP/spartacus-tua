import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsageConsumptionService } from '../../../../../../core/subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UsageConsumptionReport } from '../../../../../../core';

@Component({
  selector: 'cx-usage-consumption-header',
  templateUrl: './usage-consumption-header.component.html',
  styleUrls: ['./usage-consumption-header.component.scss'],
})
export class UsageConsumptionHeaderComponent implements OnInit, OnDestroy {
  subscriptionId: string;
  usageConsumptionReport$: Observable<UsageConsumptionReport>;
  protected destroyed$ = new Subject();

  constructor(
    protected subscriptionService: UsageConsumptionService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        filter((params: Params) => !!params),
        takeUntil(this.destroyed$)
      )
      .subscribe((params: Params) => {
        this.subscriptionId = params['subscriptionId'];
      });
    this.usageConsumptionReport$ = this.fetchUsageConsumptionReport();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.subscriptionService.clearUsageConsumptionDetails();
  }

  fetchUsageConsumptionReport(): Observable<UsageConsumptionReport> {
    return this.subscriptionService.fetchUsageConsumption(this.subscriptionId);
  }
}
