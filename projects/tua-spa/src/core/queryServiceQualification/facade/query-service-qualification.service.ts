import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  StateWithQueryServiceQualification,
  QueryServiceQualificationActions,
  QueryServiceQualificationSelectors
} from '../store';
import {
  QueryServiceQualification,
  GeographicAddress,
  ServiceQualificationItem,
  ServiceCharacteristic,
  RelatedPlaceRefOrValue
} from '../../model';
import { LOCAL_STORAGE } from '../../util';
import { GeographicAddressAction } from '../../geographic-address';

const {
  QUERY_SERVICE_QUALIFICATION,
  SEARCH_CRITERIA,
  INSTALLATION_PLACE,
  GEOGRAPHIC_ADDRESS
} = LOCAL_STORAGE.INSTALLATION_ADDRESS;

@Injectable()
export class QueryServiceQualificationService implements OnDestroy {
  protected destroyed$ = new Subject();

  constructor(protected store: Store<StateWithQueryServiceQualification>) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Get the products by querying serviceSpecification and serviceCharacteristic
   * from the serviceQualificationItem
   *
   * @param serviceQualification of {@link QueryServiceQualification}
   */
  getResultsFromQueryServiceQualification(
    serviceQualification: QueryServiceQualification
  ): void {
    if (serviceQualification.serviceQualificationItem) {
      const queries: string[] = this.createQueriesForServiceQualification(serviceQualification);
      this.productSearch(queries);
    }
  }

  /**
   * Create search queries for serviceSpecification and serviceCharacteristic
   * from the serviceQualificationItem
   *
   * @param serviceQualification of {@link QueryServiceQualification}
   *
   * @returns list of search queries as {@link string}
   */
  createQueriesForServiceQualification(
    serviceQualification: QueryServiceQualification
  ): string[] {
    const serviceQualificationMap = new Map();
    const queries: string[] = [];
    if (serviceQualification.serviceQualificationItem) {
      serviceQualification.serviceQualificationItem.forEach(
        (serviceQualificationItem: ServiceQualificationItem) => {
          const serviceQuery =
            this.createServiceSpecification(serviceQualificationItem) +
            ':' +
            this.createServiceCharacteristic(serviceQualificationItem);
          serviceQualificationMap.set(
            serviceQualificationItem.id,
            serviceQuery
          );
        }
      );
      serviceQualificationMap.forEach((value: string) => {
        const serviceQuery = '*::' + value.slice(0, -1);
        queries.push(serviceQuery);
      });
      return queries;
    } else {
      const serviceQuery = '*::' + this.createServiceSpecification(null) +
        ':' +
        this.createServiceCharacteristic(null);
      queries.push(serviceQuery);
      return queries;
    }
  }

  /**
   * Returns the list of product codes which are not serviceable
   *
   * @param productCodes List of product codes
   *
   * @return List of {@link String} as an {@link Observable}
   */
  getNonServiceableProductOfferings(
    productCodes: string[]
  ): Observable<String[]> {
    return this.store.pipe(
      select(QueryServiceQualificationSelectors.filterNonServiceableProducts, {
        productCodes: productCodes
      })
    );
  }
  /**
   * Creates {@link QueryServiceQualification} with searchCriteria as {@link GeographicAddress}
   *
   * @param address of {@link GeographicAddress}
   */
  createQueryServiceQualification(address: GeographicAddress): void {
    let queryServiceQualification: QueryServiceQualification;
    queryServiceQualification = {
      instantSyncQualification: true,
      type: QUERY_SERVICE_QUALIFICATION,
      searchCriteria: {
        type: SEARCH_CRITERIA,
        service: {
          place: [
            {
              role: INSTALLATION_PLACE,
              '@type': GEOGRAPHIC_ADDRESS,
              city: address.city,
              postcode: address.postcode,
              streetName: address.streetName,
              streetType: address.streetType,
              streetNr: address.streetNr
            }
          ]
        }
      }
    };
    this.store.dispatch(
      new QueryServiceQualificationActions.CreateQueryServiceQualification(
        queryServiceQualification
      )
    );
  }

  /**
   * Get {@link QueryServiceQualification} by SearchCriteria
   *
   * @param address {@link GeographicAddress}
   *
   * @return a {@link QueryServiceQualification}  as an {@link Observable}
   */
  getQueryServiceQualification(
    address?: GeographicAddress
  ): Observable<QueryServiceQualification> {
    return this.store.pipe(
      select(
        QueryServiceQualificationSelectors.getQueryServiceQualificationBySearchCriteria,
        { address }
      ),
      tap((queryServiceQualification) => {
        if (
          queryServiceQualification === undefined
        ) {
          this.createQueryServiceQualification(address)
        }
      })
    );
  }

  /**
   * Determines if service qualification response has errors
   *
   * @return a {@link boolean} as an {@link Observable}
   */
  hasQueryServiceQualificationError(): Observable<boolean> {
    return this.store.pipe(
      select(
        QueryServiceQualificationSelectors.hasQueryServiceQualificationError
      )
    );
  }

  /**
   * Clears the query service qualification state
   */
  clearQueryServiceQualificationState(): void {
    this.store.dispatch(
      new QueryServiceQualificationActions.ClearQueryServiceQualification()
    );
  }

  /**
   * Clears the query service search result state
   */
  clearQueryServiceSearchResultState(): void {
    this.store.dispatch(
      new QueryServiceQualificationActions.ClearQueryServiceProductSearchResult()
    );
  }

  /**
   * Clears the query service error qualification state.
   */
  clearQueryServiceQualificationErrorState(): void {
    this.store.dispatch(
      new QueryServiceQualificationActions.ClearQueryServiceQualificationError()
    );
  }

  /**
   * Gets the selected address from state
   */
  getSelectedAddress():Observable<RelatedPlaceRefOrValue> {
    return this.store.pipe(
      select(QueryServiceQualificationSelectors.getSelectedAddress)
    );
  }

  /**
   * Sets the selected installation address in the state
   *
   * @param geographicAddress of {@type GeographicAddress}
   */
  selectedInstallationAddress(geographicAddress: GeographicAddress): void {
    this.store.dispatch(
      new GeographicAddressAction.SelectedInstallationAddress({
        selectedInstallationAddress: geographicAddress
      })
    );
  }

  protected productSearch(query: String[]): void {
    this.store.dispatch(
      new QueryServiceQualificationActions.QueryServiceProductSearchResult({
        queryText: query
      })
    );
  }

  protected createServiceSpecification(
    serviceQualificationItem: ServiceQualificationItem
  ): String {
    let serviceSpecification: String = '';
    if (
      serviceQualificationItem != null &&
      serviceQualificationItem.service.serviceSpecification != null
    ) {
      serviceSpecification =
        'cfsSpecs:' +
        serviceQualificationItem.service.serviceSpecification.name;
    } else {
      serviceSpecification = 'cfsSpecs:undefined';
    }
    return serviceSpecification;
  }

  protected createServiceCharacteristic(
    serviceQualificationItem: ServiceQualificationItem
  ): String {
    let serviceChar: String = '';
    if (serviceQualificationItem && serviceQualificationItem.service.serviceCharacteristic) {
      serviceQualificationItem.service.serviceCharacteristic.forEach(
        (serviceCharacteristic: ServiceCharacteristic) => {
          if (serviceCharacteristic.name) {
            serviceChar = serviceChar.concat(
              serviceCharacteristic.name.replace(/_/g, '') +
                '_sscv' +
                ':' +
                serviceCharacteristic.value +
                ':'
            );
          }
        }
      );
    }
    return serviceChar;
  }
}
