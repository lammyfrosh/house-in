import Link from "next/link";
import { getApprovedProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShortletPage() {
  const properties = await getApprovedProperties();

  const shortletProps = properties.filter((p) => p.purpose === "shortlet");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
            Property Collection
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
            Shortlet
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Find flexible short-stay property options in trusted locations.
          </p>
        </div>

        <Link
          href="/search?purpose=shortlet"
          className="inline-flex items-center rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Open Search View
        </Link>
      </div>

      {shortletProps.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-[var(--color-text-main)]">
            No shortlet properties yet
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Approved shortlet listings will appear here once available.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shortletProps.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}