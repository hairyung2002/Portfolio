import type { Metadata } from "next";
import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { otherProjects, type OtherProject } from "@/content/otherProjects";
import { DepthScene } from "@/components/DepthScene";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = {
  title: "Projects",
  description: "문제와 판단 과정까지 정리한 대표 프로젝트 4개와 그 외 프로젝트 목록.",
};

function OtherRow({ project }: { project: OtherProject }) {
  const body = (
    <>
      <span>
        <span className="pn">{project.name}</span>
        <span className="pl">{project.line}</span>
      </span>
      <span className="pr">{project.role}</span>
      <span className="pp">
        {project.period && <span>{project.period}</span>}
        {project.status && <span>{project.status}</span>}
      </span>
    </>
  );
  return (
    <li>
      {project.slug ? (
        <Link className="prow static" href={`/projects/${project.slug}`} data-row={project.slug}>
          {body}
          <span className="arr" aria-hidden="true">
            →
          </span>
        </Link>
      ) : (
        <div className="prow static">
          {body}
          <span />
        </div>
      )}
    </li>
  );
}

export default function ProjectsPage() {
  const count = (n: number) => String(n).padStart(2, "0");
  return (
    <section className="layer" aria-label="목록">
      <DepthScene>
        <p className="eyebrow" data-in>
          PROJECTS · {count(featuredProjects.length + otherProjects.length)}
        </p>
        <h1 className="lhead metal" data-in tabIndex={-1}>
          Projects
        </h1>

        <h2 className="grp" data-in>
          대표 프로젝트 <span className="mono">SELECTED · {count(featuredProjects.length)}</span>
        </h2>
        <p className="grp-note" data-in>
          문제와 판단 과정까지 정리한 프로젝트입니다.
        </p>
        <ul className="plist" data-in>
          {featuredProjects.map((p) => (
            <li key={p.slug}>
              <Link className="prow" href={`/projects/${p.slug}`} data-row={p.slug}>
                <span>
                  <span className="pn">{p.name}</span>
                  <span className="pl">{p.line}</span>
                </span>
                <span className="pr">{p.role}</span>
                <span className="pp">
                  <span>{p.period}</span>
                  <StatusBadge status={p.status} />
                </span>
                <span className="arr" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="grp" data-in>
          그 외 프로젝트 <span className="mono">OTHERS · {count(otherProjects.length)}</span>
        </h2>
        <ul className="plist" data-in>
          {otherProjects.map((o) => (
            <OtherRow key={o.name} project={o} />
          ))}
        </ul>
      </DepthScene>
    </section>
  );
}
