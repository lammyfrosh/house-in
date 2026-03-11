"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bath,
  BedDouble,
  MapPin,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatNaira } from "@/lib/money";

type MapProperty = {
  id: string;
  slug: string;
  title: string;
  purpose: "rent" | "sale" | "shortlet";
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  state: string;
  area: string;
  city: string;
  imageUrl: string;
  listedAtText: string;
  lat: number;
  lng: number;
};

type SearchSummary = {
  state: string;
  area: string;
  purpose: string;
  propertyType: string;
  beds: string;
  baths: string;
  minPrice: number;
  maxPrice: number;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToSelected({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 12, { duration: 1.2 });
  }, [lat, lng, map]);

  return null;
}

function purposeLabel(value: string) {
  if (value === "rent") return "For Rent";
  if (value === "sale") return "For Sale";
  if (value === "shortlet") return "Shortlet";
  return value;
}

export default function SearchResultsMapClient({
  results,
  defaultCenter,
  searchSummary,
}: {
  results: MapProperty[];
  defaultCenter: { lat: number; lng: number };
  searchSummary: SearchSummary;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    results[0]?.id ?? null
  );

  const selectedProperty = useMemo(
    () => results.find((p) => p.id === selectedId) ?? results[0] ?? null,
    [results, selectedId]
  );

  useEffect(() => {
    if (results.length > 0 && !selectedId) {
      setSelectedId(results[0].id);
    }
  }, [results, selectedId]);

  const chips = [
    searchSummary.purpose ? purposeLabel(searchSummary.purpose) : "",
    searchSummary.state || "",
    searchSummary.area ? `Area: ${searchSummary.area}` : "",
    searchSummary.propertyType ? `Type: ${searchSummary.propertyType}` : "",
    searchSummary.beds ? `${searchSummary.beds}+ Beds` : "",
    searchSummary.baths ? `${searchSummary.baths}+ Baths` : "",
    searchSummary.minPrice ? `Min ${formatNaira(searchSummary.minPrice)}` : "",
    searchSummary.maxPrice ? `Max ${formatNaira(searchSummary.maxPrice)}` : "",
  ].filter(Boolean);

  return (
    <main className="h-[calc(100vh-72px)] overflow-hidden bg-[#fafafa]">
      <div className="grid h-full lg:grid-cols-[1.15fr_0.95fr]">
        <section className="relative hidden h-full border-r border-[var(--color-border)] bg-white lg:block">
          <div className="absolute left-4 top-4 z-[500] rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
              Search Map View
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text-main)]">
              {results.length} listing{results.length === 1 ? "" : "s"} found
            </p>
          </div>

          <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={11}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              {...({
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              } as any)}
            />

            {selectedProperty && (
              <FlyToSelected lat={selectedProperty.lat} lng={selectedProperty.lng} />
            )}

            {results.map((property) => (
              <Marker
                key={property.id}
                position={[property.lat, property.lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setSelectedId(property.id),
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="font-semibold">{property.title}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {property.area}, {property.city}, {property.state}
                    </p>
                    <p className="mt-2 font-bold">{formatNaira(property.price)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>

        <section className="flex h-full flex-col">
          <div className="border-b border-[var(--color-border)] bg-white px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
                  Property Search
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[var(--color-text-main)]">
                  Results for Your Search
                </h1>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Hover a property card to highlight its approximate location on the map.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-main)] hover:bg-gray-50"
                >
                  Back Home
                </Link>
                <Link
                  href="/search"
                  className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Clear Filters
                </Link>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <SlidersHorizontal size={14} />
                Active Filters
              </span>

              {chips.length === 0 ? (
                <span className="rounded-full bg-[var(--color-primary)]/20 px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
                  No filters applied
                </span>
              ) : (
                chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-[var(--color-primary)]/20 px-3 py-1 text-xs font-semibold text-[var(--color-primary-dark)]"
                  >
                    {chip}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)]">
                  <SearchX size={24} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[var(--color-text-main)]">
                  No properties found
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
                  Try broadening your search area, changing the property type, or
                  adjusting the price range.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((property) => {
                  const active = property.id === selectedProperty?.id;
                  const badge =
                    property.purpose === "rent"
                      ? "For Rent"
                      : property.purpose === "sale"
                      ? "For Sale"
                      : "Shortlet";

                  return (
                    <Link
                      key={property.id}
                      href={`/property/${encodeURIComponent(property.slug)}`}
                      onMouseEnter={() => setSelectedId(property.id)}
                      className={`block overflow-hidden rounded-2xl border bg-white transition duration-300 hover:shadow-lg ${
                        active
                          ? "border-[var(--color-primary-dark)] shadow-md"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      <div className="grid md:grid-cols-[240px_1fr]">
                        <div className="relative min-h-[210px] overflow-hidden">
                          <Image
                            src={property.imageUrl}
                            alt={property.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-2xl font-bold text-[var(--color-text-main)]">
                                {formatNaira(property.price)}
                              </p>
                              <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[var(--color-text-main)]">
                                {property.title}
                              </h3>
                              <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <MapPin size={16} />
                                {property.area}, {property.city}, {property.state}
                              </p>
                            </div>

                            <span className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--color-primary-dark)] px-4 text-xs font-extrabold uppercase tracking-widest text-white">
                              {badge}
                            </span>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-700">
                            <span className="inline-flex items-center gap-2">
                              <BedDouble size={16} />
                              {property.bedrooms} bed
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Bath size={16} />
                              {property.bathrooms} bath
                            </span>
                            <span className="text-xs text-gray-500">
                              {property.listedAtText}
                            </span>
                          </div>

                          <div className="mt-5 flex items-center justify-between">
                            <p className="text-sm text-[var(--color-primary-dark)]">
                              {active ? "Highlighted on map" : "Hover to show on map"}
                            </p>

                            <span className="text-sm font-semibold text-[var(--color-primary-dark)]">
                              View Property →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}