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
  Car,
  Ruler,
  Toilet,
} from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Property = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  parking_spaces?: number;
  size?: string;
  state: string;
  area: string;
  city: string;
  description: string;
  image_url?: string;
  video_url?: string;
  featured?: number | boolean;
  status?: "pending" | "approved" | "rejected";
  created_by_name?: string;
};

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

function getPurposeBadge(purpose: string) {
  if (purpose === "rent") return "FOR RENT";
  if (purpose === "sale") return "FOR SALE";
  return "SHORTLET";
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];
  const rawSlug = Array.isArray(slugParts) ? slugParts.join("/") : slugParts;

  if (!rawSlug) {
    notFound();
  }

  let property: Property | null = null;
  let similar: Property[] = [];

  try {
    const propertyRes = await fetch(
      `${API}/api/properties/slug/${encodeURIComponent(rawSlug)}`,
      {
        cache: "no-store",
      }
    );

    if (!propertyRes.ok) {
      notFound();
    }

    const propertyData = await propertyRes.json();
    property = propertyData.property || propertyData;

    if (!property) {
      notFound();
    }

    const allRes = await fetch(`${API}/api/properties`, {
      cache: "no-store",
    });

    if (allRes.ok) {
      const allData = await allRes.json();
      const allProperties: Property[] = allData.properties || allData || [];

      similar = allProperties
        .filter(
          (p) =>
            p.id !== property!.id &&
            p.status === "approved" &&
            p.state?.toLowerCase() === property!.state?.toLowerCase() &&
            p.purpose?.toLowerCase() === property!.purpose?.toLowerCase()
        )
        .slice(0, 3);
    }
  } catch (error) {
    console.error("Property page error:", error);
    notFound();
  }

  if (!property) {
    notFound();
  }

  const badge = getPurposeBadge(property.purpose);

  return (
    <main className="bg-[#fcfcfc]">
      <section className="relative h-[420px] w-full overflow-hidden">
        <Image
          src={property.image_url || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover"
          unoptimized
          priority
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-6 left-1/2 w-full max-w-6xl -translate-x-1/2 px-4 text-white">
          <span className="rounded-full bg-[var(--color-primary-dark)] px-4 py-1 text-xs font-bold">
            {badge}
          </span>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {property.title}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
            <MapPin size={16} />
            {property.area}, {property.city}, {property.state}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
              <BadgeDollarSign size={14} />
              Price
            </p>

            <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
              ₦{Number(property.price || 0).toLocaleString()}
            </p>

            <div className="mt-6 grid gap-4 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
              <span className="flex items-center gap-2">
                <BedDouble size={18} />
                {property.bedrooms ?? 0} Bedrooms
              </span>

              <span className="flex items-center gap-2">
                <Bath size={18} />
                {property.bathrooms ?? 0} Bathrooms
              </span>

              <span className="flex items-center gap-2">
                <Toilet size={18} />
                {property.toilets ?? 0} Toilets
              </span>

              <span className="flex items-center gap-2">
                <Car size={18} />
                {property.parking_spaces ?? 0} Parking Spaces
              </span>

              <span className="flex items-center gap-2">
                <Ruler size={18} />
                {property.size || "N/A"}
              </span>

              <span className="flex items-center gap-2">
                <BadgeDollarSign size={18} />
                {property.property_type}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Property Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--color-text-muted)]">
              {property.description || "No description available for this property yet."}
            </p>
          </div>

          {property.video_url && (
            <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-lg font-bold text-[var(--color-text-main)]">
                Property Video
              </h2>

              <video
                controls
                className="mt-4 w-full rounded-2xl border border-[var(--color-border)] bg-black"
              >
                <source src={property.video_url} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            Contact Agent
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Interested in this property? Contact the listing agent for more
            details or to schedule an inspection.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="tel:+2340000000000"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <Phone size={16} />
              Call Agent
            </a>

            <a
              href={`mailto:info@house-in.online?subject=${encodeURIComponent(
                `Inquiry about ${property.title}`
              )}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
            >
              <Mail size={16} />
              Send Message
            </a>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
            Safety Tip: Always inspect properties physically before making any
            payment.
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
              Similar Properties
            </h2>

            <Link
              href="/properties"
              className="text-sm text-[var(--color-primary-dark)] hover:underline"
            >
              View more
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <Link
                key={p.id}
                href={`/property/${p.slug}`}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={p.image_url || "/placeholder-property.jpg"}
                    alt={p.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-dark)]">
                    {getPurposeBadge(p.purpose)}
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[var(--color-text-main)]">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {p.area}, {p.city}, {p.state}
                  </p>

                  <p className="mt-3 text-base font-bold text-[var(--color-text-main)]">
                    ₦{Number(p.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}