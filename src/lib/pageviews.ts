import { databaseUrl, logError, query } from "@/lib/db";
import { cleanPath, cleanReferrer } from "@/lib/urls";

export async function recordPageview(pathname: string | null, referrer: string | null): Promise<void> {
  if (!databaseUrl()) return;
  const path = cleanPath(pathname);
  if (path.startsWith("/api") || path.startsWith("/go") || path.startsWith("/_next")) return;
  try {
    await query(
      `INSERT INTO pageviews (path, referrer, day, count)
       VALUES ($1, $2, CURRENT_DATE, 1)
       ON CONFLICT (path, referrer, day)
       DO UPDATE SET count = pageviews.count + 1`,
      [path, cleanReferrer(referrer)],
    );
  } catch (error) {
    await logError(error, path);
  }
}
