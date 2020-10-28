import { Component, OnInit, OnDestroy } from '@angular/core';
import { BucketRef, UsageConsumptionReport } from '../../../../../../core';
import { Observable, Subject } from 'rxjs';
import { ChartType, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { UsageConsumptionService } from '../../../../../../core/subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cx-usage-consumption-piechart',
  templateUrl: './usage-consumption-piechart.component.html',
  styleUrls: ['./usage-consumption-piechart.component.scss'],
})
export class UsageConsumptionPiechartComponent implements OnInit, OnDestroy {
  subscriptionId: string;
  usageConsumptionReport$: Observable<UsageConsumptionReport>;
  public doughnutChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartColors: Color[] = [
    {
      backgroundColor: ['rgb(225, 39, 39)', 'rgb(25, 188, 25)'],
    },
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
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

  getProductName(bucket: BucketRef): string {
    return bucket.product.name;
  }

  getDoughnutChartData(bucket: BucketRef): number[] {
    if (bucket.bucketBalance[0].remainingValue < 0) {
      return [bucket.bucketCounter[0].value, 0];
    }
    return [
      bucket.bucketCounter[0].value,
      bucket.bucketBalance[0].remainingValue,
    ];
  }

  isOverUsage(bucket: BucketRef): boolean {
    return bucket.bucketBalance[0].remainingValue < 0;
  }

  getRemainingUsage(bucket: BucketRef): number {
    if (bucket.bucketBalance[0].remainingValue > 0) {
      return bucket.bucketBalance[0].remainingValue;
    }
    return 0;
  }
}
