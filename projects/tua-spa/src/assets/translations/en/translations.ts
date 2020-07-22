import { TranslationResources } from '@spartacus/core';

export const tmaTranslations: TranslationResources = {
  en: {
    product: {
      productDetails: {
        currency: {
          USD: '$',
          GBP: '£',
          EUR: '€',
        },
        price: {
          contractDuration: 'Contract Duration',
          common: {
            from: 'From',
            to: 'to',
            upTo: 'up to',
            onwards: 'onwards',
            each: 'each',
          },
          priceTypes: {
            payNow: 'Pay Now',
            recurringCharges: 'Recurring Charges',
            billingEvents: {
              oneTime: 'Pay Now',
              oneTime_paynow: 'Pay Now',
              oneTime_oncancellation: 'cancellation',
              oneTime_onfirstbill: 'first bill fee',
            },
            oneTimeFees: 'One Time Fees',
            usageCharges: 'Usage Charges',
          },
          recurringCharges: {
            forFirst: 'for first',
            forNext: 'for next',
            forLast: 'for last',
            month: '{{count}} month',
            month_plural: '{{count}} months',
            billingFrequency: {
              abbreviation: 'mo',
              abbreviation_month: 'mo',
              abbreviation_monthly: 'mo',
              abbreviation_year: 'yr',
              abbreviation_yearly: 'yr',
              abbreviation_annual: 'yr',
              abbreviation_annually: 'yr',
              abbreviation_quarter: 'qr',
              abbreviation_quarterly: 'qr',
            },
          },
          usageCharge: {
            charges: {
              charge_each_respective_tier: 'Charges',
              charge_highest_applicable_tier: 'Charged By',
              charge: 'Charges',
            },
            usageTypes: {
              usageType_each_respective_tier: 'Each Respective Tier',
              usageType_highest_applicable_tier: 'Highest Applicable Tier',
              usageType: 'Each Respective Tier',
            },
            perUnit: 'Per Unit',
            perVolume: 'Per Volume',
          },
        }
      },
    },
    cart: {
      cartItems: {
        contractStartDate: 'Contract Start Date',
        installationAddress: 'Installation Address',
        meterNo: 'Meter NO',
        price: {
          month: 'month',
          months: 'Months',
          onwards: 'onwards',
          payOnCheckoutPrice: 'Pay On Checkout',
          recurringCharges: 'Recurring Charges:',
          oneTimeCharges: 'One Time Charges:',
          usageCharges: 'Usage Charges:',
          overcharge: '',
          billingFrequency: {
            abbreviation_month: 'month',
            abbreviation_monthly: 'month',
            abbreviation_year: 'year',
            abbreviation_yearly: 'year',
            abbreviation_quarter: 'quarter',
            abbreviation_quarterly: 'quarter',
          }
        }

      },
      orderCost: {
        totalPayOnCheckout: 'Total Pay On Checkout:'
      }
    },
    common: {
      common: {
        yes: 'Yes',
        no: 'No',
        next: 'Next',
        optional: 'Optional',
        currency: {
          USD: '$',
          GBP: '£',
          EUR: '€',
        },
      }
    }
  }
};
