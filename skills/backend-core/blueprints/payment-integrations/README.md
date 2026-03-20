# Payment Integration Blueprint

Enterprise-grade payment system implementation for SaaS products.

## Features
- Stripe subscription management
- Webhook security & processing
- Billing logic & invoice generation
- Refund & dispute handling

## Stack
- **Framework**: NestJS / FastAPI
- **Payment Provider**: Stripe
- **Database**: MySQL / PostgreSQL

## Implementation Guide

### 1. Stripe Checkout Session

```typescript
// src/payments/stripe-checkout.service.ts
import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeCheckoutService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createSubscription(customerId: string, priceId: string) {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/pricing`,
      metadata: {
        customerId,
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async createOneTimePayment(customerId: string, amount: number, description: string) {
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: description },
            unit_amount: amount * 100, // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/success`,
      cancel_url: `${process.env.APP_URL}/pricing`,
    });

    return { sessionId: session.id, url: session.url };
  }
}
```

### 2. Webhook Handler

```typescript
// src/payments/stripe-webhook.controller.ts
import { Controller, Post, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('webhooks')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(private billingService: BillingService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  @Post('stripe')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const customerId = session.metadata.customerId;
    const subscriptionId = session.subscription as string;

    await this.billingService.activateSubscription({
      customerId,
      subscriptionId,
      status: 'active',
    });
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    await this.billingService.updateSubscriptionStatus(
      subscription.id,
      'active',
      new Date(subscription.current_period_end * 1000),
    );
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await this.billingService.updateSubscriptionStatus(
      subscription.id,
      subscription.status,
      new Date(subscription.current_period_end * 1000),
    );
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    await this.billingService.cancelSubscription(subscription.id);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    await this.billingService.recordPayment({
      invoiceId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      paidAt: new Date(invoice.status_transitions.paid_at * 1000),
    });
  }

  private async handleInvoiceFailed(invoice: Stripe.Invoice) {
    await this.billingService.handleFailedPayment({
      invoiceId: invoice.id,
      customerId: invoice.customer as string,
      reason: invoice.last_finalization_error?.message,
    });
  }
}
```

### 3. Billing Service

```typescript
// src/billing/billing.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async activateSubscription(data: {
    customerId: string;
    subscriptionId: string;
    status: string;
  }) {
    return this.prisma.subscription.create({
      data: {
        customerId: data.customerId,
        stripeSubscriptionId: data.subscriptionId,
        status: data.status,
        startedAt: new Date(),
      },
    });
  }

  async updateSubscriptionStatus(
    subscriptionId: string,
    status: string,
    currentPeriodEnd: Date,
  ) {
    return this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status,
        currentPeriodEnd,
      },
    });
  }

  async cancelSubscription(subscriptionId: string) {
    return this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    });
  }

  async recordPayment(data: {
    invoiceId: string;
    amount: number;
    currency: string;
    paidAt: Date;
  }) {
    return this.prisma.payment.create({
      data: {
        stripeInvoiceId: data.invoiceId,
        amount: data.amount,
        currency: data.currency,
        paidAt: data.paidAt,
      },
    });
  }

  async handleFailedPayment(data: {
    invoiceId: string;
    customerId: string;
    reason?: string;
  }) {
    // Send notification to customer
    // Attempt retry logic
    // Update subscription status if needed
    return this.prisma.paymentFailure.create({
      data: {
        stripeInvoiceId: data.invoiceId,
        customerId: data.customerId,
        reason: data.reason,
        failedAt: new Date(),
      },
    });
  }

  async processRefund(paymentId: string, amount?: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    // Process refund through Stripe
    const refund = await this.stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: amount ? amount * 100 : undefined, // partial or full refund
    });

    return this.prisma.refund.create({
      data: {
        paymentId,
        amount: refund.amount / 100,
        stripeRefundId: refund.id,
        processedAt: new Date(),
      },
    });
  }
}
```

### 4. Database Schema

```prisma
// prisma/schema.prisma additions

model Subscription {
  id                    String   @id @default(uuid())
  customerId            String
  stripeSubscriptionId  String   @unique
  status                String   // active, canceled, past_due, etc.
  startedAt             DateTime
  currentPeriodEnd      DateTime?
  canceledAt            DateTime?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  customer              Customer @relation(fields: [customerId], references: [id])
  payments              Payment[]
}

model Payment {
  id                    String   @id @default(uuid())
  subscriptionId        String?
  stripeInvoiceId       String   @unique
  stripePaymentIntentId String?
  amount                Float
  currency              String
  paidAt                DateTime
  createdAt             DateTime @default(now())

  subscription          Subscription? @relation(fields: [subscriptionId], references: [id])
  refunds               Refund[]
}

model PaymentFailure {
  id              String   @id @default(uuid())
  stripeInvoiceId String
  customerId      String
  reason          String?
  failedAt        DateTime
  createdAt       DateTime @default(now())

  customer        Customer @relation(fields: [customerId], references: [id])
}

model Refund {
  id              String   @id @default(uuid())
  paymentId       String
  stripeRefundId  String   @unique
  amount          Float
  processedAt     DateTime
  createdAt       DateTime @default(now())

  payment         Payment  @relation(fields: [paymentId], references: [id])
}
```

## Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=https://yourdomain.com
```

## Security Best Practices

1. **Webhook Verification**: Always verify webhook signatures
2. **Idempotency**: Handle duplicate webhook events
3. **Audit Logging**: Log all payment transactions
4. **PCI Compliance**: Never store card details directly
5. **Rate Limiting**: Protect webhook endpoints

## Testing

```typescript
// payment-integration.spec.ts
describe('Payment Integration', () => {
  it('should create subscription checkout session', async () => {
    const result = await service.createSubscription('cus_xxx', 'price_xxx');
    expect(result).toHaveProperty('sessionId');
    expect(result).toHaveProperty('url');
  });

  it('should handle webhook events securely', async () => {
    const event = createMockWebhookEvent();
    const signature = generateTestSignature(event);
    
    const result = await controller.handleWebhook(signature, event);
    expect(result).toEqual({ received: true });
  });
});
```

## Production Deployment

1. Update Stripe webhooks endpoint in dashboard
2. Set environment variables
3. Run database migrations
4. Enable webhook event logging
5. Set up monitoring alerts for failed payments

---

> **Business Value**: 80% of SaaS products require payment integration. This blueprint saves **8+ hours** per project.
