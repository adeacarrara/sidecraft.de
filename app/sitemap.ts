import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Les pages légales sont exclues tant qu'elles ne sont pas complétées (noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
