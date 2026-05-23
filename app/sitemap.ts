import type { MetadataRoute } from "next";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://myofficialdomain.com/warranty";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/admin", "/admin/products", "/dashboard", "/login", "/register"];

  return routes.map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));
}
