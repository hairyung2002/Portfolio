import Link from "next/link";
import type { Project } from "@/content/projects";
import { Magnetic } from "./Magnetic";
import { StatusBadge } from "./StatusBadge";

/** 메인 Featured의 프로젝트 플레이트. 번호·상태 → 이름 → 한 줄 → 키워드. */
export function ProjectPlate({ project, no, total }: { project: Project; no: string; total: number }) {
  return (
    <Magnetic strength={15} className="plate-slot">
      <Link className="plate" href={`/projects/${project.slug}`} data-plate={project.slug}>
        <span className="p-top">
          <span>
            {no} / {String(total).padStart(2, "0")}
          </span>
          <StatusBadge status={project.status} />
        </span>
        <span className="p-name">{project.name}</span>
        <span className="p-line">{project.line}</span>
        <span className="p-go">
          <span>{project.tag}</span>
          <span aria-hidden="true">→</span>
        </span>
      </Link>
    </Magnetic>
  );
}
