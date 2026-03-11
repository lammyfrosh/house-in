import SearchResultsMapClient from "@/components/SearchResultsMapClient";
import { properties } from "../../lib/properties";

type SortMode = "newest" | "price_low" | "price_high";

function asString(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

function toNumber(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function norm(s: string) {
  return s.trim().toLowerCase();
}

const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  lekki: { lat: 6.4698, lng: 3.5852 },
  "lekki phase 1": { lat: 6.4474, lng: 3.4721 },
  ajah: { lat: 6.4654, lng: 3.6015 },
  "victoria island": { lat: 6.4281, lng: 3.4219 },
  ikoyi: { lat: 6.4549, lng: 3.4356 },
  ikeja: { lat: 6.6018, lng: 3.3515 },
  alausa: { lat: 6.6213, lng: 3.3581 },
  chevron: { lat: 6.4412, lng: 3.5353 },
  "wuse 2": { lat: 9.0765, lng: 7.4767 },
  garki: { lat: 9.0369, lng: 7.4937 },
  gra: { lat: 4.8156, lng: 7.0498 },
  "port harcourt": { lat: 4.8156, lng: 7.0498 },
};

const STATE_CENTERS: Record<string, { lat: number; lng: number }> = {
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Abuja: { lat: 9.0765, lng: 7.3986 },
  Rivers: { lat: 4.8156, lng: 7.0498 },
  Edo: { lat: 6.335, lng: 5.6037 },
  Delta: { lat: 5.704, lng: 5.9339 },
  Anambra: { lat: 6.2209, lng: 6.937 },
  Enugu: { lat: 6.5244, lng: 7.5086 },
  Imo: { lat: 5.572, lng: 7.0588 },
  Abia: { lat: 5.4527, lng: 7.5248 },
};

function getCoords(area: string, city: string, state: string) {
  const areaKey = norm(area);
  const cityKey = norm(city);

  if (AREA_COORDS[areaKey]) return AREA_COORDS[areaKey];
  if (AREA_COORDS[cityKey]) return AREA_COORDS[cityKey];
  if (STATE_CENTERS[state]) return STATE_CENTERS[state];

  return { lat: 6.5244, lng: 3.3792 };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const state = asString(sp.state);
  const area = asString(sp.area);
  const purpose = asString(sp.purpose);
  const propertyType = asString(sp.propertyType);
  const bedsStr = asString(sp.beds);
  const bathsStr = asString(sp.baths);
  const minPrice = toNumber(asString(sp.minPrice));
  const maxPrice = toNumber(asString(sp.maxPrice));
  const sort = (asString(sp.sort) || "newest") as SortMode;

  let results = properties.slice();

  if (purpose === "rent" || purpose === "sale" || purpose === "shortlet") {
    results = results.filter((p) => p.purpose === purpose);
  }

  if (state) {
    results = results.filter((p) => p.state === state);
  }

  if (area) {
    const q = norm(area);
    results = results.filter(
      (p) => norm(p.area).includes(q) || norm(p.city).includes(q)
    );
  }

  if (propertyType) {
    results = results.filter((p) => p.propertyType === propertyType);
  }

  if (bedsStr) {
    const minBeds = toNumber(bedsStr);
    if (minBeds > 0) results = results.filter((p) => p.bedrooms >= minBeds);
  }

  if (bathsStr) {
    const minBaths = toNumber(bathsStr);
    if (minBaths > 0) results = results.filter((p) => p.bathrooms >= minBaths);
  }

  if (minPrice > 0) {
    results = results.filter((p) => p.price >= minPrice);
  }

  if (maxPrice > 0) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  results.sort((a, b) => {
    if (sort === "price_low") return a.price - b.price;
    if (sort === "price_high") return b.price - a.price;
    return 0;
  });

  const mappedResults = results.map((p) => {
    const coords = getCoords(p.area, p.city, p.state);
    return {
      ...p,
      lat: coords.lat,
      lng: coords.lng,
    };
  });

  const defaultCenter =
    mappedResults.length > 0
      ? { lat: mappedResults[0].lat, lng: mappedResults[0].lng }
      : state && STATE_CENTERS[state]
      ? STATE_CENTERS[state]
      : { lat: 6.5244, lng: 3.3792 };

  return (
    <SearchResultsMapClient
      results={mappedResults}
      defaultCenter={defaultCenter}
      searchSummary={{
        state,
        area,
        purpose,
        propertyType,
        beds: bedsStr,
        baths: bathsStr,
        minPrice,
        maxPrice,
      }}
    />
  );
}