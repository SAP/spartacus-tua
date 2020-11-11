export const cart = {
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
      errorPost: 'Something went wrong. Could not add item to the shopping cart.',
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
};
