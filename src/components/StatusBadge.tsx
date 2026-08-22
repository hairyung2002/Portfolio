import type { ProjectStatus } from "@/content/projects/types";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  "운영 중": "text-status-active bg-status-active-bg border-status-active/30",
  "운영 종료": "text-status-ended bg-status-ended-bg border-status-ended/30",
  "개발 중": "text-status-building bg-status-building-bg border-status-building/30",
  "설계 단계": "text-status-design bg-status-design-bg border-status-design/30",
};

export function StatusBadge({ status, className = "" }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[11px] tracking-wide uppercase ${STATUS_STYLES[status]} ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        {status === "운영 중" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-active opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {status}
    </span>
  );
}
