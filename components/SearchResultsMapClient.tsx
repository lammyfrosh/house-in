"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, BedDouble, Bath, SlidersHorizontal } from "lucide-react";

export type MapProperty = {
  id: string;
  slug: string;
  title: string;
  purpose: "rent" | "sale" | "shortlet";
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  state: string;
  area: string;
  city: string;
  imageUrl: string;
  listedAtText?: string;
  lat: number;
  lng: number;
};

export type SearchSummary = {
  state?: string;
  area?: string;
  purpose?: string;
  propertyType?: string;
  beds?: string;
  baths?: string;
  minPrice?: number;
  maxPrice?: number;
};

type Filters = {
  state: string;
  area: string;
  purpose: string;
  propertyType: string;
  beds: string;
  baths: string;
  minPrice: string;
  maxPrice: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function purposeLabel(purpose: string) {
  if (purpose === "rent") return "For Rent";
  if (purpose === "sale") return "For Sale";
  return "Shortlet";
}

function norm(s: string) {
  return String(s || "").trim().toLowerCase();
}

function buildMapUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
}

const PRICE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "₦500k", value: "500000" },
  { label: "₦1m", value: "1000000" },
  { label: "₦2m", value: "2000000" },
  { label: "₦5m", value: "5000000" },
  { label: "₦10m", value: "10000000" },
  { label: "₦50m", value: "50000000" },
  { label: "₦100m", value: "100000000" },
  { label: "₦500m", value: "500000000" },
];

export default function SearchResultsMapClient({
  results,
  defaultCenter,
  searchSummary,
}: {
  results: MapProperty[];
  defaultCenter: { lat: number; lng: number };
  searchSummary: SearchSummary;
}) {
  const [filters, setFilters] = useState<Filters>({
    state: searchSummary.state || "",
    area: searchSummary.area || "",
    purpose: searchSummary.purpose || "",
    propertyType: searchSummary.propertyType || "",
    beds: searchSummary.beds || "",
    baths: searchSummary.baths || "",
    minPrice: searchSummary.minPrice ? String(searchSummary.minPrice) : "",
    maxPrice: searchSummary.maxPrice ? String(searchSummary.maxPrice) : "",
  });

  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(
    results.length > 0 ? results[0] : null
  );

  const states = useMemo(() => {
    return Array.from(new Set(results.map((r) => r.state).filter(Boolean))).sort();
  }, [results]);

  const propertyTypes = useMemo(() => {
    return Array.from(
      new Set(results.map((r) => r.propertyType).filter(Boolean))
    ).sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((property) => {
      if (filters.state && norm(property.state) !== norm(filters.state)) {
        return false;
      }

      if (
        filters.area &&
        !(
          norm(property.area).includes(norm(filters.area)) ||
          norm(property.city).includes(norm(filters.area)) ||
          norm(property.state).includes(norm(filters.area))
        )
      ) {
        return false;
      }

      if (filters.purpose && norm(property.purpose) !== norm(filters.purpose)) {
        return false;
      }

      if (
        filters.propertyType &&
        norm(property.propertyType) !== norm(filters.propertyType)
      ) {
        return false;
      }

      if (filters.beds && Number(property.bedrooms) < Number(filters.beds)) {
        return false;
      }

      if (filters.baths && Number(property.bathrooms) < Number(filters.baths)) {
        return false;
      }

      if (filters.minPrice && Number(property.price) < Number(filters.minPrice)) {
        return false;
      }

      if (filters.maxPrice && Number(property.price) > Number(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  }, [results, filters]);

  useEffect(() => {
    if (filteredResults.length === 0) {
      setSelectedProperty(null);
      return;
    }

    const stillExists = filteredResults.find((p) => p.id === selectedProperty?.id);
    if (!stillExists) {
      setSelectedProperty(filteredResults[0]);
    }
  }, [filteredResults, selectedProperty]);

  const selectedLat = selectedProperty?.lat ?? defaultCenter.lat;
  const selectedLng = selectedProperty?.lng ?? defaultCenter.lng;
  const mapSrc = buildMapUrl(selectedLat, selectedLng);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      state: "",
      area: "",
      purpose: "",
      propertyType: "",
      beds: "",
      baths: "",
      minPrice: "",
      maxPrice: "",
    });
  }

  return (
    <main className="bg-[#f7f9fc]">
      <section className="xl:h-[calc(100vh-88px)] xl:overflow-hidden">
        <div className="grid xl:h-full xl:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT MAP DESKTOP */}
          <aside className="hidden xl:block xl:h-full xl:border-r xl:border-[var(--color-border)] xl:bg-white">
            <div className="sticky top-[88px] h-[calc(100vh-88px)]">
              <iframe
                key={selectedProperty?.id || "default-map"}
                title="Property search map"
                src={mapSrc}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <div className="xl:h-[calc(100vh-88px)] xl:overflow-y-auto">
            <div className="border-b border-[var(--color-border)] bg-white px-4 py-6 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
                    Property Search
                  </p>

                  <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)] sm:text-4xl">
                    Results for Your Search
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                    Filter listings and browse matching properties beside the map.
                    Hover on desktop or tap on mobile to update the map to the
                    selected property area.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
                  >
                    Back Home
                  </Link>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[var(--color-border)] bg-[#f8fafc] p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <SlidersHorizontal
                    size={18}
                    className="text-[var(--color-primary-dark)]"
                  />
                  <h2 className="text-base font-bold text-[var(--color-text-main)]">
                    Filter Properties
                  </h2>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <select
                    value={filters.state}
                    onChange={(e) => updateFilter("state", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  <input
                    value={filters.area}
                    onChange={(e) => updateFilter("area", e.target.value)}
                    placeholder="Location / Area"
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  />

                  <select
                    value={filters.purpose}
                    onChange={(e) => updateFilter("purpose", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    <option value="">All Purposes</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                    <option value="shortlet">Shortlet</option>
                  </select>

                  <select
                    value={filters.propertyType}
                    onChange={(e) => updateFilter("propertyType", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.beds}
                    onChange={(e) => updateFilter("beds", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    <option value="">Any Beds</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>

                  <select
                    value={filters.baths}
                    onChange={(e) => updateFilter("baths", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    <option value="">Any Baths</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>

                  <select
                    value={filters.minPrice}
                    onChange={(e) => updateFilter("minPrice", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    {PRICE_OPTIONS.map((option) => (
                      <option key={`min-${option.value}`} value={option.value}>
                        Min Price {option.label !== "Any" ? `- ${option.label}` : ""}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none focus:border-[var(--color-primary-dark)]"
                  >
                    {PRICE_OPTIONS.map((option) => (
                      <option key={`max-${option.value}`} value={option.value}>
                        Max Price {option.label !== "Any" ? `- ${option.label}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 text-lg font-semibold text-[var(--color-text-main)] shadow-sm">
                Showing {filteredResults.length}{" "}
                {filteredResults.length === 1 ? "property" : "properties"}
              </div>
            </div>

            <div className="space-y-5 px-4 py-6 sm:px-6">
              {filteredResults.length === 0 ? (
                <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
                  <h2 className="text-xl font-bold text-[var(--color-text-main)]">
                    No matching properties found
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Try adjusting your filters above.
                  </p>
                </div>
              ) : (
                filteredResults.map((property) => {
                  const isSelected = selectedProperty?.id === property.id;

                  return (
                    <Link
                      key={property.id}
                      href={`/property/${property.slug}`}
                      onMouseEnter={() => setSelectedProperty(property)}
                      onFocus={() => setSelectedProperty(property)}
                      onClick={() => setSelectedProperty(property)}
                      className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                        isSelected
                          ? "border-[var(--color-primary-dark)] ring-2 ring-[var(--color-primary)]/20"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      <div className="grid gap-0 md:grid-cols-[300px_1fr]">
                        <div className="bg-slate-100">
                          <img
                            src={property.imageUrl}
                            alt={property.title}
                            className="h-64 w-full object-cover md:h-full"
                          />
                        </div>

                        <div className="p-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-[var(--color-primary-dark)]/10 px-3 py-1 text-xs font-bold uppercase text-[var(--color-primary-dark)]">
                              {purposeLabel(property.purpose)}
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                              {property.propertyType}
                            </span>

                            {isSelected && (
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                                Map Focus
                              </span>
                            )}
                          </div>

                          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-text-main)]">
                            {property.title}
                          </h2>

                          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                            <MapPin size={16} />
                            {property.area}, {property.city}, {property.state}
                          </p>

                          <p className="mt-4 text-2xl font-bold text-[var(--color-text-main)]">
                            {money(property.price)}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                            <span className="inline-flex items-center gap-2">
                              <BedDouble size={16} />
                              {property.bedrooms} Beds
                            </span>

                            <span className="inline-flex items-center gap-2">
                              <Bath size={16} />
                              {property.bathrooms} Baths
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE MAP - COMPLETELY BELOW PAGE CONTENT */}
      <section className="border-t border-[var(--color-border)] bg-[#f7f9fc] px-4 pb-8 pt-2 sm:px-6 xl:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">
                Map View
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                The map stays here at the bottom. Tap any property above to update
                the location focus.
              </p>
            </div>

            <div className="h-[280px] w-full sm:h-[340px]">
              <iframe
                key={`mobile-${selectedProperty?.id || "default-map"}`}
                title="Property search map"
                src={mapSrc}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}