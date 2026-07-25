AI Operator Kit retired product route.

Route: /products/ai-operator-kit/

The route redirects to the current WrightOps updates page and does not advertise
or accept new purchases. `/api/payments/config` returns HTTP 410 with no payment
links.

Legacy fulfillment hooks remain available only to reconcile a provider-confirmed
historical or unexpected payment:

- Stripe webhook: /api/payments/webhook
- Redirect landing page: /api/payments/success?session_id={CHECKOUT_SESSION_ID}
- Manual trigger: /api/payments/fulfill?session_id=cs_...

Do not reactivate the product or expose another receipt path without the business
asset, payment, refund, tax/KYC, and owner-confirmation controls required by the
WrightOps operating record.
