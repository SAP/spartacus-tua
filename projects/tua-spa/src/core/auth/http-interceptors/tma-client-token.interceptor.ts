import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  AuthService,
  ClientAuthActions,
  ClientAuthSelectors,
  ClientErrorHandlingService,
  ClientToken,
  ClientTokenService,
  InterceptorUtil,
  StateWithClientAuth,
  USE_CLIENT_TOKEN,
} from '@spartacus/core';
import { LoaderState } from '@spartacus/core/src/state/utils/loader';
import { Observable, of, Subject, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { TmfEndpointsService } from '../../tmf/services';

@Injectable({ providedIn: 'root' })
export class TmaClientTokenInterceptor implements HttpInterceptor, OnDestroy {
  protected destroyed$ = new Subject();

  constructor(
    protected authService: AuthService,
    protected tmfEndpoints: TmfEndpointsService,
    protected clientTokenService: ClientTokenService,
    protected clientErrorHandlingService: ClientErrorHandlingService,
    protected store: Store<StateWithClientAuth>
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isClientTokenRequest = this.isClientTokenRequest(request);
    if (isClientTokenRequest) {
      request = InterceptorUtil.removeHeader(USE_CLIENT_TOKEN, request);
    }

    let isUserLoggedIn = false;
    this.authService
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => (isUserLoggedIn = value));
    return this.getClientToken(isClientTokenRequest).pipe(
      take(1),
      switchMap((token: ClientToken) => {
        if (
          !isUserLoggedIn &&
          (!token || !token.token_type || !token.access_token)
        ) {
          this.tmaGetClientToken()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(value => token = value);
        }

        if (
          token &&
          token.token_type &&
          token.access_token &&
          request.url.includes(this.tmfEndpoints.getBaseEndpoint())
        ) {
          request = request.clone({
            setHeaders: {
              Authorization: `${token.token_type} ${token.access_token}`,
            },
          });
        }

        return next.handle(request).pipe(
          catchError((errResponse: any) => {
            if (errResponse instanceof HttpErrorResponse) {
              if (errResponse.status === 401) {
                if (isClientTokenRequest) {
                  if (this.isExpiredToken(errResponse)) {
                    return this.clientErrorHandlingService.handleExpiredClientToken(
                      request,
                      next
                    );
                  }
                }
              }
            }
            return throwError(errResponse);
          })
        );
      })
    );
  }

  /**
   * This method is used to check if the request is to get client token
   * @param request, the request
   * @return boolean, true if the request is for client token, otherwise false
   */
  protected isClientTokenRequest(request: HttpRequest<any>): boolean {
    const isRequestMapping = InterceptorUtil.getInterceptorParam(
      USE_CLIENT_TOKEN,
      request.headers
    );
    return Boolean(isRequestMapping);
  }

  /**
   * This method is used to get client token
   * @param isClientTokenRequest, boolean which indicates if request is for client token
   * @return Observable<ClientToken>, the token
   */
  protected getClientToken(
    isClientTokenRequest: boolean
  ): Observable<ClientToken> {
    if (isClientTokenRequest) {
      return this.clientTokenService.getClientToken();
    }
    return of(null);
  }

  /**
   * This method is used to get tma client token
   * @return Observable<ClientToken>, the token
   */
  protected tmaGetClientToken(): Observable<ClientToken> {
    return this.store.pipe(
      select(ClientAuthSelectors.getClientTokenState),
      filter((state: LoaderState<ClientToken>) => {
        if (this.isClientTokenLoaded(state)) {
          return true;
        } else {
          if (!state.loading) {
            this.store.dispatch(new ClientAuthActions.LoadClientToken());
          }
          return false;
        }
      }),
      map((state: LoaderState<ClientToken>) => state.value)
    );
  }

  protected isClientTokenLoaded(state: LoaderState<ClientToken>): boolean {
    return (state.success || state.error) && !state.loading;
  }

  protected isExpiredToken(resp: HttpErrorResponse): boolean {
    return resp.error?.errors?.[0]?.type === 'InvalidTokenError';
  }
}
