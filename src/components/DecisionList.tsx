import Link from "next/link";
import type { Decision } from "@/content/projects";

/** 프로젝트 상세의 판단 목록. 각 행은 판단 페이지로 들어가는 입구다. */
export function DecisionList({ slug, decisions }: { slug: string; decisions: Decision[] }) {
  return (
    <ol className="dlist" data-in>
      {decisions.map((d, i) => (
        <li key={d.title}>
          <Link className="drow" href={`/projects/${slug}/decisions/${i + 1}`} data-dec={i + 1}>
            <span className="dno">D{i + 1}</span>
            <span>
              <span className="dt">{d.title}</span>
              <span className="ds">{d.subtitle}</span>
            </span>
            <span className="arr" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
