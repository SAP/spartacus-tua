import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { Page } from '@spartacus/core';
import { ICON_TYPE, ModalService, PageLayoutService } from '@spartacus/storefront';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TmaCmsConsumptionComponent } from '../../../../../core/model';
import { TmaConsumptionChangeService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-consumption',
  templateUrl: './tma-consumption-dialog.component.html',
  styleUrls: ['./tma-consumption-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaConsumptionDialogComponent implements OnInit {

  @Input()
  consumptionComponent: TmaCmsConsumptionComponent;

  @Input()
  url: string;

  @Input()
  queryParams: Params;

  @Input()
  cartEntryConsumption?: string;

  @Output()
  updateConsumption = new EventEmitter<any>();

  currentPageCode$: Observable<string> = this.pageService.page$.pipe(
    filter(Boolean),
    map((p: Page) => p.pageId)
  );

  iconTypes = ICON_TYPE;
  protected destroyed$ = new Subject();

  constructor(
    protected modalService: ModalService,
    protected consumptionChangeService: TmaConsumptionChangeService,
    protected pageService?: PageLayoutService
  ) {
  }

  ngOnInit(): void {
  }

  dismissModal(
    {
      consumption,
      productSpecification
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
