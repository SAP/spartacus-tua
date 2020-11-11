import { ItemCounterComponent } from '@spartacus/storefront';
import { Component, forwardRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line */
  useExisting: forwardRef(() => TmaItemCounterComponent),
  multi: true
};

@Component({
  selector: 'cx-item-counter',
  templateUrl: './tma-item-counter.component.html',
  providers: [COUNTER_CONTROL_ACCESSOR]
})
export class TmaItemCounterComponent extends ItemCounterComponent implements OnInit {

  @Input()
  quantity: number;

  @Input()
  entryNumber: number;

  constructor(
    protected renderer2: Renderer2
  ) {
    super(renderer2);
  }

  ngOnInit() {
    super.ngOnInit();
    this.writeValue(this.quantity || this.value || this.min || 0);
  }
}
