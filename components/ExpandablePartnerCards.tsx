"use client";

import { useState } from "react";
import { Building2, ChevronDown, Scale, ShieldCheck } from "lucide-react";

type PartnerItem = {
  id: number;
  name: string;
  logo_url: string;
  website?: string | null;
};

export default function ExpandablePartnerCards({
  builders,
  legalProviders,
}: {
  builders: PartnerItem[];
  legalProviders: PartnerItem[];
}) {
  const [openBuilders, setOpenBuilders] = useState(false);
  const [openLegal, setOpenLegal] = useState(false);

  const cards = [
    {
      key: "builders" as const,
      title: "Builders",
      subtitle: "Trusted builder brands featured on House-In.",
      icon: Building2,
      items: builders,
      isOpen: openBuilders,
      onToggle: () => setOpenBuilders((prev) => !prev),
    },
    {
      key: "legal" as const,
      title: "Legal Service Providers",
      subtitle:
        "Recognised legal service providers available within the House-In ecosystem.",
      icon: Scale,
      items: legalProviders,
      isOpen: openLegal,
      onToggle: () => setOpenLegal((prev) => !prev),
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
                House-In Network
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-main)] md:text-3xl">
                Explore trusted professionals in the ecosystem
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
                Explore verified builders and legal partners within the House-In network.
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
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
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
                          No items available right now.
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {card.items.map((item) => {
                            const content = (
                              <div className="group flex h-full flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md">
                                <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-[#f8fafc] p-4">
                                  <img
                                    src={item.logo_url}
                                    alt={item.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>

                                <p className="mt-4 text-sm font-semibold text-[var(--color-text-main)]">
                                  {item.name}
                                </p>
                              </div>
                            );

                            return item.website ? (
                              <a
                                key={item.id}
                                href={item.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {content}
                              </a>
                            ) : (
                              <div key={item.id}>{content}</div>
                            );
                          })}
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