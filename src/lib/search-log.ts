import { databaseUrl, logError, query } from "@/lib/db";
import { scrubQuery, type Filters } from "@/lib/search";

export async function logZeroResult(filters: Filters): Promise<void> {
  if (!databaseUrl()) return;
  if (!filters.q && !filters.state && !filters.country && !filters.network && !filters.fees) return;
  try {
    await query("INSERT INTO zero_result_searches (query, filters) VALUES ($1, $2::jsonb)", [
      scrubQuery(filters.q || ""),
      JSON.stringify({
        state: filters.state,
        country: filters.country,
        network: filters.network,
        fees: filters.fees,
      }),
    ]);
  } catch (error) {
    await logError(error, "zero-result");
  }
}
