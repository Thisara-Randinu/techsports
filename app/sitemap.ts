import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/app-url";

const appUrl = getAppUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/admin", "/admin/products", "/dashboard", "/login", "/register"];

  return routes.map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
