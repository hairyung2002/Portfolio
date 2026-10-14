import type { Project } from "./types";

export const nexo: Project = {
  slug: "nexo",
  name: "Nexo",
  period: "2026.05 ~",
  featured: true,
  status: "구현 완료 · 측정 전",
  line: "Nginx 라우팅을 멈추지 않고 교체하는 C 프록시 엔진과 웹 콘솔",
  tag: "시스템 프로그래밍 · C",
  insight: "라우팅 테이블을 *서비스 중단 없이* 갈아끼우는 문제를 다뤘습니다.",
  role: "PO · 1인 개발",
  context:
    "Nginx 설정이 부담스러운 개발자도 웹 콘솔에서 라우팅을 관리할 수 있게 하는 플랫폼입니다. 실제 Nginx와 직접 구현한 C 프록시 엔진 중 하나를 골라 쓸 수 있습니다. 학습과 역량 증명을 목적으로 한 개인 프로젝트입니다.",
  outcome: [],
  pending: {
    label: "측정 전",
    text: "구현은 마쳤고, wrk 부하 테스트와 ASan·Valgrind 메모리 검증은 아직 진행하지 않았습니다.",
  },
  decisions: [
    {
      title: "Nginx를 대체하지 않고 나란히",
      subtitle: "어댑터 병행 구조",
      situation: "직접 만든 C 엔진을 보여주는 것이 목적이지만, 검증된 Nginx의 안정성을 무시할 수는 없었습니다.",
      optionLabel: "선택",
      options: [{ title: "자체 엔진만 제공" }, { title: "Nginx와 자체 엔진을 어댑터로 병행", chosen: true }],
      reasoning:
        "DataPlaneAdapter 인터페이스 아래 Nginx 어댑터와 자체 엔진 어댑터를 두고, 자체 엔진에는 실험 단계 표시를 붙였습니다.",
      tradeoff: "두 어댑터를 함께 유지해야 하는 비용이 생깁니다.",
      result: "초보자에게는 Nginx라는 안전망을 주고, 자체 엔진은 선택해서 써볼 수 있는 형태로 만들었습니다.",
    },
    {
      title: "멈추지 않고 테이블을 교체한다",
      subtitle: "rwlock 기반 포인터 교체",
      situation: "라우팅을 바꿀 때 기존 연결을 끊지 않고 새 규칙을 바로 적용해야 했습니다.",
      reasoning:
        "새 라우팅 테이블을 미리 메모리에 만든 뒤, 쓰기 잠금을 아주 짧게 걸고 포인터만 바꿉니다. 기존 연결은 그대로 두고 다음 요청부터 새 규칙이 적용됩니다.",
      tradeoff:
        "교체된 옛 테이블을 다른 스레드가 아직 읽고 있을 수 있어서, 바로 해제하면 use-after-free가 납니다. 안전한 회수 시점을 정하는 것이 이 프로젝트의 핵심 난제입니다.",
      result: "구현은 마쳤고, 교체 중 5xx 0%와 처리량 목표는 부하 테스트로 검증할 예정입니다.",
    },
    {
      title: "상위 계층의 검증을 믿지 않는다",
      subtitle: "C 엔진의 2차 방어 파싱",
      situation:
        "NestJS에서 이미 입력을 검증하더라도, C 엔진이 그 결과를 그대로 믿으면 버퍼 오버플로 같은 메모리 문제로 이어질 수 있습니다.",
      reasoning: "C 엔진에서도 고정 버퍼 크기를 미리 검사하고, 넘치면 400으로 거부합니다.",
      tradeoff: "같은 검증이 두 번 일어납니다. 메모리 안전이 걸린 계층에서는 그 비용을 감수했습니다.",
      result: "제어 계층과 데이터 계층이 서로의 검증에 기대지 않는 구조로 만들었습니다.",
    },
  ],
  implementation:
    "Control Plane(NestJS + PostgreSQL)이 라우팅 변경 요청을 검증·영속화하고, DataPlaneAdapter 인터페이스를 통해 NginxAdapter 또는 자체 구현한 NexoEngineAdapter(C, epoll+rwlock)로 실제 반영하는 구조를 구현했다. C 엔진 코어(epoll 이벤트 루프, RoutingTable, UDS 리스너)와 NestJS Control Plane 구현을 마쳤다. NestJS의 1차 검증과 별개로, C 엔진에서도 고정 버퍼 크기 사전 검증(`snprintf` 사용, 초과 시 400 거부)을 독립적으로 수행하도록 해, 상위 계층의 신뢰가 메모리 안전이 중요한 C 레이어까지 전파되지 않도록 했다.\n\n검증 기준도 수치로 미리 정했다 — wrk 부하테스트 50,000 TPS 목표, 라우팅 스왑 시 5xx 실패율 0% 실증, ASan/Valgrind 메모리 안전 검증(0 leak)을 CI 게이트로 강제하기로 했다. 이 수치들은 아직 측정 전인 목표치다.",
  reflection:
    "이 프로젝트의 핵심 성공 조건은 두 가지였다. 사회적 영향력을 정당화 근거로 쓰지 않고 기술 역량 증명에 집중하는 것, 그리고 메모리 안전·원자적 스왑 같은 핵심 몇 개만 완벽히 구현하고 나머지는 '설계함'으로 솔직히 밝히는 것. 엔진 코어와 Control Plane 구현은 마쳤지만, 원자적 스왑과 메모리 안전성이 실제 부하에서 의도대로 동작하는지는 아직 실측으로 확인하지 못했다. 남은 부하테스트로 설계 의도를 실측으로 증명하는 것이 다음 과제다.",
  threads: [],
};
