import type { Project, ProjectStatus, StatusKind } from "./types";
import { dirvana } from "./dirvana";
import { promptplace } from "./promptplace";
import { wilson } from "./wilson";
import { nexo } from "./nexo";
import { walkingCity } from "./walking-city";
import { dongday } from "./dongday";

/** 대표 프로젝트가 먼저, 그 뒤로 상세 페이지가 있는 그 외 프로젝트. 이 순서가 "다음 프로젝트" 순서다. */
export const allProjects: Project[] = [dirvana, promptplace, wilson, nexo, walkingCity, dongday];

export const featuredProjects: Project[] = allProjects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

/** 대표 프로젝트의 "01" 같은 번호. 대표가 아니면 null. */
export function featuredNumber(project: Project): string | null {
  const i = featuredProjects.indexOf(project);
  return i < 0 ? null : String(i + 1).padStart(2, "0");
}

export function nextProject(project: Project): Project {
  const i = allProjects.indexOf(project);
  return allProjects[(i + 1) % allProjects.length];
}

const STATUS_KIND: Record<ProjectStatus, StatusKind> = {
  "운영 중": "active",
  "운영 종료": "ended",
  "개발 중": "building",
  "설계 단계": "building",
  "개발 완료 · 검증 전": "building",
  "구현 완료 · 측정 전": "building",
};

export function statusKind(status: ProjectStatus): StatusKind {
  return STATUS_KIND[status];
}

export type { Project, Decision, ProjectStatus, StatusKind, Thread } from "./types";
