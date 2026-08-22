import type { Project, ProjectRole } from "./types";
import { dirvana } from "./dirvana";
import { promptplace } from "./promptplace";
import { walkingCity } from "./walking-city";
import { wilson } from "./wilson";
import { edgemesh } from "./edgemesh";
import { dongday } from "./dongday";

export const allProjects: Project[] = [dirvana, wilson, promptplace, edgemesh, walkingCity, dongday];

export const featuredProjects: Project[] = allProjects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getAllRoles(): ProjectRole[] {
  return ["Backend", "Frontend", "Infra", "PM"];
}

export type { Project, ProjectDecision, ProjectStatus, ProjectRole, OutcomeItem } from "./types";
