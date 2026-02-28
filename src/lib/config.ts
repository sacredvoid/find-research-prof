export const OPENALEX_BASE_URL = "https://api.openalex.org";
export const OPENALEX_MAILTO = process.env.NEXT_PUBLIC_OPENALEX_MAILTO || "researchprof@example.com";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://researchprof.com";
export const SITE_NAME = "ResearchProf";
export const SITE_DESCRIPTION =
  "Search any research topic and instantly find professors working in that field. View their papers, citations, h-index, collaboration networks, and direct links — all in one place.";

export const MAX_GRAPH_NODES = 150;

export const COUNTRIES: { code: string; label: string }[] = [
  { code: "", label: "All countries" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "DE", label: "Germany" },
  { code: "CN", label: "China" },
  { code: "JP", label: "Japan" },
  { code: "AU", label: "Australia" },
  { code: "FR", label: "France" },
  { code: "NL", label: "Netherlands" },
  { code: "CH", label: "Switzerland" },
  { code: "IN", label: "India" },
  { code: "KR", label: "South Korea" },
  { code: "SE", label: "Sweden" },
  { code: "SG", label: "Singapore" },
  { code: "IL", label: "Israel" },
  { code: "BR", label: "Brazil" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "DK", label: "Denmark" },
  { code: "NO", label: "Norway" },
  { code: "FI", label: "Finland" },
  { code: "AT", label: "Austria" },
  { code: "BE", label: "Belgium" },
  { code: "IE", label: "Ireland" },
  { code: "NZ", label: "New Zealand" },
  { code: "HK", label: "Hong Kong" },
  { code: "TW", label: "Taiwan" },
  { code: "PT", label: "Portugal" },
  { code: "CZ", label: "Czech Republic" },
  { code: "PL", label: "Poland" },
  { code: "MX", label: "Mexico" },
  { code: "AR", label: "Argentina" },
  { code: "TR", label: "Turkey" },
  { code: "ZA", label: "South Africa" },
  { code: "RU", label: "Russia" },
  { code: "CL", label: "Chile" },
  { code: "CO", label: "Colombia" },
  { code: "TH", label: "Thailand" },
  { code: "MY", label: "Malaysia" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "EG", label: "Egypt" },
  { code: "PK", label: "Pakistan" },
  { code: "NG", label: "Nigeria" },
  { code: "GR", label: "Greece" },
  { code: "HU", label: "Hungary" },
  { code: "RO", label: "Romania" },
  { code: "HR", label: "Croatia" },
];

/** Map country codes to display names */
const COUNTRY_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.filter((c) => c.code).map((c) => [c.code, c.label])
);

export function countryCodeToName(code: string): string {
  return COUNTRY_MAP[code] || code;
}
