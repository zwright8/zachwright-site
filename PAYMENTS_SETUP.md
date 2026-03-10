# Stripe Payment Setup — Production Checklist (AI Operator Kit)

This site uses **Stripe Payment Links** with **automatic fulfillment hooks**:

- Webhook endpoint: `/api/payments/webhook`
- Success redirect endpoint: `/api/payments/success?session_id={CHECKOUT_SESSION_ID}`
- Shared fulfill function: `api/_lib/payments.js::fulfillCheckout`

---

## 0) Preflight

- [ ] Stripe account is activated for live payments.
- [ ] You can switch between **Test mode** and **Live mode** in Stripe.
- [ ] Your public domain is live (for policy URLs and post-purchase redirects).
- [ ] A database URL is configured (`DATABASE_URL`/`POSTGRES_URL` or `NEWSLETTER_DATABASE_URL`) so fulfillment state can be saved.

---

## 1) Create products + prices in Stripe (Live mode)

In Stripe Dashboard:

1. Go to **Product catalog → Add product**.
2. Create these products exactly:
   - **AI Operator Kit Lite**
   - **AI Operator Kit Pro**
   - **AI Operator Kit Agency**
3. For each product, add a **one-time price**:
   - Lite: **$29 USD**
   - Pro: **$79 USD**
   - Agency: **$149 USD**
4. Set each product to **Active**.
5. (Recommended) Add clear short descriptions so receipts are easy to understand.

> Keep product names in Stripe aligned with names shown on the product page.

---

## 2) Create a Payment Link for each tier

For each price:

1. Open the product price and click **Create payment link**.
2. In link settings, configure:
   - Quantity: **fixed to 1** (no quantity edits)
   - Customer info: **collect customer email**
   - Billing address: **collect billing address** (recommended for tax compliance)
   - Promotion codes: optional
3. In **After payment**:
   - Select redirect behavior.
   - Use this redirect URL exactly:
     - `https://zachwright.xyz/api/payments/success?session_id={CHECKOUT_SESSION_ID}`
4. Save link and copy URL.

You should end with 3 live URLs:
- Lite payment link URL
- Pro payment link URL
- Agency payment link URL

---

## 3) Configure taxes (Stripe Tax)

In Stripe Dashboard:

1. Go to **Tax** and enable Stripe Tax (if not already enabled).
2. Add tax registrations only where you are required to collect tax.
3. For each product, set an appropriate tax category for digital goods.
4. For each payment link, enable automatic tax collection.
5. Test one checkout in Test mode to confirm tax behavior before launch.

> If you are unsure about nexus or registrations, confirm with your accountant/tax advisor before enabling live tax collection.

---

## 4) Configure receipts + customer emails in Stripe

In Stripe Dashboard:

1. Go to **Settings → Customer emails**.
2. Turn on at least:
   - **Successful payments**
   - **Refunds**
3. Ensure your support email is set in business/public details.
4. Send yourself a test purchase receipt and confirm product naming + support contact are correct.

---

## 5) Policy links required before live launch

Publish these pages on your site (or equivalent legal pages):

- Privacy Policy
- Terms of Service
- Refund Policy

Then in Stripe/payment link settings where available:

- Require agreement to Terms of Service (with URL)
- Ensure support contact is visible

Also add policy links on the product page near pricing/CTA for consistency.

> Do not launch live payments without accessible policy pages.

---

## 6) Add required Vercel environment variables

In Vercel project settings for `zachwright-site`, set:

### Stripe + checkout links
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_LITE`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_PRO`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_AGENCY`

### Fulfillment email
- `RESEND_API_KEY`
- `PAYMENTS_FROM_EMAIL` (or fallback `NEWSLETTER_FROM_EMAIL`)

### Optional (strongly recommended)
- `STRIPE_PRICE_ID_AI_OPERATOR_KIT_LITE`
- `STRIPE_PRICE_ID_AI_OPERATOR_KIT_PRO`
- `STRIPE_PRICE_ID_AI_OPERATOR_KIT_AGENCY`

### Optional deliverables URL overrides
- `AI_OPERATOR_KIT_DELIVERABLES_BASE_URL` (absolute URL base for file links)
- `AI_OPERATOR_KIT_DELIVERABLES_PATH` (default `/products/ai-operator-kit/files`)
- `AI_OPERATOR_KIT_ASSETS_REPO` / `AI_OPERATOR_KIT_ASSETS_REF` / `AI_OPERATOR_KIT_ASSETS_ROOT` (used for fallback/view links)

After saving, redeploy the site.

---

## 7) Configure Stripe webhook endpoint

Create endpoint in Stripe Dashboard:

- URL: `https://zachwright.xyz/api/payments/webhook`
- Events to send:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`

Stripe signs events with the webhook signing secret. Save that value as `STRIPE_WEBHOOK_SECRET`.

---

## 8) Local test flow (Stripe CLI)

1. Start your local server (example):
   - `vercel dev`
2. Forward Stripe events:
   - `stripe listen --forward-to localhost:3000/api/payments/webhook`
3. Use a test-mode payment link.
4. Complete checkout with Stripe test card:
   - `4242 4242 4242 4242`
   - any future expiry
   - any 3-digit CVC
   - any postal code
5. Verify:
   - Stripe CLI shows `checkout.session.completed` forwarded.
   - Server logs show fulfillment status transition.
   - Customer fulfillment email is sent with deliverable links.

---

## 9) Deliverables source of truth

Fulfillment emails currently link to static files hosted in this repo:

- Base path: `/products/ai-operator-kit/files`

Source content originates from:

- `zwright8/zw-business-assets/products/ai-operator-kit/`

When you update deliverables in `zw-business-assets`, sync the corresponding files into:

- `products/ai-operator-kit/files/`

---

## 10) Verification checklist (before announcing)

- [ ] `/api/payments/config` returns all 3 live links.
- [ ] `/products/ai-operator-kit/` main CTA opens Lite checkout.
- [ ] Pro and Agency buttons open the correct checkout links.
- [ ] `checkout.session.completed` reaches `/api/payments/webhook` and returns 200.
- [ ] Fulfillment record is created in `payment_fulfillments`.
- [ ] Customer receives fulfillment email with bundle links.
- [ ] Stripe receipt email is delivered.
- [ ] Tax calculation appears as expected (where configured).
- [ ] Policy links are publicly accessible.

---

## 11) Fulfillment implementation summary

Automatic fulfillment is implemented in this repo:

- `api/_lib/payments.js`
  - verifies Stripe signatures
  - retrieves Checkout Session + line items from Stripe API
  - resolves purchased tier (`lite`/`pro`/`agency`)
  - sends fulfillment email
  - enforces idempotency with `payment_fulfillments` table
- `api/payments/webhook.js`
  - triggers fulfillment from Stripe events
- `api/payments/success.js`
  - triggers fulfillment on redirect landing page
- `api/payments/fulfill.js`
  - manual/API trigger for a specific `session_id`
