import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CountView } from "@/components/CountView";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getExchanges } from "@/lib/catalog";
import { resolveStateSlug, stateGroups } from "@/lib/directory";
import { countryName } from "@/lib/places";
import { getStateSponsor } from "@/lib/sponsors";

type Params = { params: Promise<{ state: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function load(state: string) {
  return resolveStateSlug(state, stateGroups(await getExchanges()));
}

function placeName(group: { label: string; country: string | null }) {
  if (group.country && group.country !== "US") return `${group.label}, ${countryName(group.country)}`;
  return group.label;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { state } = await params;
  const { group, redirectTo } = await load(state);
  if (redirectTo) permanentRedirect(redirectTo);
  if (!group) return { title: "State not listed" };
  const place = placeName(group);
  const title = `Barter exchanges in ${place}`;
  const description = `Business trade exchanges based in ${place}. Published fees are shown. Missing figures stay marked Not published.`;
  const path = `/state/${group.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function StatePage({ params, searchParams }: Params) {
  const { state } = await params;
  const { group, redirectTo } = await load(state);
  if (redirectTo) permanentRedirect(redirectTo);
  if (!group) notFound();
  const place = placeName(group);
  const sponsor = await getStateSponsor([group.stateRegion, group.slug, group.label]);
  return (
    <>
      <CountView />
      <DirectoryPage
        searchParams={searchParams}
        heading={`Barter exchanges in ${place}`}
        lede={`${group.exchanges.length} listed ${group.exchanges.length === 1 ? "exchange" : "exchanges"} with a published base in ${place}.`}
        canonical={`/state/${group.slug}`}
        lockState={group.slug}
        featuredSlug={sponsor?.exchange_slug || null}
        feature={sponsor ? { slug: sponsor.slug, name: sponsor.name, tagline: sponsor.tagline } : null}
      />
    </>
  );
}
