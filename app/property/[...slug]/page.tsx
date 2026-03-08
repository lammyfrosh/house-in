import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  MapPin,
  BadgeDollarSign,
  Phone,
  Mail,
} from "lucide-react";

import { getPropertyBySlug, properties } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const rawSlug = Array.isArray(slug) ? slug.join("/") : "";
  const property = getPropertyBySlug(rawSlug);

  if (!property) {
    return notFound();
  }

  const similar = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.state === property.state &&
        p.purpose === property.purpose
    )
    .slice(0, 3);

  const badge =
    property.purpose === "rent"
      ? "FOR RENT"
      : property.purpose === "sale"
      ? "FOR SALE"
      : "SHORTLET";

  return (
    <main className="bg-[#fcfcfc]">
      {/* Hero image */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          unoptimized
          priority
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute bottom-6 left-1/2 w-full max-w-6xl -translate-x-1/2 px-4 text-white">
          <span className="rounded-full bg-[var(--color-primary-dark)] px-4 py-1 text-xs font-bold">
            {badge}
          </span>

          <h1 className="mt-3 text-3xl font-bold">{property.title}</h1>

          <p className="mt-1 flex items-center gap-2 text-sm text-white/90">
            <MapPin size={16} />
            {property.area}, {property.city}, {property.state}
          </p>
        </div>
      </section>

      {/* Main section */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
        {/* Left content */}
        <div>
          {/* Price */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
              <BadgeDollarSign size={14} />
              Price
            </p>

            <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              ₦{property.price.toLocaleString()}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-700">
              <span className="flex items-center gap-2">
                <BedDouble size={18} />
                {property.bedrooms} Bedrooms
              </span>

              <span className="flex items-center gap-2">
                <Bath size={18} />
                {property.bathrooms} Bathrooms
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Property Description
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              This property is located in a well organised area within{" "}
              {property.city}, offering convenient access to major roads,
              essential services, and everyday amenities. It is designed to
              provide a comfortable living experience with well planned spaces
              and a functional layout suitable for modern lifestyles.
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              Whether you are looking for a new home, an investment opportunity,
              or a flexible stay option, this listing represents a practical and
              appealing choice in today’s property market.
            </p>
          </div>
        </div>

        {/* Contact card */}
        <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            Contact Agent
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Interested in this property? Contact the listing agent for more
            details or to schedule an inspection.
          </p>

          <div className="mt-6 space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
              <Phone size={16} />
              Call Agent
            </button>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50">
              <Mail size={16} />
              Send Message
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
            Safety Tip: Always inspect properties physically before making any
            payment.
          </div>
        </aside>
      </section>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
              Similar Properties
            </h2>

            <Link
              href="/search"
              className="text-sm text-[var(--color-primary-dark)] hover:underline"
            >
              View more
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}