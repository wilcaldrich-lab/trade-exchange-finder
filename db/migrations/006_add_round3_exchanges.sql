-- Add 7 international exchanges checked on 2026-11-25.
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
  'Garanti Barter',
  'garanti-barter',
  'https://www.garantibarter.com.tr/',
  'Istanbul',
  'Istanbul',
  'TR',
  '+90-212-438-12-38',
  'info@garantibarter.com.tr',
  '{}'::text[],
  'Garanti Barter is a Turkish corporate barter company. Its about page says it was founded in 2004, and its history says it was established under Değişim Merkezi. Member firms trade in a shared pool and settle with barter checks rather than cash: a firm that sells into the pool collects by buying other members'' goods or services. The contact page places the head office in the Esenler district of Istanbul, and a separate Izmir regional office is also published. The retail swap site named in the company history is a different project and is not this listing.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The barter explainer says an accepted member firm provides a guarantee (teminat), is assigned a broker, and receives a barter check. The membership section says to get in touch for information. No cash commission, dues, or joining-fee amount was published on the pages checked. A figure of 73% on the barter page is described as market share, not a transaction fee.',
  8017,
  'The homepage counters say ''8.017 Kurumsal Üye'' and ''8017 Kayıtlı Üye'' (8,017 corporate / registered members). The about page says membership had passed 8,000 as of 2022. The 8,017 figure is the company''s own homepage counter, not an audited headcount. The same homepage also shows 13,500 trade offers, 12,813 trade requests, 150 specialist brokers, 200 regional representatives, and 2,132 monthly transactions.',
  2004,
  ARRAY['https://www.garantibarter.com.tr/', 'https://www.garantibarter.com.tr/hakkimizda.html', 'https://www.garantibarter.com.tr/tarihce.html', 'https://www.garantibarter.com.tr/iletisim.html', 'https://www.garantibarter.com.tr/barter.html', 'https://www.garantibarter.com.tr/ofislerimiz.html']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'OneUpTrade',
  'oneuptrade',
  'https://oneuptrade.com/',
  'New Delhi',
  'Delhi',
  'IN',
  '+91-920-594-1999',
  'info@oneuptrade.com',
  '{}'::text[],
  'OneUpTrade (One Up Trade Pvt Ltd) is a New Delhi reciprocal-trade company. The about page says it was established in February 2007. It describes a centralized barter agency: the how-it-works page says it acts as a centralized trading platform for its clients, so each client buys from and sells to OneUpTrade, and the client signs a reciprocal-trade agreement with OneUpTrade. The company says it markets and sells a client''s goods or services to its own clients, and it keeps a trade account separate from a cash payment account. The head office, a redemption store, and warehouses are in New Delhi, with sales teams in Mumbai, Bengaluru, and Kolkata. It is distinct from already-listed BXI (Barter Exchange of India) in Mumbai. The FAQ also lists response@oneuptrade.com for the joining process.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The how-it-works page says clients pay a transaction fee only on purchases from OneUpTrade, and that taxes, freight, and any miscellaneous charges are payable separately in the cash payment account. No percentage, monthly dues, or joining fee was published on the pages checked.',
  2000,
  'The homepage says ''2000+ Businesses'' and ''a unique nationwide B2B Network of more than 2000 reputed businesses.'' The about page repeats ''more than 2000'' and says trade volume over the last 15 years exceeded Rs. 1,000 crore. These are the company''s own figures. The about-page copyright is 2022, so the 15-year volume line may not have been updated.',
  2007,
  ARRAY['https://oneuptrade.com/', 'https://oneuptrade.com/oneuptrade/', 'https://oneuptrade.com/how-it-works/', 'https://oneuptrade.com/why-oneuptrade/', 'https://oneuptrade.com/contact-us/', 'https://oneuptrade.com/faqs/']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Barter System Polska',
  'barter-system-polska',
  'https://new.bartersystem24.pl/',
  'Bielsko-Biała',
  NULL,
  'PL',
  '+48-509-361-260',
  'biuro@bartersystem24.pl',
  '{}'::text[],
  'Barter System Polska (Barter System Polska Sp. z o.o.) is a Bielsko-Biała multilateral barter platform for Polish SMEs. The homepage says it is the oldest and largest barter-exchange platform in Poland and has operated continuously for 18 years. It says it is modeled on long-running foreign circuits, naming the Swiss WIR system, founded in 1934, as the oldest example, along with Bartercard, BizX, and Belgian RES. Participants settle in an internal unit called BPLN, and offers can be priced partly or fully in BPLN. A participants'' council (RUBS) advises on debit purchase limits. The contact page lists ul. prof. dr. Mieczysława Michałowicza 12, 43-300 Bielsko-Biała. The platform regulations name the company''s registered office at ul. 1 Maja 45-47 in the same city (KRS 0000029210). bartersystem24.pl points to this marketing site, the offer platform, and the settlement login. This listing is distinct from Barter Klub S.A. in Wrocław.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The platform regulations say use is free for all buyers. Commissions on the sale price and on delivery costs are defined in Annex 1; the regulation text retrieved did not include those annex amounts. The same page says Barter System does not charge a commission on the portion settled in BPLN, and that Barter System Administracja charges that portion under the supplier''s agreement. No single cash percentage was published on the pages checked.',
  1200,
  'The homepage says ''Ponad 1200 firm skorzystało z naszego narzędzia'' (more than 1,200 firms have used the tool) and shows a counter of 1,200 firms. The wording can be read as cumulative use rather than a current headcount. The same page claims more than PLN 100 million of additional turnover and 44,000 B2B transactions. These are the company''s own figures. The transaction total is not a member count.',
  NULL,
  ARRAY['https://new.bartersystem24.pl/', 'https://new.bartersystem24.pl/kontakt', 'https://new.bartersystem24.pl/o-projekcie', 'https://new.bartersystem24.pl/rubs', 'https://bartersystem24.pl/', 'https://platforma.bartersystem24.pl/kontakt', 'https://platforma.bartersystem24.pl/regulamin-serwisu']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Clube de Permuta Portugal',
  'clube-de-permuta-portugal',
  'https://clubedepermuta.pt/',
  'Lisbon',
  NULL,
  'PT',
  NULL,
  NULL,
  '{}'::text[],
  'Clube de Permuta Portugal is the European franchise of the already-listed Brazilian Clube de Permuta, on its own site. clubedepermuta.pt redirects to sitenovo.clubedepermuta.pt. The Portugal pages describe a multilateral business club: an associate can sell to one company and buy from another, and transactions are recorded in an internal unit called the Permutz. The site''s news index says the club has reached Lisbon as its first operation in Europe. Grande Consumo, in an article dated 4 April 2025, reported that the Lisbon launch event was held on 25 March at Myriad by Sana. No local phone, email, or Lisbon street address was published on the Portugal pages checked. The site footer still identifies the Brazilian franchisor, Clube de Permuta Franqueadora Ltda (CNPJ 15.547.066/0001-73), at a Belo Horizonte address, so that address is not treated as a Lisbon office.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No joining fee, dues, or cash commission was published on the Portugal pages checked. The associate page says payment inside the club is in the internal unit Permutz rather than ordinary currency, at market prices.',
  NULL,
  'The Portugal homepage says business was done ''entre os mais de 2000 associados'' and shows network impact totals. The news index also cites wider-network figures, including about 1,750 associates and franchises in Brazil and abroad. Grande Consumo reported 1,800 associated companies in Brazil. Those figures describe the wider Clube de Permuta network, not a published Lisbon headcount, and are not used as a Portugal member count.',
  2025,
  ARRAY['https://clubedepermuta.pt/', 'https://sitenovo.clubedepermuta.pt/', 'https://sitenovo.clubedepermuta.pt/como-funciona/', 'https://sitenovo.clubedepermuta.pt/entre-em-contato-para-ser-um-associado/', 'https://sitenovo.clubedepermuta.pt/noticias/', 'https://grandeconsumo.com/clube-de-permuta-chega-a-portugal-e-apresenta-novo-modelo-de-negocio-as-empresas-portuguesas/']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Svensk Barter',
  'svensk-barter',
  'https://www.svenskbarter.se/',
  'Norrköping',
  'Östergötland',
  'SE',
  NULL,
  'info@svenskbarter.se',
  '{}'::text[],
  'Svensk Barter (Svensk Barter ekonomisk förening, organization number 769637-0241) is a cooperative barter network. The site address is care of Coompanion Östergötland, Box 6178, 600 06 Norrköping. Members exchange goods and services without cash, including mixed cash-and-barter deals agreed between the parties, and the site says members are co-owners rather than outside investors. It welcomes both members who barter and members who use the network only to find business. Trades are recorded on the member platform linked from the site. No public phone number was found.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The FAQ says a network membership is available at a lower cost and a bartering membership costs an extra fee, and it tells applicants to request a quote fitted to the business. No cash percentage, monthly amount, or joining fee was stated on svenskbarter.se.',
  NULL,
  NULL,
  NULL,
  ARRAY['https://www.svenskbarter.se/', 'https://www.svenskbarter.se/medlemskap/']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Barter Klub',
  'barter-klub',
  'https://www.barterklub.pl/',
  'Wrocław',
  NULL,
  'PL',
  '+48-531-699-333',
  'biuro@barterklub.pl',
  '{}'::text[],
  'Barter Klub (Barter Klub S.A.) is a Wrocław multilateral barter club. The site describes a clearing platform and business-club meetings: a firm can sell to one participant and spend the resulting trade value with another, instead of a one-to-one swap. The news page lists a monthly online meeting and local meetings in Katowice and Wrocław. The contact block gives the company address as ul. Małopanewska 18/6, 54-212 Wrocław, with email biuro@barterklub.pl and phone +48 531 699 333. It is distinct from Barter System Polska in Bielsko-Biała.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No joining fee, dues, or cash commission was published on the club pages checked.',
  NULL,
  NULL,
  NULL,
  ARRAY['https://www.barterklub.pl/', 'https://www.barterklub.pl/o-klubie', 'https://www.barterklub.pl/o-barterze', 'https://barterklub.pl/aktualnosci']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Barter Bureau',
  'barter-bureau',
  'https://www.barterbureau.net/',
  'Cairo',
  NULL,
  'EG',
  '+20-110-124-4210',
  'info@barterbureau.net',
  '{}'::text[],
  'Barter Bureau is a Cairo business-to-business trade exchange and third-party record keeper. Members sell at their normal prices for Trade Pounds credited to a trade account and spend those Trade Pounds with other members. The site says one Trade Pound equals one Egyptian pound, and that Trade Pounds are not cash and cannot be withdrawn as cash. An approved member can receive a lifetime interest-free trade credit line after paying the one-time subscription fee and signing the membership agreement. The published office is Building No. 15, Al-Malik Al-Muzaffar Street, Al-Manial, Cairo. The footer phone is printed as (+2) 01101244210, which matches the site''s WhatsApp link.',
  NULL,
  NULL,
  'EGP 799 (Classic), EGP 2,199 (Premium), or EGP 4,999 (Elite), from the second year',
  'EGP 4,000 (Classic), EGP 10,000 (Premium), or EGP 25,000 (Elite)',
  'The plans page states the same transaction fee on Classic, Premium, and Elite: 7% cash plus 3% trade on each sale or purchase. One-time joining fees are EGP 4,000 (Classic, for professionals and freelancers, with an 8,000 Trade Pound credit line), EGP 10,000 (Premium, for SMEs and startups, 30,000 Trade Pounds), or EGP 25,000 (Elite, for enterprises, 100,000 Trade Pounds). Annual admin fees from the second year are EGP 799, EGP 2,199, and EGP 4,999 for those plans. Extra cardholders and extra sub-accounts are EGP 500 each. The page says prices can change without notice. A custom plan is quoted through sales@barterbureau.net. The cash percentage is paired with a separate trade percentage, so no single cash-fee percentage is recorded.',
  NULL,
  NULL,
  NULL,
  ARRAY['https://www.barterbureau.net/', 'https://www.barterbureau.net/about-us/en', 'https://www.barterbureau.net/plans/en', 'https://www.barterbureau.net/contact-us/en']::text[],
  200,
  DATE '2026-11-25'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO schema_migrations (id)
VALUES ('006_add_round3_exchanges')
ON CONFLICT (id) DO NOTHING;
