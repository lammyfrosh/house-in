export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary-dark)]">
          Safety Tips
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[var(--color-text-main)]">
          Stay Safe While Searching for Properties
        </h1>

        <p className="mt-3 text-sm text-[var(--color-text-muted)] md:text-base">
          We encourage all users to take proper precautions before making any
          financial commitment on a property.
        </p>

        <div className="mt-8 space-y-4">
          {[
            "Always inspect a property physically before making payment.",
            "Confirm ownership documents and relevant approvals where necessary.",
            "Avoid paying cash without a written agreement or proper receipt.",
            "Verify the identity of agents, landlords, or property representatives.",
            "Be cautious of deals that seem too good to be true.",
            "Report suspicious listings or misleading information immediately.",
          ].map((tip, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--color-border)] p-5"
            >
              <p className="text-sm font-medium text-[var(--color-text-main)] md:text-base">
                {index + 1}. {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}