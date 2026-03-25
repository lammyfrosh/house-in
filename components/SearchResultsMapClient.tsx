"use client";

import Link from "next/link";
import { Filter, MapPin, BedDouble, Bath } from "lucide-react";

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

function buildFilterChips(summary: SearchSummary) {
  const chips: string[] = [];

  if (summary.state) chips.push(`State: ${summary.state}`);
  if (summary.area) chips.push(`Location: ${summary.area}`);
  if (summary.purpose) chips.push(`Purpose: ${purposeLabel(summary.purpose)}`);
  if (summary.propertyType) chips.push(`Type: ${summary.propertyType}`);
  if (summary.beds) chips.push(`Beds: ${summary.beds}+`);
  if (summary.baths) chips.push(`Baths: ${summary.baths}+`);
  if (summary.minPrice) chips.push(`Min: ${money(summary.minPrice)}`);
  if (summary.maxPrice) chips.push(`Max: ${money(summary.maxPrice)}`);

  return chips;
}

export default function SearchResultsMapClient({
  results,
  defaultCenter,
  searchSummary,
}: {
  results: MapProperty[];
  defaultCenter: { lat: number; lng: number };
  searchSummary: SearchSummary;
}) {
  const activeFilters = buildFilterChips(searchSummary);

  return (
    <main className="bg-[#f7f9fc]">
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-primary-dark)]">
                Property Search
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)] sm:text-4xl">
                Results for Your Search
              </h1>

              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                Browse all matching listings and highlight approximate locations
                on the map.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  <Filter size={16} />
                  Active Filters
                </span>

                {activeFilters.length > 0 ? (
                  activeFilters.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-[var(--color-primary)]/15 px-4 py-2 text-sm font-semibold text-[var(--color-primary-dark)]"
                    >
                      {chip}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    No filters applied
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
              >
                Back Home
              </Link>

              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 text-lg font-semibold text-[var(--color-text-main)] shadow-sm">
          Showing {results.length} {results.length === 1 ? "property" : "properties"}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-14 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-[var(--color-text-main)]">
                No matching properties found
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Try adjusting your state, location, price, or property filters.
              </p>
            </div>
          ) : (
            results.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.slug}`}
                className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="grid gap-0 md:grid-cols-[260px_1fr]">
                  <div className="bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="h-60 w-full object-cover md:h-full"
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
                    </div>

                    <h2 className="mt-3 text-xl font-semibold text-[var(--color-text-main)]">
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
            ))
          )}
        </div>

        <aside className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            Approximate Map Area
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Centered around:
          </p>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-[var(--color-text-main)]">
            <p>
              <span className="font-semibold">Latitude:</span> {defaultCenter.lat}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Longitude:</span> {defaultCenter.lng}
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-[var(--color-primary)]/10 p-4 text-sm text-[var(--color-primary-dark)]">
            The search filters above are active on this results page.
          </div>
        </aside>
      </section>
    </main>
  );
}