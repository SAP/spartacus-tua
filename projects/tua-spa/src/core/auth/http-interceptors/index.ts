import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TmaClientTokenInterceptor } from './tma-client-token.interceptor';
import { TmaUserTokenInterceptor } from './tma-user-token.interceptor';

export const tmaInterceptors: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useExisting: TmaClientTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useExisting: TmaUserTokenInterceptor,
    multi: true,
  },
];
