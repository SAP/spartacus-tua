import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartItemAlterationsDetailsComponent } from "./cart-item-alterations-details.component";
import { I18nModule } from "@spartacus/core";

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [CartItemAlterationsDetailsComponent],
  exports: [CartItemAlterationsDetailsComponent],
})
export class CartItemAlterationsDetailsModule {}
