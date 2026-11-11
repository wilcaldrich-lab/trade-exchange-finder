# Trade Exchange Finder

A mobile-first directory of business barter and trade exchanges, published at [barterexchanges.org](https://barterexchanges.org). `tradeexchangefinder.com` and `www` hosts redirect there.

The public list shows a fact only when an exchange published it. Empty fields render as **Not published**.

## Stack

Next.js App Router, TypeScript, Tailwind, Postgres (Neon), Resend.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in the variables below.
3. Apply the schema: `npm run db:migrate`
4. Load the sourced exchanges: `npm run db:seed`
5. `npm run dev`

`npm run build` does not need a database. Pages read the database at request time and fall back to `data/exchanges.json` for the public directory if the database is missing or empty. Sponsor totals do not use that fallback. If the database cannot be read, `/sponsor` says the live totals are unavailable.

The Node server also applies `db/migrations/001_init.sql` on startup when `DATABASE_URL` or `POSTGRES_URL` is set (`src/instrumentation.ts`). That does not seed data. Run `npm run db:seed` once per database. Seeding again refreshes the original slugs from `data/exchanges.json`. Exchanges added only through the review queue are left in place. A correction to a seeded slug is overwritten if you seed again.

Migrations prefer a direct connection when `DATABASE_URL_UNPOOLED` or `POSTGRES_URL_NON_POOLING` is set. The running app uses `DATABASE_URL`, then `POSTGRES_URL` (use the Neon pooled URL on Vercel).

## Environment variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres URL. Read first. |
| `POSTGRES_URL` | Fallback if `DATABASE_URL` is unset (Vercel Marketplace Neon). |
| `DATABASE_URL_UNPOOLED` / `POSTGRES_URL_NON_POOLING` | Optional direct URL for `db:migrate` and `db:seed`. |
| `RESEND_API_KEY` | Resend API key. |
| `RESEND_AUDIENCE_ID` | Audience id, or segment id on current Resend accounts. Signups are added there. Newsletter drafts target it. |
| `ADMIN_TOKEN` | Bearer token for `/api/admin/*`. Compared with a SHA-256 digest so the check does not leak the length. |
| `OWNER_EMAIL` | Receives sponsor inquiries. |
| `BOT_EMAIL` | Also receives sponsor inquiries when set. |
| `FROM_EMAIL` | Verified sender, for example `hello@barterexchanges.org`. |
| `SITE_URL` | Canonical origin. Defaults to `https://barterexchanges.org`. |

Do not commit `.env`.

## Routes

- `/` directory, search, and filters
- `/state/[state]` exchanges in one state or region
- `/country/[country]` exchanges in one country
- `/exchange/[slug]` listing, sources, and last-checked date
- `/guide` how business barter works
- `/submit` new listing or correction (review queue)
- `/sponsor` live database counts and inquiry form
- `/go/[sponsor]` click log, then redirect
- `/sitemap.xml`, `/robots.txt`, Open Graph image

Search covers name, city, state, and description. Filters cover state, country, network (IRTA, NATE, UC, BANC), and whether any fee is published.

## Admin API

Send `Authorization: Bearer $ADMIN_TOKEN`.

- `GET /api/admin/queue` pending submissions
- `POST /api/admin/approve` JSON `{ "id": 1, "action": "approve" }` or `"reject"`. Approve writes the submission onto `entries`.
- `GET /api/admin/stats` entry count, signups (total and 7 days), pageviews (7 and 30 days, top pages), sponsor clicks, inquiries
- `GET /api/admin/searches` recent zero-result searches
- `GET /api/admin/sponsors` sponsor rows
- `POST /api/admin/sponsors` create a row, or update one when `id` is sent
- `POST /api/admin/newsletter/draft` creates a Resend broadcast draft (five listings, one line each, plus a sponsored-by line) and returns its id. It does not send.

Sponsor placements are `bar`, `state_feature`, and `newsletter`. A state feature can set `state_region` (for example `TX` or `texas`) and an optional `exchange_slug`.

## Deploy

1. Import the repo in Vercel.
2. Attach Neon from the Vercel Marketplace so `DATABASE_URL` or `POSTGRES_URL` is present.
3. Set the Resend, admin, and email variables. Verify the From domain in Resend.
4. Add the domains `barterexchanges.org` and `tradeexchangefinder.com`. The app 308-redirects `www.barterexchanges.org`, `tradeexchangefinder.com`, and `www.tradeexchangefinder.com` to the apex.
5. After the first boot (schema is applied on startup), run `npm run db:seed` with the production database URL.

Public forms use a honeypot field and a short in-memory rate limit. Pageviews store path, referrer origin and path, and UTC day. They do not use cookies.

## Scripts

- `npm test` pure checks for the seed file, search, email blocking, and the admin token compare
- `npm run lint`
- `npm run build`
