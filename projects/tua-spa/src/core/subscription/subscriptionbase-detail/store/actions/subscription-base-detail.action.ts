import { Action } from '@ngrx/store';

export enum SubscriptionBaseDetailActionType {
  LOAD_SUBSCRIPTION_BASE_DETAIL = '[Subscription-base-detail] Load Subscription Base Detail',
  LOAD_SUBSCRIPTION_BASE_DETAIL_SUCCESS = '[Subscription-base-detail] Load Subscription Base Detail Success',
  LOAD_SUBSCRIPTION_BASE_DETAIL_FAIL = '[Subscription-base-detail] Load Subscription Base Detail Fail',
  CLEAR_SUBSCRIPTION_BASE_DETAILS = '[Subscription-base-detail] Clear Subscription Base Detail',
}
export class LoadSubscriptionBaseDetail implements Action {
  readonly type =
    SubscriptionBaseDetailActionType.LOAD_SUBSCRIPTION_BASE_DETAIL;
  constructor(
    public payload: {
      baseSiteId: string;
      subscriptionBaseId: string;
    }
  ) {}
}

export class LoadSubscriptionBaseDetailSuccess implements Action {
  readonly type =
    SubscriptionBaseDetailActionType.LOAD_SUBSCRIPTION_BASE_DETAIL_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSubscriptionBaseDetailFail implements Action {
  readonly type =
    SubscriptionBaseDetailActionType.LOAD_SUBSCRIPTION_BASE_DETAIL_FAIL;
  constructor(public payload: any) {}
}

export class ClearSubscriptionBaseDetails implements Action {
  readonly type =
    SubscriptionBaseDetailActionType.CLEAR_SUBSCRIPTION_BASE_DETAILS;
  constructor() {}
}

export type SubscriptionBaseDetailAction =
  | LoadSubscriptionBaseDetail
  | LoadSubscriptionBaseDetailSuccess
  | LoadSubscriptionBaseDetailFail
  | ClearSubscriptionBaseDetails;
