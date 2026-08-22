import type { Project } from "./types";

export const walkingCity: Project = {
  slug: "walking-city",
  name: "Walking City",
  oneLiner: "AWS Bedrock RAG 기반 산책 코스 추천 서비스 — LLM Hallucination을 실제 데이터로 잡는 아키텍처를 설계 자문하고, 지도 연동은 직접 구현",
  status: "운영 종료",
  period: "K-HTML 해커톤 (2025.08)",
  roles: ["Frontend"],
  myRole:
    "프론트엔드 개발 직접 담당 + 백엔드/AI 아키텍처 설계 자문 및 작업 분배 (아키텍처는 팀원과 공동 설계, 직접 구현은 아님)",
  stack: [
    { category: "Backend", items: ["Spring Boot"] },
    { category: "AI", items: ["AWS Bedrock", "Bedrock Knowledge Base", "RAG"] },
    { category: "Storage", items: ["Amazon S3"] },
    { category: "Map", items: ["TMAP API"] },
  ],
  featured: false,

  problem:
    "기존 지도 서비스는 최단 경로, 인기 장소, 단순 키워드 검색 중심이라 사용자 취향을 충분히 반영하지 못했다. 반대로 LLM만 단독으로 쓰면 실제 지역 정보를 모른 채 존재하지 않는 장소를 추천하거나 오래된 정보를 활용하는 Hallucination이 발생할 수 있었다. LLM이 실제 지역 데이터를 근거로 추천하게 만드는 것을 핵심 문제로 잡았다.",

  decisions: [
    {
      title: "RAG 아키텍처 채택",
      situation: "LLM 단독으로는 동대문구의 실제 관광지·공원·카페 정보를 충분히 반영하지 못했다.",
      options: ["LLM 단독 응답에 의존한다", "공공 데이터를 Knowledge Base로 구축해 RAG로 검색 후 응답을 생성한다"],
      reasoning: "질문 시 관련 데이터를 먼저 검색해 LLM에 함께 제공하면 실제 데이터에 근거한 추천이 가능하다고 판단했다.",
      tradeoff:
        "Knowledge Base 구축(공공 API 수집 → CSV 정제 → S3 업로드)이라는 추가 파이프라인이 필요해졌지만, 그 대가로 Hallucination을 줄일 수 있었다.",
      result: "지역 특화 추천이 가능해지고 실제 데이터 기반 추천을 구현했다.",
    },
    {
      title: "전국이 아닌 동대문구로 스코프 제한",
      situation: "전국 단위 데이터를 구축할지, 특정 지역에 집중할지 선택이 필요했다.",
      options: ["전국 데이터를 얕게 다룬다", "동대문구만 깊게 다룬다"],
      reasoning:
        "얕고 넓은 데이터보다 좁고 깊은 데이터가 추천 품질을 높인다고 판단했고, 동대문구 공공데이터가 가장 안정적으로 제공됐다.",
      tradeoff: "커버리지를 포기하는 대신 동대문구 내 추천 정확도를 높였다.",
      result: "범용 추천 대비 동대문구 내에서는 높은 추천 정확도를 확보했다.",
    },
  ],

  implementation:
    "TMAP API를 연동해 추천 장소를 실제 도보 경로로 이어주는 지도 기능을 프론트엔드에서 직접 구현했다. RAG 기반 추천 시스템과 Knowledge Base 구축 파이프라인은 팀원과 함께 설계 방향을 정하고 기술 자문과 작업 분배를 맡았지만, 실제 코드 구현에는 참여하지 않았다.",

  outcome: [
    { label: "K-HTML 해커톤 본선 진출(200명 참가, 본선 16개 팀) 및 우수상 수상", verified: true },
  ],

  reflection:
    "AWS Bedrock이 해외 리전 서버라는 레이턴시 문제도 있었지만, 더 근본적인 한계는 비동기 처리가 미흡해 서버가 한 번에 하나의 AI 요청만 처리할 수 있었다는 점이었다. 여러 사용자가 동시에 추천을 요청하면 순차적으로만 처리되어 응답 지연이 누적됐다.\n\n인프라/AI 아키텍처는 설계 자문과 기술 방향 조율까지만 담당했고, 실제 구현에는 참여하지 않아 이 영역의 직접적인 구현 경험은 없다. 이때 관찰만 했던 '동시 AI 요청 처리'라는 한계는 이후 Wilson 프로젝트에서 직접 백엔드 아키텍처를 설계하며 다시 마주하게 된다.",
};
