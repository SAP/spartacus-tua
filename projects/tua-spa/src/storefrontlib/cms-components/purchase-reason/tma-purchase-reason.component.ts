import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseSiteService } from '@spartacus/core';
import { DatePipe } from '@angular/common';
import { TmaChecklistAction, TmaChecklistActionType } from '../../../core/model';
import { TmaChecklistActionService } from '../../../core/checklistaction/facade';
import { takeUntil } from 'rxjs/operators';
import { TmaChecklistActionTypeCheckService } from '../../../core';

@Component({
  selector: 'cx-purchase-reason',
  templateUrl: './tma-purchase-reason.component.html',
  styleUrls: ['./tma-purchase-reason.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPurchaseReasonComponent implements OnInit, OnDestroy {

  @Input()
  contractStartDate: string;

  @Input()
  serviceProvider: string;

  @Input()
  selectedReasonPurchase: string;

  @Input()
  compact: boolean;

  @Input()
  isReadOnly: boolean;

  @Input()
  productCode: string;

  @Input()
  entryNumber: number;

  @Output()
  moveIn = new EventEmitter<any>();

  @Output()
  switchProvider = new EventEmitter<any>();

  @Output()
  updateProvider = new EventEmitter<any>();

  @Output()
  updateContractStartDate = new EventEmitter<any>();

  @Output()
  updateServiceProvider = new EventEmitter<any>();

  @ViewChild('serviceProviderButton', { static: false })
  serviceProviderButton: ElementRef;

  @ViewChild('serviceProviderInput', { static: false })
  serviceProviderInput: ElementRef;

  checklistAction$: Observable<TmaChecklistAction[]>;

  minDate: Date;
  maxDate: Date;
  
  protected baseSiteId: string;
  protected destroyed$ = new Subject();

  constructor(
    protected baseSiteService: BaseSiteService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected datePipe: DatePipe,
    protected checklistActionTypeCheckService: TmaChecklistActionTypeCheckService
  ) {
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1000);
    this.baseSiteService.getActive().pipe(takeUntil(this.destroyed$)).subscribe((baseSiteId: string) => this.baseSiteId = baseSiteId);
    this.checklistAction$ = this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, this.productCode);
    if (!this.selectedReasonPurchase){
      this.selectedReasonPurchase = 'move';
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Emits an event for the move radio button state
   */
  onMoveInChecked(): void {
    this.selectedReasonPurchase = "move";
    this.moveIn.emit();
  }

  /**
   * Emits an event for the switch provider radio button state
   */
  onSwitchProviderChecked(): void {
    this.selectedReasonPurchase = "switchProvider";
    this.switchProvider.emit();
  }

  /**
   * Emits an event with the updated contract start date
   * 
   * @param event - user input event
   */
  onUpdateContractStartDate(event: Event) {
    this.updateContractStartDate.emit(this.datePipe.transform((event.target as HTMLInputElement).value, 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\''));
  }

  /**
   * Emits an event for the service provider input state
   */
  onUpdateServiceProvider() {
    this.serviceProvider = this.serviceProviderInput.nativeElement.value;
    this.serviceProviderButton.nativeElement.disabled = true;
    this.updateProvider.emit({ serviceProvider: this.serviceProvider });
  }

  /**
   * Checks if the update service provider button should be disabled
   * 
   * @return True if the update service provider button should be disabled, otherwise false
   */
  isUpdateServiceProviderButtonDisabled(): boolean {
    return !this.serviceProvider || this.serviceProvider === '';
  }

  /**
   * Check if the installation address action type is provided
   * 
   * @param checklistActionList - list of checklist actions
   * @param type - checklist action type
   * @return True if the checklist type is found in the checklist actions list, otherwise false
   */
  hasChecklistActionOfType(checklistActionList: TmaChecklistAction[], type: TmaChecklistActionType): boolean {
    return this.checklistActionTypeCheckService.hasChecklistActionOfType(checklistActionList, type);
  }

  /**
   * Emits an event for the service provider input change state
   */
  onServiceProviderChanged(): void {
    this.updateServiceProvider.emit(this.serviceProviderInput.nativeElement.value);
  }

  /**
   * Enables/disables the 'Yes' button if the service provider input changes
   */
  updateServiceProviderButton(event: Event): void {
    (event.target as HTMLInputElement).value !== '' ?
      this.serviceProviderButton.nativeElement.disabled = false :
      this.serviceProviderButton.nativeElement.disabled = true;
  }

  /**
   * Get the checklist action type
   * 
   * @return A {@link TmaChecklistActionType}
   */
  get checklistActionType(): typeof TmaChecklistActionType {
    return TmaChecklistActionType;
  }
}
