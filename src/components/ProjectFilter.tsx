"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectRole } from "@/content/projects/types";
import { ProjectCard } from "./ProjectCard";

const ROLES: ProjectRole[] = ["Backend", "Frontend", "Infra", "PM"];

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectRole | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.roles.includes(active))),
    [projects, active]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2 font-mono text-xs uppercase" role="group" aria-label="역할로 필터링">
        {(["All", ...ROLES] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setActive(role)}
            aria-pressed={active === role}
            className={`border px-3 py-1.5 tracking-wide transition-colors ${
              active === role
                ? "border-ink bg-surface-2 text-ink"
                : "border-border text-ink-muted hover:border-metal hover:text-ink"
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i + 1} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-ink-muted">해당 역할의 프로젝트가 아직 없습니다.</p>
      )}
    </div>
  );
}
