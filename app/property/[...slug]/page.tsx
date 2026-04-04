import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  MapPin,
  BadgeDollarSign,
  Car,
  Ruler,
  Toilet,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  getApprovedProperties,
  getApprovedPropertyBySlug,
} from "@/lib/api";
import PropertyGallery from "@/components/PropertyGallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getPurposeBadge(purpose: string) {
  if (purpose === "rent") return "FOR RENT";
  if (purpose === "sale") return "FOR SALE";
  return "SHORTLET";
}

function isPriceOnRequest(property: { price_on_request?: number | boolean }) {
  return (
    property.price_on_request === true ||
    property.price_on_request === 1 ||
    String(property.price_on_request).toLowerCase() === "true"
  );
}

function sanitizeWhatsAppNumber(phone?: string | null) {
  if (!phone) return null;

  const cleaned = String(phone).replace(/[^\d+]/g, "").trim();
  if (!cleaned) return null;

  if (cleaned.startsWith("+")) {
    return cleaned.slice(1);
  }

  if (cleaned.startsWith("0")) {
    return `234${cleaned.slice(1)}`;
  }

  return cleaned;
}

function sanitizeTelNumber(phone?: string | null) {
  if (!phone) return null;

  const cleaned = String(phone).replace(/[^\d+]/g, "").trim();
  if (!cleaned) return null;

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `+234${cleaned.slice(1)}`;
  }

  return `+${cleaned}`;
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;

  if (!rawSlug) notFound();

  const property = await getApprovedPropertyBySlug(rawSlug);

  if (!property) notFound();

  const allProperties = await getApprovedProperties();

  const similar = allProperties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.state?.toLowerCase() === property.state?.toLowerCase() &&
        p.purpose?.toLowerCase() === property.purpose?.toLowerCase()
    )
    .slice(0, 3);

  const badge = getPurposeBadge(property.purpose);
  const showCallForPrice = isPriceOnRequest(property);

  const galleryImages =
    property.gallery_images && property.gallery_images.length > 0
      ? property.gallery_images
      : [property.image_url || "/placeholder-property.jpg"];

  const whatsappNumber = sanitizeWhatsAppNumber(property.contact_phone);
  const telNumber = sanitizeTelNumber(property.contact_phone);

  const whatsappMessage = showCallForPrice
    ? `Hello, I am interested in this property: ${property.title} in ${property.area}, ${property.city}, ${property.state}. Please share the price and more details.`
    : `Hello, I am interested in this property: ${property.title} in ${property.area}, ${property.city}, ${property.state}. Please share more details.`;

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : null;

  return (
    <main className="bg-[#f7f9fc]">
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-[var(--color-primary-dark)] px-4 py-1 text-xs font-bold text-white">
                {badge}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-main)] sm:text-4xl xl:text-5xl">
                {property.title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <MapPin size={16} />
                {property.area}, {property.city}, {property.state}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-[var(--color-primary)]/10 px-5 py-4 text-left lg:min-w-[220px]">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
                Price
              </p>
              <p className="mt-2 text-3xl font-bold text-[var(--color-text-main)]">
                {showCallForPrice
                  ? "Call for Price"
                  : `₦${Number(property.price || 0).toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 xl:grid-cols-[1.75fr_0.95fr_1.05fr]">
        <div>
          <PropertyGallery title={property.title} images={galleryImages} />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
              <BadgeDollarSign size={14} />
              Property Details
            </p>

            <div className="mt-6 grid gap-4 text-sm text-gray-700">
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

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Property Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--color-text-muted)]">
              {property.description ||
                "No description available for this property yet."}
            </p>
          </div>

          {property.video_url && (
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
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

        <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            Contact Agent
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Interested in this property? Reach out directly to the person who posted it.
          </p>

          {property.contact_phone ? (
            <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-[var(--color-text-main)]">
              <span className="font-semibold">Phone:</span> {property.contact_phone}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              This property does not have a contact phone number yet.
            </div>
          )}

          <div className="mt-6 space-y-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={16} />
                Contact via WhatsApp
              </a>
            )}

            {telNumber && (
              <a
                href={`tel:${telNumber}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
              >
                <Phone size={16} />
                {showCallForPrice ? "Call for Price" : "Call Agent"}
              </a>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
            Safety Tip: Always inspect properties physically before making any
            payment.
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
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
            {similar.map((p) => {
              const similarIsCallForPrice = isPriceOnRequest(p);

              return (
                <Link
                  key={p.id}
                  href={`/property/${p.slug}`}
                  className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-56 w-full">
                    <img
                      src={p.image_url || "/placeholder-property.jpg"}
                      alt={p.title}
                      className="h-full w-full object-cover"
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
                      {similarIsCallForPrice
                        ? "Call for Price"
                        : `₦${Number(p.price || 0).toLocaleString()}`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}