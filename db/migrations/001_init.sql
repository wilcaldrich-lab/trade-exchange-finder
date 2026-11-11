-- Trade Exchange Finder. Safe to run more than once.

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website TEXT,
  city TEXT,
  state_region TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  networks TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  cash_fee_percent NUMERIC,
  monthly_dues TEXT,
  annual_dues TEXT,
  joining_fee TEXT,
  fees_notes TEXT,
  approx_member_count INTEGER,
  member_count_notes TEXT,
  year_founded INTEGER,
  source_urls TEXT[] NOT NULL DEFAULT '{}',
  website_http_status INTEGER,
  last_checked DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS entries_country_idx ON entries (country);
CREATE INDEX IF NOT EXISTS entries_state_idx ON entries (state_region);

CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('new', 'correction')),
  exchange_slug TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_name TEXT,
  submitter_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions (status, created_at DESC);

CREATE TABLE IF NOT EXISTS signups (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signups_created_idx ON signups (created_at DESC);

CREATE TABLE IF NOT EXISTS zero_result_searches (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS zero_result_searches_created_idx ON zero_result_searches (created_at DESC);

CREATE TABLE IF NOT EXISTS pageviews (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT NOT NULL DEFAULT '',
  day DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 1,
  UNIQUE (path, referrer, day)
);

CREATE INDEX IF NOT EXISTS pageviews_day_idx ON pageviews (day);

CREATE TABLE IF NOT EXISTS sponsor_weeks (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  destination_url TEXT NOT NULL,
  placement TEXT NOT NULL DEFAULT 'bar' CHECK (placement IN ('bar', 'state_feature', 'newsletter')),
  state_region TEXT,
  exchange_slug TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_on DATE,
  ends_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sponsor_clicks (
  id BIGSERIAL PRIMARY KEY,
  sponsor TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sponsor_clicks_created_idx ON sponsor_clicks (created_at);
CREATE INDEX IF NOT EXISTS sponsor_clicks_sponsor_idx ON sponsor_clicks (sponsor);

CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  exchange_name TEXT,
  offer TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS errors (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  path TEXT,
  stack TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO schema_migrations (id)
VALUES ('001_init')
ON CONFLICT (id) DO NOTHING;
