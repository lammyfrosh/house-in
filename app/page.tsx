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

export default function Home() {
  // ✅ Balanced featured like a real site: 2 rent + 2 sale + 2 shortlet
  const featured = [
    ...properties.filter((p) => p.purpose === "rent").slice(0, 2),
    ...properties.filter((p) => p.purpose === "sale").slice(0, 2),
    ...properties.filter((p) => p.purpose === "shortlet").slice(0, 2),
  ];

  return (
    <main>
      <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="/hero-v2.jpg"
          alt="Organised residential estate view"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-[var(--color-primary)]/35" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              Search by State & Area • Rent • Sale • Shortlet
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white drop-shadow-sm md:text-5xl">
              Find Properties Across Nigeria
            </h1>

            <p className="mt-3 max-w-2xl text-base text-white/90 drop-shadow md:text-lg">
              Explore organised estates, apartments, duplexes and land listings.
            </p>
          </div>

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

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
            Featured Properties
          </h2>

          <Link
            href="/search"
            className="text-sm text-[var(--color-primary-dark)] hover:underline"
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
    </main>
  );
}