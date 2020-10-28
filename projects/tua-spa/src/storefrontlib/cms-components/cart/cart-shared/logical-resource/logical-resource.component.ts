import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { JourneyChecklistLogicalResourceComponent } from '../../../journey-checklist';
import {
  LogicalResource,
  LogicalResourceType
} from '../../../../../core/model';
import { LogicalResourceReservationService } from '../../../../../core/reservation/facade';
import { Observable, Subject } from 'rxjs';
import { TmaItem } from '..';

@Component({
  selector: 'cx-logical-resource',
  templateUrl: './logical-resource.component.html',
  styleUrls: ['./logical-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogicalResourceComponent implements OnInit, OnDestroy {
  @Input()
  logicalResources: LogicalResource[];

  @Input()
  item: TmaItem;

  @Input()
  isReadOnly: boolean;

  @Input()
  isCartPage: boolean;

  reservationError$: Observable<boolean>;
  protected modalRef: ModalRef;
  protected destroyed$ = new Subject();

  constructor(
    public logicalResourceReservationService: LogicalResourceReservationService,
    protected modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.reservationError$ = this.logicalResourceReservationService.hasReservationError();
  }

  ngOnDestroy(): void {
    this.logicalResourceReservationService.clearReservationError();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * This method is used to edit the MSISDN in Cart Page
   */
  public editMsisdn() {
    let modal: any;
    this.modalRef = this.modalService.open(
      JourneyChecklistLogicalResourceComponent,
      {
        centered: true,
        size: 'lg',
        backdrop: 'static',
        keyboard: true
      }
    );
    modal = this.modalRef.componentInstance;
    modal.isEdit = true;
    modal.cartEntry = this.item;
  }

  /**
   * This method is used to checks whether the logical resource type is MSISDN or not
   *
   * @returns true if LogicalResourceType matches MSISDN
   */
  public isResourceTypeMsisdn(
    logicalResourceType: LogicalResourceType
  ): boolean {
    return logicalResourceType === LogicalResourceType.MSISDN;
  }
}
