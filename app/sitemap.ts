import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";
import { RESOURCES } from "@/data/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PUBLIC_ROUTES, ...RESOURCES.map((resource) => `/resources/${resource.id}`)].map((route) => ({
    url: route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`,
  }));
}
