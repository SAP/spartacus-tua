import { ModuleWithProviders, NgModule } from '@angular/core';
import { SelfcareService } from './facade';
import { SelfcareStoreModule } from './store/selfcare-store.module';

@NgModule({
  imports: [SelfcareStoreModule]
})
export class SelfcareModule {
  static forRoot(): ModuleWithProviders<SelfcareModule> {
    return {
      ngModule: SelfcareModule,
      providers: [SelfcareService]
    };
  }
}