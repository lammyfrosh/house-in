import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/api";
import { formatNaira } from "@/lib/money";

type PropertyWithDates = Property & {
  created_at?: string;
  createdAt?: string;
};

function isNewListing(p: PropertyWithDates) {
  const rawDate = p.created_at || p.createdAt;
  if (!rawDate) return false;

  const createdTime = new Date(rawDate).getTime();
  if (Number.isNaN(createdTime)) return false;

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - createdTime <= sevenDaysMs;
}

export default function PropertyCard({ p }: { p: PropertyWithDates }) {
  const badge =
    p.purpose === "rent"
      ? "For Rent"
      : p.purpose === "sale"
      ? "For Sale"
      : "Shortlet";

  const imageSrc = p.image_url || p.imageUrl || "/placeholder-property.jpg";
  const listedText = p.listedAtText || "Live listing";
  const showNewBadge = isNewListing(p);

  return (
    <Link
      href={`/property/${encodeURIComponent(p.slug)}`}
      className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${p.title} in ${p.area}, ${p.city}`}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {showNewBadge && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
            New
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-semibold">{formatNaira(p.price)}</p>
            <p className="mt-1 line-clamp-1 font-medium">{p.title}</p>
            <p className="mt-1 text-sm text-gray-600">
              {p.area}, {p.city}, {p.state}
            </p>
          </div>

          <span
            className="
              inline-flex h-8 min-w-[92px] shrink-0 items-center justify-center
              self-start rounded-full bg-[var(--color-primary-dark)] px-3
              text-[11px] font-extrabold uppercase tracking-widest text-white shadow-sm
            "
          >
            {badge}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
          <p>
            {p.bedrooms} bed • {p.bathrooms} bath
          </p>
          <p className="text-xs text-gray-500">{listedText}</p>
        </div>
      </div>
    </Link>
  );
}