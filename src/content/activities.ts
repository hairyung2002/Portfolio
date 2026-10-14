/** 메인 Activities 타임라인 항목. 시간순. */
export interface TimelineEntry {
  date: string;
  title: string;
  sub?: string;
}

/** About의 기간 + 항목 행. 학력·활동·발표·수상이 같은 모양을 쓴다. */
export interface DatedItem {
  when: string;
  what: string;
  sub?: string;
}

export const timeline: TimelineEntry[] = [
  { date: "2022.09", title: "중앙봉사동아리 '길' 회장", sub: "2023.02까지" },
  { date: "2025.03", title: "멋쟁이사자처럼 13기", sub: "백엔드 트랙 수료" },
  { date: "2025.03", title: "UMC 8th", sub: "Web 파트 수료" },
  { date: "2025.08", title: "K-HTML 해커톤 우수상", sub: "Walking City" },
  { date: "2025.08", title: "UMC 9th 중앙운영진", sub: "Web 파트" },
  { date: "2026.01", title: "멋쟁이사자처럼 14기 백엔드 트랙장", sub: "Spring Boot 커리큘럼 운영" },
  { date: "2026.05", title: "ASBG in DGU", sub: "1st General Member · 활동 중" },
  { date: "2026.08", title: "PyCon 2026 연사", sub: "Green CI / Red Production" },
  { date: "2026.09", title: "공공 AX 서포터즈 1기", sub: "활동 중" },
];

/** About 활동. 최신순. */
export const aboutActivities: DatedItem[] = [
  { when: "2026.09 ~", what: "공공 AX 서포터즈 1기" },
  { when: "2026.05 ~", what: "ASBG in DGU", sub: "1st General Member" },
  { when: "2026.01 ~", what: "멋쟁이사자처럼 14기 백엔드 트랙장", sub: "Spring Boot 커리큘럼 운영" },
  { when: "2025.08 ~ 2026.02", what: "UMC 9th 중앙운영진", sub: "Web 파트" },
  { when: "2025.03 ~ 2025.12", what: "멋쟁이사자처럼 13기 백엔드 트랙 수료" },
  { when: "2025.03 ~ 2025.08", what: "UMC 8th Web 파트 수료" },
  { when: "2022.09 ~ 2023.02", what: "중앙봉사동아리 '길' 회장" },
];
