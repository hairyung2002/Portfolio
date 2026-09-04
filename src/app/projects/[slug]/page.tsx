import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allProjects, getProjectBySlug } from "@/content/projects";
import { StatusBadge } from "@/components/StatusBadge";
import { RoleTag } from "@/components/RoleTag";
import { Section } from "@/components/Section";
import { ProseText } from "@/components/ProseText";
import { DecisionLog } from "@/components/DecisionLog";
import { OutcomeList } from "@/components/OutcomeList";
import { ScanLine } from "@/components/ScanLine";

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.oneLiner,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const idx = allProjects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden border-b border-border bg-surface/40">
        <ScanLine key={slug} />
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-14 sm:py-16">
          <Link href="/projects" className="w-fit font-mono text-xs text-ink-muted transition-colors hover:text-ink">
            ← All Projects
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-[12px] text-ink-muted">{project.period}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance text-ink sm:text-4xl">{project.name}</h1>
            <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-muted">{project.oneLiner}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] leading-relaxed text-ink-muted">
            <span>{project.myRole}</span>
            {project.teamSize && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.teamSize}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {project.roles.map((role) => (
              <RoleTag key={role} label={role} />
            ))}
            {project.links?.map((link) => {
              const isLive = /live/i.test(link.label);
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    isLive
                      ? "flex items-center gap-1.5 border border-accent/50 bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent transition-colors hover:border-accent"
                      : "border border-metal-dim px-1.5 py-0.5 font-mono text-[11px] text-metal transition-colors hover:border-ink hover:text-ink"
                  }
                >
                  {isLive && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                  )}
                  {link.label} ↗
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rail-x mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 py-14 sm:py-16">
        <Section title="Problem" index={1} first>
          <ProseText text={project.problem} />
        </Section>

        <Section title="Decisions" index={2}>
          <DecisionLog decisions={project.decisions} />
        </Section>

        <Section title="Implementation" index={3}>
          <ProseText text={project.implementation} />
        </Section>

        <Section title="Outcome" index={4}>
          <OutcomeList items={project.outcome} />
        </Section>

        <Section title="Reflection" index={5}>
          <ProseText text={project.reflection} />
        </Section>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto grid max-w-3xl grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <Link
            href={prev ? `/projects/${prev.slug}` : "/projects"}
            className="group flex flex-col gap-1 px-6 py-8 transition-colors hover:bg-surface"
          >
            <span className="font-mono text-[11px] text-ink-muted uppercase">← Prev</span>
            <span className="text-ink transition-colors group-hover:underline">{prev ? prev.name : "전체 프로젝트"}</span>
          </Link>
          <Link
            href={next ? `/projects/${next.slug}` : "/projects"}
            className="group flex flex-col gap-1 px-6 py-8 text-right transition-colors hover:bg-surface"
          >
            <span className="font-mono text-[11px] text-ink-muted uppercase">Next →</span>
            <span className="text-ink transition-colors group-hover:underline">{next ? next.name : "전체 프로젝트"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
