# Newsletter Setup

This site now includes a secure daily newsletter flow:

- `POST /api/newsletter/signup` (double opt-in signup)
- `GET /api/newsletter/confirm?token=...` (email confirmation)
- `GET /api/newsletter/unsubscribe?token=...` (one-click unsubscribe)
- `GET|POST /api/newsletter/send` (daily sender, cron protected)

## Guardrails Included

- Double opt-in required before mail is sent.
- Email addresses are encrypted at rest (AES-256-GCM) before DB storage.
- Raw emails are never used as identifiers (`email_hash` HMAC used for lookup).
- Raw IP addresses are not stored; only hashed IP for abuse controls.
- Signup endpoint has honeypot + per-IP rate limiting windows.
- Unsubscribe token uses HMAC signature validation.
- Cron sender requires bearer token auth (`CRON_SECRET`).

## Environment Variables

Set these in Vercel Project Settings:

- `NEWSLETTER_DATABASE_URL`:
  Neon/Postgres connection string.
- `NEWSLETTER_ENCRYPTION_KEY`:
  32-byte key, base64 or 64-char hex.
  Example: `openssl rand -base64 32`
- `NEWSLETTER_HASH_SECRET`:
  Long random secret used for HMAC hashes.
  Example: `openssl rand -hex 32`
- `RESEND_API_KEY`:
  Resend API key for transactional emails.
- `NEWSLETTER_FROM_EMAIL`:
  Verified sender identity in Resend, e.g. `Daily Drops <updates@zachwright.xyz>`.
- `SITE_BASE_URL`:
  Public site URL, e.g. `https://zachwright.xyz`.
- `CRON_SECRET`:
  Secret used by Vercel cron Authorization header.
- `NEWSLETTER_ALLOWED_ORIGINS` (optional):
  Comma-separated allowed browser origins for signup POST.
- `NEWSLETTER_BATCH_SIZE` (optional):
  Max recipients per cron run; default `120`.

## Cron Schedule

Defined in [vercel.json](/Users/zacharywright/Documents/GitHub/zachwright-site/vercel.json):

- `0 14 * * *` (14:00 UTC daily)

Adjust as needed.

## Manual Dry Run

You can test the sender without updating `last_sent_slug` by adding `dryRun=1`:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://zachwright.xyz/api/newsletter/send?dryRun=1"
```
