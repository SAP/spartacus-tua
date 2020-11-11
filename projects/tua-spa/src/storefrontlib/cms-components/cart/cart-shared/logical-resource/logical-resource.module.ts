import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { LogicalResourceComponent } from './logical-resource.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [LogicalResourceComponent],
  exports: [LogicalResourceComponent],
  entryComponents: [LogicalResourceComponent]
})
export class LogicalResourceModule {
}
