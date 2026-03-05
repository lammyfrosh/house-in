import Image from "next/image";
import { notFound } from "next/navigation";
import { properties } from "@/lib/properties";
import { formatNaira } from "@/lib/money";

export const dynamicParams = false;

// ✅ Tell Next which slugs exist (important for production stability)
export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

// ✅ Optional: nice SEO per property (safe)
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const p = properties.find((x) => x.slug === params.slug);
  if (!p) return { title: "Property not found | House-In" };

  return {
    title: `${p.title} | House-In`,
    description: `${p.title} in ${p.area}, ${p.city}, ${p.state}.`,
  };
}

export default function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = properties.find((x) => x.slug === params.slug);
  if (!p) return notFound();

  const badge =
    p.purpose === "rent" ? "For Rent" : p.purpose === "sale" ? "For Sale" : "Shortlet";

  const locationText = `${p.area}, ${p.city}, ${p.state}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={p.imageUrl}
              alt={`${p.title} - ${locationText}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
                {p.title}
              </h1>
              <p className="mt-2 text-sm text-gray-600">{locationText}</p>
            </div>

            <span className="shrink-0 self-start inline-flex h-8 min-w-[92px] items-center justify-center rounded-full bg-[var(--color-primary-dark)] px-3 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-sm">
              {badge}
            </span>
          </div>

          <p className="mt-4 text-2xl font-extrabold text-[var(--color-text-main)]">
            {formatNaira(p.price)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Bedrooms
              </p>
              <p className="mt-1 text-lg font-semibold">{p.bedrooms}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Bathrooms
              </p>
              <p className="mt-1 text-lg font-semibold">{p.bathrooms}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Type
              </p>
              <p className="mt-1 text-lg font-semibold capitalize">
                {p.propertyType}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Listed
              </p>
              <p className="mt-1 text-lg font-semibold">{p.listedAtText}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <p className="text-sm text-gray-700">
              This is a demo listing for the client review phase. In the next
              version, the agent/owner details, verified badge, inspections, and
              media approval flow will be connected to the real database.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
                Request Inspection
              </button>
              <button className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold hover:bg-gray-50">
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}