import { AuthConfig, AuthModule, Config, ConfigModule, provideConfigValidator } from '@spartacus/core';
import { tmaInterceptors } from './http-interceptors';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { defaultTmaAuthConfig } from './config/default-tma-auth-config';
import { tmfConfigValidator } from '../tmf/config/tmf-config-validator';

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
        ...tmaInterceptors,
        { provide: AuthConfig, useExisting: Config },
      ],
    };
  }
}
