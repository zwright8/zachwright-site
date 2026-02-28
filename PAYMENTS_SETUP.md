# Stripe Payment Setup — AI Operator Kit

This site uses **Stripe Payment Links** for fast launch.

## 1) Create products and links in Stripe
Create 3 products:
- AI Operator Kit Lite ($29)
- AI Operator Kit Pro ($79)
- AI Operator Kit Agency ($149)

Copy the Payment Link URLs.

## 2) Add environment variables in Vercel project
Set:
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_LITE`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_PRO`
- `STRIPE_PAYMENT_LINK_AI_OPERATOR_KIT_AGENCY`

## 3) Verify
- Open `/products/ai-operator-kit/`
- Buttons should point to Stripe links.

## Optional next step
Upgrade to Stripe Checkout Sessions API + webhook fulfillment once you want richer order metadata.
