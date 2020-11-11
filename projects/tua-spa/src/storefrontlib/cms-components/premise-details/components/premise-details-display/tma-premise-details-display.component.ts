import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseSiteService } from '@spartacus/core';
import { Observable, Subject } from 'rxjs';
import { TmaChecklistAction, TmaChecklistActionType, TmaPremiseDetail } from '../../../../../core/model';
import { TmaChecklistActionService } from '../../../../../core/checklistaction/facade';
import { takeUntil } from 'rxjs/operators';
import { TmaChecklistActionTypeCheckService, TmaPremiseDetailInteractionService } from '../../../../../core';

@Component({
  selector: 'cx-premise-details-display',
  templateUrl: './tma-premise-details-display.component.html',
  styleUrls: ['./tma-premise-details-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPremiseDetailsDisplayComponent implements OnInit, OnDestroy {

  @Input()
  premiseDetail: TmaPremiseDetail;

  @Input()
  compact: boolean;

  @Input()
  isReadOnly: boolean;

  @Input()
  productCode: string;

  @Input()
  entryNumber: number;

  @Output()
  updatePremiseDetails = new EventEmitter<any>();

  baseSiteId: string;
  checklistAction$: Observable<TmaChecklistAction[]>;
  premiseDetails$: Observable<{ premiseDetails: TmaPremiseDetail, entryNumber: number }>;

  protected destroyed$ = new Subject();

  constructor(
    protected baseSiteService: BaseSiteService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected premiseDetailInteractionService: TmaPremiseDetailInteractionService,
    protected checklistActionTypeCheckService: TmaChecklistActionTypeCheckService
  ) {}

  ngOnInit(): void {
    this.baseSiteService.getActive().pipe(takeUntil(this.destroyed$)).subscribe((baseSiteId: string) => this.baseSiteId = baseSiteId);
    this.checklistAction$ = this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, this.productCode);
    this.premiseDetails$ = this.premiseDetailInteractionService.getPremiseDetails;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Emits an event with the updated premise detail
   */
  updatePremise(): void {
    this.updatePremiseDetails.emit(this.premiseDetail);
  }

  /**
   * Get the checklist action type
   * 
   * @return A {@link TmaChecklistActionType}
   */
  get checklistActionType(): typeof TmaChecklistActionType {
    return TmaChecklistActionType;
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
   * Returns the installation address from the provided premise details
   * 
   * @param premiseDetail - premise detail
   * @param entryNumber - optional entry number
   * @returns The installation address as {@link string}
   */
  getInstallationAddress(premiseDetail: TmaPremiseDetail, entryNumber?: number): string {
    if (entryNumber !== +this.entryNumber) {
      premiseDetail = this.premiseDetail;
    }

    if (!premiseDetail || !premiseDetail.installationAddress) {
      return '';
    }

    let installationAddress = '';
    installationAddress += premiseDetail.installationAddress.streetName;
    installationAddress += ', ' + premiseDetail.installationAddress.buildingNumber;
    installationAddress += premiseDetail.installationAddress.apartmentNumber ?
      ', ' + premiseDetail.installationAddress.apartmentNumber : '';
    installationAddress += ', ' + premiseDetail.installationAddress.postalCode;
    installationAddress += premiseDetail.installationAddress.region && premiseDetail.installationAddress.region.name ?
      ', ' + premiseDetail.installationAddress.region.name : '';
    installationAddress += ', ' + premiseDetail.installationAddress.city;
    installationAddress += ', ' + (premiseDetail.installationAddress.country.name ?
      premiseDetail.installationAddress.country.name : premiseDetail.installationAddress.country.isocode);

    return installationAddress;
  }

  /**
   * Returns the meter details from the provided premise detail
   * 
   * @param premiseDetail - premise detail
   * @param entryNumber - optional entry number
   * @returns The meter details as {@link string}
   */
  getMeterDetails(premiseDetail: TmaPremiseDetail, entryNumber?: number): string {
    if (entryNumber !== +this.entryNumber) {
      premiseDetail = this.premiseDetail;
    }
    return premiseDetail && premiseDetail.meter ? premiseDetail.meter.id : '';
  }

   /**
   * Get the premise details
   * 
   * @param premiseDetail - the premise details
   * @return A {@link TmaPremiseDetail}
   */
  getPremiseDetails(premiseDetail: { premiseDetails: TmaPremiseDetail, entryNumber: number }): TmaPremiseDetail {
    if (premiseDetail){
      return premiseDetail.premiseDetails;
    }
      return this.premiseDetail;
  }

}
