import { createMachine } from 'xstate';

// State Machine for Axiom-Standard Multi-Step Checkout
export const checkoutMachine = createMachine({
  id: 'checkout',
  initial: 'idle',
  predictableActionArguments: true,
  context: {
    cart: [],
    shippingAddress: null,
    billingInfo: null,
    paymentToken: null
  },
  states: {
    idle: {
      on: { START_CHECKOUT: 'address' }
    },
    address: {
      on: {
        SUBMIT_ADDRESS: { target: 'billing', actions: 'assignAddress' },
        CANCEL: 'idle'
      }
    },
    billing: {
      on: {
        SUBMIT_BILLING: { target: 'review', actions: 'assignBilling' },
        BACK: 'address'
      }
    },
    review: {
      on: {
        CONFIRM: 'processing',
        BACK: 'billing'
      }
    },
    processing: {
      invoke: {
        src: 'processPayment',
        onDone: { target: 'success', actions: 'assignToken' },
        onError: 'error'
      }
    },
    error: {
      on: {
        RETRY: 'processing',
        EDIT_BILLING: 'billing'
      }
    },
    success: {
      type: 'final'
    }
  }
});
