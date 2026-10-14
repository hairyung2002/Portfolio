import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProjects, featuredNumber, featuredProjects, getProjectBySlug, nextProject } from "@/content/projects";
import { DepthScene } from "@/components/DepthScene";
import { DecisionList } from "@/components/DecisionList";
import { Emph, plain } from "@/components/Emph";
import { OutcomeList } from "@/components/OutcomeList";
import { PageNav } from "@/components/PageNav";
import { ProseText } from "@/components/ProseText";
import { SectionHeading } from "@/components/SectionHeading";
import { StatusBadge } from "@/components/StatusBadge";
import { ThreadList } from "@/components/ThreadList";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${plain(project.insight)} ${project.line}`,
  };
}

/*
 * 상세 순서 (HANDOFF §16):
 * 한 줄 결론 → 역할·기간·상태 → 배경 → 결과 → 핵심 판단 → 구현 → 회고 → 이어진 것
 * 구현·회고는 상세 구성이 확정될 때까지 기존 내용을 그대로 남겨 둔다.
 */
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const no = featuredNumber(project);
  const next = nextProject(project);
  const hasOutcome = project.outcome.length > 0 || !!project.pending;

  return (
    <section className="layer" aria-label="프로젝트">
      <DepthScene>
        <p className="eyebrow" data-in>
          {no ? `PROJECT ${no} / ${String(featuredProjects.length).padStart(2, "0")}` : "PROJECT"} · {project.period}
        </p>
        <h1 className="pname metal" data-in tabIndex={-1}>
          {project.name}
        </h1>
        <p className="insight" data-in>
          <Emph text={project.insight} />
        </p>

        <dl className="facts" data-in>
          <div>
            <dt>역할</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>기간</dt>
            <dd>{project.period}</dd>
          </div>
          <div>
            <dt>상태</dt>
            <dd>
              <StatusBadge status={project.status} />
            </dd>
          </div>
        </dl>

        {project.links && project.links.length > 0 && (
          <ul className="plinks" data-in aria-label="링크">
            {project.links.map((l) => (
              <li key={l.url}>
                <a className={l.live ? "live" : undefined} href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.live && <i aria-hidden="true" />}
                  {l.live ? `실서비스 · ${l.label}` : l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="context" data-in>
          {project.context}
        </p>

        {hasOutcome && (
          <>
            <SectionHeading title="결과" label="OUTCOME" />
            <OutcomeList items={project.outcome} pending={project.pending} />
          </>
        )}

        <SectionHeading title="핵심 판단" label="DECISIONS" />
        <DecisionList slug={project.slug} decisions={project.decisions} />

        {project.implementation && (
          <>
            <SectionHeading title="구현" label="IMPLEMENTATION" />
            <ProseText text={project.implementation} />
          </>
        )}

        {project.reflection && (
          <>
            <SectionHeading title="회고" label="REFLECTION" />
            <ProseText text={project.reflection} />
          </>
        )}

        {project.threads.length > 0 && (
          <>
            <SectionHeading title="이어진 것" label="THREADS" />
            <ThreadList threads={project.threads} />
          </>
        )}

        <PageNav
          label="프로젝트 이동"
          prev={{ href: "/projects", k: "← PROJECTS", v: "전체 프로젝트" }}
          next={{ href: `/projects/${next.slug}`, k: "NEXT PROJECT →", v: next.name }}
        />
      </DepthScene>
    </section>
  );
}
