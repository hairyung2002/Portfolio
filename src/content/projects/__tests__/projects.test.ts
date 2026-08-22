import { describe, expect, it } from "vitest";
import { allProjects } from "../index";

const FORBIDDEN_PATTERNS: RegExp[] = [
  /010-\d{4}-\d{4}/, // 전화번호
  /자소서/,
  /면접에서\s*쓸만한/,
  /나중에\s*채/,
  /노현수|노민혁|문범식|이민형|이소정|이현우|정유이|조의진/, // 팀원 실명
  /3\.59\s*\/\s*4\.5/, // 학점
  /토익스피킹/, // 어학 점수
  /가동률\s*70%|150만원/, // 동데이 IR 목업 수치
];

function collectStrings(project: (typeof allProjects)[number]): string[] {
  const strings: string[] = [project.oneLiner, project.myRole, project.problem, project.implementation, project.reflection];
  if (project.teamSize) strings.push(project.teamSize);
  project.decisions.forEach((d) => {
    strings.push(d.title, d.situation, d.reasoning, d.tradeoff, d.result, ...d.options);
  });
  project.outcome.forEach((o) => {
    strings.push(o.label);
    if (o.note) strings.push(o.note);
  });
  return strings;
}

describe("project content", () => {
  it("has unique slugs", () => {
    const slugs = allProjects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(allProjects.map((p) => [p.slug, p] as const))("%s has required narrative fields", (_slug, project) => {
    expect(project.problem.length).toBeGreaterThan(0);
    expect(project.decisions.length).toBeGreaterThanOrEqual(1);
    expect(project.implementation.length).toBeGreaterThan(0);
    expect(project.outcome.length).toBeGreaterThanOrEqual(1);
    expect(project.reflection.length).toBeGreaterThan(0);

    project.decisions.forEach((d) => {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.situation.length).toBeGreaterThan(0);
      expect(d.options.length).toBeGreaterThanOrEqual(2);
      expect(d.reasoning.length).toBeGreaterThan(0);
      expect(d.tradeoff.length).toBeGreaterThan(0);
      expect(d.result.length).toBeGreaterThan(0);
    });
  });

  it.each(allProjects.map((p) => [p.slug, p] as const))("%s contains no forbidden content", (_slug, project) => {
    const haystack = collectStrings(project).join("\n");
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(haystack).not.toMatch(pattern);
    }
  });
});
