import { databaseUrl, logError, query } from "@/lib/db";
import { scrubQuery, type Filters } from "@/lib/search";

export async function logZeroResult(filters: Filters): Promise<void> {
  if (!databaseUrl()) return;
  if (!filters.q && !filters.state && !filters.country && !filters.network && !filters.fees) return;
  const text = scrubQuery(filters.q || "");
  const payload = JSON.stringify({
    state: filters.state,
    country: filters.country,
    network: filters.network,
    fees: filters.fees,
  });
  try {
    const recent = await query<{ one: number }>(
      `SELECT 1 AS one FROM zero_result_searches
       WHERE query = $1 AND filters = $2::jsonb AND created_at > now() - interval '15 minutes'
       LIMIT 1`,
      [text, payload],
    );
    if (recent.length) return;
    await query("INSERT INTO zero_result_searches (query, filters) VALUES ($1, $2::jsonb)", [text, payload]);
  } catch (error) {
    await logError(error, "zero-result");
  }
}
