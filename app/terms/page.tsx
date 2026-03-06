export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
          Terms & Conditions
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[var(--color-text-main)]">
          Terms of Use
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
          <p>
            By using House-In, you agree to use the platform lawfully and in a
            manner that does not misrepresent property information or mislead
            other users.
          </p>

          <p>
            House-In serves as a digital property listing platform and does not
            directly own, sell, rent, or guarantee the properties displayed on
            the website unless expressly stated otherwise.
          </p>

          <p>
            Users are responsible for independently verifying all listing
            details, pricing, documents, and the authenticity of any party they
            transact with.
          </p>

          <p>
            We reserve the right to remove listings, restrict access, or suspend
            accounts that violate platform rules or engage in suspicious
            activity.
          </p>
        </div>
      </div>
    </main>
  );
}