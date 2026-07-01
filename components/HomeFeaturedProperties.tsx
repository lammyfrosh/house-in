"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search, X } from "lucide-react";
import type { Property } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

const FEATURED_STATES = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Edo",
  "Delta",
  "Anambra",
  "Enugu",
  "Imo",
  "Abia",
];

const ALL_NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

function norm(value: string) {
  return String(value || "").trim().toLowerCase();
}

function buildFeatured(properties: Property[]) {
  return [
    ...properties.filter((p) => p.purpose === "rent").slice(0, 2),
    ...properties.filter((p) => p.purpose === "sale").slice(0, 2),
    ...properties.filter((p) => p.purpose === "shortlet").slice(0, 2),
  ].slice(0, 6);
}

export default function HomeFeaturedProperties({
  properties,
}: {
  properties: Property[];
}) {
  const [selectedState, setSelectedState] = useState("");

  const filteredProperties = useMemo(() => {
    if (!selectedState) return properties;

    return properties.filter(
      (property) => norm(property.state) === norm(selectedState)
    );
  }, [properties, selectedState]);

  const featured = useMemo(() => {
    return buildFeatured(filteredProperties);
  }, [filteredProperties]);

  const searchHref = selectedState
    ? `/search?state=${encodeURIComponent(selectedState)}`
    : "/search";

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-[var(--color-primary-dark)] p-6 text-white md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/90">
              <Search size={14} />
              Quick State Filter
            </div>

            <h2 className="mt-5 text-2xl font-bold leading-tight md:text-3xl">
              Browse featured properties by location
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/80">
              Quickly narrow the homepage listings by state, then continue to
              the full search page for deeper filters.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={searchHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0f766e] transition hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-md"
              >
                <span>View matching search</span>
                <ArrowRight size={16} />
              </Link>

              {selectedState && (
                <button
                  type="button"
                  onClick={() => setSelectedState("")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Clear
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#f8fafc] p-5 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
                  Filter by State
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {selectedState
                    ? `Showing featured listings in ${selectedState}`
                    : "Showing featured listings across all states"}
                </p>
              </div>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:min-w-[220px]"
              >
                <option value="">All Featured States</option>
                {ALL_NIGERIA_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
              <button
                type="button"
                onClick={() => setSelectedState("")}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  !selectedState
                    ? "bg-[var(--color-primary-dark)] text-white"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-text-main)] hover:border-[var(--color-primary-dark)]"
                }`}
              >
                All
              </button>

              {FEATURED_STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setSelectedState(state)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedState === state
                      ? "bg-[var(--color-primary-dark)] text-white"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-main)] hover:border-[var(--color-primary-dark)]"
                  }`}
                >
                  <MapPin size={14} />
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
            Featured Properties
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {selectedState
              ? `A handpicked mix of sale, rent, and shortlet listings in ${selectedState}.`
              : "A handpicked mix of sale, rent, and shortlet listings across key locations."}
          </p>
        </div>

        <Link
          href={searchHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-dark)] transition hover:underline"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {featured.length === 0 ? (
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-bold text-[var(--color-text-main)]">
            No featured listings found
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {selectedState
              ? `There are no featured homepage listings in ${selectedState} yet. Try another state or view all listings.`
              : "Featured listings are temporarily unavailable."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property.id} p={property} />
          ))}
        </div>
      )}
    </section>
  );
}