/**
 * 진행 상태는 감추지 않는다. 검증이 끝나지 않은 프로젝트는
 * "개발 완료 · 검증 전"처럼 어디까지 왔는지를 상태 자체에 적는다.
 */
export type ProjectStatus =
  | "운영 중"
  | "운영 종료"
  | "개발 중"
  | "설계 단계"
  | "개발 완료 · 검증 전"
  | "구현 완료 · 측정 전";

/** 상태 점의 색. 문구가 늘어나도 색은 세 가지로 유지한다. */
export type StatusKind = "active" | "ended" | "building";

export interface DecisionOption {
  title: string;
  desc?: string;
  /** 실제로 고른 선택지. 판단 페이지에서 강조된다. */
  chosen?: boolean;
}

export interface Decision {
  title: string;
  subtitle: string;
  situation: string;
  options?: DecisionOption[];
  /** 고른 선택지 위에 붙는 라벨. 사후 회고라면 "지금이라면", 순차 시도라면 "시도한 순서". */
  optionLabel?: "선택" | "지금이라면" | "시도한 순서";
  reasoning: string;
  tradeoff: string;
  result: string;
}

export interface Thread {
  dir: "이전" | "이후";
  name: string;
  text: string;
  href: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  /** 실서비스 배포 링크. 다른 링크보다 눈에 띄게 보여준다. */
  live?: boolean;
}

/** 미검증·측정 전 안내. 검증된 결과(`outcome`)와 시각적으로 분리해 보여준다. */
export interface Pending {
  label: string;
  text: string;
}

export interface Project {
  slug: string;
  name: string;
  period: string;
  featured: boolean;
  status: ProjectStatus;

  /** 플레이트·목록용 한 줄 */
  line: string;
  /** 플레이트 하단 키워드 */
  tag: string;
  /** 상세 상단의 한 줄 결론. `*구간*`은 강조로 렌더링된다. */
  insight: string;
  role: string;
  /** 배경 문단 */
  context: string;

  /** 출처가 확인된 결과만 담는다. */
  outcome: string[];
  pending?: Pending;

  decisions: Decision[];
  /** 직접 구현한 내용. 문단은 빈 줄로 구분한다. */
  implementation?: string;
  /** 배운 것과 남은 한계. 문단은 빈 줄로 구분한다. */
  reflection?: string;
  threads: Thread[];
  links?: ProjectLink[];
}
