-- Listing corrections from the November 2026 activity audit.
-- Idempotent. Matches entries by slug and does not insert listings.
-- Apply with npm run db:migrate (also runs once on server startup).
--
-- trade-euro: remove the row. Its public news stopped in December 2021.
-- crescent-city-trade-exchange: website https://crescentcitytrade.net/;
--   contact email info@crescentcitytrade.net (published on the contact page).
-- bexb: contact email info@bexb.it. Operated by In-Lire S.p.A. Società Benefit
--   under a business-unit lease since 16 July 2025 (published on bexb.it).
-- bbx-uk: contact email info.uk@bbxworld.com (published on bbxuk.com).

DELETE FROM entries
WHERE slug = 'trade-euro';

UPDATE entries
SET
  website = 'https://crescentcitytrade.net/',
  email = 'info@crescentcitytrade.net',
  source_urls = ARRAY[
    'https://irta.com/member-directory/',
    'https://crescentcitytrade.net/',
    'https://crescentcitytrade.net/about-ccte/',
    'https://crescentcitytrade.net/contact/'
  ]::text[],
  last_checked = DATE '2026-11-24',
  updated_at = now()
WHERE slug = 'crescent-city-trade-exchange'
  AND (
    website IS DISTINCT FROM 'https://crescentcitytrade.net/'
    OR email IS DISTINCT FROM 'info@crescentcitytrade.net'
    OR source_urls IS DISTINCT FROM ARRAY[
      'https://irta.com/member-directory/',
      'https://crescentcitytrade.net/',
      'https://crescentcitytrade.net/about-ccte/',
      'https://crescentcitytrade.net/contact/'
    ]::text[]
    OR last_checked IS DISTINCT FROM DATE '2026-11-24'
  );

UPDATE entries
SET
  email = 'info@bexb.it',
  description = 'Circuito BexB is an Italian commercial-intermediation circuit that has helped member companies buy and sell among themselves since 2001. Since 16 July 2025 it has been operated by In-Lire S.p.A. Società Benefit under a business-unit lease. The company describes itself as a shared purchasing office and states that more than €400 million has been transacted on the circuit since 2012.',
  last_checked = DATE '2026-11-24',
  updated_at = now()
WHERE slug = 'bexb'
  AND (
    email IS DISTINCT FROM 'info@bexb.it'
    OR description IS DISTINCT FROM 'Circuito BexB is an Italian commercial-intermediation circuit that has helped member companies buy and sell among themselves since 2001. Since 16 July 2025 it has been operated by In-Lire S.p.A. Società Benefit under a business-unit lease. The company describes itself as a shared purchasing office and states that more than €400 million has been transacted on the circuit since 2012.'
    OR last_checked IS DISTINCT FROM DATE '2026-11-24'
  );

UPDATE entries
SET
  email = 'info.uk@bbxworld.com',
  source_urls = ARRAY[
    'https://irta.com/member-directory/',
    'https://bbxuk.com/',
    'https://bbxuk.com/terms-of-use/'
  ]::text[],
  last_checked = DATE '2026-11-24',
  updated_at = now()
WHERE slug = 'bbx-uk'
  AND (
    email IS DISTINCT FROM 'info.uk@bbxworld.com'
    OR source_urls IS DISTINCT FROM ARRAY[
      'https://irta.com/member-directory/',
      'https://bbxuk.com/',
      'https://bbxuk.com/terms-of-use/'
    ]::text[]
    OR last_checked IS DISTINCT FROM DATE '2026-11-24'
  );

INSERT INTO schema_migrations (id)
VALUES ('003_listing_contacts')
ON CONFLICT (id) DO NOTHING;
