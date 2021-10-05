import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { JourneyChecklistLogicalResourceFormComponent } from './journey-checklist-logical-resource-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    CommonModule,
    I18nModule,
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  declarations: [JourneyChecklistLogicalResourceFormComponent],
  exports: [JourneyChecklistLogicalResourceFormComponent],
  entryComponents: [JourneyChecklistLogicalResourceFormComponent]
})
export class JourneyChecklistLogicalResourceFormModule {
}
