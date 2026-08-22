import type { Metadata } from "next";
import { profile, otherProjects } from "@/content/profile";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "About",
  description: "학력, 활동 이력, 수상, 발표 세션과 그 외 프로젝트 목록.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-2 px-6 py-16 sm:py-20">
      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-8">
        <span className="font-mono text-xs tracking-[0.15em] text-ink-muted uppercase">Profile</span>
        <h1 className="text-3xl font-bold text-ink">About</h1>
      </div>

      <Section title="Education" index={1} first>
        <ul className="flex flex-col gap-1 text-[15px] leading-relaxed">
          {profile.education.map((edu) => (
            <li key={edu.school}>
              <p className="font-semibold text-ink">{edu.school}</p>
              <p className="text-ink-muted">{edu.major}</p>
              <p className="font-mono text-[13px] text-ink-muted">{edu.period}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Stack" index={2}>
        <p className="mb-3 text-sm text-ink-muted">
          각 기술을 왜 선택했는지는 프로젝트 상세의 Decisions에서 확인할 수 있습니다.
        </p>
        <dl className="flex flex-col gap-3 font-mono text-[13px]">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <dt className="w-20 shrink-0 text-ink-muted">능숙</dt>
            <dd className="text-ink">{profile.stack.proficient.join(" · ")}</dd>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <dt className="w-20 shrink-0 text-ink-muted">사용 가능</dt>
            <dd className="text-ink">{profile.stack.capable.join(" · ")}</dd>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <dt className="w-20 shrink-0 text-ink-muted">학습 중</dt>
            <dd className="text-ink">{profile.stack.learning.join(" · ")}</dd>
          </div>
        </dl>
      </Section>

      <Section title="Activities" index={3}>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-muted">
          {profile.activities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>

      <Section title="Awards" index={4}>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-muted">
          {profile.awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>

      <Section title="Speaking" index={5}>
        <div className="flex flex-col gap-1 text-[15px] leading-relaxed">
          <p className="font-semibold text-ink">{profile.speaking.title}</p>
          <p className="font-mono text-[13px] text-ink-muted">
            {profile.speaking.event} · {profile.speaking.date} ·{" "}
            <span className="text-accent">{profile.speaking.status}</span>
          </p>
        </div>
        <p className="mt-4 text-sm text-ink-muted">{profile.blogNote}</p>
      </Section>

      <Section title="그 외 프로젝트" index={6}>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed">
          {otherProjects.map((p) => (
            <li key={p.name}>
              <span className="font-semibold text-ink">{p.name}</span>
              <span className="text-ink-muted"> — {p.summary}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
