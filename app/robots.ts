import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/signin",
          "/register",
          "/add-property",
          "/api/",
        ],
      },
    ],
    sitemap: "https://house-in.online/sitemap.xml",
    host: "https://house-in.online",
  };
}