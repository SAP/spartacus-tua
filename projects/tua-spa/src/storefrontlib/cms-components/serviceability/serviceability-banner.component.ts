import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  CmsComponentData,
  MediaService,
  ModalService
} from '@spartacus/storefront';
import { OccConfig } from '@spartacus/core';
import { QueryServiceQualificationService, TmaCmsServiceabilityBannerComponent } from '../../../core';
import { ServiceabilityFormComponent } from './serviceability-form/serviceability-form.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'cx-serviceability-banner',
  templateUrl: './serviceability-banner.component.html',
  styleUrls: ['./serviceability-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceabilityBannerComponent implements OnDestroy {
  modalRef: any;
  baseUrl: string;
  protected destroyed$ = new Subject();

  constructor(
    public component: CmsComponentData<TmaCmsServiceabilityBannerComponent>,
    public mediaService: MediaService,
    protected config: OccConfig,
    protected modalService: ModalService,
    protected queryServiceQualificationService: QueryServiceQualificationService
  ) {}

  ngOnDestroy() {
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.queryServiceQualificationService.clearQueryServiceSearchResultState();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  checkServiceability(data : TmaCmsServiceabilityBannerComponent) {
    let modalInstance: any;
    this.modalRef = this.modalService.open(ServiceabilityFormComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
      keyboard: false
    });

    modalInstance = this.modalRef.componentInstance;
    modalInstance.simpleProductOffering = data.simpleProductOffering;
    if (data.bundledProductOffering !== undefined) {
      modalInstance.bundleProductOffering = data.bundledProductOffering;
    }
  }
}
