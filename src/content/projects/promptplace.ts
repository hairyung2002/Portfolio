import type { Project } from "./types";

export const promptplace: Project = {
  slug: "promptplace",
  name: "PromptPlace",
  period: "2025.07 ~ 현재",
  featured: true,
  status: "운영 중",
  line: "결제와 정산이 오가는 AI 프롬프트 마켓플레이스를 1년 넘게 운영 중",
  tag: "커머스 · 결제 · 운영",
  insight: "결제 검증은 SDK 결제가 끝난 뒤에만. *실행 순서를 코드로 보장*했습니다.",
  role: "Frontend → 서버 파트 리더",
  context:
    "생성형 AI 프롬프트를 사고파는 마켓플레이스입니다. 프론트엔드에서 결제, 판매자 정산, 관리자 기능을 맡았고, 지금은 서버 파트 리더로 실서비스를 운영하고 있습니다.",
  outcome: [
    "2025년 7월부터 실서비스 운영 중 (promptplace.kr)",
    "결제·정산·관리자 기능을 프론트엔드에서 엔드투엔드로 구현",
  ],
  decisions: [
    {
      title: "결제 순서를 코드로 강제한다",
      subtitle: "콜백 기반 Promise 체이닝",
      situation:
        "주문서 생성 → PortOne 결제창 → 결제 완료 → 서버 검증 순서여야 했는데, 운영 환경에서만 결제창이 뜨기도 전에 검증 요청이 나가 매번 결제 실패가 났습니다. 로컬에선 매번 정상이었습니다.",
      optionLabel: "선택",
      options: [
        { title: "환경 차이의 원인부터 규명", desc: "원인을 찾는 동안 결제 장애가 계속됨" },
        { title: "실행 순서를 구조로 보장", desc: "원인과 무관하게 증상을 제거", chosen: true },
      ],
      reasoning:
        "재현 패턴은 분명했습니다. 원인이 무엇이든 SDK 결제가 끝나기 전에는 서버 검증이 절대 나가지 않게 만들면 증상은 사라집니다.",
      tradeoff: "로컬과 운영이 왜 다르게 동작했는지는 끝내 규명하지 못했습니다.",
      result:
        "운영 환경에서 반복되던 결제 실패를 해소했고, 이 경험은 PyCon 2026 발표 「Green CI / Red Production」으로 이어졌습니다.",
    },
    {
      title: "여러 PG를 하나의 인터페이스로",
      subtitle: "PortOne SDK 채택",
      situation: "실제 돈이 오가는 서비스라 신뢰할 수 있는 PG 연동이 필요했습니다.",
      optionLabel: "선택",
      options: [{ title: "PG사 직접 연동" }, { title: "PortOne SDK", chosen: true }],
      reasoning:
        "팀 규모와 일정에서는 빠른 구현과 안정성이 우선이었고, 여러 PG를 하나의 인터페이스로 다룰 수 있었습니다.",
      tradeoff: "결제 흐름이 외부 SDK의 동작에 기대게 됩니다. 결제 순서 문제도 이 경계에서 생겼습니다.",
      result: "실제 운영할 수 있는 결제 기능을 구현했습니다.",
    },
    {
      title: "누르는 즉시 반응하는 팔로우",
      subtitle: "파생값에서 Optimistic Update로",
      situation:
        "로그인 직후 메인에서 팔로우 상태가 틀리게 보였습니다. useState의 lazy initializer는 첫 렌더링에만 평가되는데, 그때 팔로잉 목록이 아직 도착하지 않아 false로 고정된 것이었습니다.",
      optionLabel: "시도한 순서",
      options: [
        { title: "useEffect로 동기화", desc: "공용 mutation 훅의 관심사 분리가 흐려져 배제" },
        { title: "파생값으로 계산", desc: "초기값은 해결, 클릭 후 리렌더링 전까지 반영 안 됨" },
        { title: "Optimistic Update", desc: "캐시를 먼저 갱신해 즉시 반응", chosen: true },
      ],
      reasoning:
        "강제 리렌더링은 검색·정렬·필터 상태를 해쳐 배제했고, onMutate · onError · onSettled로 캐시를 먼저 바꾸는 방식을 택했습니다.",
      tradeoff:
        "팀 구조상 onSettled에서 다시 불러오는 방식이 이미 정해져 있어, 즉시 반응 효과가 완전히 살지는 못했습니다.",
      result: "초기값 문제는 해결했고, 반응 속도는 절충안으로 마무리했습니다.",
    },
  ],
  implementation:
    "메인 페이지의 프롬프트·프롬프터 탐색, 결제 시스템(PortOne SDK 연동, 주문 생성, 결제 완료/실패 처리), 판매자 정산(정산 신청, 내역 조회, 계좌 등록), 관리자 대시보드(판매자 관리, 정산 승인)를 전담 구현했다. Backend API 연동과 FE 코드 리팩토링도 함께 담당했다.\n\n메인 페이지 탐색 기능에서는 팔로우 상태 동기화 문제를 겪었다. `useState`의 lazy initializer는 첫 렌더링에서만 평가되는데, 팔로잉 목록을 비동기로 가져오다 보니 초기값이 항상 false로 고정되는 문제였다. 파생값으로 바꾸자 이번엔 리렌더링이 있어야만 상태가 반영되는 문제가 생겼고, 최종적으로 `onMutate`/`onError`/`onSettled` 기반 Optimistic Update로 캐시를 먼저 갱신해 해결했다.\n\n결제 기능에서는 로컬 환경에서는 매번 정상 동작하던 결제 순차 호출이 운영 환경에서는 매번 실패하는 문제를 겪었다. SDK 결제창이 완전히 열리기 전에 서버 검증 요청이 먼저 나가버리는 현상이었는데, 로컬/운영 환경 차이의 근본 원인은 끝내 규명하지 못했다. 대신 콜백 기반 Promise 체이닝으로 '결제 요청 → SDK 완료 → 서버 검증'의 실행 순서를 구조적으로 보장하도록 재작성해 해결했다.",
  reflection:
    "팔로우 상태 동기화 이슈에서 Optimistic Update를 도입했지만, 협업 구조상 `onSettled`에서 쿼리를 다시 fetch하는 방식이 이미 정해져 있어 '즉각 반응'이라는 효과를 완전히 살리지는 못했다. 결제 순차 호출 문제도 재현되는 증상 패턴을 근거로 구조를 개선해 실제로 해결했지만, 로컬과 운영 환경에서 왜 다르게 동작했는지는 답을 찾지 못한 채 남아 있다.\n\n이 경험 이후 로컬 테스트 통과가 운영 환경의 안정성을 보장하지 않는다는 것을 체감했고, 코드의 정확성뿐 아니라 실제 운영 환경의 부하와 변수까지 함께 검증하는 습관을 갖게 됐다. 이 주제는 이후 2026 파이콘 세션 발표 주제로 이어졌다.",
  threads: [
    {
      dir: "이후",
      name: "PyCon 2026 발표",
      text: "로컬에선 통과하고 운영에선 실패한 결제 문제를 「Green CI / Red Production」 발표로 정리했습니다.",
      href: "/about",
    },
  ],
  links: [
    { label: "promptplace.kr", url: "https://www.promptplace.kr", live: true },
    { label: "GitHub", url: "https://github.com/PromptPlace/PromtPlace-FE" },
  ],
};
