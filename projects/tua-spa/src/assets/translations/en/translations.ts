import { TranslationResources } from '@spartacus/core';

export const tmaTranslations: TranslationResources = {
  en: {
    product: {
      productDetails: {
        loginNeeded: 'Please Login to proceed with add to cart.',
        price: {
          contractDuration: 'Contract Duration',
          common: {
            off:'OFF',
            hierarchical_price:'Hierarchical Price',
            from: 'From',
            to: 'to',
            upTo: 'up to',
            onwards: 'onwards',
            each: 'each',
            discount: 'You Save',
            applicableDiscount : 'Discounts / ',
            for: 'for'
          },
          priceTypes: {
            payNow: 'Pay Now',
            recurringCharges: 'Recurring Charges',
            billingEvents: {
              billingEvent_paynow: 'On Checkout',
              billingEvent_oncancellation: 'On Cancellation',
              billingEvent_onfirstbill: 'On First Bill',
              billingEvent_monthly: 'monthly',
              billingEvent_yearly: 'yearly',
              billingEvent_quarterly: 'quarterly',
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
              charge: 'Charges',
              charge_each_respective_tier: 'Charges',
              charge_highest_applicable_tier: 'Charged By',
            },
            usageTypes: {
              usageType_each_respective_tier: 'Charged By Each Respective Tier',
              usageType_highest_applicable_tier: 'Charged By Highest Applicable Tier',
            },
            perUnit: 'Per Unit',
            perVolume: 'Per Volume',
          },
        },
      },
    },
    cart: {
      cartItems: {
        contractStartDate: 'Contract Start Date',
        installationAddress: 'Installation Address:',
        meterNo: 'Meter NO',
        appointment: 'Appointment:',
        defaultAppointment: 'Please call to Schedule',
        appointmentError: {
          getAppointmentByIdError:
            'There is a problem in fetching appointment details.Please try again later',
          appointmentByIdCartRemoval:
            'Your appointment cannot be displayed. Please remove the cart entry to proceed',
          errorPost:
            'Something went wrong. Could not add item to the shopping cart.',
          cancelledAppointmentError:
            'There is a problem with appointment. Please  remove this entry from the cart to proceed.',
        },
        price: {
          common: {
            from: 'From',
            onwards: 'onwards',
          },
          month: 'month',
          months: 'Months',
          payOnCheckoutPrice: 'Pay On Checkout',
          recurringCharges: 'Recurring Charges',
          oneTimeCharges: 'One Time Charges',
          usageCharges: 'Usage Charges',
          billingFrequency: {
            abbreviation_month: 'month',
            abbreviation_monthly: 'month',
            abbreviation_year: 'year',
            abbreviation_yearly: 'year',
            abbreviation_quarter: 'quarter',
            abbreviation_quarterly: 'quarter',
          },
        },
      },
      orderCost: {
        toBeDetermined: 'TBD',
        totalPayOnCheckout: 'Total Pay On Checkout',
      },
    },
    common: {
      common: {
        yes: 'Yes',
        no: 'No',
        next: 'Next',
        back: 'Back',
        continue: 'Continue',
        update: 'Update',
        optional: 'Optional',
        priceInformation: 'Price Information',
        currencies: {
          currency: '$',
          currency_USD: '$',
          currency_GBP: '£',
          currency_EUR: '€',
        },
      },
    },
    guidedSelling: {
      guidedSelling: {
        steps: {
          offers: 'Offers',
          configureOffer: 'Configure Offer',
        },
        addSelection: {
          buttonLabel_select: 'Select',
          buttonLabel_unselect: 'Unselect',
        },
        currentSelection: {
          newContract: '(with new contract)',
          offer: 'Offer',
          startingFrom: 'Starting From',
          bestApplicable: 'Best Applicable Price',
        },
        edit: {
          previousAppointmentDeleted:
            'Previously selected Installation details are no longer valid.',
        },
      },
    },
    priceheadLine: {
      priceheadLine: {
        productListPriceHeadline: {
          bestApplicable: 'Best Applicable Price',
        },
      },
    },

    resource: {
      resource: {
        type_MSISDN: 'Phone Number',
      },
    },
    stepper: {
      stepper: {
        stepper_MSISDN: 'Select your desired Phone Number',
        stepper_APPOINTMENT: 'Select a suitable time for an appointment',
        stepper_INSTALLATION_ADDRESS:
          'Select suitable details for your installation address',
      },
    },
    availabilityCheckError: {
      availabilityCheckError: {
        fetchAvailabilityCheck:
          'There is a problem in fetching Phone numbers. Please try again later',
      },
    },
    msisdnReservationError: {
      msisdnReservationError: {
        postReservationError:
          'Something went wrong. Could not add item to the shopping cart',
        patchError:
          'Phone number cannot be updated at the moment. Continue with previous selection',
        getReservationError:
          'There is a problem in fetching Phone number details. Please try again later',
        cancelledReservationError:
          'There is a problem with selected Phone number. Please remove this entry from the cart to proceed',
      },
    },
    checkList: {
      checkList: {
        appointment: {
          headline: 'Select a suitable time for an appointment',
          call_to_schedule: 'Please Call to Schedule',
          patchError:
            'Could not update the appointment at this time. Select "Call to Schedule" option to have an appointment booked for you.',
        },
        installationAddress: {
          headline: 'Select suitable details for your installation address',
        },
        msisdn: {
          headline: 'Select your desired Phone Number',
        },
      },
    },
    subscriptions: {
      subscriptions: {
        headingSubscription: 'My Subscriptions',
        subscribedServices: 'Subscribed Services:',
        usageDetailsBtn: 'Usage Details',
        backToSubscriptions: 'Go back to Subscriptions',
        orderNumber: 'Order Number',
        contractStartDate: 'Contract Start date',
        contractDuration: 'Contract Duration',
        expiresOn: 'Expires On',
        noSubscription: 'You have no subscriptions',
        priceInfo: 'Original Order Prices',
        noConsumptions: 'No usage consumption data available',
        usageConsumption: 'Usage Consumption',
        overUsedDataLimit: 'Over Used Data Limit',
        usageRemaining: 'remaining',
        usageUsed: 'used',
        serviceName: 'Service Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        usagePercentage: 'Usage %',
        usage: 'Usage',
        usageConsumptionMsg:
          'You have used {{usageValue}} {{usageUnit}} out of {{total}} {{usageUnit}}',
        usageRemainingMsg: '{{usageValue}} {{usageUnit}} Remaining',
        usageUsedMsg: '{{usageValue}} {{usageUnit}} Used',
        subscriptionUnits: {
          mobile_data: 'Mobile Data',
          phone_minutes: 'Phone Minutes',
          movies_on_demand: 'Movies on demand',
          theme_packages: 'Theme  Packages',
          radio_stations: 'Radio Stations',
          documentaries_on_demand: 'Documentaries on demand',
          blockbusters_on_demand: 'Blockbusters on demand',
          videos_on_demand: 'Videos on demand',
          music_pieces: 'Music Pieces',
          sms: 'SMS',
          mb: 'MB',
          gb: 'GB',
          sessions: 'Sessions',
          channels: 'Channels',
          unit: 'Unit',
          replacements: 'Replacements',
          gbps: 'GBPS',
          mbps: 'MBPS',
        },
      },
    },
    addressInputs: {
      addressInputs: {
        buildingNumber: {
          label: 'House/Building Number',
          placeholder: 'House/Building Number',
        },
        streetName: {
          label: 'Street',
          placeholder: 'Street',
        },
        apartmentNumber: {
          label: 'Apartment/Unit/Suite',
          placeholder: 'Apartment/Unit/Suite',
        },
        city: {
          label: 'City',
          placeholder: 'City',
        },
        country: {
          label: 'Country',
          placeholder: 'Country',
        },
        state: {
          label: 'State/Province',
          placeholder: 'State/Province',
        },
        postalCode: {
          label: 'Zip/Postal Code',
          placeholder: 'Postal Code',
        },
      },
    },
  },
};
