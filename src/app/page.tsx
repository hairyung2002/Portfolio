import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { StatRow } from "@/components/StatRow";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Hero } from "@/components/Hero";

const STATS = [
  { value: "10,000+", label: "Dirvana 누적 활성 사용자", note: "GA 검증" },
  { value: "20,000+", label: "Dirvana 게임 이벤트 참여", note: "GA 검증" },
  { value: "1", label: "실서비스 운영 중 (PromptPlace)", note: "2025.07 ~" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      <div className="rail-x mx-auto flex w-full max-w-5xl flex-col gap-14 px-6 py-14 sm:gap-16 sm:py-16">
        <section>
          <ScrollReveal variant="panel">
            <StatRow stats={STATS} />
          </ScrollReveal>
        </section>

        <section className="flex flex-col gap-6">
          <div className="edge-ticks flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border pt-3 pb-4">
            <h2 className="font-mono text-xs tracking-[0.15em] text-ink-muted uppercase">
              Featured Projects
            </h2>
            <div className="flex items-baseline gap-5">
              <span className="font-mono text-[11px] text-ink-muted">04 Selected</span>
              <Link
                href="/projects"
                className="text-[13px] text-ink-muted transition-colors hover:text-ink hover:underline"
              >
                전체 프로젝트 보기 →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.slug} variant="flip" index={index}>
                <ProjectCard project={project} index={index + 1} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
