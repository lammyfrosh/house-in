import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPropertySlugs, getPropertyBySlug } from "@/lib/properties";

export const dynamicParams = true;

// ✅ Next needs this to know valid slugs (helps production)
export function generateStaticParams() {
  return getAllPropertySlugs();
}

export default function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = getPropertyBySlug(params.slug);

  if (!property) {
    return notFound();
  }

  const badge =
    property.purpose === "rent"
      ? "FOR RENT"
      : property.purpose === "sale"
      ? "FOR SALE"
      : "SHORTLET";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
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

        {/* Details */}
        <div>
          <span className="inline-block rounded-full bg-[var(--color-primary-dark)] px-4 py-1 text-xs font-bold text-white">
            {badge}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-main)]">
            {property.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {property.area}, {property.city}, {property.state}
          </p>

          <p className="mt-4 text-2xl font-bold text-[var(--color-text-main)]">
            ₦{property.price.toLocaleString()}
          </p>

          <div className="mt-6 flex gap-6 text-sm text-gray-600">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Listed {property.listedAtText}
          </p>
        </div>
      </div>
    </main>
  );
}