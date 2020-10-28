import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { TmaCartPrice } from "../../../../../../core/model";
import { TmaCartPriceService } from "../../../../../../core";

@Component({
  selector: "cx-cart-item-alteration-details",
  templateUrl: "./cart-item-alterations-details.component.html",
  styleUrls: ["./cart-item-alterations-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemAlterationsDetailsComponent implements OnInit {
  @Input()
  priceList?: TmaCartPrice[];

  @Input()
  price?: TmaCartPrice;

  constructor(public priceService: TmaCartPriceService) {}

  ngOnInit() {
    if (this.price) {
      const prices: TmaCartPrice[] = [];
      prices.push(this.price);
      this.priceList = prices;
    }
  }
}
