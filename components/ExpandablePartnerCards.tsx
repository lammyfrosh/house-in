"use client";

import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ExternalLink,
  Newspaper,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { IndustryUpdate } from "@/lib/api";

function formatDate(value?: string) {
  if (!value) return "Recent update";

  try {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Recent update";
  }
}

function getFallbackImage(category: "builder" | "legal") {
  return category === "builder"
    ? "/hero-v2.jpg"
    : "/placeholder-property.jpg";
}

function UpdatePreviewCard({ update }: { update: IndustryUpdate }) {
  const imageUrl = update.image_url || getFallbackImage(update.category);

  return (
    <a
      href={update.source_url}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#f8fafc]">
        <img
          src={imageUrl}
          alt={update.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-primary-dark)] shadow-sm">
          {update.category === "builder" ? "Builder Update" : "Legal Insight"}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
          <span>{formatDate(update.created_at)}</span>

          {update.source_name ? (
            <span className="line-clamp-1 font-medium">
              {update.source_name}
            </span>
          ) : null}
        </div>

        <h3 className="line-clamp-2 text-base font-bold leading-6 text-[var(--color-text-main)] transition group-hover:text-[var(--color-primary-dark)]">
          {update.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {update.description ||
            "Read this useful property industry update from the original source."}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-dark)]">
          Read article
          <ExternalLink size={15} />
        </div>
      </div>
    </a>
  );
}

export default function ExpandablePartnerCards({
  builderUpdates,
  legalUpdates,
}: {
  builderUpdates: IndustryUpdate[];
  legalUpdates: IndustryUpdate[];
}) {
  const [openBuilders, setOpenBuilders] = useState(false);
  const [openLegal, setOpenLegal] = useState(false);

  const cards = [
    {
      key: "builders" as const,
      title: "Builder Updates",
      subtitle:
        "Useful building, construction, and development updates from trusted online sources.",
      icon: Building2,
      items: builderUpdates.slice(0, 3),
      isOpen: openBuilders,
      onToggle: () => setOpenBuilders((prev) => !prev),
      emptyText: "No builder updates available right now.",
    },
    {
      key: "legal" as const,
      title: "Legal Property Insights",
      subtitle:
        "Helpful legal updates around property documents, due diligence, and land verification.",
      icon: Scale,
      items: legalUpdates.slice(0, 3),
      isOpen: openLegal,
      onToggle: () => setOpenLegal((prev) => !prev),
      emptyText: "No legal property updates available right now.",
    },
  ];

  return (
    <section className="bg-[linear-gradient(180deg,#f8fbfb_0%,#eef5f4_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 rounded-[32px] border border-[var(--color-border)] bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[var(--color-primary)]/20 p-3 text-[var(--color-primary-dark)]">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--color-primary-dark)]">
                House-In Updates
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-main)] md:text-3xl">
                Industry Updates & Trusted Insights
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
                Explore useful property, building, and legal updates curated to
                help users make better property decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.key}
                className="overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-white shadow-sm transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={card.onToggle}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-[#f8fafc]"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="rounded-2xl bg-[var(--color-primary)]/20 p-3 text-[var(--color-primary-dark)]">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-2xl font-semibold text-[var(--color-text-main)]">
                        {card.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-2xl border border-[var(--color-border)] bg-white p-2 text-[var(--color-text-main)] transition-transform duration-300 ${
                      card.isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    card.isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-[var(--color-border)] px-6 pb-6 pt-5">
                      {card.items.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[#f8fafc] p-6 text-sm text-[var(--color-text-muted)]">
                          <div className="mb-3 inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary-dark)] shadow-sm">
                            <Newspaper size={18} />
                          </div>

                          <p>{card.emptyText}</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {card.items.map((update) => (
                            <UpdatePreviewCard
                              key={update.id}
                              update={update}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}