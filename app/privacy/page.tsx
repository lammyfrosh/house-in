export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
          Privacy Policy
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[var(--color-text-main)]">
          Your Privacy Matters
        </h1>

        <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
          <p>
            House-In respects your privacy and is committed to protecting any
            personal information you share with us through the website.
          </p>

          <p>
            We may collect details such as your name, email address, phone
            number, and activity on the platform for account registration,
            enquiries, support, and platform improvement.
          </p>

          <p>
            We do not sell your personal information to third parties. However,
            certain information may be used to improve our services, resolve
            disputes, or comply with applicable legal obligations.
          </p>

          <p>
            By using this platform, you acknowledge and agree to the collection
            and responsible use of your information in line with this policy.
          </p>
        </div>
      </div>
    </main>
  );
}