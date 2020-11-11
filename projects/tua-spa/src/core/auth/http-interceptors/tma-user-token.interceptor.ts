import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '@spartacus/core';
import { TmfEndpointsService } from '../../tmf/services/tmf-endpoints.service';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TmaUserTokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tmfEndpoints: TmfEndpointsService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.getUserToken().pipe(
      take(1),
      switchMap(token => {
        if (
          token && token.token_type && token.access_token &&
          (this.isTmfUrl(request.url)) &&
          !request.headers.get('Authorization')
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

  protected isTmfUrl(url: string): boolean {
    return url.includes(this.tmfEndpoints.getBaseEndpoint());
  }
}
