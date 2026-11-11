import { NOT_PUBLISHED } from "@/lib/format";
import { slugify } from "@/lib/slug";

const US_STATES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  TH: "Thailand",
  GB: "United Kingdom",
  SG: "Singapore",
  IT: "Italy",
  BR: "Brazil",
  BE: "Belgium",
};

export function stateSlug(state: string | null | undefined): string {
  if (!state) return "";
  return slugify(state);
}

export function stateLabel(state: string | null | undefined, country: string | null | undefined): string {
  if (!state) return NOT_PUBLISHED;
  if ((country || "").toUpperCase() === "US" && US_STATES[state.toUpperCase()]) {
    return US_STATES[state.toUpperCase()];
  }
  return state;
}

export function countryName(code: string | null | undefined): string {
  if (!code) return NOT_PUBLISHED;
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase();
}

export function locationLine(input: {
  city: string | null;
  state_region: string | null;
  country: string | null;
}): string {
  const state = input.state_region
    ? input.country?.toUpperCase() === "US"
      ? input.state_region.toUpperCase()
      : stateLabel(input.state_region, input.country)
    : null;
  const country =
    input.country && input.country.toUpperCase() !== "US" ? countryName(input.country) : null;
  const parts = [input.city, state, country].filter((part): part is string => Boolean(part));
  return parts.length ? parts.join(", ") : NOT_PUBLISHED;
}
