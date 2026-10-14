import { describe, expect, it } from "vitest";
import { allProjects, featuredProjects, getProjectBySlug } from "../index";
import { aboutActivities, timeline } from "../../activities";
import { awards, education, stack, talks } from "../../about";
import { otherProjects } from "../../otherProjects";
import { HEADLINE, profile } from "../../profile";

/** CLAUDE.md §2 — 원고에 있어도 공개하면 안 되는 내용. */
const FORBIDDEN_PATTERNS: RegExp[] = [
  /01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/, // 전화번호
  /자소서/,
  /면접에서\s*쓸만한/,
  /나중에\s*채/,
  /노현수|노민혁|문범식|이민형|이소정|이현우|정유이|조의진/, // 팀원 실명
  /팀원[^.。]{0,20}이탈|이탈한\s*팀원/, // 팀원 이탈 서술
  /\d\.\d{1,2}\s*\/\s*4\.5/, // 학점
  /토익|TOEIC|OPIc|오픽/i, // 어학 점수
  /가동률\s*70%|150만원/, // 동데이 IR 목업 수치
  /유실률\s*0\s*%|페이로드\s*50\s*%/, // Wilson 미검증 기대치
  /억지\s*없이\s*탄탄|비중\s*있게\s*쓰지\s*말/, // 원고의 메타 발언
];

/** 객체 안의 모든 문자열을 모은다. 필드가 늘어나도 검사에서 빠지지 않게. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

const EVERYTHING = { allProjects, otherProjects, timeline, aboutActivities, education, talks, awards, stack, profile, HEADLINE };

describe("project content", () => {
  it("has unique slugs", () => {
    const slugs = allProjects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("features the four landing projects in order", () => {
    expect(featuredProjects.map((p) => p.slug)).toEqual(["dirvana", "promptplace", "wilson", "nexo"]);
  });

  it.each(allProjects.map((p) => [p.slug, p] as const))("%s has the required fields", (_slug, project) => {
    for (const key of ["name", "period", "status", "line", "tag", "insight", "role", "context"] as const) {
      expect(project[key].trim().length, key).toBeGreaterThan(0);
    }
    expect(Array.isArray(project.outcome)).toBe(true);
    // 검증된 결과가 없으면 무엇이 아직 측정 전인지는 반드시 밝힌다.
    expect(project.outcome.length > 0 || !!project.pending).toBe(true);
    expect(project.decisions.length).toBeGreaterThanOrEqual(1);
  });

  it.each(allProjects.map((p) => [p.slug, p] as const))("%s decisions are complete", (_slug, project) => {
    project.decisions.forEach((d) => {
      for (const key of ["title", "subtitle", "situation", "reasoning", "tradeoff", "result"] as const) {
        expect(d[key].trim().length, `${d.title}.${key}`).toBeGreaterThan(0);
      }
      if (d.options) {
        expect(d.options.length).toBeGreaterThanOrEqual(2);
        expect(d.options.filter((o) => o.chosen)).toHaveLength(1);
      }
    });
  });

  it.each(allProjects.map((p) => [p.slug, p] as const))("%s marks unverified work as pending", (_slug, project) => {
    if (project.status !== "운영 중" && project.status !== "운영 종료") {
      expect(project.pending, "진행 중 프로젝트는 측정 전 안내가 있어야 한다").toBeDefined();
    }
  });

  it("only uses emphasis tokens in balanced pairs", () => {
    allProjects.forEach((p) => expect((p.insight.match(/\*/g) ?? []).length % 2).toBe(0));
    expect((HEADLINE.match(/\*/g) ?? []).length % 2).toBe(0);
  });

  it("links threads and other projects to routes that exist", () => {
    const valid = (href: string) =>
      href === "/" ||
      href === "/projects" ||
      href === "/about" ||
      (href.startsWith("/projects/") && !!getProjectBySlug(href.slice("/projects/".length)));
    allProjects.forEach((p) => p.threads.forEach((t) => expect(valid(t.href), t.href).toBe(true)));
    otherProjects.forEach((o) => {
      if (o.slug) expect(getProjectBySlug(o.slug), o.slug).toBeDefined();
    });
  });
});

describe("prohibited content", () => {
  it.each(Object.entries(EVERYTHING))("%s contains no forbidden content", (_name, value) => {
    const haystack = strings(value).join("\n");
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(haystack).not.toMatch(pattern);
    }
  });
});
