CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email_hash CHAR(64) NOT NULL UNIQUE,
    email_ciphertext TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'unsubscribed')),
    verify_token_hash CHAR(64),
    source TEXT,
    consent_ip_hash CHAR(64),
    user_agent_hash CHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    last_sent_slug TEXT,
    last_sent_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_verify_token_idx
ON newsletter_subscribers (verify_token_hash)
WHERE verify_token_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS newsletter_signup_attempts (
    id BIGSERIAL PRIMARY KEY,
    ip_hash CHAR(64) NOT NULL,
    user_agent_hash CHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsletter_signup_attempts_ip_created_idx
ON newsletter_signup_attempts (ip_hash, created_at DESC);
