import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MediaService } from '@spartacus/storefront';

@Component({
  selector: 'cx-slider-option',
  templateUrl: './tma-slider-option.component.html',
  styleUrls: ['./tma-slider-option.component.scss']
})
export class TmaSliderOptionComponent implements OnInit {

  @Input()
  consumption: string;

  @Input()
  sliderOptions: any;

  @Output()
  consumptionValue = new EventEmitter<number>();

  mediaValues = [];
  checked: boolean[] = [];

  constructor(protected mediaService: MediaService) {
  }

  ngOnInit(): void {
    this.populateMedia();
    this.updateSlider();
  }

  /**
   * Updates the value of the slider to a new value of the slider.
   *
   * @param index - the index of the new value
   */
  changeOptionValue(index: number): void {
    const value = this.sliderOptions[index].value;
    this.consumptionValue.emit(value);
  }

  /**
   * Updates the selected radio button of the slider
   */
  updateSlider(): void {
    const consumption: number = Number(this.consumption);
    this.sliderOptions.forEach((option, index) => {
      if (consumption === option.value){
        this.checked[index] = true;
      }
    });
  }

  protected populateMedia(): void {
    this.sliderOptions.forEach(option => {
      const media = this.mediaService.getMedia(
        option.media,
        option.media.format,
        option.media.altText
      );

      this.mediaValues.push(media);
    });
  }
}
