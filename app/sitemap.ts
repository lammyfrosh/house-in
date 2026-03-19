import type { MetadataRoute } from "next";
import { getApprovedProperties } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://house-in.online";

  let properties: Array<{
    slug?: string;
    updated_at?: string;
    created_at?: string;
  }> = [];

  try {
    properties = await getApprovedProperties();
  } catch (error) {
    console.error("Sitemap property fetch failed:", error);
  }

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
}