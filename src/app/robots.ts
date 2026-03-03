import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/changelog", "/demo"],
        disallow: ["/professor/", "/search"],
      },
    ],
    sitemap: "https://only-research.xyz/sitemap.xml",
  };
}
