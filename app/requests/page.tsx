import Link from "next/link";

type Request = {
  id: string;
  title: string;
  state: string;
  area: string;
  purpose: "rent" | "sale" | "shortlet";
  type: string;
  beds: string;
  budget: string;
  posted: string;
};

const requests: Request[] = [
  {
    id: "r1",
    title: "Looking for 2 Bedroom Apartment",
    state: "Lagos",
    area: "Lekki",
    purpose: "rent",
    type: "Flat / Apartment",
    beds: "2+",
    budget: "₦2,500,000 – ₦4,000,000 / year",
    posted: "Posted today",
  },
  {
    id: "r2",
    title: "Need 3 Bedroom Duplex in a Gated Estate",
    state: "Lagos",
    area: "Ajah",
    purpose: "sale",
    type: "Duplex",
    beds: "3+",
    budget: "₦70,000,000 – ₦120,000,000",
    posted: "Posted 2 days ago",
  },
  {
    id: "r3",
    title: "Shortlet Studio or 1 Bedroom",
    state: "Abuja",
    area: "Wuse / Garki",
    purpose: "shortlet",
    type: "Apartment",
    beds: "1+",
    budget: "₦30,000 – ₦70,000 / night",
    posted: "Posted this week",
  },
];

function badgeText(purpose: Request["purpose"]) {
  if (purpose === "rent") return "FOR RENT";
  if (purpose === "sale") return "FOR SALE";
  return "SHORTLET";
}

export default function RequestsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
            Property Requests
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            See what people are requesting. Agents and landlords can respond.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/requests/new"
            className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-xs font-extrabold tracking-widest uppercase text-white hover:opacity-90"
          >
            Post a Request
          </Link>

          <Link
            href="/search"
            className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-extrabold tracking-widest uppercase text-[var(--color-text-main)] hover:bg-gray-50"
          >
            Browse Listings
          </Link>
        </div>
      </div>

      {/* Filter bar (UI only for now) */}
      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 md:grid-cols-12">
        <select className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-3 default:text-gray-500">
          <option value="">STATE</option>
          <option>Lagos</option>
          <option>Abuja</option>
          <option>Rivers</option>
          <option>Edo</option>
          <option>Delta</option>
          <option>Anambra</option>
          <option>Enugu</option>
          <option>Imo</option>
          <option>Abia</option>
        </select>

        <input
          className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-4"
          placeholder="AREA / LGA (e.g. Lekki)"
        />

        <select className="h-11 rounded-xl border border-[var(--color-border)] px-3 md:col-span-3 default:text-gray-500">
          <option value="">PURPOSE</option>
          <option>For Rent</option>
          <option>For Sale</option>
          <option>Shortlet</option>
        </select>

        <button className="h-11 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-extrabold tracking-widest uppercase text-[var(--color-text-main)] hover:opacity-90 md:col-span-2">
          Filter
        </button>
      </div>

      {/* Requests list */}
      <div className="mt-6 grid gap-4">
        {requests.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-5 hover:shadow-sm transition"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-extrabold tracking-widest text-gray-700">
                    {badgeText(r.purpose)}
                  </span>
                  <span className="text-xs text-gray-500">{r.posted}</span>
                </div>

                <h2 className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
                  {r.title}
                </h2>

                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {r.area}, {r.state} • {r.type} • {r.beds} beds
                </p>

                <p className="mt-2 text-sm font-semibold text-[var(--color-text-main)]">
                  Budget: <span className="font-medium">{r.budget}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-extrabold tracking-widest uppercase text-[var(--color-text-main)] hover:bg-gray-50">
                  View
                </button>

                <button className="rounded-xl bg-[var(--color-primary-dark)] px-4 py-2 text-xs font-extrabold tracking-widest uppercase text-white hover:opacity-90">
                  Respond
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text-main)]">
            Note:
          </span>{" "}
          This requests page is currently UI-first (demo-ready). Next step is to
          connect it to the database so users can post real requests and receive
          responses.
        </p>
      </div>
    </main>
  );
}