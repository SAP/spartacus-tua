import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CxDatePipe } from '@spartacus/core';
import { JourneyChecklistLogicalResourceDisplayModule } from './journey-checklist-logical-resource-display';
import { JourneyChecklistLogicalResourceFormModule } from './journey-checklist-logical-resource-form';

@NgModule({
  imports: [
    CommonModule,
    JourneyChecklistLogicalResourceFormModule,
    JourneyChecklistLogicalResourceDisplayModule
  ],
  providers: [CxDatePipe],
  declarations: [],
  entryComponents: [],
  exports: []
})
export class JourneyChecklistLogicalResourceModule {
}
