import { OccConfig } from '@spartacus/core';

export const defaultTmaB2bOccConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        addEntries:
          'orgUsers/${userId}/carts/${cartId}/entries?quantity=${quantity}&code=${code}',
        setDeliveryAddress:
          'users/${userId}/carts/${cartId}/addresses/delivery'
      }
    }
  }
};
