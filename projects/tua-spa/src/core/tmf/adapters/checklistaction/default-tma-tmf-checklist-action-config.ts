import { TmfConfig } from '../..';

export const defaultTmaTmfChecklistActionConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getChecklistAction: {
          endpoint: 'checklistAction'
        },
      },
    },
  },
};
