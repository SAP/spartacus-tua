import { TmaTmfProductOffering } from '.';

export interface TmaChecklistAction {
  id?: string;
  name?: string;
  actionType: string;
  productOffering?: TmaTmfProductOffering[];
}

export enum TmaChecklistActionType {
  CONTRACT_START_DATE = 'CONTRACT_START_DATE',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  INSTALLATION_ADDRESS = 'INSTALLATION_ADDRESS',
  APPOINTMENT = 'APPOINTMENT',
  MSISDN = 'MSISDN'
}
