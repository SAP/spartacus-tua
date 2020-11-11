import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { ICON_TYPE, ModalService } from '@spartacus/storefront';
import { TmaCmsConsumptionComponent } from '../../../../../core/model';
import { TmaConsumptionChangeService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-consumption',
  templateUrl: './tma-consumption-dialog.component.html',
  styleUrls: ['./tma-consumption-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaConsumptionDialogComponent implements OnInit {

  @Input()
  consumptionComponent: TmaCmsConsumptionComponent;

  @Input()
  url: string;

  @Input()
  queryParams: Params;

  @Output()
  updateConsumption = new EventEmitter<any>();

  iconTypes = ICON_TYPE;

  constructor(
    protected modalService: ModalService,
    protected consumptionChangeService: TmaConsumptionChangeService,
  ) {
  }

  ngOnInit(): void {
  }

  dismissModal(
    {
      consumption,
      productSpecification,
    }: {
      consumption?: number,
      productSpecification?: string
    }): void {
    if (consumption && productSpecification) {
      this.consumptionChangeService.updateConsumption({ consumption: consumption, productSpecification: productSpecification });
      this.updateConsumption.emit(consumption);
    }
    this.modalService.dismissActiveModal();
  }
}
