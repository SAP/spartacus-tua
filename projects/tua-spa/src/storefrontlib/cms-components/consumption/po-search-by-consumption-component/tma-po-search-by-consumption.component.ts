import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params } from '@angular/router';
import { TmaConsumptionConfig } from '../../../../core/config/consumption/config';
import { SEPARATOR, TmaConsumptionValue, TmaPoSearchByConsumption, TmaSliderOption } from '../../../../core/model';

@Component({
  selector: 'cx-po-search-by-consumption',
  templateUrl: './tma-po-search-by-consumption.component.html',
  styleUrls: ['./tma-po-search-by-consumption.component.scss']
})
export class TmaPoSearchByConsumptionComponent implements OnInit {

  @Input()
  poConsumption: TmaPoSearchByConsumption;

  @Input()
  isModal: boolean;

  @Input()
  url: string;

  @Input()
  queryParams: Params;

  @Output()
  closeModal = new EventEmitter<any>();

  sliderOptions: TmaSliderOption[] = [];
  consumption: string;

  consumptionForm: FormGroup = this.fb.group({
    consumptionInput: ['', Validators.required]
  });

  constructor(
    protected fb: FormBuilder,
    protected consumptionConfig: TmaConsumptionConfig
  ) {
  }

  ngOnInit(): void {
    this.createSliderOptionList();
    this.consumption = this.getConsumption(this.poConsumption.productSpecification.id, this.poConsumption.usageUnit.id);
    this.consumptionForm['controls'].consumptionInput.setValue(this.consumption);
  }

  /**
   * Updates the consumption value with a new value.
   *
   * @param consumptionValue The value to be updated
   */
  consumptionValueChange(consumptionValue) {
    this.consumptionForm['controls'].consumptionInput.setValue(consumptionValue);
  }

  /**
   * Retrieves the text message of the button.
   *
   * @return the button message
   */
  getButtonText(): string {
    if (this.isModal) {
      return 'consumption.updateMyConsumption';
    }

    return 'consumption.getAvailableOffers';
  }

  /**
   * Stores the new consumption value.
   */
  saveConsumption() {
    localStorage.setItem('consumption' + SEPARATOR + this.poConsumption.productSpecification.id + SEPARATOR + this.poConsumption.usageUnit.id, this.getConsumptionInput());
    if (this.isModal) {
      this.closeModal.emit({
        consumption: this.getConsumptionInput(),
        productSpecification: this.poConsumption.productSpecification.id
      });
    }
  }

  protected createSliderOptionList() {
    const sliderOptionsMap = new Map(Object.entries(this.poConsumption.sliderOptionComponents));

    sliderOptionsMap.forEach((value) => {
      const option: TmaSliderOption = {
        uid: value.uid,
        name: value.name,
        value: Number(value.value),
        media: {
          altText: value.media.code,
          url: value.media.url
        }
      };
      this.sliderOptions.push(option);
    });

    this.sliderOptions.sort((a, b) => (Number(a.value) > Number(b.value)) ? 1 : -1);
  }

  protected getConsumptionInput(): string {
    return this.consumptionForm.controls.consumptionInput.value;
  }

  protected getConsumption(productSpecification: string, usageUnit: string): string {
    const consumptionFromLocalStorage = localStorage.getItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit);

    if (consumptionFromLocalStorage) {
      return consumptionFromLocalStorage;
    }

    const defaultConsumptionValue = this.consumptionConfig.consumption.defaultValues.find((consumptionValue: TmaConsumptionValue) => consumptionValue.productSpecification === productSpecification && consumptionValue.usageUnit === usageUnit);
    if (!defaultConsumptionValue) {
      const consumptionValue = this.consumptionConfig.consumption.default;
      localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, consumptionValue);
      return consumptionValue;
    }

    localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, defaultConsumptionValue.value);
    return defaultConsumptionValue.value;
  }
}
