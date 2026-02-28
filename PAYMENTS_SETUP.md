# Stripe Payment Setup — Production Checklist (AI Operator Kit)

This site currently uses **Stripe Payment Links** (not custom Checkout Sessions + webhook).  
That means checkout is live-ready, but fulfillment can still be manual.

---

## 0) Preflight

- [ ] Stripe account is activated for live payments.
- [ ] You can switch between **Test mode** and **Live mode** in Stripe.
- [ ] Your public domain is live (for policy URLs and post-purchase redirects).

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
3. Post-payment behavior:
   - Set a redirect URL (recommended) to your product page or thank-you page.
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

## 6) Add Stripe links to Vercel environment variables

In Vercel project settings for `zachwright-site`, set:

- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_LITE`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_PRO`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_AGENCY`

After saving, redeploy the site.

---

## 7) Verification checklist (before announcing)

- [ ] `/api/payments/config` returns all 3 live links.
- [ ] `/products/ai-operator-kit/` main CTA opens Lite checkout.
- [ ] Pro and Agency buttons open the correct checkout links.
- [ ] Stripe receipt email is delivered after test purchase.
- [ ] Tax calculation appears as expected (where configured).
- [ ] Policy links are publicly accessible.

---

## 8) Current fulfillment reality (important)

This repo currently configures **checkout links only**.  
It does **not** implement webhook-based automatic fulfillment yet.

Use manual fulfillment operations until webhook automation is added:

- Runbook: `zw-business-assets/automation/order-fulfillment-runbook.md`
- Manual fallback checklist: `zw-business-assets/automation/manual-fulfillment-fallback-checklist.md`

When ready, next upgrade is Stripe Checkout Sessions + webhook fulfillment pipeline.
