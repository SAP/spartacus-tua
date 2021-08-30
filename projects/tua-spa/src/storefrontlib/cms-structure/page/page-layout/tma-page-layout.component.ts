import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PageLayoutComponent, PageLayoutService } from "@spartacus/storefront";

@Component({
    selector: 'cx-page-layout',
    templateUrl: './tma-page-layout.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class TmaPageLayoutComponent extends PageLayoutComponent {
    constructor(protected pageLayoutService: PageLayoutService) {super(pageLayoutService)}
  }