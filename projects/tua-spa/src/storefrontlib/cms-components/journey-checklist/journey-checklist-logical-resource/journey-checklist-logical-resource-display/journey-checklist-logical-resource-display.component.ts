import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { ModalRef, ModalService } from '@spartacus/storefront';
import {
  LogicalResource,
  LogicalResourceType,
  TmaOrderEntry,
  TmaProduct
} from '../../../../../core/model';
import { LogicalResourceReservationService } from '../../../../../core/reservation/facade';
import { Observable, Subject } from 'rxjs';
import { AvailabilityCheckService } from '../../../../../core';
import { JourneyChecklistLogicalResourceFormComponent } from '../journey-checklist-logical-resource-form/journey-checklist-logical-resource-form.component';

@Component({
  selector: 'cx-journey-checklist-logical-resource-display',
  templateUrl: './journey-checklist-logical-resource-display.component.html',
  styleUrls: ['./journey-checklist-logical-resource-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JourneyChecklistLogicalResourceDisplayComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @Input()
  logicalResources: LogicalResource[];

  @Input()
  item?: TmaOrderEntry;

  @Input()
  showEdit: boolean;

  @Input()
  tmaProduct?: TmaProduct;

  @Input()
  addLogicalResource: boolean;

  errorResult: string;
  reservationError$: Observable<boolean>;
  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();

  constructor(
    public logicalResourceReservationService: LogicalResourceReservationService,
    public availabilityCheckService: AvailabilityCheckService,
    protected modalService: ModalService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.reservationError$ = this.logicalResourceReservationService.hasReservationError();
  }

  ngOnDestroy(): void {
    this.logicalResourceReservationService.clearReservationError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Opens {@link JourneyChecklistLogicalResourceFormComponent} passing the necessary data
   *
   * @param resource of {@link LogicalResource}
   */
  public updateLogicalResource(resource?: LogicalResource): void {
    let modalInstance: any;
    this.modalRef = this.modalService.open(
      JourneyChecklistLogicalResourceFormComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: true
      }
    );
    modalInstance = this.modalRef.componentInstance;
    modalInstance.isEdit = resource ? true : false;
    modalInstance.cartEntry = this.item ? this.item : undefined;
  }

  /**
   * Checks whether the logical resource type is MSISDN or not
   *
   * @return true if {@link LogicalResourceType} matches MSISDN
   */
  public isResourceTypeMsisdn(
    logicalResourceType: LogicalResourceType
  ): boolean {
    return logicalResourceType === LogicalResourceType.MSISDN;
  }
}
