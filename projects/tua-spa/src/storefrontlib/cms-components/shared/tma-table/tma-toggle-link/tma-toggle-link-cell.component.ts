import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import {
  OutletContextData,
  TableDataOutletContext
} from '@spartacus/storefront';
import { TmaSelfcareSubscriptionsTreeNode } from '../../../../../core/model';
import { TmfSelfcareTreeService } from '../../../../../core/tmf/adapters/selfcare';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
  selector: 'cx-selfcare-toggle-link-cell',
  templateUrl: './tma-toggle-link-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaToggleLinkCellComponent extends TmaCellComponent {
  @HostBinding('style.--cx-depth-level')
  get depthLevel() {
    return this.model.depthLevel;
  }

  constructor(
    protected outlet: OutletContextData<TableDataOutletContext>,
    protected selfcareTreeService: TmfSelfcareTreeService
  ) {
    super(outlet);
  }

  get combinedName() {
    return this.property
      ? this.count > 0
        ? `${this.property} (${this.count})`
        : `${this.property}`
      : '';
  }

  get tabIndex() {
    return 0;
  }

  get expanded() {
    return this.model.expanded;
  }

  /**
   * Counts the number of descendants
   */
  get count() {
    return this.model.count;
  }

  toggleItem(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selfcareTreeService.toggle(this.model as any);
  }

  /**
   * Indicates whether the tree item should have a toggle navigation.
   *
   * The toggle navigation is used in case the tree item has descendants,
   * and if the tree item level is not configured to be shown anyway.
   */
  get isSwitchable(): boolean {
    return this.count > 0;
  }

  // TODO: leverage these methods when available from future PR.
  get hasItem(): boolean {
    return !!this.item && Object.keys(this.item).length > 0;
  }

  protected get item(): TmaSelfcareSubscriptionsTreeNode | null {
    if (!this.outlet.context) {
      return null;
    }
    const { _field, _options, _type, _i18nRoot, ...all } = this.outlet.context;
    return all as TmaSelfcareSubscriptionsTreeNode;
  }
}
