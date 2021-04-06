import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { JourneyChecklistLogicalResourceDisplayComponent } from './journey-checklist-logical-resource-display.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  declarations: [JourneyChecklistLogicalResourceDisplayComponent],
  exports: [JourneyChecklistLogicalResourceDisplayComponent],
  entryComponents: [JourneyChecklistLogicalResourceDisplayComponent]
})
export class JourneyChecklistLogicalResourceDisplayModule {
}
