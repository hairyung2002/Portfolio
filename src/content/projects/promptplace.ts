import type { Project } from "./types";

export const promptplace: Project = {
  slug: "promptplace",
  name: "PromptPlace",
  oneLiner: "AI 프롬프트 마켓플레이스 — 결제·정산까지 포함한 실서비스 프론트엔드를 전담하고 1년 가까이 운영을 지속시킨 기록",
  status: "운영 중",
  period: "2025.07 ~ 현재",
  roles: ["Frontend"],
  myRole: "Frontend Engineer — 결제·정산·관리자 기능 등 핵심 비즈니스 로직 전담",
  teamSize: "PM 1 · Design 1 · Marketing 1 · Backend 3 · Frontend 3",
  stack: [
    { category: "Core", items: ["React 19", "TypeScript (strict)", "Vite 7"] },
    { category: "상태 관리", items: ["TanStack Query v5", "React Context API"] },
    { category: "라우팅/통신", items: ["React Router v7", "Axios"] },
    { category: "스타일링", items: ["Tailwind CSS v4", "Emotion", "MUI"] },
    { category: "결제/인증", items: ["PortOne SDK", "Google OAuth"] },
  ],
  links: [
    { label: "GitHub", url: "https://github.com/PromptPlace/PromtPlace-FE" },
    { label: "Live · promptplace.kr", url: "https://www.promptplace.kr" },
  ],
  featured: true,

  problem:
    "생성형 AI 확산으로 프롬프트의 가치가 커졌지만, 이를 체계적으로 거래·공유할 플랫폼은 마땅치 않았다. 프롬프트 제작자는 노하우를 수익화할 창구가 없었고, 사용자는 검증된 프롬프트를 찾으려면 커뮤니티나 SNS를 일일이 뒤져야 했다. 기존 공유 서비스 대부분이 단순 게시판에 머물러 검색·구매·판매·정산이 하나로 이어지는 생태계를 제공하지 못한다는 점에서, 프롬프트를 디지털 상품으로 다루는 마켓플레이스를 목표로 잡았다.",

  decisions: [
    {
      title: "PortOne SDK로 결제 시스템 구축",
      situation: "실제 결제가 오가는 서비스라 신뢰할 수 있는 PG 연동이 필요했다.",
      options: ["PG사와 직접 연동한다", "PortOne SDK로 복수 PG를 하나의 인터페이스로 다룬다"],
      reasoning:
        "팀 규모와 일정상 빠른 구현과 안정성이 중요했고, 복수 PG를 단일 인터페이스로 다룰 수 있다는 점이 유리하다고 판단했다.",
      tradeoff:
        "SDK에 결제 흐름 제어를 위임하는 대신, 결제창이 열리는 타이밍처럼 SDK 내부 동작에 의존하는 지점에서는 통제권이 줄었다.",
      result: "실제 운영 가능한 결제 기능을 구현했다.",
    },
    {
      title: "관리자 페이지를 일반 사용자 화면과 분리",
      situation: "판매자 관리, 정산 승인 등 관리자 기능은 일반 사용자 기능과 목적·권한이 달랐다.",
      options: ["일반 페이지에 관리자 기능을 조건부로 포함한다", "별도 관리자 페이지로 완전히 분리한다"],
      reasoning: "목적이 다른 기능을 한 화면에 조건부로 두면 권한 관리와 유지보수가 복잡해진다고 판단했다.",
      tradeoff: "화면과 라우팅이 늘어나는 대신, 권한 경계가 코드 구조로 명확해졌다.",
      result: "관리자 전용 페이지로 운영 기능을 분리해 유지보수성을 확보했다.",
    },
    {
      title: "TanStack Query + Axios 3단 레이어 구조를 결제·정산에도 일관 적용",
      situation:
        "apis/ 레이어에서 axios로 요청하고 hooks/queries·hooks/mutations 레이어에서 TanStack Query로 감싸는 이 컨벤션은 팀의 시작점이었던 워크북에서 제시된 것으로, 본인이 설계하지 않았다.",
      options: ["기존 컨벤션을 그대로 따른다", "담당 기능(결제/정산/관리자)에는 별도 구조를 적용한다"],
      reasoning:
        "설계자는 아니었지만 이 구조가 캐싱과 전역 데이터 동기화, API 호출과 상태 관리의 관심사 분리를 위해 필요하다는 걸 이해한 뒤, 데이터 정합성이 중요한 결제·정산·관리자 기능에도 일관되게 적용하기로 했다.",
      tradeoff: "새 구조를 고안하는 대신, 이미 검증된 패턴을 확장하는 쪽을 택해 팀 전체의 일관성을 유지했다.",
      result:
        "결제/정산/관리자처럼 데이터 정합성이 중요한 기능에서도 안정적인 캐싱과 상태 동기화를 확보했고, 이후 본인이 프론트엔드를 맡는 다른 프로젝트에도 같은 구조를 표준으로 가져가 쓰고 있다.",
    },
  ],

  implementation:
    "메인 페이지의 프롬프트·프롬프터 탐색, 결제 시스템(PortOne SDK 연동, 주문 생성, 결제 완료/실패 처리), 판매자 정산(정산 신청, 내역 조회, 계좌 등록), 관리자 대시보드(판매자 관리, 정산 승인)를 전담 구현했다. Backend API 연동과 FE 코드 리팩토링도 함께 담당했다.\n\n메인 페이지 탐색 기능에서는 팔로우 상태 동기화 문제를 겪었다. `useState`의 lazy initializer는 첫 렌더링에서만 평가되는데, 팔로잉 목록을 비동기로 가져오다 보니 초기값이 항상 false로 고정되는 문제였다. 파생값으로 바꾸자 이번엔 리렌더링이 있어야만 상태가 반영되는 문제가 생겼고, 최종적으로 `onMutate`/`onError`/`onSettled` 기반 Optimistic Update로 캐시를 먼저 갱신해 해결했다.\n\n결제 기능에서는 로컬 환경에서는 매번 정상 동작하던 결제 순차 호출이 운영 환경에서는 매번 실패하는 문제를 겪었다. SDK 결제창이 완전히 열리기 전에 서버 검증 요청이 먼저 나가버리는 현상이었는데, 로컬/운영 환경 차이의 근본 원인은 끝내 규명하지 못했다. 대신 콜백 기반 Promise 체이닝으로 '결제 요청 → SDK 완료 → 서버 검증'의 실행 순서를 구조적으로 보장하도록 재작성해 해결했다.",

  outcome: [
    { label: "결제·정산·관리자 기능을 포함한 커머스 플랫폼을 구축해 2025.07부터 지속 운영", verified: true },
    { label: "실사용자 대상 서비스로 PM·디자이너·백엔드·마케터 등 다양한 직군과 협업", verified: true },
  ],

  reflection:
    "팔로우 상태 동기화 이슈에서 Optimistic Update를 도입했지만, 협업 구조상 `onSettled`에서 쿼리를 다시 fetch하는 방식이 이미 정해져 있어 '즉각 반응'이라는 효과를 완전히 살리지는 못했다. 결제 순차 호출 문제도 재현되는 증상 패턴을 근거로 구조를 개선해 실제로 해결했지만, 로컬과 운영 환경에서 왜 다르게 동작했는지는 답을 찾지 못한 채 남아 있다.\n\n이 경험 이후 로컬 테스트 통과가 운영 환경의 안정성을 보장하지 않는다는 것을 체감했고, 코드의 정확성뿐 아니라 실제 운영 환경의 부하와 변수까지 함께 검증하는 습관을 갖게 됐다. 이 주제는 이후 2026 파이콘 세션 발표 주제로 이어졌다.",
};
