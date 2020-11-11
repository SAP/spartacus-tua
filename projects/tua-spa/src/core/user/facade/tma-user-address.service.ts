import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Address,
  AuthService,
  OCC_USER_ID_CURRENT,
  StateWithProcess,
  StateWithUser,
  UserActions,
  UserAddressService
} from '@spartacus/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as TmaUserAddressSelector from '../store/selectors/tma-user-address.selectors';

@Injectable({
  providedIn: 'root'
})
export class TmaUserAddressService extends UserAddressService {

  protected destroyed$ = new Subject();

  constructor(
    protected store: Store<StateWithUser | StateWithProcess<void>>,
    protected authService?: AuthService
  ) {
    super(store, authService);
  }

  /**
   * Adds the provided address to the list of the user's addresses.
   *
   * @param address - The address which will be added
   */
  addUserAddress(address: Address): void {
    this.getUserId(userId =>
      this.store.dispatch(
        new UserActions.AddUserAddress({
          userId,
          address
        })
      )
    );
  }

  protected getUserId(callback: (userId: string) => void): void {
    if (this.authService) {
      this.authService
        .getOccUserId()
        .pipe(
          takeUntil(this.destroyed$),
          take(1)
          )
        .subscribe(userId => callback(userId));
    }
    else {
      callback(OCC_USER_ID_CURRENT);
    }
  }

  protected isAddressEqual(a1: Address, a2: Address): boolean {
    return a1.town === a2.town &&
      a1.country.isocode === a2.country.isocode &&
      a1.line1 === a2.line1 &&
      a1.line2 === a2.line2 &&
      a1.postalCode === a2.postalCode &&
      (a1.region ? a1.region.isocode === a2.region.isocode : !a1.region);
  }
}
