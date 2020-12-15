import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from "@angular/core";
import { TmaCartPrice } from "../../../../../../core/model";

@Component({
  selector: "cx-cart-item-alteration-details",
  templateUrl: "./cart-item-alterations-details.component.html",
  styleUrls: ["./cart-item-alterations-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemAlterationsDetailsComponent {
  @Input()
  alterations: TmaCartPrice[];

  constructor() {}

}
