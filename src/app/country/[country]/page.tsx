import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryPage } from "@/components/DirectoryPage";
import { getExchanges } from "@/lib/catalog";
import { countryGroups } from "@/lib/directory";
import { countryName } from "@/lib/places";

type Params = { params: Promise<{ country: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function loadCountry(country: string) {
  const code = country.toLowerCase();
  const groups = countryGroups(await getExchanges());
  const exchanges = groups.get(code);
  if (!exchanges?.length) return null;
  return { slug: code, label: countryName(exchanges[0]?.country), count: exchanges.length };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { country } = await params;
  const group = await loadCountry(country);
  if (!group) return { title: "Country not listed" };
  return {
    title: `Barter exchanges in ${group.label}`,
    description: `Business trade exchanges listed in ${group.label}. Fees appear only when an exchange published them.`,
    alternates: { canonical: `/country/${group.slug}` },
  };
}

export default async function CountryPage({ params, searchParams }: Params) {
  const { country } = await params;
  const group = await loadCountry(country);
  if (!group) notFound();
  return (
    <DirectoryPage
      searchParams={searchParams}
      heading={`Barter exchanges in ${group.label}`}
      lede={`${group.count} listed ${group.count === 1 ? "exchange" : "exchanges"} in ${group.label}.`}
      canonical={`/country/${group.slug}`}
      lockCountry={group.slug}
    />
  );
}
