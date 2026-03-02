import type { MetadataRoute } from "next";
import { SITE_URL, OPENALEX_BASE_URL, OPENALEX_MAILTO } from "@/lib/config";

// Fetch top professors for sitemap
async function getTopProfessors(): Promise<string[]> {
  try {
    const url = new URL(`${OPENALEX_BASE_URL}/authors`);
    url.searchParams.set("mailto", OPENALEX_MAILTO);
    url.searchParams.set("filter", "works_count:>100,cited_by_count:>5000");
    url.searchParams.set("sort", "cited_by_count:desc");
    url.searchParams.set("per_page", "200");
    url.searchParams.set("select", "id");

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map((a: { id: string }) =>
      a.id.replace("https://openalex.org/", "")
    );
  } catch {
    return [];
  }
}

const POPULAR_TOPICS = [
  "Machine Learning",
  "Artificial Intelligence",
  "Climate Change",
  "Quantum Computing",
  "Computational Neuroscience",
  "Gene Therapy",
  "Renewable Energy",
  "Robotics",
  "Data Science",
  "Natural Language Processing",
  "Computer Vision",
  "Bioinformatics",
  "Cybersecurity",
  "Blockchain",
  "Materials Science",
  "Drug Discovery",
  "Astrophysics",
  "Behavioral Economics",
  "Cancer Research",
  "Immunology",
  "Nanotechnology",
  "Deep Learning",
  "Human Computer Interaction",
  "Cognitive Science",
  "Sustainability",
  "Genetics",
  "Organic Chemistry",
  "Neuroscience",
  "Epidemiology",
  "Environmental Science",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const professorIds = await getTopProfessors();

  const staticPages: MetadataRoute.Sitemap = [
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
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
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
  ];

  const professorPages: MetadataRoute.Sitemap = professorIds.map((id) => ({
    url: `${SITE_URL}/professor/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const topicPages: MetadataRoute.Sitemap = POPULAR_TOPICS.map((topic) => ({
    url: `${SITE_URL}/search?q=${encodeURIComponent(topic)}&type=topic`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...topicPages, ...professorPages];
}
