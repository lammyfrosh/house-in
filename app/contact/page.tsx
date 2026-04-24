export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
          Contact
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[var(--color-text-main)]">
          Get in Touch
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] md:text-base">
          For listing enquiries, support, partnership discussions, or feedback,
          please reach out through any of the channels below.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] p-5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
              Email
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
              contact@house-in.online
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] p-5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
              Phone
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
              +23408075990912, +2348088769717
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] p-5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
              Office Hours
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
              Mon – Sat, 9:00am – 6:00pm
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] p-5">
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
              Response Time
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text-main)]">
              Usually within 24 hours
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}