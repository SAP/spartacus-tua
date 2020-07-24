import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConverterService, FeatureConfigService, OccCartEntryAdapter, OccEndpointsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCartModification } from '../../../model/tma-cart.model';
import { TmaCartEntryAdapter } from '../../../cart/store/adapters/tma-cart-entry.adapter';
import { TmaOrderEntry } from '../../../model/tma-cart.entry.model';
import { TMA_CART_MODIFICATION_NORMALIZER } from "../../../cart/connectors";

@Injectable({
  providedIn: 'root'
})
export class TmaOccCartEntryAdapter extends OccCartEntryAdapter implements TmaCartEntryAdapter {

  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService,
    protected featureConfigService?: FeatureConfigService
  ) {
    super(http, occEndpointsService, converterService, featureConfigService);
  }

  addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): Observable<TmaCartModification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = this.occEndpointsService.getUrl(
      'addEntries',
      { userId, cartId }
    );

    return this.http
      .post<TmaCartModification>(url, cartEntry, { headers })
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }

  updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): Observable<TmaCartModification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const entryNumber = cartEntry.entryNumber;
    const url = this.occEndpointsService.getUrl(
      'updateEntries',
      { userId, cartId, entryNumber }
    );

    return this.http
      .patch<TmaCartModification>(url, cartEntry, { headers })
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }
}
