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
  const featured = [
    ...properties.filter((p) => p.purpose === "rent").slice(0, 2),
    ...properties.filter((p) => p.purpose === "sale").slice(0, 2),
    ...properties.filter((p) => p.purpose === "shortlet").slice(0, 2),
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative h-[82vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src="/hero-v2.jpg"
          alt="Organised residential estate view"
          fill
          priority
          className="object-cover"
        />

        {/* FIXED OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 z-[1]" />
        <div className="absolute inset-0 bg-[var(--color-primary-dark)]/20 z-[1]" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-4">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
              <ShieldCheck size={14} />
              SEARCH BY STATE & AREA • RENT • SALE • SHORTLET
            </p>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white drop-shadow-sm md:text-5xl">
              Find Property the Smarter Way in Nigeria
            </h1>

            <p className="mt-4 max-w-2xl text-base text-white/90 drop-shadow md:text-lg">
              Discover houses, apartments, land, and shortlet listings across
              selected states in Nigeria — with a platform designed to make your
              search easier, faster, and more reliable.
            </p>
          </div>

          {/* SEARCH BOX */}
          <div className="mt-8 rounded-3xl bg-white p-4 shadow-xl md:p-5">
            <form action="/search" className="grid gap-3 md:grid-cols-12">
              <select
                name="state"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-3"
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <input
                name="area"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-4"
                placeholder="Area (e.g. Jakande, Lekki)"
              />

              <select
                name="purpose"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-2"
              >
                <option value="">Purpose</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="shortlet">Shortlet</option>
              </select>

              <select
                name="propertyType"
                className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-2"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="duplex">Duplex</option>
                <option value="terrace">Terrace</option>
                <option value="bungalow">Bungalow</option>
                <option value="land">Land</option>
              </select>

              <button className="h-11 rounded-xl bg-[var(--color-primary-dark)] text-white md:col-span-1">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
          Featured Properties
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}