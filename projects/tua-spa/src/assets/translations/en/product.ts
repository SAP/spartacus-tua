export const product = {
  productDetails: {
    averageCost: 'Average Cost',
    year: 'year',
    month: 'month',
    contractTerm: 'Contract Term',
    cancellationFee: 'Cancellation Fee',
    onetimeFees: 'One-time Fees',
    payNowPrices: 'Pay Now',
    onFirstBillPrices: 'On First Bill',
    recurringPrices: 'Recurring Prices',
    usageChargePrices: 'Charge Prices',
    overage: 'Overage',
    months: 'Months',
    costEstimationWarning: 'The average cost is properly determined only for prices that have a single usage unit',
    warningMessage: 'The average cost is properly determined only for prices that have a single usage unit!',
    loginNeeded: 'You need to login before adding product to cart.',
    price: {
      contractDuration: 'Contract Duration',
      common: {
        from: 'From',
        to: 'to',
        upTo: 'up to',
        onwards: 'onwards',
        each: 'each'
      },
      priceTypes: {
        payNow: 'Pay Now',
        recurringCharges: 'Recurring Charges',
        billingEvents: {
          oneTime: 'Pay Now',
          oneTime_paynow: 'Pay Now',
          oneTime_oncancellation: 'cancellation',
          oneTime_onfirstbill: 'first bill fee'
        },
        oneTimeFees: 'One Time Fees',
        usageCharges: 'Usage Charges'
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
          abbreviation_quarterly: 'qr'
        }
      },
      usageCharge: {
        charges: {
          charge: 'Charges',
          charge_each_respective_tier: 'Charges',
          charge_highest_applicable_tier: 'Charged By'
        },
        usageTypes: {
          usageType_each_respective_tier: 'Each Respective Tier',
          usageType_highest_applicable_tier: 'Highest Applicable Tier',
          usageType: 'Each Respective Tier'
        },
        perUnit: 'Per Unit',
        perVolume: 'Per Volume'
      }
    }
  },
  productList: {
    viewDetails: 'View Details',
    viewDetailedPrices: 'View Detailed Prices',
    averageCostBaseOnConsumption: 'Average cost base on your consumption',
    updateConsumption: 'Update Your Consumption'
  }
};
