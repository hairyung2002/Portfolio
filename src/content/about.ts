import type { DatedItem } from "./activities";

export const education: DatedItem[] = [
  { when: "2028.02 졸업예정", what: "동국대학교 정보통신공학전공", sub: "경영학과 복수전공" },
];

export const talks: DatedItem[] = [
  {
    when: "2026.08.15",
    what: "PyCon 2026 연사 「Green CI / Red Production」",
    sub: "테스트 코드가 프로덕트 품질을 보장하지 못하는 이유",
  },
];

export const awards: DatedItem[] = [
  { when: "2025.08", what: "K-HTML 해커톤 우수상", sub: "Walking City" },
  { when: "", what: "교내 창업동아리 데모데이 대상", sub: "동데이" },
];

export const stack: { level: string; items: string }[] = [
  { level: "능숙", items: "Django · NestJS · Spring Boot · React · AWS · Docker · PostgreSQL" },
  { level: "사용 가능", items: "React Native · Express.js · MongoDB · MySQL · gRPC" },
  { level: "학습 중", items: "Kubernetes" },
];
