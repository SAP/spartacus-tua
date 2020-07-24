import { BaseStore, Language } from '@spartacus/core';

export namespace Tmf {
  export interface TmaChecklistAction {
    id: string;
    name: string;
    actionType: string;
  }

  export interface BaseSites {
    baseSites?: BaseSite[];
  }

  export interface BaseSite {
    channel?: string;
    defaultLanguage?: Language;
    defaultPreviewCatalogId?: string;
    defaultPreviewCategoryCode?: string;
    defaultPreviewProductCode?: string;
    locale?: string;
    name?: string;
    theme?: string;
    uid?: string;
    stores?: BaseStore[];
    urlPatterns?: string[];
    urlEncodingAttributes?: string[];
  }

  export interface TmaTmfShoppingCart {
    id: string;
    href: string;
    baseSiteId: string;
    cartItem?: TmaTmfCartItem[];
    relatedParty?: TmaTmfRelatedParty[];
  }

  export interface TmaTmfCartItem {
    id: string;
    action?: TmaTmfActionType;
    quantity?: number;
    cartItem?: TmaTmfCartItem[];
  }

  export enum TmaTmfActionType {
    ADD = 'ADD',
    UPDATE = 'UPDATE'
  }

  export interface TmaTmfRelatedParty {
    id: string;
    href: string;
    role?: string;
    name?: string;
  }
}
