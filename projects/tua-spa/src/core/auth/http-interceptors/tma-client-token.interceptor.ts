import { Injectable, OnDestroy } from '@angular/core';
import { AuthService, ClientToken, InterceptorUtil, USE_CLIENT_TOKEN } from '@spartacus/core';
import { TmfEndpointsService } from '../../tmf/services';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmaClientTokenInterceptor implements HttpInterceptor, OnDestroy {

  protected destroyed$ = new Subject();

  constructor(
    protected authService: AuthService,
    protected tmfEndpoints: TmfEndpointsService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let isUserLoggedIn = false;
    this.authService.isUserLoggedIn()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => isUserLoggedIn = value);
    return this.getClientToken(request).pipe(
      take(1),
      switchMap((token: ClientToken) => {
        if (!isUserLoggedIn && (!token || !token.token_type || !token.access_token)) {
          this.authService.getClientToken()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(value => token = value);
        }
        if (
          token && token.token_type && token.access_token &&
          (request.url.includes(this.tmfEndpoints.getBaseEndpoint()))
        ) {
          request = request.clone({
            setHeaders: {
              Authorization: `${token.token_type} ${token.access_token}`,
            },
          });
        }
        return next.handle(request);
      })
    );
  }

  protected getClientToken(request: HttpRequest<any>): Observable<ClientToken> {
    if (
      InterceptorUtil.getInterceptorParam(USE_CLIENT_TOKEN, request.headers)
    ) {
      return this.authService.getClientToken();
    }
    return of(null);
  }
}
