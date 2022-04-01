import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  AuthConfig,
  AuthModule,
  ClientAuthModule,
  Config,
  ConfigModule,
  UserAuthModule
} from '@spartacus/core';
import { defaultTmaAuthConfig } from './config/default-tma-auth-config';
import { TmaClientTokenInterceptor } from './http-interceptors/tma-client-token.interceptor';
import { TmaUserTokenInterceptor } from './http-interceptors/tma-user-token.interceptor';

@NgModule({
  imports: [
    CommonModule,
    ClientAuthModule.forRoot(),
    UserAuthModule.forRoot(),
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaAuthConfig)
  ]
})
export class TmaAuthModule extends AuthModule {
  static forRoot(): ModuleWithProviders<TmaAuthModule> {
    return {
      ngModule: TmaAuthModule,
      providers: [
        ...[
          {
            provide: HTTP_INTERCEPTORS,
            useExisting: TmaClientTokenInterceptor,
            multi: true
          },
          {
            provide: HTTP_INTERCEPTORS,
            useExisting: TmaUserTokenInterceptor,
            multi: true
          }
        ],
        { provide: AuthConfig, useExisting: Config }
      ]
    };
  }
}
