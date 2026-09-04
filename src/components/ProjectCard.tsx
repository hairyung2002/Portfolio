import Link from "next/link";
import type { Project } from "@/content/projects/types";
import { StatusBadge } from "./StatusBadge";
import { RoleTag } from "./RoleTag";

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="corner-marks group relative flex flex-col gap-4 overflow-hidden border border-border bg-surface p-6 transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-metal hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6),0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-ink/[0.08] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sheen motion-reduce:hidden"
      />

      <div className="flex items-center justify-between">
        {index !== undefined && (
          <span className="font-mono text-[11px] text-ink-muted">{String(index).padStart(2, "0")}</span>
        )}
        <StatusBadge status={project.status} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink">
          {project.name}
          <span className="ml-1.5 inline-block -translate-x-1 text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.oneLiner}</p>
      </div>
      {/* Headline outcome metric slot — wired after the content pass:
          {project.outcome.find((o) => o.verified)?.label} */}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
        <div className="flex flex-wrap gap-1.5">
          {project.roles.map((role) => (
            <RoleTag key={role} label={role} />
          ))}
        </div>
        <span className="ml-auto text-[11px] text-ink-muted">{project.period}</span>
      </div>
    </Link>
  );
}
