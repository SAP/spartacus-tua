import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { TmaProductOfferingPrice } from "../../../../../core/model";
import { TmaPriceService } from "../../../../../core/product/facade";

@Component({
  selector: "cx-alteration-details",
  templateUrl: "./tma-alteration-details.component.html",
  styleUrls: ["./tma-alteration-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaAlterationDetailsComponent implements OnInit {
  @Input()
  priceList?: TmaProductOfferingPrice[];

  @Input()
  price?: TmaProductOfferingPrice;

  constructor(public priceService: TmaPriceService) {}

  ngOnInit() {
    if (this.price) {
      const prices: TmaProductOfferingPrice[] = [];
      prices.push(this.price);
      this.priceList = prices;
    }
  }
}
