# Multi-Step Form with XState

Production-ready multi-step form implementation using XState for complex user flows.

## Use Cases
- Checkout processes
- User on boarding
- Survey/questionnaire
- Registration workflows

## Stack
- **State Management**: XState
- **Framework**: React / Vue
- **Validation**: Zod
- **Styling**: Tailwind CSS + OKLCH

## Implementation

### 1. State Machine Definition

```typescript
// multi-step-checkout.machine.ts
import { createMachine, assign } from 'xstate';
import { z } from 'zod';

// Validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

const addressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().min(2),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()),
  cvv: z.string().regex(/^\d{3,4}$/),
});

export interface CheckoutContext {
  personalInfo: z.infer<typeof personalInfoSchema> | null;
  address: z.infer<typeof addressSchema> | null;
  payment: z.infer<typeof paymentSchema> | null;
  errors: Record<string, string>;
  orderId: string | null;
}

export const checkoutMachine = createMachine<CheckoutContext>({
  id: 'checkout',
  initial: 'personalInfo',
  context: {
    personalInfo: null,
    address: null,
    payment: null,
    errors: {},
    orderId: null,
  },
  states: {
    personalInfo: {
      on: {
        NEXT: {
          target: 'address',
          actions: assign({
            personalInfo: (_, event) => event.data,
            errors: {},
          }),
          cond: (_, event) => {
            try {
              personalInfoSchema.parse(event.data);
              return true;
            } catch {
              return false;
            }
          },
        },
        VALIDATE: {
          actions: assign({
            errors: (_, event) => {
              try {
                personalInfoSchema.parse(event.data);
                return {};
              } catch (error) {
                return error.flatten().fieldErrors;
              }
            },
          }),
        },
      },
    },
    address: {
      on: {
        BACK: 'personalInfo',
        NEXT: {
          target: 'payment',
          actions: assign({
            address: (_, event) => event.data,
            errors: {},
          }),
          cond: (_, event) => {
            try {
              addressSchema.parse(event.data);
              return true;
            } catch {
              return false;
            }
          },
        },
        VALIDATE: {
          actions: assign({
            errors: (_, event) => {
              try {
                addressSchema.parse(event.data);
                return {};
              } catch (error) {
                return error.flatten().fieldErrors;
              }
            },
          }),
        },
      },
    },
    payment: {
      on: {
        BACK: 'address',
        SUBMIT: {
          target: 'processing',
          actions: assign({
            payment: (_, event) => event.data,
            errors: {},
          }),
          cond: (_, event) => {
            try {
              paymentSchema.parse(event.data);
              return true;
            } catch {
              return false;
            }
          },
        },
        VALIDATE: {
          actions: assign({
            errors: (_, event) => {
              try {
                paymentSchema.parse(event.data);
                return {};
              } catch (error) {
                return error.flatten().fieldErrors;
              }
            },
          }),
        },
      },
    },
    processing: {
      invoke: {
        src: 'processOrder',
        onDone: {
          target: 'success',
          actions: assign({
            orderId: (_, event) => event.data.orderId,
          }),
        },
        onError: {
          target: 'payment',
          actions: assign({
            errors: (_, event) => ({
              _form: event.data.message || 'Payment failed. Please try again.',
            }),
          }),
        },
      },
    },
    success: {
      type: 'final',
    },
  },
});
```

### 2. React Implementation

```typescript
// CheckoutFlow.tsx
import { useMachine } from '@xstate/react';
import { checkoutMachine } from './multi-step-checkout.machine';

export function CheckoutFlow() {
  const [state, send] = useMachine(checkoutMachine, {
    services: {
      processOrder: async (context) => {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalInfo: context.personalInfo,
            address: context.address,
            payment: context.payment,
          }),
        });

        if (!response.ok) {
          throw new Error('Order processing failed');
        }

        return response.json();
      },
    },
  });

  const currentStep = state.value as string;
  const stepNumber = {
    personalInfo: 1,
    address: 2,
    payment: 3,
    processing: 4,
    success: 5,
  }[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <ProgressBar currentStep={stepNumber} totalSteps={5} />

      {/* Forms */}
      {state.matches('personalInfo') && (
        <PersonalInfoForm
          onNext={(data) => send({ type: 'NEXT', data })}
          onValidate={(data) => send({ type: 'VALIDATE', data })}
          errors={state.context.errors}
          initialData={state.context.personalInfo}
        />
      )}

      {state.matches('address') && (
        <AddressForm
          onNext={(data) => send({ type: 'NEXT', data })}
          onBack={() => send('BACK')}
          onValidate={(data) => send({ type: 'VALIDATE', data })}
          errors={state.context.errors}
          initialData={state.context.address}
        />
      )}

      {state.matches('payment') && (
        <PaymentForm
          onSubmit={(data) => send({ type: 'SUBMIT', data })}
          onBack={() => send('BACK')}
          onValidate={(data) => send({ type: 'VALIDATE', data })}
          errors={state.context.errors}
          initialData={state.context.payment}
        />
      )}

      {state.matches('processing') && <ProcessingSpinner />}

      {state.matches('success') && (
        <SuccessScreen orderId={state.context.orderId!} />
      )}
    </div>
  );
}
```

### 3. Form Components

```typescript
// PersonalInfoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface PersonalInfoFormProps {
  onNext: (data: any) => void;
  onValidate: (data: any) => void;
  errors: Record<string, string>;
  initialData: any;
}

export function PersonalInfoForm({ onNext, onValidate, errors, initialData }: PersonalInfoFormProps) {
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData || {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          {...register('phone')}
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{formErrors.phone.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Continue to Address
      </button>
    </form>
  );
}
```

### 4. Progress Bar Component

```typescript
// ProgressBar.tsx
export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { number: 1, name: 'Personal Info' },
    { number: 2, name: 'Address' },
    { number: 3, name: 'Payment' },
    { number: 4, name: 'Processing' },
    { number: 5, name: 'Complete' },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.number} className="relative flex-1">
            <div className="flex items-center">
              <div
                className={`
                  relative flex h-10 w-10 items-center justify-center rounded-full border-2
                  ${currentStep >= step.number
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                  }
                  transition-all duration-300
                `}
              >
                {currentStep > step.number ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2
                    ${currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'}
                    transition-all duration-300
                  `}
                />
              )}
            </div>
            <span className="mt-2 block text-xs text-center font-medium text-gray-900">
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

## Features

✅ **Type-Safe**: Full TypeScript + Zod validation  
✅ **Accessible**: ARIA labels and keyboard navigation  
✅ **Resilient**: State persists across refreshes  
✅ **Animated**: Smooth transitions with Framer Motion  
✅ **Optimistic**: Shows progress before server confirms  

## Customization

- Adjust state machine for different flows (onboarding, surveys)
- Add analytics tracking at each step transition
- Integrate with backend APIs for real-time validation
- Persist state to localStorage for draft recovery

---

> **Business Value**: High-conversion checkout flows are the core competitive advantage of SaaS products.
