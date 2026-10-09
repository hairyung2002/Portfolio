# 프로젝트명: Nexo (Proxy Web Service)

## 기본 정보
- 한 줄 소개: Nginx 설정을 두려워하는 초심자도 웹 콘솔에서 라우팅을 관리할 수 있고, 동시에 직접 구현한 고성능 C 프록시 엔진을 선택적으로 사용해볼 수 있는 동적 API 게이트웨이 플랫폼
- 유형: 개인 사이드 프로젝트 (Software Engineering 중심, 오픈소스 공개 예정)
- **현재 진행 상태: 기획 완료, 개발 착수 단계 (코드 구현 전). 이 파일은 개발 진행에 따라 트러블슈팅/성과 섹션을 계속 추가할 예정 — 지금은 의사결정 로그 위주로만 구성**
- 본인 역할: 1인 프로젝트 — 기획, C 엔진, NestJS Control Plane, React 콘솔 전체 담당
- 대표 키워드: Nginx 오픈소스 분석, C 기반 확장, Software Engineering, 시스템 프로그래밍

## Tech Stack
- **Data Plane (C)**: epoll, pthread(rwlock), picohttpparser, Unix Domain Socket/JSON-RPC
- **Control Plane**: NestJS, TypeORM, PostgreSQL
- **Web Console**: React, Chart.js/D3.js (실시간 트래픽 대시보드)
- **검증/품질**: wrk(부하테스트), ASan/Valgrind(메모리 안전), TSan(동시성), GitHub Actions CI

---

## 문제 정의 및 목적

**목적**: 시스템 프로그래밍(C, epoll, pthread) 역량과 Full-Stack(NestJS/React) 역량을 하나의 완결된 프로덕트로 증명하는 포트폴리오 프로젝트. Nginx나 Envoy 같은 성숙한 프록시를 대체하려는 목적이 아니며, 상용 서비스/멀티테넌트 SaaS도 아님 — **정직하게 학습/역량 증명 목적임을 명시**.

**타겟 페르소나**: 데브옵스 경험 1년 미만 주니어 백엔드 개발자. Nginx `.conf` 문법이 두렵고, 잘못 건드리면 서비스가 죽을까봐 라우팅 변경을 꺼리는 사람.

**본인이 스스로 정리한 프로젝트 타당성 평가** (자기 객관화가 잘 된 지점 — 자소서에서 그대로 활용 가능)
- 기술적 가치: 높으나 완주(무결한 동시성 구현) 조건부
- 사회적 영향력: 낮음 (이미 Envoy/Kong/Nginx Proxy Manager가 시장 문제를 풀고 있음) — **이걸 어필 포인트로 쓰지 않기로 스스로 결정**
- 실효성: 목적을 "포트폴리오/학습"으로 좁히면 높음, "인프라 문제의 새로운 해결"로는 낮음
- 핵심 성공 조건: (1) 사회적 영향력을 정당화 근거로 쓰지 않고 기술 역량 증명에 집중 (2) 메모리 안전/원자적 스왑 등 핵심 3~4개만 완벽히 구현하고 나머지는 "설계함"으로 솔직히 명시

---

## 시스템 아키텍처

```
[Web Console (React)]
        │
[NestJS Control Plane] ── PostgreSQL (라우팅 정보 영속화)
        │
  DataPlaneAdapter (interface)
        │
   ┌────┴─────┐
NginxAdapter   NexoEngineAdapter
(실제 nginx)   (자체 C 엔진: epoll+rwlock)
```

- **Control Plane**: 라우팅 변경 요청을 검증/영속화하고, 선택된 어댑터를 통해 실제 데이터 플레인에 반영
- **Data Plane (선택 가능)**: `NginxAdapter`(실제 nginx config 생성/검증 후 reload) / `NexoEngineAdapter`(직접 구현한 C 엔진과 UDS/JSON-RPC로 통신)

---

## 기술적 선택과 이유 (Technical Decisions)

### Decision 1. 왜 Nginx를 대체하지 않고 "어댑터로 병행 지원"하는 구조를 택했는가
- **상황**: C 엔진을 직접 구현하는 것 자체가 목적이지만, 실제 프로덕션에서 검증된 Nginx의 안정성을 무시할 수는 없음
- **결정**: `DataPlaneAdapter` 인터페이스를 두고 `NginxAdapter`(실제 nginx)와 `NexoEngineAdapter`(자체 C 엔진)를 모두 지원하도록 설계. 커스텀 엔진 선택 시 "Experimental — not battle-tested" 경고 배지 노출
- **이유**: 초보자에게는 검증된 Nginx라는 안전망을 제공하면서, 동시에 본인이 만든 엔진을 "선택적으로 실험해볼 수 있는" 형태로 만들어 정직성과 기술 증명을 동시에 확보

### Decision 2. 원자적 라우팅 스왑 메커니즘 — 이 프로젝트의 핵심 기술 난제
- **상황**: 라우팅 변경 시 서비스 중단 없이(무중단) 새 라우팅 테이블을 반영해야 함
- **결정**: 요청이 오면 C 엔진이 새 RoutingTable(해시맵)을 메모리에 새로 구성한 뒤, `pthread_rwlock_wrlock()`으로 짧게 잠그고 포인터만 원자적으로 교체. 기존 연결은 영향받지 않고 이후 요청부터 즉시 새 라우팅 적용
- **핵심 난제**: 교체된 구(舊) 테이블을 언제 안전하게 free할 것인가 — 아직 참조 중인 스레드가 있을 수 있어 즉시 해제하면 use-after-free 위험. Refcount 또는 grace period 기반의 안전 회수 전략 필요 (진행하며 실제 구현 방식 업데이트 예정)

### Decision 3. Defense in Depth — NestJS 검증을 C 엔진이 다시 신뢰하지 않음
- **상황**: Control Plane(NestJS)에서 이미 DTO 검증을 하더라도, C 엔진이 이를 맹신하면 메모리 안전 문제(오버플로우 등)로 이어질 수 있음
- **결정**: NestJS의 1차 검증과 별개로, C 엔진에서도 고정 버퍼 크기 사전 검증(`snprintf` 사용, 초과 시 400 거부) 등 2차 방어적 파싱을 독립적으로 수행
- **이유**: 상위 계층의 신뢰가 하위 계층(메모리 안전이 특히 중요한 C)까지 전파되어서는 안 된다는 시스템 설계 원칙

### Decision 4. MVP 스코프를 의도적으로 좁힘 (Out-of-Scope 명시)
- **상황**: TLS/HTTP2/HTTP3, 복잡한 로드밸런싱, 서비스 디스커버리, 멀티테넌시 등 "진짜 프로덕션 프록시"에 필요한 기능은 무궁무진함
- **결정**: 이런 항목들을 의도적으로 Out-of-Scope로 명시하고, 핵심 난제(원자적 스왑, 메모리 안전)에 집중
- **이유**: 완벽주의로 스코프가 무한정 늘어나는 것이 "1인 프로젝트 최대 리스크"라고 스스로 판단 — 여기에 대한 자기 객관화 자체가 프로젝트 관리 역량을 보여주는 지점

### Decision 5. 검증 기준을 수치로 명확히 설정
- **결정**: wrk 부하테스트 50,000 TPS 목표, 라우팅 스왑 시 5xx 실패율 0% 실증, ASan/Valgrind 메모리 안전 검증(0 leak 필수)을 CI 게이트로 강제
- **이유**: "동작한다"가 아니라 "이 정도 처리량에서도 무중단 스왑이 실증됐다"는 정량적 기준을 미리 정해둠으로써, 나중에 애매하게 마무리되는 것을 방지

---

## 개발 로드맵 (예상 기간)

| Phase | 내용 | 예상 기간 |
|---|---|---|
| 1 | C Core: epoll 루프, picohttpparser, RoutingTable, UDS 리스너 | 1~2주 |
| 2 | Atomic Swap: rwlock 스왑 + old table 안전 회수 (최대 난제) | 1.5~3주 |
| 3 | Control Plane: NestJS + PostgreSQL + UDS 클라이언트 + 서킷브레이커 | 3~5일 |
| 3.5 | DataPlaneAdapter 인터페이스 + NginxAdapter/NexoEngineAdapter 구현 | 3~5일 |
| 4 | Web Console: 라우팅 관리 GUI + 대시보드 + 엔진 선택 UI | 3~5일 |
| 5 | 검증/마무리: wrk 부하테스트, 5xx 0% 실증, 문서화 | 3~7일 |

총 예상 기간: 약 6~10주

---

## 자소서/면접에서 쓸만한 포인트 메모 (개발 진행에 따라 업데이트 예정)

- **Software Engineer 지원 시**: 이 프로젝트 전체가 사실상 Software Engineer 트랙의 정수 — Nginx 같은 오픈소스 프록시의 동작 원리를 이해하고, 직접 C로 확장/구현한 경험 자체가 대부분의 신입 지원자가 못 다루는 영역
- **Problem Solver 지원 시**: "원자적 라우팅 스왑에서 use-after-free를 어떻게 막을 것인가"라는 문제를 미리 정의하고, 아직 완전히 풀지 못했다는 것도 솔직히 인지하고 있는 상태 — 문제를 명확히 정의하는 능력 자체가 소재
- **PM/Product 관점**: "사회적 영향력을 정당화 근거로 쓰지 않겠다"는 자기 객관화, Out-of-Scope를 의도적으로 정해 스코프 크리프를 방지한 프로젝트 관리 판단
- **정직함이 강점이 되는 지점**: 아직 개발 착수 단계라는 것, 그리고 "완벽주의가 최대 리스크"라는 것을 스스로 인지하고 있다는 점 자체가 신뢰도를 높임. 나중에 완주하지 못하더라도 "이런 문제를 이렇게 설계했다"는 것만으로도 충분히 의미 있는 소재가 됨

---

## 나중에 채울 것 (개발 진행되는 대로 업데이트)
- 실제 구현 과정에서의 트러블슈팅 (특히 Decision 2의 old table 회수 전략을 실제로 어떻게 구현했는지)
- wrk 부하테스트 실측 결과 (TPS, 5xx 비율)
- ASan/Valgrind 검증 결과
- 개발 중 겪은 예상치 못한 문제들
