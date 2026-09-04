import type { Metadata } from "next";
import { allProjects } from "@/content/projects";
import { ProjectFilter } from "@/components/ProjectFilter";

export const metadata: Metadata = {
  title: "Projects",
  description: "전체 프로젝트 목록 — 역할과 스택으로 필터링해 확인할 수 있습니다.",
};

export default function ProjectsPage() {
  return (
    <div className="rail-x mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-20">
      <div className="flex flex-col gap-3 border-b border-border pb-8">
        <span className="font-mono text-xs tracking-[0.15em] text-ink-muted uppercase">All Projects</span>
        <h1 className="text-3xl font-bold text-ink">Projects</h1>
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-ink-muted">
          운영 상태를 감추지 않습니다 — 운영 중인 서비스부터 설계 단계인 프로젝트까지 있는 그대로 표기합니다.
        </p>
      </div>
      <ProjectFilter projects={allProjects} />
    </div>
  );
}
