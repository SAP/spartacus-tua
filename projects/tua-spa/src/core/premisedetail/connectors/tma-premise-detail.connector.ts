import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaPremiseDetail, TmaTechnicalResource } from '../../model';
import { TmaPremiseDetailAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root'
})
export class TmaPremiseDetailConnector {

  constructor(protected adapter: TmaPremiseDetailAdapter) {
  }

  /**
   * Validates the provided premise details
   * 
   * @param premiseDetails - The premise details
   * @return List of {@link TmaTechnicalResource} as an {@link Observable}
   */
  public validatePremiseDetails(
    premiseDetails: TmaPremiseDetail
  ): Observable<TmaTechnicalResource[]> {
    return this.adapter.validatePremiseDetail(premiseDetails);
  }
}
