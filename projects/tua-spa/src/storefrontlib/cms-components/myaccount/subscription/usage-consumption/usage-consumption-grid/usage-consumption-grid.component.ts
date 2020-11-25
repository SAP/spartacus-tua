import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsageConsumptionService } from '../../../../../../core/subscription';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import {
  UsageConsumptionReport,
  BucketRef,
} from '../../../../../../core/model';

@Component({
  selector: 'cx-usage-consumption-grid',
  templateUrl: './usage-consumption-grid.component.html',
})
export class UsageConsumptionGridComponent implements OnInit, OnDestroy {
  isOverUsed: boolean;
  subscriptionId: string;
  usageConsumptionReport$: Observable<UsageConsumptionReport>;
  protected destroyed$ = new Subject();

  constructor(
    protected usageConsumptionService: UsageConsumptionService,
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
    this.usageConsumptionService.clearUsageConsumptionDetails();
  }

  fetchUsageConsumptionReport(): Observable<UsageConsumptionReport> {
    return this.usageConsumptionService.fetchUsageConsumption(
      this.subscriptionId
    );
  }

  getProductName(bucket: BucketRef): string {
    return bucket.product.name;
  }
  
  getStartDate(bucket: BucketRef): any {
    return bucket.bucketBalance[0].validFor.startDateTime;
  }

  getEndDate(bucket: BucketRef): any {
    return bucket.bucketBalance[0].validFor.endDateTime;
  }

  getUsagePercentage(bucket: BucketRef): string {
    const total: number =
      bucket.bucketCounter[0].value + bucket.bucketBalance[0].remainingValue;
    const usagePercentage: number =
      (bucket.bucketCounter[0].value / total) * 100;
    this.isOverUsed = usagePercentage > 100;
    return Math.round(usagePercentage) + '%';
  }

  getTotalUsage(bucket: BucketRef): number {
    return (
      bucket.bucketCounter[0].value + bucket.bucketBalance[0].remainingValue
    );
  }
}
