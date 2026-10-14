import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProjects, getProjectBySlug, nextProject } from "@/content/projects";
import { DecisionFlow } from "@/components/DecisionFlow";
import { DepthScene } from "@/components/DepthScene";
import { PageNav } from "@/components/PageNav";

type Params = { slug: string; n: string };

export const dynamicParams = false;

// 프로젝트 × 판단 조합을 아래에서 한 번에 만든다.
export function generateStaticParams(): Params[] {
  return allProjects.flatMap((p) => p.decisions.map((_, i) => ({ slug: p.slug, n: String(i + 1) })));
}

function resolve({ slug, n }: Params) {
  const project = getProjectBySlug(slug);
  const k = Number(n);
  const decision = project?.decisions[k - 1];
  return project && decision ? { project, decision, k } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const found = resolve(await params);
  if (!found) return {};
  return {
    title: `${found.decision.title} · ${found.project.name}`,
    description: found.decision.situation,
  };
}

export default async function DecisionPage({ params }: { params: Promise<Params> }) {
  const found = resolve(await params);
  if (!found) notFound();
  const { project, decision, k } = found;
  const total = project.decisions.length;
  const hasNext = k < total;
  const after = nextProject(project);

  return (
    <section className="layer" aria-label="판단">
      <DepthScene className="wrap narrow">
        <p className="eyebrow" data-in>
          DECISION {k} / {total} · {project.name.toUpperCase()}
        </p>
        <h1 className="dtitle" data-in tabIndex={-1}>
          {decision.title}
        </h1>
        <p className="dsub" data-in>
          {decision.subtitle}
        </p>

        <DecisionFlow decision={decision} />

        <PageNav
          label="판단 이동"
          prev={{ href: `/projects/${project.slug}`, k: "← PROJECT", v: project.name }}
          next={
            hasNext
              ? {
                  href: `/projects/${project.slug}/decisions/${k + 1}`,
                  k: "NEXT DECISION →",
                  v: `D${k + 1} ${project.decisions[k].title}`,
                }
              : { href: `/projects/${after.slug}`, k: "NEXT PROJECT →", v: after.name }
          }
        />
      </DepthScene>
    </section>
  );
}
