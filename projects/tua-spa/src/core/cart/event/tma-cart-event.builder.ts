import { Injectable } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { CartEventBuilder, EventService } from '@spartacus/core';
import { TmaCartService } from '../facade';
import { TmaCartEntryActionTypes } from '../store/actions/tma-cart-entry.actions';
import { TmaCartAddEntryEvent } from './tma-cart.events';

/**
 * Registers events for the active cart
 */
@Injectable(
  { providedIn: 'root' }
)
export class TmaCartEventBuilder extends CartEventBuilder {

  constructor(
    protected actionsSubject: ActionsSubject,
    protected event: EventService,
    protected activeCartService: TmaCartService
  ) {
    super(actionsSubject, event, activeCartService);
    this.register();
  }

  /**
   * Registers events for the active cart
   */
  protected register() {
    this.registerAddEntry();
  }

  /**
   * Register events for adding entry to the active cart
   */
  protected registerAddEntry() {
    this.registerMapped({
      action: TmaCartEntryActionTypes.ADD_ENTRY,
      event: TmaCartAddEntryEvent
    });
  }
}
