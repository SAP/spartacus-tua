import { TmaTmfProductOffering } from '.';

export interface TmaChecklistAction {
  id?: string;
  name?: string;
  actionType: string;
  productOffering?: TmaTmfProductOffering[];
}
