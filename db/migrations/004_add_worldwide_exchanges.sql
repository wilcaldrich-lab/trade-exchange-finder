-- Add 15 worldwide exchanges approved on 2026-11-24.
-- Idempotent. Inserts by slug and does not update an existing row.
-- Apply with npm run db:migrate (also runs once on server startup).
--
-- Values are copied from data/exchanges.json. monthly_dues, annual_dues, and
-- joining_fee are text, so a published number is stored as that number's digits.
-- Currency and waiver language stays in fees_notes. Fields that are not columns
-- are not inserted.

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'ITEX',
  'itex',
  'https://www.itex.com/',
  'Bellevue',
  'WA',
  'US',
  '800-277-9722',
  'support@itex.com',
  '{}'::text[],
  'ITEX is a U.S.-based franchised business trade-exchange network. Member businesses sell goods or services for ITEX dollars and spend those credits with other members through a national directory, website, and mobile app. Local offices operate as ITEX franchisees in many U.S. markets and in Canada (including Toronto and Montreal). ITEX’s site states that Carolina Trade Exchange members are now part of the ITEX network. This is proposed as one network listing, not a separate listing for each franchise office.',
  6,
  NULL,
  NULL,
  NULL,
  'Published on itex.com: 6% cash transaction fee when a member sells or buys, plus $25 cash and 10 ITEX dollars monthly (every 4 weeks). Franchise inquiries use franchises@itex.com.',
  NULL,
  'The corporate site says ''1,000''s of businesses across hundreds of industries'' and ''thousands of participating members.'' No single audited headcount was published on the pages checked.',
  NULL,
  ARRAY['https://www.itex.com/', 'https://www.itex.com/Help/ContactUs.aspx', 'https://www.itex.com/Locations/', 'https://www.itex.com/CTE/', 'https://omaha.itex.com/AboutUs.aspx', 'https://lasvegas.itex.com/AboutUs.aspx', 'https://www.otcmarkets.com/file/company/financial-report/500326/content']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Bartercard Australia',
  'bartercard-australia',
  'https://bartercard.com.au/',
  NULL,
  NULL,
  'AU',
  '1300-227-837',
  'info@bartercard.com',
  '{}'::text[],
  'Bartercard Australia is a national business trade exchange. Members sell spare capacity or stock into the network for trade dollars and spend those credits with other Australian members on business and lifestyle purchases. It is the original Bartercard market and is distinct from already-listed Bartercard UK. Regional office numbers are published for Queensland, New South Wales, Victoria and Western Australia.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current joining, monthly or transaction-fee figures were found on the homepage or contact page checked.',
  NULL,
  'The homepage cites 178 Google reviews but does not publish a current member count. The New Zealand site describes ''over 32,000 cardholders across New Zealand and Australia'' as a combined figure.',
  1991,
  ARRAY['https://bartercard.com.au/', 'https://bartercard.com.au/contact/', 'https://bartercard.com.au/business/35-years-of-creating-opportunities-for-businesses/', 'https://bartercard.co.nz/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Bartercard New Zealand',
  'bartercard-new-zealand',
  'https://bartercard.co.nz/',
  NULL,
  NULL,
  'NZ',
  '0508-227-837',
  NULL,
  '{}'::text[],
  'Bartercard New Zealand is the New Zealand operation of the Bartercard trade-exchange network. The site says it has supported Kiwi businesses since 1992 and that members can sell and buy goods and services for trade dollars on the group’s trading platform, including Marketplace, Property and Travel features, with support from a business development manager.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current fee figures were found on the homepage or contact page checked.',
  NULL,
  'The site says ''a network of over 32,000 cardholders across New Zealand and Australia.'' That figure is combined, not New Zealand-only.',
  1992,
  ARRAY['https://bartercard.co.nz/', 'https://bartercard.co.nz/contact/', 'https://bartercard.com.au/business/35-years-of-creating-opportunities-for-businesses/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'WIR Bank (CHW-System)',
  'wir-bank-chw',
  'https://www.wir.ch/',
  'Basel',
  'Basel-Stadt',
  'CH',
  '0800-947-947',
  NULL,
  '{}'::text[],
  'WIR Bank Genossenschaft runs the CHW system, a Swiss SME complementary-currency circuit founded in 1934. CHW is pegged 1:1 to the Swiss franc and circulates only among participating businesses. Participants set an acceptance rate, must make their full offer available to other participants, and must charge the same prices in CHW and CHF. The bank also offers CHW credit, a participant directory (CHWfinder), and a CHF 150-a-year SME package.',
  2,
  NULL,
  '150',
  NULL,
  'Published conditions valid from 21 October 2026: CHF 150 per year for the CHW SME package, plus a 2% network contribution in CHF on CHW amounts received. An interest-free immediate credit of 10,000 CHW is included for participants with good credit, subject to the bank’s rules. Amounts are in Swiss francs, not US dollars.',
  NULL,
  'The CHW-System page describes a network of tens of thousands of Swiss businesses (''zehntausenden Betrieben''). No exact current headcount was published on the pages checked.',
  1934,
  ARRAY['https://www.wir.ch/de/chw-netzwerk/chw-system/', 'https://www.wir.ch/fileadmin/downloads/Informationen/allgemeine-bedingungen-bank-wir-de.pdf', 'https://www.wir.ch/fileadmin/downloads/Informationen/zinsen-konditionen-bank-wir-fr.pdf', 'https://www.wir.ch/fr/chw-netzwerk/chw-kmu-paket/uebersicht/paquet-chw-pour-pme/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'RES',
  'res',
  'https://res.be/',
  'Keerbergen',
  'Flanders',
  'BE',
  '+32-15-422-776',
  'info@res.be',
  '{}'::text[],
  'RES is a Belgian complementary-currency and modern barter circuit founded in 1996. It serves more than 2,000 businesses across sectors and also has a large consumer membership. Business members can take payment in RES points (with negotiable RES percentages for B2B trades) and spend those points with other participants. The network is a hybrid B2B/B2C circuit, not a purely business-only exchange, but it is a long-running commercial organized-trade system of the WIR/Sardex type.',
  10,
  NULL,
  '0',
  '0',
  'The site says a freemium account can be opened at no opening or annual charge. Once a member receives RES customers, a 10% euro commission applies to the RES portion of the sale. Example published: a €100 sale with 50% RES incurs 10% of 50 RES, or €5.',
  2000,
  'The site says more than 2,000 entrepreneurs and 15,000 consumers are active in the network.',
  1996,
  ARRAY['https://res.be/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'BXI (Barter Exchange of India)',
  'bxi-barter-exchange-of-india',
  'https://bxiworld.com/',
  'Mumbai',
  'Maharashtra',
  'IN',
  '+91-88283-26776',
  'business@bxiworld.com',
  ARRAY['IRTA']::text[],
  'BXI is an Indian B2B barter platform listed in the current IRTA member directory as Barter Exchange of India. Companies join to sell goods or services for trade credits and spend those credits on other members’ offerings, including marketing, travel, and business essentials. The about page says Brandworld is the exclusive counterparty partner authorized to buy from and sell to members inside the ecosystem.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current fee schedule was found on the homepage or about page checked.',
  400,
  'The company about page says ''over 400+ trusted brands'' and ''12+ categories.'' A BusinessToday impact feature dated 13 May 2026 reported 350+ brands in 98+ cities; treat press figures as secondary to the company’s own page.',
  NULL,
  ARRAY['https://bxiworld.com/', 'https://bxiworld.com/about', 'https://irta.com/member-directory/', 'https://www.businesstoday.in/impact-feature/story/how-bxi-is-using-trade-credits-to-transform-indias-traditional-barter-system-531350-2026-05-13', 'https://www.businessworld.in/article/bxi-reviving-barter-for-the-digital-age-568116']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Metro Trading Association',
  'metro-trading-association',
  'https://metrotrading.com/',
  'Rochester Hills',
  'MI',
  'US',
  '248-244-0000',
  'info@metrotrading.com',
  ARRAY['IRTA']::text[],
  'Metro Trading Association is a Michigan and Ohio business barter network. Members sell goods or services for MTA trade credits and spend those credits with other members, with trade-broker support and a member app. The site says membership also connects clients to IRTA’s wider trading community.',
  12,
  NULL,
  NULL,
  '400',
  'A Rochester Regional Chamber member offer dated in 2026, running through 31 December 2026, states a $400 membership fee (waived in that offer), a 12% transaction fee per sale, and a maintenance fee of $19 cash plus $19 trade after six months, with first-year monthly fees also waived in the offer. These figures were not independently located on metrotrading.com’s FAQ page.',
  5000,
  'The homepage says MTA ''offers marketing services to over 5,000 members in Michigan and Ohio'' and also uses ''thousands of businesses'' language.',
  NULL,
  ARRAY['https://metrotrading.com/', 'https://metrotrading.com/about-us/', 'https://metrotrading.com/faqs/', 'https://irta.com/member-directory/', 'https://business.rrc-mi.com/membertomember/info/metro-trading-association-chamber-member-special-400-mta-membership-fee-waived-for-life-09-13-2026']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'iTrade Colorado',
  'itrade-colorado',
  'https://itradecolorado.com/',
  'Westminster',
  'CO',
  'US',
  '303-945-2444',
  'info@itradecolorado.com',
  ARRAY['IRTA']::text[],
  'iTrade Colorado is a Colorado B2B trade network. Members sell through the network for credits they can spend with other Colorado members on goods and services such as printing, dining, marketing and repairs. IRTA lists the exchange as iTrade Colorado at itradecolorado.net; the live public site used here is itradecolorado.com. The .net address returned a bot-challenge page from this environment and was not independently read.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current fee schedule was found on the homepage checked.',
  2500,
  'The homepage says the network brings together ''more than 2,500 businesses who trade products and services every day.''',
  NULL,
  ARRAY['https://itradecolorado.com/', 'https://irta.com/member-directory/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'TBT Barter',
  'tbt-barter',
  'https://tbtbarter.com/',
  'Cherry Hill',
  'NJ',
  'US',
  '856-269-4136',
  'info@tbtbarter.com',
  ARRAY['IRTA']::text[],
  'TBT Barter is a local business trade exchange serving South Jersey, Philadelphia and the surrounding tri-state area. It is family-owned in Cherry Hill, New Jersey, and describes itself as a third-party coordinator and record-keeper of member barter transactions, including monthly accounting and year-end tax reporting. A second address is published in Somers Point, New Jersey.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current fee schedule was found on the homepage checked.',
  NULL,
  'The site says it works with ''hundreds'' of local business owners and that it ''consistently add[s] 10-20 new members per month.'' No total headcount was published.',
  NULL,
  ARRAY['https://tbtbarter.com/', 'https://irta.com/member-directory/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Barter Network Inc.',
  'barter-network-inc',
  'https://barternetworkinc.com/',
  'Milford',
  'CT',
  'US',
  '203-647-0251',
  'mbastarache@barternetworkinc.com',
  ARRAY['IRTA']::text[],
  'Barter Network Inc. is a Connecticut independently owned trade exchange, distinct from already-listed Barter Network Ltd. of Ontario, Canada. It offers members new-customer referrals and a range of local spending options. The company is running a 2026 referral program aimed at doubling membership, and it has advertised a waived first-year signup fee for Milford/West Haven Chamber members.',
  NULL,
  NULL,
  NULL,
  '399',
  'The site advertises a first-year sign-up fee of $399, sometimes waived (chamber offer and 2026 referral offer). No transaction-fee or monthly-dues figure was found on the pages checked. Published staff emails also include cyalof@barternetworkinc.com (Clay Yalof) and others on the contact page. Direct line also published for Clay Yalof: 203-951-3519.',
  NULL,
  'No total member count was published. The site lists named new members and says it wants to double membership in 2026.',
  NULL,
  ARRAY['https://barternetworkinc.com/', 'https://barternetworkinc.com/contact-us/', 'https://irta.com/member-directory/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Badger Barter',
  'badger-barter',
  'https://badgerbarter.com/',
  'Sun Prairie',
  'WI',
  'US',
  '608-837-0525',
  NULL,
  ARRAY['IRTA']::text[],
  'Badger Barter is a Wisconsin business barter network based in the Madison / Sun Prairie area. The site describes a membership marketplace, trade credits or ''barter bucks,'' optional lines of credit for qualifying businesses, and business-to-business matchmaking. It says the system is accepted by hundreds of businesses in and around the Madison regional metro area.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current fee schedule was found on the homepage or contact page checked.',
  NULL,
  'The site says the network ''offers over 600 business connection opportunities'' and is ''accepted by hundreds of businesses'' around Madison. The 600 figure is published as connection opportunities, not a verified member headcount.',
  NULL,
  ARRAY['https://badgerbarter.com/', 'https://badgerbarter.com/contact/', 'https://irta.com/member-directory/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Via Permuta',
  'via-permuta',
  'https://viapermuta.com.br/',
  'Belo Horizonte',
  'Minas Gerais',
  'BR',
  '31-99547-7849',
  'contato@viapermuta.com.br',
  '{}'::text[],
  'Via Permuta is a Brazilian multilateral business-barter (permuta) franchise network, distinct from already-listed Clube de Permuta. Member companies receive an internal credit unit called VP$ (published as VP$ 1.00 = R$ 1.00) and can buy from and sell to other associates without a direct two-way swap. The national brand site is viapermuta.com.br; a Campinas-area unit site, permutarmc.com.br, publishes current network-scale figures and unit-level contacts. This is proposed as one network listing.',
  NULL,
  NULL,
  NULL,
  NULL,
  'The Campinas unit site has an FAQ item ''Quais são os custos para ser associado?'' but the public page did not expand the actual fee amounts in the version retrieved. No fee schedule was found on viapermuta.com.br.',
  4500,
  'permutarmc.com.br, which identifies itself as Permuta RMC / Via Permuta and 3JPS Intermediacao de Negocios Ltda (CNPJ 67.041.411/0001-04), claims 46 units in Brazil, more than 4,500 associated companies, and more than R$ 269 million moved in permuta. The national viapermuta.com.br homepage counters displayed zeros when checked and are not used. Testimonials on the national site refer to membership since 2018 and name founders Michel and Randolpho.',
  NULL,
  ARRAY['https://viapermuta.com.br/', 'https://viapermuta.com.br/seja-um-franqueado-via-permuta/', 'https://permutarmc.com.br/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Exmerce',
  'exmerce',
  'https://exmerce.com/',
  'Calgary',
  'AB',
  'CA',
  '877-412-3287',
  'growmybusiness@exmerce.com',
  '{}'::text[],
  'Exmerce is a Calgary-area business barter exchange. Members sell products or services for Exmerce Dollars and spend those credits with other members, with broker support and a member portal and app. It is a second Canadian exchange, distinct from already-listed Barter Network Ltd. of Ontario.',
  NULL,
  '35',
  NULL,
  NULL,
  'Published membership cost is $35 plus GST per month, plus an 8% fee when buying and an 8% fee when selling. The membership page also says there are no contracts and mentions up to $2,500 in Exmerce line of credit. Amounts appear to be Canadian dollars. Facebook also lists info@exmerce.com; the email used here is the one published on the FAQ page.',
  500,
  'The membership page says members have access to ''the entire barter community of over 500 businesses.''',
  NULL,
  ARRAY['https://exmerce.com/', 'https://exmerce.com/exmerce-for-your-business/', 'https://exmerce.com/membership/', 'https://exmerce.com/faq/', 'https://exmerce.com/contact/', 'https://exmerce.com/exmerce-barter-inc-named-exclusive-national-partner-in-the-barter-exchange-category-by-yyc-business-network/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'Barter de México',
  'barter-de-mexico',
  'https://barterdemexico.com/',
  'Mexico City',
  'CDMX',
  'MX',
  '+1-702-728-1185',
  'info@barterdemexico.com',
  '{}'::text[],
  'Barter de México presents itself as a national commercial barter network for Mexican businesses, with broker offices or barter stores in Mexico City, Puebla and Tijuana. Members sell unused capacity for ''pesos de trueque'' and spend those credits with other business members. The same site also promotes TRUUEKE, a consumer/hyperlocal swap app in testing, and a creator program; only the business exchange is in scope for this directory.',
  NULL,
  NULL,
  NULL,
  NULL,
  'No current fee schedule for the business exchange was found on the homepage checked.',
  NULL,
  'The site says it has been in operation 25+ years, is active in three cities, and refers to ''thousands'' of business partners. No exact member count was published.',
  NULL,
  ARRAY['https://barterdemexico.com/']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO entries (
  name, slug, website, city, state_region, country, phone, email, networks, description,
  cash_fee_percent, monthly_dues, annual_dues, joining_fee, fees_notes, approx_member_count,
  member_count_notes, year_founded, source_urls, website_http_status, last_checked
) VALUES (
  'London Barter Network',
  'london-barter-network',
  'https://londonbarternetwork.com/',
  'London',
  'ON',
  'CA',
  NULL,
  NULL,
  '{}'::text[],
  'London Barter Network describes itself as a self-service business barter exchange for London, Ontario. It says it has moved from a commission model to an advertisement-supported model, with no transaction commissions or monthly fees, and that trade dollars are valued at T$1 = CAD $1.00 for CRA/HST purposes.',
  0,
  '0',
  NULL,
  '0',
  'The about page says trading between members is 100% free — no transaction commissions, no monthly fees — and that the network will not revert to commission fees, with sponsor placements funding operations.',
  NULL,
  'No member count was published on the pages retrieved.',
  NULL,
  ARRAY['https://londonbarternetwork.com/', 'https://londonbarternetwork.com/about']::text[],
  200,
  DATE '2026-11-23'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO schema_migrations (id)
VALUES ('004_add_worldwide_exchanges')
ON CONFLICT (id) DO NOTHING;
