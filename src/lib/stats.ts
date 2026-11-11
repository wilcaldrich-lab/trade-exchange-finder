import { databaseUrl, query } from "@/lib/db";

export type LiveStats = {
  exchanges: number;
  subscribers: number;
  pageviews30d: number;
};

export type AdminStats = {
  entries: number;
  signups: { total: number; last7d: number };
  pageviews: { last7d: number; last30d: number; topPages: { path: string; views: number }[] };
  sponsorClicks: { total: number; last30d: number };
  inquiries: number;
};

export async function getLiveStats(): Promise<LiveStats | null> {
  if (!databaseUrl()) return null;
  try {
    const [entries, signups, views] = await Promise.all([
      query<{ count: string }>("SELECT count(*)::text AS count FROM entries"),
      query<{ count: string }>("SELECT count(*)::text AS count FROM signups"),
      query<{ count: string }>(
        "SELECT coalesce(sum(count), 0)::text AS count FROM pageviews WHERE day >= CURRENT_DATE - INTERVAL '29 days'",
      ),
    ]);
    return {
      exchanges: Number(entries[0]?.count || 0),
      subscribers: Number(signups[0]?.count || 0),
      pageviews30d: Number(views[0]?.count || 0),
    };
  } catch {
    return null;
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const [entries, signups, signups7, views7, views30, topPages, clicks, clicks30, inquiries] = await Promise.all([
    query<{ count: string }>("SELECT count(*)::text AS count FROM entries"),
    query<{ count: string }>("SELECT count(*)::text AS count FROM signups"),
    query<{ count: string }>("SELECT count(*)::text AS count FROM signups WHERE created_at >= now() - INTERVAL '7 days'"),
    query<{ count: string }>(
      "SELECT coalesce(sum(count), 0)::text AS count FROM pageviews WHERE day >= CURRENT_DATE - INTERVAL '6 days'",
    ),
    query<{ count: string }>(
      "SELECT coalesce(sum(count), 0)::text AS count FROM pageviews WHERE day >= CURRENT_DATE - INTERVAL '29 days'",
    ),
    query<{ path: string; views: string }>(
      `SELECT path, sum(count)::text AS views
       FROM pageviews
       WHERE day >= CURRENT_DATE - INTERVAL '29 days'
       GROUP BY path
       ORDER BY sum(count) DESC
       LIMIT 10`,
    ),
    query<{ count: string }>("SELECT count(*)::text AS count FROM sponsor_clicks"),
    query<{ count: string }>(
      "SELECT count(*)::text AS count FROM sponsor_clicks WHERE created_at >= now() - INTERVAL '30 days'",
    ),
    query<{ count: string }>("SELECT count(*)::text AS count FROM sponsor_inquiries"),
  ]);

  return {
    entries: Number(entries[0]?.count || 0),
    signups: { total: Number(signups[0]?.count || 0), last7d: Number(signups7[0]?.count || 0) },
    pageviews: {
      last7d: Number(views7[0]?.count || 0),
      last30d: Number(views30[0]?.count || 0),
      topPages: topPages.map((row) => ({ path: row.path, views: Number(row.views || 0) })),
    },
    sponsorClicks: { total: Number(clicks[0]?.count || 0), last30d: Number(clicks30[0]?.count || 0) },
    inquiries: Number(inquiries[0]?.count || 0),
  };
}
