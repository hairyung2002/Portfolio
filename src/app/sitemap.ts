import type { MetadataRoute } from "next";
import { allProjects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/projects`, priority: 0.8 },
    { url: `${siteUrl}/about`, priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = allProjects.flatMap((project) => [
    { url: `${siteUrl}/projects/${project.slug}`, priority: 0.7 },
    ...project.decisions.map((_, i) => ({
      url: `${siteUrl}/projects/${project.slug}/decisions/${i + 1}`,
      priority: 0.5,
    })),
  ]);

  return [...staticRoutes, ...projectRoutes];
}
