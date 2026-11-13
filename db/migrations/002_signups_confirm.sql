-- Confirmed newsletter signups and the time they were pushed to Resend.
-- Existing rows stay confirmed so current subscribers are not asked again.
-- New rows default to unconfirmed.
-- Apply with npm run db:migrate (also runs once on server startup).

ALTER TABLE signups ADD COLUMN IF NOT EXISTS confirmed BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE signups ALTER COLUMN confirmed SET DEFAULT false;
ALTER TABLE signups ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ;

INSERT INTO schema_migrations (id)
VALUES ('002_signups_confirm')
ON CONFLICT (id) DO NOTHING;
