import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BREAKPOINT, BreakpointService } from '@spartacus/storefront';
import { TmaGuidedSellingCurrentSelectionsService, TmaGuidedSellingStepsService } from '../../../core/guided-selling/facade';

@Component({
  selector: 'cx-guided-selling',
  templateUrl: './tma-guided-selling.component.html'
})
export class TmaGuidedSellingComponent implements OnInit, OnDestroy {

  bpoCode: string;
  compact: boolean;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected breakpointService: BreakpointService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService
  ) {
  }

  ngOnInit(): void {
    this.bpoCode = this.activatedRoute.snapshot.url[1].toString();
    this.compact = window.innerWidth < this.breakpointService.getSize(BREAKPOINT.md);
  }

  ngOnDestroy(): void {
    if (this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections) {
      this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
      this.guidedSellingStepsService.setFirstStepAsActiveStep();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.compact = window.innerWidth < this.breakpointService.getSize(BREAKPOINT.md);
  }
}
