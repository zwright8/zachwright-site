AI Operator Kit product landing page.

Route: /products/ai-operator-kit/

Payment links are pulled from /api/payments/config.

Automatic fulfillment hooks:

- Stripe webhook: /api/payments/webhook
- Redirect landing page: /api/payments/success?session_id={CHECKOUT_SESSION_ID}
- Manual trigger: /api/payments/fulfill?session_id=cs_...
