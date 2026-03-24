import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Building2,
  House,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { getApprovedProperties, Property } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

const STATES = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Edo",
  "Delta",
  "Anambra",
  "Enugu",
  "Imo",
  "Abia",
];

const stateLinks = [
  { name: "Lagos", href: "/search?state=Lagos", icon: MapPin },
  { name: "Abuja", href: "/search?state=Abuja", icon: Building2 },
  { name: "Rivers", href: "/search?state=Rivers", icon: House },
  { name: "Edo", href: "/search?state=Edo", icon: MapPin },
  { name: "Delta", href: "/search?state=Delta", icon: Building2 },
  { name: "Enugu", href: "/search?state=Enugu", icon: House },
];

const trustItems = [
  {
    title: "Easy Search Experience",
    text: "Clear filters, focused navigation, and better listing discovery make searching feel easier and faster.",
    icon: Search,
  },
  {
    title: "Professional Presentation",
    text: "Listings are displayed in a cleaner and more organised way that helps users feel more confident.",
    icon: BadgeCheck,
  },
  {
    title: "Built for Growth",
    text: "House-In is designed to grow into a stronger property ecosystem for agents, landlords, and users.",
    icon: ShieldCheck,
  },
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let properties: Property[] = [];

  try {
    properties = await getApprovedProperties();
  } catch (error) {
    console.error("Homepage properties fetch failed:", error);
    properties = [];
  }

  const featured = [
    ...properties.filter((p) => p.purpose === "rent").slice(0, 2),
    ...properties.filter((p) => p.purpose === "sale").slice(0, 2),
    ...properties.filter((p) => p.purpose === "shortlet").slice(0, 2),
  ].slice(0, 6);

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-[920px] overflow-hidden md:min-h-[980px]">
        <Image
          src="/hero-v2.jpg"
          alt="Organised residential estate view"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-[var(--color-primary-dark)]/28" />

        <div className="relative z-10 mx-auto flex min-h-[920px] max-w-6xl flex-col px-4 pt-24 md:min-h-[980px] md:pt-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur-md">
              <ShieldCheck size={14} />
              SEARCH BY STATE & AREA • RENT • SALE • SHORTLET
            </p>

            <h1 className="mt-6 max-w-[900px] text-4xl font-semibold leading-tight text-white drop-shadow-sm md:text-7xl md:leading-[1.04]">
              Find Property the Smarter Way in Nigeria
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 drop-shadow md:text-xl">
              Discover houses, apartments, land, and shortlet listings across
              selected states in Nigeria — with a platform designed to make your
              search easier, faster, and more reliable.
            </p>
          </div>
        </div>

        {/* HERO CARDS FULLY INSIDE HERO */}
        <div className="absolute inset-x-0 bottom-12 z-20 md:bottom-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-[30px] border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-md md:p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/search?purpose=sale"
                  className="group cursor-pointer rounded-3xl bg-[var(--color-primary-dark)] px-6 py-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-white/15 p-3 text-white">
                    <Building2 size={22} />
                  </div>
                  <p className="text-2xl font-bold text-white">For Sale</p>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Explore curated sale listings across prime locations.
                  </p>
                </Link>

                <Link
                  href="/search?purpose=rent"
                  className="group cursor-pointer rounded-3xl bg-[var(--color-primary-dark)] px-6 py-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-white/15 p-3 text-white">
                    <House size={22} />
                  </div>
                  <p className="text-2xl font-bold text-white">For Rent</p>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Discover rental properties with better clarity and faster
                    access.
                  </p>
                </Link>

                <Link
                  href="/search?purpose=shortlet"
                  className="group cursor-pointer rounded-3xl bg-[var(--color-primary-dark)] px-6 py-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-white/15 p-3 text-white">
                    <BadgeCheck size={22} />
                  </div>
                  <p className="text-2xl font-bold text-white">Shortlet</p>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    Find flexible short-stay options for comfort and
                    convenience.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="bg-[#eef2f5] py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[#f7f8fa] p-4 shadow-sm md:p-6">
            <form action="/search" className="grid gap-3 md:grid-cols-12">
              <select
                name="state"
                className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-3"
                defaultValue=""
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <input
                name="area"
                className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-4"
                placeholder="Area / LGA (e.g. Lekki, Ikeja, Wuse)"
              />

              <select
                name="purpose"
                className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-2"
                defaultValue=""
              >
                <option value="">Purpose</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="shortlet">Shortlet</option>
              </select>

              <select
                name="propertyType"
                className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-2"
                defaultValue=""
              >
                <option value="">Property Type</option>
                <option value="Apartment">Flat / Apartment</option>
                <option value="Duplex">Duplex</option>
                <option value="Terrace">Terrace</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Land">Land</option>
              </select>

              <button
                type="submit"
                className="h-12 rounded-xl bg-[var(--color-primary-dark)] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md md:col-span-1"
              >
                Search
              </button>

              <div className="grid gap-3 md:col-span-12 md:grid-cols-12">
                <select
                  name="beds"
                  className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-2"
                  defaultValue=""
                >
                  <option value="">Beds</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>

                <select
                  name="baths"
                  className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-2"
                  defaultValue=""
                >
                  <option value="">Baths</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>

                <select
                  name="minPrice"
                  className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-4"
                  defaultValue=""
                >
                  <option value="">Min Price</option>
                  <option value="500000">₦500k</option>
                  <option value="1000000">₦1m</option>
                  <option value="2000000">₦2m</option>
                  <option value="5000000">₦5m</option>
                  <option value="10000000">₦10m</option>
                  <option value="50000000">₦50m</option>
                  <option value="100000000">₦100m</option>
                </select>

                <select
                  name="maxPrice"
                  className="h-12 rounded-xl border border-[var(--color-border)] bg-white px-3 transition outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 md:col-span-4"
                  defaultValue=""
                >
                  <option value="">Max Price</option>
                  <option value="1000000">₦1m</option>
                  <option value="2000000">₦2m</option>
                  <option value="5000000">₦5m</option>
                  <option value="10000000">₦10m</option>
                  <option value="50000000">₦50m</option>
                  <option value="100000000">₦100m</option>
                  <option value="500000000">₦500m</option>
                </select>
              </div>

              <div className="md:col-span-12">
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span className="font-medium text-[var(--color-text-main)]">
                    Popular:
                  </span>
                  <Link
                    href="/search?state=Lagos&area=Lekki&purpose=rent"
                    className="transition hover:text-[var(--color-primary-dark)] hover:underline"
                  >
                    Lekki (Rent)
                  </Link>
                  <Link
                    href="/search?state=Abuja&area=Wuse&purpose=sale"
                    className="transition hover:text-[var(--color-primary-dark)] hover:underline"
                  >
                    Abuja (Sale)
                  </Link>
                  <Link
                    href="/search?state=Lagos&area=Victoria%20Island&purpose=shortlet"
                    className="transition hover:text-[var(--color-primary-dark)] hover:underline"
                  >
                    VI (Shortlet)
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              A handpicked mix of sale, rent, and shortlet listings across key
              locations.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-dark)] transition hover:underline"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-[var(--color-text-main)]">
              Featured listings are temporarily unavailable
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              The website is still live. Property data will appear here once the
              backend connection responds successfully.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* BROWSE BY STATE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Browse by State
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Explore property opportunities in some of Nigeria’s most active
              locations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stateLinks.map((state) => {
              const Icon = state.icon;
              return (
                <Link
                  key={state.name}
                  href={state.href}
                  className="group rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--color-text-main)]">
                        {state.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        View listings in {state.name}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-primary)]/30 p-2 text-[var(--color-primary-dark)]">
                      <Icon size={18} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-[var(--color-primary)]/20">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
                About House-In
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[var(--color-text-main)]">
                A More Trustworthy Way to Search for Property
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
                <p>
                  House-In was built with one clear goal: to make property
                  search in Nigeria feel easier, clearer, and more dependable.
                </p>

                <p>
                  Whether someone is searching for a home to rent, a property to
                  buy, a shortlet for convenience, or land for opportunity,
                  House-In is designed to help them move from interest to
                  decision with more confidence.
                </p>

                <p>
                  We believe a good property platform should do more than just
                  display listings — it should inspire trust, save time, and
                  make people feel they are in the right place from the very
                  first click.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
                Our Promise
              </p>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <div className="mt-1 rounded-xl bg-[var(--color-primary)]/30 p-2 text-[var(--color-primary-dark)]">
                    <Search size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                      Clarity
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Search tools and property information presented in a way
                      people can understand quickly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 rounded-xl bg-[var(--color-primary)]/30 p-2 text-[var(--color-primary-dark)]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                      Confidence
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      A platform experience that feels organised, intentional,
                      and trustworthy.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 rounded-xl bg-[var(--color-primary)]/30 p-2 text-[var(--color-primary-dark)]">
                    <BadgeCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                      Convenience
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      From search to enquiry, every step is being designed to
                      feel smoother and smarter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PEOPLE WILL LOVE IT */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Why People Will Love Using House-In
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Built to feel simple, attractive, and useful from the very first
              visit.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-[var(--color-primary)]/30 p-3 text-[var(--color-primary-dark)]">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}