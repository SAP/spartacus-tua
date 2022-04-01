export interface TmaPaymentRef {
  code?: string;
  href?: string;
  id?: string;
  name?: string;
  type?: TmaPaymentType;
  '@referredType'?: string;
}

export enum TmaPaymentType {
  VOUCHER = 'VOUCHER',
  CREDITCARD = 'CREDITCARD'
}

