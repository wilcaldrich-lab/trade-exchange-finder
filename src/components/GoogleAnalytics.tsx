import Script from "next/script";

const CONSENT_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
];

/**
 * Google Analytics 4 tag. Renders nothing unless NEXT_PUBLIC_GA_ID is set.
 * Consent Mode v2 denies ads everywhere. Analytics storage is denied in the
 * EEA, the UK, and Switzerland, and granted elsewhere. Hits are sent only on
 * the public host.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId || !/^G-[A-Z0-9]+$/.test(gaId)) return null;

  const config = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: ${JSON.stringify(CONSENT_REGIONS)}
});
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
if (location.hostname === 'barterexchanges.org' || location.hostname === 'www.barterexchanges.org') {
  gtag('config', '${gaId}');
}`;

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {config}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
    </>
  );
}
