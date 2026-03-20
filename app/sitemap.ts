import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

type PropertyItem = {
  slug?: string;
  updated_at?: string;
  created_at?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://house-in.online";
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.house-in.online";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/for-sale`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-rent`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shortlet`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const res = await fetch(`${apiBase}/api/properties`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return staticPages;
    }

    const data = await res.json();

    const properties: PropertyItem[] = Array.isArray(data?.properties)
      ? data.properties
      : [];

    const propertyPages: MetadataRoute.Sitemap = properties
      .filter((property) => property.slug)
      .map((property) => ({
        url: `${baseUrl}/property/${property.slug}`,
        lastModified: property.updated_at
          ? new Date(property.updated_at)
          : property.created_at
          ? new Date(property.created_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));

    return [...staticPages, ...propertyPages];
  } catch (error) {
    console.error("Sitemap property fetch failed:", error);
    return staticPages;
  }
}