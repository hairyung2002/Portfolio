/**
 * 화면 깊이. 페이지 전환 연출(줌 인 / 줌 아웃 / 옆으로)이 이 값의 비교로 정해진다.
 *   /                                0
 *   /projects, /about                1
 *   /projects/[slug]                 2
 *   /projects/[slug]/decisions/[n]   3
 */
export type Depth = 0 | 1 | 2 | 3;

export function normalizePath(path: string): string {
  const bare = path.split(/[?#]/)[0].replace(/\/+$/, "");
  return bare === "" ? "/" : bare;
}

function segments(path: string): string[] {
  return normalizePath(path).split("/").filter(Boolean);
}

export function depthOf(path: string): Depth {
  const s = segments(path);
  if (s.length === 0) return 0;
  if (s[0] === "projects" && s.length >= 4 && s[2] === "decisions") return 3;
  if (s[0] === "projects" && s.length >= 2) return 2;
  return 1;
}

/** 상단 "뒤로"와 ESC가 가는 곳. 판단 → 프로젝트 → 목록 → 메인. */
export function parentOf(path: string): string {
  const s = segments(path);
  switch (depthOf(path)) {
    case 3:
      return `/projects/${s[1]}`;
    case 2:
      return "/projects";
    default:
      return "/";
  }
}

export type TransitionKind = "in" | "out" | "lateral";

export function transitionKind(from: string, to: string): TransitionKind {
  const a = depthOf(from);
  const b = depthOf(to);
  return b > a ? "in" : b < a ? "out" : "lateral";
}

export function projectSlugOf(path: string): string | null {
  const s = segments(path);
  return s[0] === "projects" && s.length >= 2 ? s[1] : null;
}

export function decisionNumberOf(path: string): number | null {
  const s = segments(path);
  return depthOf(path) === 3 ? Number(s[3]) : null;
}

/**
 * 얕은 화면으로 돌아왔을 때 줌 아웃 프레임이 줄어들 요소.
 * 메인은 플레이트, 목록은 행, 프로젝트는 판단 행을 찾는다.
 */
export function returnTargetSelector(from: string, to: string): string | null {
  const slug = projectSlugOf(from);
  const n = decisionNumberOf(from);
  switch (depthOf(to)) {
    case 0:
      return slug ? `[data-plate="${slug}"]` : null;
    case 1:
      return slug ? `[data-row="${slug}"]` : null;
    case 2:
      return n !== null && projectSlugOf(to) === slug ? `[data-dec="${n}"]` : null;
    default:
      return null;
  }
}
