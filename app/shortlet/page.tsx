import PropertyCard from "../../components/PropertyCard";
import { properties } from "../../lib/properties";

export default function ShortletPage() {
  const shortletProps = properties.filter((p) => p.purpose === "shortlet");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Shortlet Apartments</h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse serviced apartments and short-stay listings.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shortletProps.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>

      {shortletProps.length === 0 && (
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <p className="font-medium text-[var(--color-text-main)]">
            No shortlet listings yet.
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Add a shortlet property to see it here.
          </p>
        </div>
      )}
    </main>
  );
}