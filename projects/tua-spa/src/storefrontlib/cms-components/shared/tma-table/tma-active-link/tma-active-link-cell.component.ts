import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
  selector: 'cx-selfcare-active-link-cell',
  templateUrl: '../tma-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaActiveLinkCellComponent extends TmaCellComponent {
  get tabIndex() {
    return 0;
  }
}
