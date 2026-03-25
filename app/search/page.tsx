import SearchResultsMapClient, {
  type MapProperty,
  type SearchSummary,
} from "@/components/SearchResultsMapClient";
import { getApprovedProperties } from "@/lib/api";

function asString(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

function norm(s: string) {
  return String(s || "").trim().toLowerCase();
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

  const summary: SearchSummary = {
    state: asString(sp.state),
    area: asString(sp.area),
    purpose: asString(sp.purpose),
    propertyType: asString(sp.propertyType),
    beds: asString(sp.beds),
    baths: asString(sp.baths),
    minPrice: Number(asString(sp.minPrice) || 0),
    maxPrice: Number(asString(sp.maxPrice) || 0),
  };

  const properties = await getApprovedProperties();

  const results: MapProperty[] = properties.map((p) => {
    const coords = getCoords(p.area, p.city, p.state);

    return {
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      purpose: p.purpose as "rent" | "sale" | "shortlet",
      propertyType: p.property_type || p.propertyType || "",
      price: Number(p.price),
      bedrooms: Number(p.bedrooms || 0),
      bathrooms: Number(p.bathrooms || 0),
      state: p.state,
      area: p.area,
      city: p.city,
      imageUrl: p.image_url || p.imageUrl || "/placeholder-property.jpg",
      listedAtText: p.listedAtText || "Live listing",
      lat: coords.lat,
      lng: coords.lng,
    };
  });

  return (
    <SearchResultsMapClient
      results={results}
      defaultCenter={{ lat: 6.5244, lng: 3.3792 }}
      searchSummary={summary}
    />
  );
}