import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TmaOrderEntry } from '../../../../../../core/model';

@Component({
  selector: 'cx-installation-address',
  templateUrl: './installation-address.component.html',
  styleUrls: ['./installation-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallationAddressComponent {
  @Input()
  installationAddressEntries: TmaOrderEntry[];

  constructor() {}
}
