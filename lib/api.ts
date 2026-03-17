const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

export type Property = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  parking_spaces?: number;
  size?: string;
  state: string;
  area: string;
  city: string;
  description: string;
  image_url?: string;
  video_url?: string;
  featured?: number | boolean;
  status?: "pending" | "approved" | "rejected";
  created_by_name?: string;

  // compatibility helpers for old UI pieces
  imageUrl?: string;
  propertyType?: string;
  listedAtText?: string;
};

function normalizeProperty(property: Property): Property {
  return {
    ...property,
    imageUrl: property.image_url || "/placeholder-property.jpg",
    propertyType: property.property_type,
    listedAtText: "Live listing",
  };
}

export async function getApprovedProperties(): Promise<Property[]> {
  const res = await fetch(`${API_BASE_URL}/api/properties`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch properties");
  }

  return (data.properties || []).map(normalizeProperty);
}

export async function getApprovedPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const res = await fetch(
    `${API_BASE_URL}/api/properties/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch property");
  }

  return data.property ? normalizeProperty(data.property) : null;
}