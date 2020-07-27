import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TmaProduct } from '../../model';
import { TmaSelectionAction } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaGuidedSellingCurrentSelectionsService {

  protected currentSelections: TmaProduct[];
  protected _shouldRemoveCurrentSelections: boolean;

  protected _selection = new Subject<{ product: TmaProduct, action: TmaSelectionAction }>();
  protected _selection$: Observable<{ product: TmaProduct, action: TmaSelectionAction }> = this._selection.asObservable();

  constructor() {
    this.currentSelections = [];
    this._shouldRemoveCurrentSelections = true;
  }

  /**
   * Adds/removes a new selection to the current selection.
   *
   * @param product - The product offering to be added/removed from the current selection
   * @param action - The action which indicates if the product offering is added or removed from the current selection
   */
  changeSelection(product: TmaProduct, action: TmaSelectionAction): void {
    action === TmaSelectionAction.ADD ? this.addToCurrentSelections(product) : this.removeFromCurrentSelections(product);
    this._selection.next({ product: product, action: action });
  }

  /**
   * Returns the list of the current selections.
   *
   * @return List of {@link TmaProduct}
   */
  getCurrentSelections(): TmaProduct[] {
    return this.currentSelections;
  }

  /**
   * Clears the current selection list.
   */
  clearCurrentSelections(): void {
    this.currentSelections.forEach((currentSelection: TmaProduct) => {
      this.changeSelection(currentSelection, TmaSelectionAction.REMOVE);
    });
  }

  protected addToCurrentSelections(product: TmaProduct): void {
    this.currentSelections.push(product);
  }

  protected removeFromCurrentSelections(product: TmaProduct): void {
    this.currentSelections = this.currentSelections.filter((prod: TmaProduct) => prod.code !== product.code);
  }

  get selection$(): Observable<{ product: TmaProduct, action: TmaSelectionAction }> {
    return this._selection$;
  }

  get shouldRemoveCurrentSelections(): boolean {
    return this._shouldRemoveCurrentSelections;
  }

  set shouldRemoveCurrentSelections(shouldRemoveCurrentSelections: boolean) {
    this._shouldRemoveCurrentSelections = shouldRemoveCurrentSelections;
  }
}
