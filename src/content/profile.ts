export interface Education {
  school: string;
  major: string;
  period: string;
}

export interface SpeakingEngagement {
  title: string;
  event: string;
  date: string;
  status: "예정" | "완료";
}

export const profile = {
  name: "곽도윤",
  role: "Backend-leaning Full-stack Engineer",
  tagline: "운영되는 시스템을 다루는 엔지니어",
  intro: "사용자에게 새로운 가치를 제공하는 서비스 개발자",
  contact: {
    email: "kdoing2002@gmail.com",
    github: "https://github.com/hairyung2002",
    blog: "https://velog.io/@hairyung2002/",
  },
  education: [
    {
      school: "동국대학교 공과대학 컴퓨터정보통신공학부 정보통신공학전공",
      major: "경영대학 경영학과 복수전공",
      period: "재학 중 · 졸업예정 2028.02",
    },
  ] satisfies Education[],
  stack: {
    proficient: [
      "Django",
      "NestJS",
      "Spring Boot",
      "React",
      "AWS",
      "Docker",
      "PostgreSQL",
    ],
    capable: ["React Native", "Express.js", "MongoDB", "MySQL", "gRPC"],
    learning: ["Kubernetes", "NoSQL"],
  },
  activities: [
    "교내 중앙봉사동아리 '길' (2021.09 ~ 2023.02, 2022.09 ~ 2023.02 회장)",
    "멋쟁이사자처럼 13기 백엔드 트랙 이수 (2025.03 ~ 2025.12)",
    "멋쟁이사자처럼 14기 백엔드 트랙장 활동 중 (2026.01 ~ )",
    "UMC 8th Web 파트 이수 (2025.03 ~ 2025.08)",
    "UMC 9th Web 파트 중앙운영진 (2025.08 ~ 2026.02)",
  ],
  awards: [
    "2025.08 K-HTML 해커톤 우수상 (Walking City)",
    "동데이 — 교내 창업동아리 데모데이 대상",
  ],
  speaking: {
    title:
      "Green CI/Red Production — 테스트 코드가 프로덕트 품질을 보장하지 못하는 이유",
    event: "2026 파이콘(PyCon)",
    date: "2026.08.15",
    status: "완료",
  } satisfies SpeakingEngagement,
  blogNote: "개인 기술 블로그 운영 중 (velog, 게시글 약 10개)",
};

export interface OtherProject {
  name: string;
  summary: string;
}

export const otherProjects: OtherProject[] = [
  {
    name: "너굴선배",
    summary: "Django 기반 초기 백엔드 프로젝트, REST API 설계 학습 목적",
  },
  {
    name: "Badang",
    summary:
      "AI 기반 소상공인 맞춤형 컨설팅 서비스, 웹 크롤링과 생성형 AI 활용",
  },
  {
    name: "Portpolis",
    summary: "React + Express.js 기반 개발자 포트폴리오 제작 서비스",
  },
  { name: "ConnecTeamed", summary: "팀 빌딩·협업 지원 웹 서비스" },
  {
    name: "2026 봄 동아리 박람회 사이트",
    summary: "동국대 봄 동아리 박람회 정보 제공 웹사이트",
  },
  {
    name: "2026 봄축제 사이트",
    summary: "Dirvana 경험을 반영해 구조 개선, MySQL 볼륨 마운트 적용",
  },
  {
    name: "SW 교육원 프로젝트",
    summary:
      "팀 프로젝트, 백엔드 개발 및 REST API 협업 (기획·디자인 마무리 단계)",
  },
  {
    name: "AIoT 공모전",
    summary: "AI와 IoT를 결합한 공모전, 풀스택 개발 참여",
  },
];
