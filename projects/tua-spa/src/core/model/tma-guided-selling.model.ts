export interface TmaGuidedSellingStep {
  id: string;
  name: string;
  active: boolean;
  inProductGroup: boolean;
}

export enum TmaSelectionAction {
  ADD = 'add',
  REMOVE = 'remove'
}
