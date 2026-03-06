import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { formatNaira } from "@/lib/money";

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

  const badge =
    property.purpose === "rent"
      ? "FOR RENT"
      : property.purpose === "sale"
      ? "FOR SALE"
      : "SHORTLET";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/search"
          className="text-sm font-medium text-[var(--color-primary-dark)] hover:underline"
        >
          ← Back to Listings
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
        {/* Left side */}
        <section>
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

          {/* mini gallery placeholders */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                unoptimized
                className="object-cover opacity-90"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                unoptimized
                className="object-cover opacity-80"
              />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--color-primary-dark)] px-4 text-xs font-extrabold uppercase tracking-widest text-white">
                  {badge}
                </span>

                <h1 className="mt-4 text-3xl font-bold text-[var(--color-text-main)]">
                  {property.title}
                </h1>

                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {property.area}, {property.city}, {property.state}
                </p>
              </div>

              <div className="text-left lg:text-right">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Price
                </p>
                <p className="mt-1 text-3xl font-bold text-[var(--color-text-main)]">
                  {formatNaira(property.price)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Bedrooms
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text-main)]">
                  {property.bedrooms}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Bathrooms
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text-main)]">
                  {property.bathrooms}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Type
                </p>
                <p className="mt-2 text-xl font-semibold capitalize text-[var(--color-text-main)]">
                  {property.propertyType}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Listed
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text-main)]">
                  {property.listedAtText}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Property Description
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
              <p>
                This {property.propertyType} listing is located in{" "}
                <span className="font-semibold text-[var(--color-text-main)]">
                  {property.area}, {property.city}
                </span>
                , {property.state}. It is presented as a {property.purpose} listing
                and currently displayed as part of the live platform preview.
              </p>

              <p>
                The property comes with {property.bedrooms} bedroom
                {property.bedrooms === 1 ? "" : "s"} and {property.bathrooms} bathroom
                {property.bathrooms === 1 ? "" : "s"}, making it suitable for users
                looking for comfort, accessibility, and a clean residential environment.
              </p>

              <p>
                More detailed property descriptions, media galleries, inspection
                scheduling, and verified ownership details will be fully connected
                during the backend integration phase.
              </p>
            </div>
          </div>
        </section>

        {/* Right side */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Contact Agent
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Reach out directly for inspection, negotiation, or more property details.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href="tel:+2348000000000"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--color-primary-dark)] text-sm font-semibold text-white hover:opacity-90"
              >
                Call Agent
              </a>

              <a
                href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                  `Hello, I am interested in this property: ${property.title}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-full items-center justify-center rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
              >
                WhatsApp Agent
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Request Inspection
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Fill this quick request and the agent can follow up.
            </p>

            <form className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="080..."
                  className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                  Preferred Date
                </label>
                <input
                  type="date"
                  className="mt-2 h-11 w-full rounded-xl border border-[var(--color-border)] px-3 outline-none focus:border-[var(--color-primary-dark)]"
                />
              </div>

              <button
                type="button"
                className="h-11 w-full rounded-xl bg-[var(--color-primary-dark)] text-sm font-semibold text-white hover:opacity-90"
              >
                Submit Request
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">
              Safety Reminder
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">
              <li>• Inspect the property physically before payment.</li>
              <li>• Verify property documents and ownership details.</li>
              <li>• Avoid suspiciously cheap offers without due diligence.</li>
              <li>• Keep records of payments and communication.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}