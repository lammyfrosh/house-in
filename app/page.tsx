import Image from "next/image";
import Link from "next/link";
import { properties } from "../lib/properties";
import PropertyCard from "../components/PropertyCard";

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
  { name: "Lagos", href: "/search?state=Lagos" },
  { name: "Abuja", href: "/search?state=Abuja" },
  { name: "Rivers", href: "/search?state=Rivers" },
  { name: "Edo", href: "/search?state=Edo" },
  { name: "Delta", href: "/search?state=Delta" },
  { name: "Enugu", href: "/search?state=Enugu" },
];

export default function Home() {
  const featured = [
    ...properties.filter((p) => p.purpose === "rent").slice(0, 2),
    ...properties.filter((p) => p.purpose === "sale").slice(0, 2),
    ...properties.filter((p) => p.purpose === "shortlet").slice(0, 2),
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="/hero-v2.jpg"
          alt="Organised residential estate view"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-[var(--color-primary)]/30" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              SEARCH BY STATE & AREA • RENT • SALE • SHORTLET
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white drop-shadow-sm md:text-5xl">
              Find Property the Smarter Way in Nigeria
            </h1>

            <p className="mt-3 max-w-2xl text-base text-white/90 drop-shadow md:text-lg">
              Discover houses, apartments, land, and shortlet listings across
              selected states in Nigeria — with a platform designed to make your
              search easier, faster, and more reliable.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-7 rounded-2xl bg-white p-4 shadow-md md:p-5">
            <form action="/search" className="grid gap-3 md:grid-cols-12">
              <select
                name="state"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-3"
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
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-4"
                placeholder="Area / LGA (e.g. Lekki, Ikeja, Wuse)"
              />

              <select
                name="purpose"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-2"
                defaultValue="rent"
              >
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="shortlet">Shortlet</option>
              </select>

              <select
                name="propertyType"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-2"
                defaultValue=""
              >
                <option value="">Property Type</option>
                <option value="apartment">Flat / Apartment</option>
                <option value="duplex">Duplex</option>
                <option value="terrace">Terrace</option>
                <option value="bungalow">Bungalow</option>
                <option value="land">Land</option>
              </select>

              <button
                type="submit"
                className="h-11 rounded-xl bg-[var(--color-primary-dark)] font-semibold text-white hover:opacity-90 md:col-span-1"
              >
                Search
              </button>

              <div className="grid gap-3 md:col-span-12 md:grid-cols-12">
                <select
                  name="beds"
                  className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-2"
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
                  className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-2"
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
                  className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-4"
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
                  className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-4"
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
                    className="hover:underline"
                  >
                    Lekki (Rent)
                  </Link>
                  <Link
                    href="/search?state=Abuja&area=Wuse&purpose=sale"
                    className="hover:underline"
                  >
                    Abuja (Sale)
                  </Link>
                  <Link
                    href="/search?state=Lagos&area=Victoria%20Island&purpose=shortlet"
                    className="hover:underline"
                  >
                    VI (Shortlet)
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              A handpicked mix of sale, rent, and shortlet listings across key locations.
            </p>
          </div>

          <Link
            href="/search"
            className="text-sm font-medium text-[var(--color-primary-dark)] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* BROWSE BY STATE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Browse by State
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Explore property opportunities in some of Nigeria’s most active locations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stateLinks.map((state) => (
              <Link
                key={state.name}
                href={state.href}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-primary)] hover:shadow-sm"
              >
                <p className="text-lg font-semibold text-[var(--color-text-main)]">
                  {state.name}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  View listings in {state.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
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
                  House-In was built with one clear goal: to make property search
                  in Nigeria feel easier, clearer, and more dependable. Instead
                  of overwhelming users with clutter, confusion, or inconsistent
                  information, we aim to present listings in a way that feels
                  simple, organised, and worth trusting.
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

            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
                Our Promise
              </p>

              <div className="mt-5 space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                    Clarity
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Search tools and property information presented in a way people can understand quickly.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                    Confidence
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    A platform experience that feels organised, intentional, and trustworthy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                    Convenience
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    From search to enquiry, every step is being designed to feel smoother and smarter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Why People Will Love Using House-In
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Built to feel simple, attractive, and useful from the very first visit.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                Easy Search Experience
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Clear filters, straightforward navigation, and focused property
                discovery make the platform easy to use for both first-time and
                experienced users.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                Professional Presentation
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                The layout, property cards, and information flow are designed to
                give users confidence and make listings feel valuable.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
                Built for Growth
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                House-In is being structured not just for today’s listings, but
                for a stronger property ecosystem as more agents, landlords, and
                users come onboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}