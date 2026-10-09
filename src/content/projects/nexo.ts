import type { Project } from "./types";

export const nexo: Project = {
  slug: "nexo",
  name: "Nexo",
  oneLiner:
    "Nginx 오픈소스 분석 기반 C 프록시 엔진 — 무중단 라우팅 스왑이라는 난제를 정의하고 스코프를 의도적으로 좁혀 구현 중인 프로젝트",
  status: "개발 중",
  period: "진행 중 (개인 사이드 프로젝트)",
  roles: ["Backend", "Infra"],
  myRole: "1인 개발 — 기획, C 엔진, NestJS Control Plane, React 콘솔 전체 담당",
  stack: [
    {
      category: "Data Plane (C)",
      items: [
        "epoll",
        "pthread(rwlock)",
        "picohttpparser",
        "Unix Domain Socket / JSON-RPC",
      ],
    },
    { category: "Control Plane", items: ["NestJS", "TypeORM", "PostgreSQL"] },
    { category: "Web Console", items: ["React", "Chart.js / D3.js"] },
    {
      category: "검증",
      items: ["wrk", "ASan / Valgrind", "TSan", "GitHub Actions CI"],
    },
  ],
  featured: true,

  problem:
    "Nginx나 Envoy 같은 성숙한 프록시를 대체하려는 목적이 아니다. 시스템 프로그래밍(C, epoll, pthread) 역량과 풀스택(NestJS/React) 역량을 하나의 완결된 프로덕트로 증명하는 포트폴리오 프로젝트로 정의했다. 타겟은 데브옵스 경험 1년 미만 주니어 백엔드 개발자 — Nginx `.conf` 문법이 두렵고 라우팅 변경을 잘못 건드리면 서비스가 죽을까봐 꺼리는 사람이다.\n\n스스로 프로젝트 타당성을 평가했을 때, 기술적 가치는 높지만 완주(무결한 동시성 구현) 조건부이고, 사회적 영향력은 낮다(이미 Envoy·Kong·Nginx Proxy Manager가 같은 문제를 풀고 있다)는 결론에 도달했다. 이 낮은 사회적 영향력을 어필 포인트로 쓰지 않기로 하고, 목적을 '포트폴리오·학습'으로 좁혀 기술 역량 증명에 집중하기로 했다.",

  decisions: [
    {
      title: "Nginx를 대체하지 않고 어댑터로 병행 지원",
      situation:
        "C 엔진을 직접 구현하는 것 자체가 목적이지만, 프로덕션에서 검증된 Nginx의 안정성을 무시할 수는 없었다.",
      options: [
        "자체 C 엔진만 지원한다",
        "DataPlaneAdapter 인터페이스로 Nginx와 자체 엔진을 모두 지원한다",
      ],
      reasoning:
        "초보자에게는 검증된 Nginx라는 안전망을 제공하면서, 동시에 직접 만든 엔진을 선택적으로 실험해볼 수 있게 하는 편이 정직성과 기술 증명을 동시에 확보한다고 판단했다.",
      tradeoff:
        "어댑터 계층을 추가로 설계해야 하는 대신, 커스텀 엔진 선택 시 'Experimental — not battle-tested' 경고를 노출해 신뢰 경계를 명확히 할 수 있었다.",
      result:
        "DataPlaneAdapter 인터페이스 아래 NginxAdapter(실제 nginx)와 NexoEngineAdapter(자체 C 엔진)를 함께 지원하는 구조로 구현했다.",
    },
    {
      title: "원자적 라우팅 스왑 메커니즘",
      situation:
        "라우팅 변경 시 서비스 중단 없이 새 라우팅 테이블을 반영해야 했다.",
      options: [
        "요청마다 라우팅 테이블을 다시 조회한다",
        "새 RoutingTable을 메모리에 구성한 뒤 포인터만 원자적으로 교체한다",
      ],
      reasoning:
        "포인터 교체 방식이 짧은 잠금 구간만으로 무중단 전환을 달성할 수 있다고 판단했다.",
      tradeoff:
        "교체된 구(舊) 테이블을 언제 안전하게 해제할지가 핵심 난제로 남았다 — 아직 참조 중인 스레드가 있으면 즉시 해제 시 use-after-free 위험이 있다.",
      result:
        "pthread_rwlock_wrlock으로 짧게 잠그고 포인터만 교체하는 방식으로 구현했다. 교체된 구 테이블은 메모리 할당 관리 계층에서 해제하도록 처리했으며, 스왑 중 메모리 안전성은 엔진 구동 확인과 ASan/Valgrind 검증 단계에서 확인할 예정이다.",
    },
    {
      title: "MVP 스코프를 의도적으로 좁힘",
      situation:
        "TLS/HTTP2/HTTP3, 복잡한 로드밸런싱, 서비스 디스커버리, 멀티테넌시 등 '진짜 프로덕션 프록시'에 필요한 기능은 끝이 없었다.",
      options: [
        "가능한 기능을 모두 구현하려 한다",
        "핵심 난제(원자적 스왑, 메모리 안전) 몇 개에만 집중하고 나머지는 Out-of-Scope로 명시한다",
      ],
      reasoning:
        "완벽주의로 스코프가 무한정 늘어나는 것이 1인 프로젝트의 가장 큰 리스크라고 판단했다.",
      tradeoff:
        "기능의 폭을 포기하는 대신, 핵심 난제를 완성도 있게 구현할 시간을 확보했다.",
      result:
        "Out-of-Scope 항목을 명시하고 원자적 스왑과 메모리 안전 검증에 집중하는 로드맵을 세웠다.",
    },
  ],

  implementation:
    "Control Plane(NestJS + PostgreSQL)이 라우팅 변경 요청을 검증·영속화하고, DataPlaneAdapter 인터페이스를 통해 NginxAdapter 또는 자체 구현한 NexoEngineAdapter(C, epoll+rwlock)로 실제 반영하는 구조를 구현했다. C 엔진 코어(epoll 이벤트 루프, RoutingTable, UDS 리스너)와 NestJS Control Plane 구현을 마쳤다. NestJS의 1차 검증과 별개로, C 엔진에서도 고정 버퍼 크기 사전 검증(`snprintf` 사용, 초과 시 400 거부)을 독립적으로 수행하도록 해, 상위 계층의 신뢰가 메모리 안전이 중요한 C 레이어까지 전파되지 않도록 했다.\n\n검증 기준도 수치로 미리 정했다 — wrk 부하테스트 50,000 TPS 목표, 라우팅 스왑 시 5xx 실패율 0% 실증, ASan/Valgrind 메모리 안전 검증(0 leak)을 CI 게이트로 강제하기로 했다. 현재는 구현 단계로, 남은 작업은 엔진 구동 확인과 웹 콘솔(클라이언트 화면), 간편 조작 API 구현이다.",

  outcome: [
    {
      label:
        "기획 및 아키텍처 설계 완료 — Decision, 로드맵, 검증 기준까지 문서화",
      verified: true,
    },
    {
      label:
        "C 엔진 코어(epoll 루프, RoutingTable, UDS 리스너) 및 NestJS Control Plane 구현 완료",
      verified: true,
    },
    {
      label:
        "wrk 부하테스트 50,000 TPS, 라우팅 스왑 5xx 실패율 0%, ASan/Valgrind 0 leak",
      verified: false,
      note: "목표 수치 — 엔진 구동 확인 전이라 실측 없음",
    },
  ],

  reflection:
    "이 프로젝트의 핵심 성공 조건은 두 가지였다. 사회적 영향력을 정당화 근거로 쓰지 않고 기술 역량 증명에 집중하는 것, 그리고 메모리 안전·원자적 스왑 같은 핵심 몇 개만 완벽히 구현하고 나머지는 '설계함'으로 솔직히 밝히는 것. 엔진 코어와 Control Plane 구현은 마쳤지만, 원자적 스왑과 메모리 안전성이 실제 부하에서 의도대로 동작하는지는 아직 실측으로 확인하지 못했다. 남은 구동 확인과 부하테스트로 설계 의도를 실측으로 증명하는 것이 다음 과제다.",
};
