import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
  selector: 'selfcare-status-cell',
  templateUrl: './tma-status-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaStatusCellComponent extends TmaCellComponent {
  get label() {
    if (this.isActive === undefined) {
      return;
    }
    return this.isActive
      ? 'selfcare.subscriptions.enabled'
      : 'selfcare.subscriptions.disabled';
  }

  get isActive(): boolean {
    return this.model.status;
  }
}
