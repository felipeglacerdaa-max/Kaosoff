import type { MetadataRoute } from "next";
import { getProducts, getDrops } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kaosoff.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, drops] = await Promise.all([getProducts(), getDrops()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/produtos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/drops`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/encomendas`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/sobre`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contato`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/politicas`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/produtos/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const dropPages: MetadataRoute.Sitemap = drops.map((d) => ({
    url: `${BASE_URL}/drops/${d.slug}`,
    lastModified: d.launchDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...dropPages];
}
