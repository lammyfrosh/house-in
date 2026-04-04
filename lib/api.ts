const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

export type Property = {
  id: number;
  title: string;
  slug: string;
  purpose: string;
  property_type: string;
  price: number;
  price_on_request?: number | boolean;
  bedrooms: number;
  bathrooms: number;
  toilets?: number;
  parking_spaces?: number;
  size?: string;
  state: string;
  area: string;
  city: string;
  description: string;
  contact_phone?: string | null;
  image_url?: string;
  video_url?: string;
  featured?: number | boolean;
  status?: "pending" | "approved" | "rejected";
  created_by_name?: string;
  gallery_images?: string[];
  created_at?: string;

  imageUrl?: string;
  propertyType?: string;
  listedAtText?: string;
};

export type PartnerItem = {
  id: number;
  name: string;
  logo_url: string;
  website?: string | null;
  created_at?: string;
};

function normalizeProperty(property: Property): Property {
  const gallery =
    property.gallery_images && property.gallery_images.length > 0
      ? property.gallery_images
      : property.image_url
      ? [property.image_url]
      : ["/placeholder-property.jpg"];

  return {
    ...property,
    gallery_images: gallery,
    imageUrl: property.image_url || gallery[0] || "/placeholder-property.jpg",
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

export async function getBuilders(): Promise<PartnerItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/partners/builders`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch builders");
  }

  return data.builders || [];
}

export async function getLegalProviders(): Promise<PartnerItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/partners/legal-providers`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch legal providers");
  }

  return data.legalProviders || [];
}