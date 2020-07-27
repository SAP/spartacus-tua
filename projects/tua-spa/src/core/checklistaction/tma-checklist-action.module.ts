import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaChecklistActionStoreModule } from './store/tma-checklist-action-store.module';
import { TmaChecklistActionService } from './facade';

@NgModule({
  imports: [TmaChecklistActionStoreModule],
})
export class TmaChecklistActionModule {
  static forRoot(): ModuleWithProviders<TmaChecklistActionModule> {
    return {
      ngModule: TmaChecklistActionModule,
      providers: [TmaChecklistActionService]
    };
  }
}
