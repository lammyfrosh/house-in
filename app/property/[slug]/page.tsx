import Image from "next/image";
import Link from "next/link";
import { properties } from "@/lib/properties";

export const dynamic = "force-dynamic";

function norm(input: string) {
  try {
    return decodeURIComponent(input).trim().toLowerCase();
  } catch {
    return input.trim().toLowerCase();
  }
}

export default function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const wanted = norm(params.slug);

  const property = properties.find((p) => norm(p.slug) === wanted);

  // ✅ TEMP: Do NOT 404 — show debug so we know what Vercel is seeing
  if (!property) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-extrabold text-[var(--color-text-main)]">
          Property not found
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Requested slug:{" "}
          <span className="font-semibold text-black">{params.slug}</span>
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Normalized slug:{" "}
          <span className="font-semibold text-black">{wanted}</span>
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-sm font-semibold text-[var(--color-text-main)]">
            Slugs available in this deployment ({properties.length}):
          </p>

          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            {properties.slice(0, 30).map((p) => (
              <li key={p.id}>
                <Link className="text-[var(--color-primary-dark)] underline" href={`/property/${p.slug}`}>
                  {p.slug}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-gray-500">
            If this list is empty or missing expected slugs, then Vercel is deploying an older file.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[var(--color-primary-dark)] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
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