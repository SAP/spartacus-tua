import { AuthConfig, AuthModule, Config, ConfigModule } from '@spartacus/core';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { defaultTmaAuthConfig } from './config/default-tma-auth-config';
import { TmaClientTokenInterceptor } from './http-interceptors/tma-client-token.interceptor';
import { TmaUserTokenInterceptor } from './http-interceptors/tma-user-token.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaAuthConfig),
  ],
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
            multi: true,
          },
          {
            provide: HTTP_INTERCEPTORS,
            useExisting: TmaUserTokenInterceptor,
            multi: true,
          },
        ],
        { provide: AuthConfig, useExisting: Config },
      ],
    };
  }
}
