-- Migration: 20261003120000_verified_phone_identities.sql
-- Description: Creates verified_phone_identities table for anti-abuse protection
-- Privacy Invariant: Raw phone numbers are NEVER stored in the database.
-- Only HMAC-SHA256 phone_fingerprint and phone_last4 are persisted.
-- Household Invariant: Multiple accounts may share a verified phone_fingerprint
-- representing a household correlation key. user_id remains strictly UNIQUE (1 phone per account).
-- Provider Invariant: provider must be explicitly supplied by trusted server flow (no disabled default, cannot equal 'disabled').
-- Versioning: fingerprint_version supports future HMAC secret rotation without mixing generations.
-- Access Boundary: Row-Level Security enabled fail-closed. Direct client SELECT/INSERT/UPDATE/DELETE
-- is completely forbidden on the raw identity table. No client RPC is exposed.

CREATE TABLE IF NOT EXISTS public.verified_phone_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_fingerprint text NOT NULL,
  fingerprint_version smallint NOT NULL DEFAULT 1,
  phone_last4 varchar(4) NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  provider text NOT NULL,
  provider_reference text NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_verified_phone_identities_user UNIQUE (user_id),
  CONSTRAINT chk_phone_fingerprint_hex CHECK (phone_fingerprint ~ '^[0-9a-f]{64}$'),
  CONSTRAINT chk_fingerprint_version CHECK (fingerprint_version >= 1),
  CONSTRAINT chk_provider_valid CHECK (length(trim(provider)) > 0 AND provider != 'disabled'),
  CONSTRAINT chk_phone_last4_digits CHECK (phone_last4 ~ '^[0-9]{4}$')
);

-- Non-unique index on phone_fingerprint for server-side household / anti-abuse correlation
-- Note: user_id already has a unique b-tree index created by uq_verified_phone_identities_user.
CREATE INDEX IF NOT EXISTS idx_verified_phone_identities_fingerprint ON public.verified_phone_identities(phone_fingerprint);

-- Enable Row Level Security (fail closed by default)
ALTER TABLE public.verified_phone_identities ENABLE ROW LEVEL SECURITY;

-- Zero direct client access on the raw identity table:
-- No SELECT, INSERT, UPDATE, or DELETE policies exist for public, anon, or authenticated roles.
-- Direct table access from browser clients is strictly blocked to prevent exposure of
-- phone_fingerprint or provider_reference.
-- Safe status API will be added later only when a real UI requires it.

-- Updated_at trigger
CREATE TRIGGER set_verified_phone_identities_updated_at
  BEFORE UPDATE ON public.verified_phone_identities
  FOR EACH ROW
  EXECUTE FUNCTION private.handle_updated_at();
