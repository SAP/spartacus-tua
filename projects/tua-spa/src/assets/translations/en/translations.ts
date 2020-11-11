import { TranslationResources } from '@spartacus/core';
import { AddressBookComponent } from '@spartacus/storefront';

export const tmaTranslations: TranslationResources = {
  en: {
    product: {
      productDetails: {
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
              charge: 'Charges',
              charge_each_respective_tier: 'Charges',
              charge_highest_applicable_tier: 'Charged By',
            },
            usageTypes: {
              usageType_each_respective_tier: 'Each Respective Tier',
              usageType_highest_applicable_tier: 'Highest Applicable Tier',
              usageType: 'Each Respective Tier',
            },
            perUnit: 'Per Unit',
            perVolume: 'Per Volume',
          },
        },
        loginNeeded: 'You need to login before adding product to cart.',
      },
      productList: {
        viewDetails: 'View Details'
      },
    },
    cart: {
      cartItems: {
        contractStartDate: 'Contract Start Date',
        installationAddress: 'Installation Address',
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
          startingFrom: 'Starting From'
        }
      }
    },
    addressInputs: {
      addressInputs: {
        buildingNumber: {
          label: 'House/Building Number',
          placeholder: 'House/Building Number'
        },
        streetName: {
          label: 'Street',
          placeholder: 'Street'
        },
        apartmentNumber: {
          label: 'Apartment/Unit/Suite',
          placeholder: 'Apartment/Unit/Suite'
        },
        city: {
          label: 'City',
          placeholder: 'City'
        },
        country: {
          label: 'Country',
          placeholder: 'Country'
        },
        state: {
          label: 'State/Province',
          placeholder: 'State/Province'
        },
        postalCode: {
          label: 'Zip/Postal Code',
          placeholder: 'Postal Code'
        }
      }
    },
    premiseDetails: {
      premiseDetails: {
        checkAvailability: 'Check availability',
        checkAvailabilityErrorMessage: 'Wrong configuration! Product does not have \'INSTALLATION_ADDRESS\' checklist action and\/or \'meter_id\' configurable product specification characteristic.',
        provideDetails: 'Please provide premise details',
        detailValidation: 'Validate premise details',
        updateDetails: 'Update premise details',
        visitProductListingPage: 'Visit product listing page',
        premiseAddress: {
          title: 'Premise Address'
        },
        meterDetails: {
          title: 'Meter details',
          meterId: {
            label: 'Meter ID',
            placeholder: 'Meter ID'
          }
        },
        premiseDetailsValidation: {
          success: 'Current product offering can be successfully installed at this premise. Would you like to add the product offering to cart?',
          fail: 'Current premise is not valid for current product offering installation. Please contact support on number +100244243.'
        }
      }
    },
    purchaseReason: {
      purchaseReason: {
        reasonForPurchase: 'Reason For Purchase?',
        move: 'Moving/Moved',
        switchProvider: 'Switching Providers',
        desiredContractStartDate: 'Desired Contract Start Date',
        desiredChangeDate: 'Desired Change Date',
        previousEnergySupplier: 'Previous Energy Supplier',
        saveEnergySupplies: 'Set Energy Supplier'
      }
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
          mbps: 'MBPS'
        }
      }
    }
  }
};
