-- Add 9 round-2 exchanges checked on 2026-11-24.
-- Idempotent. Inserts by slug and does not update an existing row.
-- Apply with npm run db:migrate (also runs once on server startup).
--
-- Values are copied from data/exchanges.json. monthly_dues, annual_dues, and
-- joining_fee are text. Currency and waiver language stays in fees_notes.
-- Fields that are not columns are not inserted.

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'BarterPay',
  'barterpay',
  'https://barterpay.ca/',
  'Stoney Creek',
  'ON',
  'CA',
  '1-866-777-0660',
  'hello@barterpay.ca',
  '{}'::text[],
  'BarterPay is a Canadian business barter exchange headquartered in Stoney Creek, Ontario, with franchise-style local communities across many provinces. Member businesses sell spare capacity or inventory into the network for Barter Credits that can be spent with other members nationwide. The company also promotes optional charitable donations of credits. This is proposed as one national listing, not a separate listing for each local BarterPay community.',
  NULL,
  '$15',
  NULL,
  '$300',
  'A BarterPay promotional page for Brandon, Manitoba states an initial membership fee of $300 and a $15 monthly fee, and advertised a limited-time waiver of the initial fee plus the first three monthly payments. That page uses placeholder dates (XXXX) for the offer deadline and a chamber event, so the figures should be treated as published but possibly stale. No cash transaction-commission percentage was found on the official pages checked.',
  4000,
  'The homepage states ''Join over 4000 business owners who are already making the smart choice to barter…''. This is the company''s own marketing figure, not an audited headcount.',
  NULL,
  ARRAY['https://barterpay.ca/', 'https://barterpay.ca/how-our-barter-trade-system-works/', 'https://barterpay.ca/our-story/', 'https://barterpay.ca/where-we-barter/', 'https://barterpay.ca/meet-bart/', 'https://barterpay.ca/barter-news/', 'https://barterpay.ca/brandon-promo/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Art of Barter',
  'art-of-barter',
  'https://www.artofbarter.com/',
  'Elgin',
  'IL',
  'US',
  '847-214-5656',
  'info@artofbarter.com',
  '{}'::text[],
  'Art of Barter is an independent trade exchange serving small businesses primarily in the Greater Chicagoland area. Members buy and sell with barter dollars; the company acts as a record keeper and clearinghouse and charges cash transaction fees plus a monthly service fee. It is distinct from already-listed IMS Barter, which operates a Chicago Barter brand after earlier Midwest acquisitions.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The Terms of Use (effective 18 September 2025) state that revenue comes from a cash transaction fee on barter transactions and a monthly service fee for maintaining member accounts. No specific percentage or dollar amounts were published on the pages checked.',
  1500,
  'The About page says the company ''provides barter brokerage services to approximately 1,500 small business clients located primarily in the Greater Chicagoland area'' and has ''negotiated in excess of $160 million in barter transactions for its members since beginning operation in 1992.''',
  1991,
  ARRAY['https://www.artofbarter.com/', 'https://www.artofbarter.com/About.aspx', 'https://www.artofbarter.com/ArtOfBarterTermsOfUse.aspx', 'https://www.artofbarter.com/Contact.aspx']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'iTrade Pay',
  'itrade-pay',
  'https://itradepay.com/',
  'Phoenix',
  'AZ',
  'US',
  '602-308-0385',
  'info@itradepay.com',
  '{}'::text[],
  'iTrade Pay is a Phoenix-based membership trade exchange, formerly Value Card Alliance / Value Card Trade and rebranded nationally as iTrade Pay in 2019. Members trade goods and services for trade dollars through the iTrade Pay platform and brokers. The company also lists Tucson and Flagstaff market numbers and markets iTrade Pay barter software; this is proposed as one exchange listing, not a software-vendor listing and not a second Arizona listing for each city page. It is distinct from already-listed iTrade Colorado, Arizona Trade Exchange (Mesa), and Tradesource (Phoenix).',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'The About page claims access to ''over 36,000 businesses.'' The FAQ claims ''over 150 exchanges, 40,000 plus members, and more than $400 million in goods and services available.'' Those figures appear to describe a broader affiliate or software-connected network, not a verified Phoenix-only headcount, and were not used as a local member count.',
  NULL,
  ARRAY['https://itradepay.com/', 'https://itradepay.com/about/', 'https://itradepay.com/contact/', 'https://itradepay.com/itrade-pay-holiday-extravaganza/', 'https://itradepay.com/value-card-alliance-is-now-itrade-pay/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Oklahoma Barter Exchange',
  'oklahoma-barter-exchange',
  'https://www.oklahomabarterexchange.com/',
  'Tulsa',
  'OK',
  'US',
  '918-628-1929',
  'info@oklahomabarterexchange.com',
  '{}'::text[],
  'Oklahoma Barter Exchange is an independently owned Tulsa trade exchange. Members trade goods and services through the network without cash. The company says it previously operated under the Business Exchange name and adopted the current name in 2021. It is distinct from the already-listed ITEX franchise offices that serve Tulsa and other Oklahoma and Missouri markets.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  500,
  'The official site states it is ''a trade group of over 500 members'' and ''the largest independently owned trade exchange in Oklahoma with over 20 years of successful trading in and around Tulsa.'' These are the company''s own figures.',
  NULL,
  ARRAY['https://www.oklahomabarterexchange.com/', 'https://www.oklahomabarterexchange.com/About.aspx', 'https://www.oklahomabarterexchange.com/Contact.aspx', 'https://allevents.in/tulsa/oklahoma-barter-exchange-holiday-barter-fair/200029300149120']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Circuito Linx',
  'circuito-linx',
  'https://circuitolinx.net/',
  'Albiate',
  'Lombardy',
  'IT',
  '+39-0362-1637823',
  'info@circuitolinx.net',
  '{}'::text[],
  'Circuito Linx is a Lombardy B2B commercial-credit circuit (Sardex-style) that works like a business barter exchange. It is operated by Circuito Lombardia S.r.l. Member companies and professionals buy and sell using Linx credits pegged at 1 Linx = 1 euro, including an interest-free credit line repaid by selling to other members. It is distinct from already-listed Sardex (Sardinia) and BexB (Brescia).',
  NULL,
  NULL,
  NULL,
  NULL,
  'The site emphasizes a 0% interest credit line. No cash commission or membership-fee amounts were found on the pages checked.',
  NULL,
  NULL,
  NULL,
  ARRAY['https://circuitolinx.net/', 'https://circuitolinx.net/calendario-eventi-2026/', 'https://circuitolinx.net/richiedi-informazioni/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Circuito Venetex',
  'circuito-venetex',
  'https://circuitovenetex.net/',
  'Padova',
  'Veneto',
  'IT',
  '+39-049-8649108',
  'info@circuitovenetex.net',
  '{}'::text[],
  'Circuito Venetex is the Veneto commercial-credit circuit (Sardex-style) that works like a business barter exchange. It is operated by Circuito Venetex S.r.l. Members trade using Venetex credits and can access interest-free spending credit repaid by selling inside the network. It is part of the wider Italian circuit family that includes already-listed Sardex, and its own magazine coverage describes joint events with Sardex. Proposed as a separate regional listing because it has its own legal entity, website, and territory.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The site advertises access to interest-free credit (scoperto a tasso zero). No cash commission or membership-fee amounts were found on the pages checked.',
  800,
  'The homepage says the network includes ''oltre 800'' businesses and professionals in Veneto and ''più di 10.000 sul territorio nazionale.'' The national figure appears to refer to the wider Italian commercial-credit group, not Venetex-only membership; 800 is the published Veneto figure.',
  NULL,
  ARRAY['https://circuitovenetex.net/', 'https://circuitovenetex.net/evento-societa-benefit-circuiti-credito-villa-bornello-economia-territorio-05-05-2026/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Abrex',
  'abrex',
  'https://www.abrex.net/',
  'Vasto',
  'Abruzzo',
  'IT',
  '+39-0871-564511',
  'info@circuitoabrex.net',
  '{}'::text[],
  'Abrex is an Abruzzo commercial-credit circuit (Sardex-style) that works like a business barter exchange. It is operated by Abrex S.r.l. Member businesses exchange goods and services using the circuit''s complementary credits and can access interest-free credit. The site identifies Franco Contu, a co-founder of already-listed Sardex, as vice president of Abrex, so this is a Sardex-related regional circuit with its own company, site, and territory.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The site advertises interest-free credit. No cash commission or membership-fee amounts were found on the pages checked.',
  NULL,
  NULL,
  NULL,
  ARRAY['https://www.abrex.net/', 'https://www.abrex.net/2025/03/05/un-evento-imperdibile-per-scoprire-i-nuovi-servizi-di-abrex/', 'https://www.abrex.net/news/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'United Economy',
  'united-economy',
  'https://www.unitedeconomy.nl/',
  'Utrecht',
  'Utrecht',
  'NL',
  NULL,
  'info@unitedeconomy.nl',
  '{}'::text[],
  'United Economy is a complementary-currency / circular-money cooperative (United Economy Coöperatie / Circulair Geld Nederland) rather than a classic trade exchange. It is a Dutch sustainability network in which businesses and individuals try to buy from one another through a shared trading environment. Members may optionally use a ''circular account'' so payments stay inside the value-driven economy, and the cooperative also mentions interest-free cooperative credit.',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  700,
  'The homepage says more than 700 large and small values-driven (SME) companies and organizations have already joined. Individuals can also participate. This is the organization''s own figure.',
  NULL,
  ARRAY['https://www.unitedeconomy.nl/', 'https://www.unitedeconomy.nl/contact/', 'https://www.unitedeconomy.nl/agenda/', 'https://www.unitedeconomy.nl/wat-we-doen/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Barter Japan',
  'barter-japan',
  'https://www.barter-japan.com/',
  'Tokyo',
  'Tokyo',
  'JP',
  '03-5379-3965',
  NULL,
  '{}'::text[],
  'Barter Japan (バータージャパン株式会社) is a Tokyo-based membership barter community for business owners and freelancers, founded in 2009. Members exchange goods and services using Barter Points (BP) rather than cash. The company explicitly says BP is not a cryptocurrency. It also holds frequent in-person and online business-matching meetings in Tokyo, Koriyama and on Zoom. No public email address was found; the official site publishes a Tokyo phone and fax and a contact form.',
  3.3,
  NULL,
  NULL,
  '110,000 yen (tax excluded) for companies 1–100 in the current second recruitment; 330,000 yen from the 101st company',
  'The official membership-guidance page (tax-excluded prices) states a joining fee of 110,000 yen for up to 100 companies in the second recruitment, then 330,000 yen per company after that, plus 400,000 yen in loaned joining credits. A barter fee of 3.3% of BP used is billed monthly to regular members, or 11% to pre-members, together with membership dues. The dues amount itself is referred to but was not readable as a figure (the fee table on the page did not render as text). A one-year joining-fee refund policy is also published, subject to conditions.',
  NULL,
  'The joining-fee note said the second recruitment was ''currently 86 companies'' of a 100-company tier. That is a fee-tier figure, not a verified total membership, and was not used as a headcount. The group has held at least 190 numbered business-matching meetings, which implies a longer-running membership community.',
  2009,
  ARRAY['https://www.barter-japan.com/', 'https://www.barter-japan.com/What/', 'https://www.barter-japan.com/guidance/', 'https://www.barter-japan.com/company/', 'https://www.barter-japan.com/news/2026/', 'https://www.barter-japan.com/activities/', 'https://www.barter-japan.com/activities/2026/10/89712/']::text[],
  200,
  DATE '2026-11-24'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO schema_migrations (id)
VALUES ('005_add_round2_exchanges')
ON CONFLICT (id) DO NOTHING;
