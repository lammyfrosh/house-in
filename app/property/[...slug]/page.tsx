import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  MapPin,
  BadgeDollarSign,
  Mail,
  Car,
  Ruler,
  Toilet,
  MessageCircle,
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

const ADMIN_WHATSAPP_NUMBER = "2348075990912";
const CONTACT_EMAIL = "contact@house-in.online";

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

  const galleryImages =
    property.gallery_images && property.gallery_images.length > 0
      ? property.gallery_images
      : [property.image_url || "/placeholder-property.jpg"];

  const whatsappMessage = `Hello, I am interested in this property: ${property.title} in ${property.area}, ${property.city}, ${property.state}. Please share more details.`;
  const whatsappHref = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const emailSubject = `Inquiry about ${property.title}`;
  const emailBody = `Hello,

I am interested in this property:

Title: ${property.title}
Location: ${property.area}, ${property.city}, ${property.state}
Price: ₦${Number(property.price || 0).toLocaleString()}

Please share more details.

Thank you.`;

  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <main className="bg-[#f7f9fc]">
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-[var(--color-primary-dark)] px-4 py-1 text-xs font-bold text-white">
                {badge}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-main)] sm:text-4xl">
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
                ₦{Number(property.price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <PropertyGallery
              title={property.title}
              images={galleryImages}
            />

            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  <BadgeDollarSign size={14} />
                  Property Details
                </p>

                <div className="mt-6 grid gap-4 text-sm text-gray-700 sm:grid-cols-2 xl:grid-cols-1">
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
        </div>

        <aside className="h-fit rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">
            Contact Agent
          </h2>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Interested in this property? Reach out directly through WhatsApp or email.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <MessageCircle size={16} />
              Contact via WhatsApp
            </a>

            <a
              href={mailHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] transition hover:bg-gray-50"
            >
              <Mail size={16} />
              Send Email
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
              href="/search"
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
                className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-56 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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