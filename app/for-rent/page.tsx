import PropertyCard from "../../components/PropertyCard";
import { properties } from "../../lib/properties";

export default function ForRentPage() {
  const rentProps = properties.filter((p) => p.purpose === "rent");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Properties for Rent</h1>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rentProps.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}