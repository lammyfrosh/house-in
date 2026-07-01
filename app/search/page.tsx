import SearchResultsMapClient, {
  type MapProperty,
  type SearchSummary,
} from "@/components/SearchResultsMapClient";
import { getApprovedProperties, type Property } from "@/lib/api";

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
  FCT: { lat: 9.0765, lng: 7.3986 },
  Rivers: { lat: 4.8156, lng: 7.0498 },
  Edo: { lat: 6.335, lng: 5.6037 },
  Delta: { lat: 5.704, lng: 5.9339 },
  Anambra: { lat: 6.2209, lng: 6.937 },
  Enugu: { lat: 6.5244, lng: 7.5086 },
  Imo: { lat: 5.572, lng: 7.0588 },
  Abia: { lat: 5.4527, lng: 7.5248 },
  Oyo: { lat: 7.3775, lng: 3.947 },
  Ogun: { lat: 6.998, lng: 3.4737 },
  Osun: { lat: 7.5629, lng: 4.52 },
  Ondo: { lat: 7.25, lng: 5.195 },
  Ekiti: { lat: 7.719, lng: 5.311 },
  Kwara: { lat: 8.9669, lng: 4.3874 },
  Kogi: { lat: 7.8007, lng: 6.7399 },
  Kaduna: { lat: 10.5105, lng: 7.4165 },
  Kano: { lat: 12.0022, lng: 8.592 },
};

function getCoords(area: string, city: string, state: string) {
  const areaKey = norm(area);
  const cityKey = norm(city);

  if (AREA_COORDS[areaKey]) return AREA_COORDS[areaKey];
  if (AREA_COORDS[cityKey]) return AREA_COORDS[cityKey];
  if (STATE_CENTERS[state]) return STATE_CENTERS[state];

  return { lat: 6.5244, lng: 3.3792 };
}

function getEffectiveState(summary: SearchSummary) {
  return norm(summary.state || "") === "other"
    ? summary.otherState || ""
    : summary.state || summary.otherState || "";
}

function propertyMatchesFilters(property: Property, summary: SearchSummary) {
  const effectiveState = getEffectiveState(summary);

  const propertyState = norm(property.state);
  const propertyArea = norm(property.area);
  const propertyCity = norm(property.city);
  const propertyPurpose = norm(property.purpose);
  const propertyType = norm(property.property_type || property.propertyType || "");
  const bedrooms = Number(property.bedrooms || 0);
  const bathrooms = Number(property.bathrooms || 0);
  const price = Number(property.price || 0);

  if (effectiveState && propertyState !== norm(effectiveState)) return false;

  if (
    summary.area &&
    !propertyArea.includes(norm(summary.area)) &&
    !propertyCity.includes(norm(summary.area)) &&
    !propertyState.includes(norm(summary.area))
  ) {
    return false;
  }

  if (summary.purpose && propertyPurpose !== norm(summary.purpose)) return false;

  if (summary.propertyType && propertyType !== norm(summary.propertyType)) {
    return false;
  }

  const effectiveBeds =
    norm(summary.beds || "") === "other"
      ? summary.otherBeds || ""
      : summary.beds || "";

  if (effectiveBeds && bedrooms < Number(effectiveBeds)) return false;

  if (summary.baths && bathrooms < Number(summary.baths)) return false;

  if (summary.minPrice && price < summary.minPrice) return false;

  if (summary.maxPrice && price > summary.maxPrice) return false;

  return true;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const summary: SearchSummary = {
    state: asString(sp.state),
    otherState: asString(sp.otherState),
    area: asString(sp.area),
    purpose: asString(sp.purpose),
    propertyType: asString(sp.propertyType),
    beds: asString(sp.beds),
    otherBeds: asString(sp.otherBeds),
    baths: asString(sp.baths),
    minPrice: Number(asString(sp.minPrice) || 0),
    maxPrice: Number(asString(sp.maxPrice) || 0),
  };

  const properties = await getApprovedProperties({
    state: summary.state,
    otherState: summary.otherState,
    area: summary.area,
    purpose: summary.purpose,
    propertyType: summary.propertyType,
    beds: summary.beds,
    otherBeds: summary.otherBeds,
    baths: summary.baths,
    minPrice: summary.minPrice || "",
    maxPrice: summary.maxPrice || "",
  });

  const filteredProperties = properties.filter((property) =>
    propertyMatchesFilters(property, summary)
  );

  const results: MapProperty[] = filteredProperties.map((p) => {
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

  const effectiveState = getEffectiveState(summary);

  const defaultCenter =
    effectiveState && STATE_CENTERS[effectiveState]
      ? STATE_CENTERS[effectiveState]
      : { lat: 6.5244, lng: 3.3792 };

  return (
    <SearchResultsMapClient
      results={results}
      defaultCenter={defaultCenter}
      searchSummary={summary}
    />
  );
}