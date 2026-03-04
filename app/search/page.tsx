import Link from "next/link";
import PropertyCard from "../../components/PropertyCard";
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

type Filters = {
  state: string;
  area: string;
  purpose: string;
  propertyType: string;
  beds: string;
  baths: string;
  minPrice: number;
  maxPrice: number;
};

function applyFilters(list: typeof properties, f: Filters) {
  let results = list.slice();

  // purpose
  if (f.purpose === "rent" || f.purpose === "sale" || f.purpose === "shortlet") {
    results = results.filter((p) => p.purpose === f.purpose);
  }

  // state (exact)
  if (f.state) {
    results = results.filter((p) => p.state === f.state);
  }

  // area (contains)
  if (f.area) {
    const q = norm(f.area);
    results = results.filter((p) => norm(p.area).includes(q));
  }

  // propertyType
  if (f.propertyType) {
    results = results.filter((p) => p.propertyType === f.propertyType);
  }

  // beds/baths (min)
  if (f.beds) {
    const minBeds = toNumber(f.beds);
    if (minBeds > 0) results = results.filter((p) => p.bedrooms >= minBeds);
  }
  if (f.baths) {
    const minBaths = toNumber(f.baths);
    if (minBaths > 0) results = results.filter((p) => p.bathrooms >= minBaths);
  }

  // price
  if (f.minPrice > 0) results = results.filter((p) => p.price >= f.minPrice);
  if (f.maxPrice > 0) results = results.filter((p) => p.price <= f.maxPrice);

  return results;
}

function sortResults(list: typeof properties, sort: SortMode) {
  const results = list.slice();
  results.sort((a, b) => {
    if (sort === "price_low") return a.price - b.price;
    if (sort === "price_high") return b.price - a.price;
    return 0; // newest (dummy data)
  });
  return results;
}

function buildSearchHref(
  current: Record<string, string | string[] | undefined>,
  overrides: Record<string, string>
) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    const sv = Array.isArray(v) ? v[0] : v;
    if (!sv) continue;
    params.set(k, sv);
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (!v) params.delete(k);
    else params.set(k, v);
  }
  const q = params.toString();
  return q ? `/search?${q}` : "/search";
}

function chipsFromFilters(f: Filters) {
  const chips: string[] = [];
  if (f.purpose)
    chips.push(
      f.purpose === "rent" ? "For Rent" : f.purpose === "sale" ? "For Sale" : "Shortlet"
    );
  if (f.state) chips.push(f.state);
  if (f.area) chips.push(`Area: ${f.area}`);
  if (f.propertyType) chips.push(`Type: ${f.propertyType}`);
  if (f.beds) chips.push(`${f.beds}+ beds`);
  if (f.baths) chips.push(`${f.baths}+ baths`);
  if (f.minPrice) chips.push(`Min ₦${f.minPrice.toLocaleString()}`);
  if (f.maxPrice) chips.push(`Max ₦${f.maxPrice.toLocaleString()}`);
  return chips;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const filters: Filters = {
    state: asString(sp.state),
    area: asString(sp.area),
    purpose: asString(sp.purpose),
    propertyType: asString(sp.propertyType),
    beds: asString(sp.beds),
    baths: asString(sp.baths),
    minPrice: toNumber(asString(sp.minPrice)),
    maxPrice: toNumber(asString(sp.maxPrice)),
  };

  const sort = (asString(sp.sort) || "newest") as SortMode;

  // STRICT results
  const strict = sortResults(applyFilters(properties, filters), sort);

  // OPTIONAL “Relax filters” mode (query param)
  const relaxMode = asString(sp.relax) === "1";

  let results = strict;

  // If relaxMode is on and strict returns 0, relax in stages (professional fallback)
  const relaxedStages: { label: string; href: string; results: typeof properties }[] = [];

  if (strict.length === 0) {
    // Stage 1: drop area
    {
      const f = { ...filters, area: "" };
      const r = sortResults(applyFilters(properties, f), sort);
      relaxedStages.push({
        label: "Try without Area/LGA",
        href: buildSearchHref(sp, { area: "", relax: "1" }),
        results: r,
      });
    }

    // Stage 2: drop propertyType
    {
      const f = { ...filters, propertyType: "" };
      const r = sortResults(applyFilters(properties, f), sort);
      relaxedStages.push({
        label: "Try without Property Type",
        href: buildSearchHref(sp, { propertyType: "", relax: "1" }),
        results: r,
      });
    }

    // Stage 3: keep state, drop purpose + type (broad)
    {
      const f = { ...filters, purpose: "", propertyType: "", area: "" };
      const r = sortResults(applyFilters(properties, f), sort);
      relaxedStages.push({
        label: "Broaden results in this State",
        href: buildSearchHref(sp, { purpose: "", propertyType: "", area: "", relax: "1" }),
        results: r,
      });
    }

    if (relaxMode) {
      // choose first stage with results
      const firstWithResults = relaxedStages.find((x) => x.results.length > 0);
      if (firstWithResults) results = firstWithResults.results;
    }
  }

  const chips = chipsFromFilters(filters);
  const summary = chips.length ? chips.join(" • ") : "All listings";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{summary}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {results.length} result(s)
            </span>

            <Link
              href="/search"
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
            >
              Back to Home
            </Link>

            {strict.length === 0 && (
              <Link
                href={buildSearchHref(sp, { relax: relaxMode ? "" : "1" })}
                className="rounded-full bg-[var(--color-primary-dark)] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
              >
                {relaxMode ? "Use strict filters" : "Relax filters"}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-muted)]">Sort:</span>
          <div className="flex gap-2">
            <Link
              href={buildSearchHref(sp, { sort: "newest" })}
              className={`rounded-xl border px-3 py-2 text-sm ${
                sort === "newest"
                  ? "border-[var(--color-primary-dark)] text-[var(--color-primary-dark)]"
                  : "border-[var(--color-border)] text-gray-700 hover:bg-gray-50"
              }`}
            >
              Newest
            </Link>
            <Link
              href={buildSearchHref(sp, { sort: "price_low" })}
              className={`rounded-xl border px-3 py-2 text-sm ${
                sort === "price_low"
                  ? "border-[var(--color-primary-dark)] text-[var(--color-primary-dark)]"
                  : "border-[var(--color-border)] text-gray-700 hover:bg-gray-50"
              }`}
            >
              Price Low
            </Link>
            <Link
              href={buildSearchHref(sp, { sort: "price_high" })}
              className={`rounded-xl border px-3 py-2 text-sm ${
                sort === "price_high"
                  ? "border-[var(--color-primary-dark)] text-[var(--color-primary-dark)]"
                  : "border-[var(--color-border)] text-gray-700 hover:bg-gray-50"
              }`}
            >
              Price High
            </Link>
          </div>
        </div>
      </div>

      {/* If strict = 0, show “no exact matches” + suggestions */}
      {strict.length === 0 && (
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="font-semibold text-[var(--color-text-main)]">
            No exact matches found.
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            This is normal on real property sites. Try relaxing one filter.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {relaxedStages.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <p className="font-medium text-[var(--color-text-main)]">
              No results found.
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Try changing your filters (state, area, price range, beds/baths).
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}