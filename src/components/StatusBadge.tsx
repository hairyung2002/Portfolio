import { statusKind, type ProjectStatus } from "@/content/projects";

/** 점 + 텍스트. 점의 색은 운영 중 / 종료 / 진행 중 세 가지뿐이다. */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`status ${statusKind(status)}`}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}
