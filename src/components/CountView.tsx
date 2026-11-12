import { headers } from "next/headers";
import { after } from "next/server";
import { recordPageview } from "@/lib/pageviews";

/** Counts a real page render. Not mounted for not-found, so 404s do not insert. */
export async function CountView() {
  const headerList = await headers();
  if (headerList.get("x-count-view") === "1") {
    const pathname = headerList.get("x-pathname");
    const referrer = headerList.get("referer");
    after(() => recordPageview(pathname, referrer));
  }
  return null;
}
