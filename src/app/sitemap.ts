import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/my-list`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
