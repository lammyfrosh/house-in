import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { formatNaira } from "@/lib/money";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PropertyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const rawSlug = Array.isArray(sp.slug) ? sp.slug[0] : sp.slug;

  if (!rawSlug) return notFound();

  const property = getPropertyBySlug(rawSlug);

  if (!property) return notFound();

  const badge =
    property.purpose === "rent"
      ? "FOR RENT"
      : property.purpose === "sale"
      ? "FOR SALE"
      : "SHORTLET";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>

        <div>
          <span className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--color-primary-dark)] px-4 text-xs font-extrabold uppercase tracking-widest text-white">
            {badge}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-main)]">
            {property.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {property.area}, {property.city}, {property.state}
          </p>

          <p className="mt-4 text-2xl font-bold text-[var(--color-text-main)]">
            {formatNaira(property.price)}
          </p>

          <div className="mt-6 flex gap-6 text-sm text-gray-600">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Listed {property.listedAtText}
          </p>

          <div className="mt-6">
            <Link
              href="/search"
              className="inline-flex rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Back to Listings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}