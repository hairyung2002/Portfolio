export type ProjectStatus = "운영 중" | "운영 종료" | "개발 중" | "설계 단계";

export type ProjectRole = "Backend" | "Frontend" | "Infra" | "PM";

export interface ProjectDecision {
  title: string;
  situation: string;
  options: string[];
  reasoning: string;
  tradeoff: string;
  result: string;
}

export interface OutcomeItem {
  label: string;
  verified: boolean;
  note?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface StackGroup {
  category: string;
  items: string[];
}

export interface Project {
  slug: string;
  name: string;
  oneLiner: string;
  status: ProjectStatus;
  period: string;
  roles: ProjectRole[];
  myRole: string;
  teamSize?: string;
  stack: StackGroup[];
  links?: ProjectLink[];
  featured: boolean;

  problem: string;
  decisions: ProjectDecision[];
  implementation: string;
  outcome: OutcomeItem[];
  reflection: string;
}
