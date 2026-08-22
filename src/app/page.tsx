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

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 py-16 sm:py-20">
        <ScrollReveal variant="panel">
          <StatRow stats={STATS} />
        </ScrollReveal>

        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <h2 className="font-mono text-xs tracking-[0.15em] text-ink-muted uppercase">Featured Projects</h2>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[11px] text-ink-muted">04 Selected</span>
              <Link href="/projects" className="font-mono text-[13px] text-ink-muted transition-colors hover:text-ink hover:underline">
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
