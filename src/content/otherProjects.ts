export interface OtherProject {
  name: string;
  line: string;
  role?: string;
  period?: string;
  status?: string;
  /** 상세 페이지가 있는 프로젝트. 목록에서 링크가 된다. */
  slug?: string;
}

export const otherProjects: OtherProject[] = [
  {
    name: "운꿰사",
    line: "축제 사주 소개팅 서비스. 1차 런칭에서 공유 확산이 약하자, 소개팅 리텐션과 메일 알림에 집중하는 방향으로 바꿨습니다.",
    role: "PO · Backend",
    period: "2026.09",
    status: "운영 종료",
  },
  {
    name: "2026 봄축제 사이트",
    line: "Dirvana 경험을 반영해 구조를 개선하고, DB를 MySQL 볼륨 마운트 구조로 전환했습니다.",
    period: "2026 봄",
    status: "운영 종료",
  },
  {
    name: "동데이",
    line: "인디밴드 공연장 예약 플랫폼. 직접 공연장을 섭외해 검증한 뒤, 공연장 측 지불 의사가 없음을 확인하고 스스로 종료했습니다.",
    role: "팀 리더 · PM",
    period: "6주 프로그램",
    status: "종료 · 데모데이 대상",
    slug: "dongday",
  },
  {
    name: "Walking City",
    line: "RAG 기반 산책 코스 추천. 동대문구 공공데이터로 범위를 좁혀 추천 품질을 높였습니다.",
    role: "Frontend · 설계 자문",
    period: "2025.08",
    status: "해커톤 우수상",
    slug: "walking-city",
  },
  { name: "2026 봄 동아리 박람회 사이트", line: "동국대 봄 동아리 박람회 정보를 제공하는 웹사이트.", period: "2026 봄" },
  { name: "Badang", line: "웹 크롤링과 생성형 AI를 활용한 소상공인 맞춤형 컨설팅 서비스." },
  { name: "Portpolis", line: "React와 Express.js 기반의 개발자 포트폴리오 제작 서비스." },
  { name: "ConnecTeamed", line: "팀 빌딩과 협업을 돕는 웹 서비스." },
  { name: "AIoT 공모전", line: "AI와 IoT를 결합한 공모전 프로젝트에 풀스택으로 참여했습니다.", role: "Full-stack" },
  { name: "너굴선배", line: "REST API 설계를 익히기 위해 만든 Django 기반 첫 백엔드 프로젝트.", role: "Backend" },
];
