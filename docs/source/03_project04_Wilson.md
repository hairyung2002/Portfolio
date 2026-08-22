# 프로젝트명: Wilson (초고령사회 대응 AI 선제적 다가감 플랫폼)

## 기본 정보
- 한 줄 소개: 초고령사회 대응을 위해 Frontend, Backend, AI Server를 단일 사용자 흐름으로 통합하고, gRPC 및 메시지 큐 아키텍처 기반으로 치매 당사자와 보호자를 동시에 케어하는 음성 기반 AI 플랫폼
- 유형: 창업 프로젝트 (대표 프로젝트)
- 기간: 2026.06.01 ~ 진행 중
- **현재 진행 상태: 각 파트(Backend/App/AI Server)가 개별적으로 약 50% 완성된 상태이며, 아직 파트 간 통합(Integration)이 완료되지 않음. 또한 인프라 측면에서 Decision 2, 3에 서술된 K8s(Ingress TLS Termination, Headless Service 등) 아키텍처는 현재 설계 단계이며, 실제로는 아직 각자 개별 Docker 컨테이너로 배포 중이고 K8s는 적용되지 않은 상태. 아래 문서의 아키텍처/성과 관련 서술 중 상당 부분은 "설계 의도 및 기대 효과"이며, 실제 배포·측정된 결과가 아님 — 통합/K8s 적용/검증 후 반드시 업데이트 필요**
- 팀 규모: 총 4명 (원래 5명이었으나 PM/Designer 담당이었던 노현수가 중간에 팀 이탈. 이후 본인이 PM 역할까지 흡수) — 본인: PM + Mobile App + Backend(Spring) / 노민혁: Designer / 문범식: AI / 이민형: AI + Infra
- 본인 역할: **PM 겸 Backend Engineer 겸 Mobile App Developer** (Backend·App 구현 100% 전담, 중간에 PM 공백이 생겨 기획/일정 관리까지 겸함). 시스템 아키텍처(gRPC/MQ 분리, 데이터 플로우) 설계는 AI 담당 팀원들과 **공동으로 주도** (단독 설계가 아님, 이 표현 유지 필요)
- 참고: 2026 글로벌 피우다프로젝트(ICT콤플렉스) 대학생 지원 프로그램에 선정되어 진행 중인 프로젝트 (2026.05 신청, 개발 기간 06.01~08.17 5단계 마일스톤). 3단계 사업화 로드맵(~2026 일본 IRB 임상 PoC → 2027 일본 B2G/B2B 진입 → 2028 한일 확산)까지 수립된 상태 — PM 관점에서 어필 가능
- 대표 키워드: Backend Architecture, AI Service, 분산 시스템, gRPC, Kubernetes

## Tech Stack
- **Mobile**: React Native(Expo), TypeScript, TanStack Query, Zustand
- **Backend**: Java 17, Spring Boot 3.x, Spring Security, Spring Data JPA
- **AI Server**(팀원 담당, 본인은 연동 인터페이스 설계까지 관여): Python, FastAPI, OpenAI Whisper API(STT), OpenAI TTS API(TTS), PyTorch, BERT(치매 징후/감정 분석), Ollama, Chroma DB
  - 참고: 음성 인식/합성(STT/TTS)은 자체 모델이 아니라 OpenAI API를 활용하고, PyTorch/BERT/Ollama는 치매 징후·감정 분석에 사용
- **Database**: PostgreSQL, Redis
- **Messaging**: Apache Kafka
- **IPC/Infra**: gRPC(HTTP/2), Docker, Kubernetes, AWS ALB, ACM

---

## 문제 정의

2025년 대한민국 고령인구 비중은 20.3%로 초고령사회에 진입했고, 독거노인 비중은 32.8%에 달한다. 노인의 67.2%가 디지털 적응에 어려움을 느끼는데, 기존 AI 챗봇 서비스는 "사용자가 먼저 말을 걸어야 하는" 수동적 텍스트 방식에 머물러 실질적 접근성이 떨어졌다. 동시에 노인 돌봄의 81.4%를 가족이 부담하고 있고 보호자의 스트레스 경험률이 46.3%에 달하는데, 기존 서비스는 노인 단독 케어에 치우쳐 보호자를 위한 통합 케어는 부재했다. (참고: 일본은 치매 환자가 2020년 602만 명에서 2040년 약 802만 명으로 증가 전망, 인지증 사회적 비용 19.4조 엔 — 지원서 제출 시 조사한 배경 자료)

이에 따라 AI가 먼저 말을 거는 선제적 음성 인터페이스와, 노인·보호자를 동시에 케어하는 이중(Dual) 구조를 핵심 문제 해결 방향으로 설정했다.

## 서비스 시나리오 (사용자 흐름)

```
사용자(어르신)가 앱을 실행하지 않아도, AI가 먼저 안부를 묻는 푸시 알림을 보낸다
  ("할머니, 오늘 점심은 뭐 드셨어요?")
      ↓
알림을 통해 앱에 진입, 음성으로 대답 (타이핑 없이 STT로 인식)
      ↓
실시간 음성 스트리밍 (gRPC) → LLM이 손주 같은 말투로 자연스럽게 응답 생성 → TTS로 음성 출력
      ↓ (동시에, 별도 파이프라인으로)
대화 내용이 Message Queue로 전달되어 백그라운드에서 감정/치매 징후 분석
      ↓
분석 결과가 누적되어 보호자 앱의 대시보드로 전달 (반복 질문 증가, 어휘력 저하 등 패턴 감지 시 전문가 상담 권유)
```

이 흐름 자체가 왜 gRPC(실시간 음성), MQ/Kafka(백그라운드 분석), Redis(대화 세션 유지), Chroma DB(개인화된 대화 이력)가 각각 필요했는지를 설명해준다.

## 담당 기능

- Spring Boot 메인 백엔드 서버 및 PostgreSQL/Redis 데이터 아키텍처 설계
- React Native(Expo) 음성 인터페이스 및 보호자 대시보드 앱 개발
- Mobile ↔ Backend ↔ AI Server 간 gRPC/REST/MQ 데이터 파이프라인 설계 (AI Engineer 팀원과 공동 설계)
- K8s 기반 인프라 로드밸런싱 및 네트워크 보안(h2c, Internal DNS) 구조 수립
- CLAUDE.md 기반 AI 개발 환경 구축 및 TDD 개발 프로세스 직접 주도

## System Architecture (설계도)

```
[ Mobile App ]
      │
      ▼ (HTTPS/WSS via ACM)
[ AWS ALB / Ingress ] ── (TLS Termination)
      │
      ▼ (h2c via K8s Internal DNS)
[ Spring Boot Main Server ] ── (Session/Context) ──► [ Redis ]
      │
      ├──► [ gRPC Streaming ] ──► [ FastAPI (STT/TTS/LLM) ] ── (Chroma DB Vector RAG)
      │
      └──► [ Publish Protobuf Byte[] ] ──► [ Message Queue(SQS) ] ──► [ FastAPI 분석 Worker ] ──► [ PostgreSQL ]
```

---

## 기술적 선택과 이유 (Technical Decisions)

> 아래 결정들은 팀(본인 + AI Engineer)이 공동으로 설계한 내용이며, 서술된 "결과"는 현재 통합 전이라 대부분 설계 의도/기대 효과임. 실제 검증 후 사실 여부를 업데이트할 것.

### Decision 1. 실시간 대화와 무거운 AI 연산의 분리 (gRPC + Message Queue) — **본인이 제안/주장한 결정**
- **상황**: 음성 대화는 실시간 응답이 필수적인 반면, 대화 기반 치매 징후/감정 분석(BERT)은 CPU 연산이 무거워 수 초가 소요됨
- **본인의 논거**: (1) 사용자 관점에서, AI의 무거운 연산 결과를 통으로 기다리게 하기보다 형태소 단위로 끊어서 스트리밍 응답하면 체감 대기시간을 최소화할 수 있다고 판단. (2) REST API로는 음성 데이터 자체를 파싱해서 전달하기 까다로운 반면, gRPC를 사용하면 음성을 바이너리 형태로 AI 서버에 직접 전달할 수 있어 불필요한 파싱 오버헤드를 제거해 레이턴시 이점이 있다고 판단 — 이 두 가지 근거로 REST 대신 gRPC를 본인이 직접 제안
- **결정**: 대화 구간은 Spring Boot ↔ FastAPI 간 gRPC h2c 스트리밍으로 초저지연 처리, 분석 구간은 대화 완료 이벤트를 Message Queue에 발행하고 즉시 응답 반환 → 백그라운드 파드가 Consume 후 분석
- **기대 효과** (검증 전): AI 분석 부하와 무관하게 실시간 응답 속도 확보, 분석 서버 장애 시에도 MQ가 메시지를 보관해 데이터 유실 방지

### Decision 2. K8s 내부 통신 보안 최적화 (Ingress TLS Termination + h2c) — **설계 단계, 아직 미배포**
- **본인 포함 팀원 2명이 함께 설계**
- **상황**: Pod-to-Pod 내부 통신까지 TLS를 직접 적용하면 인증서 관리 복잡도와 CPU 암복호화 오버헤드 증가
- **결정**: 외부(Mobile↔Ingress) 구간은 AWS ALB+ACM으로 HTTPS/TLS 적용(TLS Termination), K8s 내부망(Spring↔FastAPI)은 평문 HTTP/2(h2c)로 구성 — 경계 보안(Perimeter Security) 관점의 트레이드오프
- **현재 상태**: 이 구조는 설계 단계이며, 실제로는 아직 각자 개별 Docker 컨테이너로 배포 중이라 K8s 자체가 적용되지 않은 상태. 실제 배포 후 검증 필요
- **기대 효과**: 인증서 관리 포인트를 인프라 단으로 일원화하고 내부 통신 레이턴시 최적화

### Decision 3. gRPC Keep-Alive 쏠림 해결 (Headless Service + Client-Side Round Robin) — **본인이 직접 설계, 아직 미배포**
- **상황**: Spring-FastAPI 컨테이너가 같은 K8s 단위로 함께 관리되는 구조라, 일반적인 클러스터 레벨 로드밸런서(L4 ClusterIP)는 이 내부 Spring↔FastAPI 간 통신에는 관여할 수 없다고 판단. 게다가 gRPC는 HTTP/2 기반 단일 TCP 커넥션을 재사용(Keep-Alive)하므로, 여러 AI Pod가 떠 있어도 트래픽이 특정 Pod로만 쏠리는 병목이 발생할 수 있음
- **본인의 논거**: 클러스터 단위 로드밸런서로는 이 문제를 해결할 수 없으니, gRPC 클라이언트 라이브러리 레벨에서 직접 Round Robin을 적용해야 한다고 판단해 설계
- **결정**: K8s Headless Service로 CoreDNS가 모든 AI Pod IP 리스트를 반환하게 하고, Spring Boot gRPC Client 단에서 `round_robin` 정책 적용
- **현재 상태**: 설계 완료, 아직 K8s 미적용으로 실제 배포/검증 전
- **기대 효과**: 별도 Service Mesh(Istio) 없이도 클라이언트 사이드 부하 분산

### Decision 4. Kafka 채택 이유 — 형태소 단위 스트리밍의 순서 보장 + 확장성 대비
- **상황**: AI 서버가 생성한 답변을 한 번에 통으로 넘기면 사용자가 1~2분씩 기다려야 하므로, 3~5초 단위의 형태소로 끊어서 순차적으로 Spring 서버에 전달하는 구조를 택함. 이때 형태소 조각들이 반드시 순서대로 처리되어야 함(순서가 꼬이면 TTS 음성 출력 자체가 뒤섞임)
- **본인/팀의 논거**: 단순 순서 보장만 놓고 보면 SQS FIFO 등 다른 메시지 큐로도 가능하지만, 서비스 확장 시 사용자 수가 늘어나면 동시다발적으로 발생하는 형태소 스트림의 양이 늘어날 것을 대비해, 처리량과 순서 보장을 함께 만족하는 Kafka를 선택함
- **정직한 평가**: 프로젝트 초기 단계인 지금은 극단적인 대용량 트래픽은 아니지만, 사용자 기반이 늘어날 경우를 고려한 확장성 있는 선택이었다는 것이 정확한 표현. "지금 당장 Kafka가 아니면 안 됐다"보다는 "성장을 고려해 처리량에 여유 있는 선택을 했다"는 톤이 맞음

### Decision 5. K8s 도입 이유 — 학습 목적 + 향후 스케일링 대비 (정직하게 기록)
- **실제 이유**: 팀 전체가 Docker까지는 다뤄봤지만 K8s 오케스트레이션은 경험이 부족해, 학습 목적이 가장 컸음
- **덧붙이는 논거**: Spring(가벼운 I/O 중심)과 FastAPI(무거운 연산 중심)가 향후 서로 다른 스케일링 정책이 필요할 것으로 예상되어, 미리 오케스트레이션 환경에 익숙해지고자 함
- **정직한 평가**: "K8s가 아니면 안 되는 기술적 필연성"이 있었다기보다는, 학습 목적과 향후 대비 성격이 강한 선택. 자소서에서는 이 점을 숨기지 않고 "학습과 확장성 대비를 위해 선제적으로 도입"이라는 톤으로 서술하는 것이 정직하고 자연스러움

### Decision 6. AI 서버 내부 모듈 분리 (RAG / BERT 분석 / 치매 감지)
- **상황**: AI 서버 하나에서 RAG 기반 대화 생성, BERT 기반 감정 분석, 치매 징후 감지를 모두 처리하면 특정 연산이 몰릴 때 다른 기능까지 함께 지연될 위험이 있음
- **결정 및 이유**: 세 기능을 각각 독립된 모듈(파드)로 분리 — 각 모듈이 서로 다른 연산 특성(GPU 집약적 생성 vs 경량 분류 등)을 가지고, 독립적인 트랜잭션 단위로 동작하기 때문에 분리하는 것이 유지보수성과 성능 양쪽에서 유리하다고 판단
- **결과**: 특정 모듈에 부하가 몰려도 다른 모듈에 영향이 전파되지 않는 구조 확보 (이 Decision은 억지 없이 탄탄한 논거를 갖춘 사례)

### Decision 7. Chroma DB 단일 인스턴스 기반 Multi-Tenancy 설계
- **상황**: 노인용 RAG 데이터(대화 이력)와 보호자용 RAG 데이터(돌봄 가이드)의 격리가 필요했으나, DB 파드를 복수로 띄우면 클러스터 자원 소모가 심각
- **결정**: Chroma DB는 1개 인스턴스로 유지하되 Collection(`elderly_context`, `guardian_context`) 단위로 분리하고, 개인 데이터는 Metadata Filtering(`where={"user_id": ...}`)으로 격리
- **기대 효과**: 인프라 자원 소모 최소화와 Row-Level 데이터 격리 양립

---

## 트러블슈팅

### 이슈 1. Python FastAPI GIL로 인한 STT/TTS 프리징
- **문제**: STT/TTS와 치매 분석 모델이 동일 프로세스 내에서 동시 실행될 때, CPU-Bound 연산인 분석 모델이 GIL(Global Interpreter Lock)을 점유해 실시간 음성 대화가 끊기는 현상 발생
- **해결**: 치매 분석 로직을 메인 이벤트 루프에서 완전히 분리 — 대화 완료 시 MQ로 메시지를 내보내고, 별도 Multi-processing Worker 파드가 MQ 데이터를 가져가 처리하도록 물리적 파드 분리

### 이슈 2. Redis Session Context 만료로 인한 대화 끊김
- **문제**: 고령층 특성상 대화 사이 침묵이 길어, 기존 TTL 기반 Redis Context가 대화 도중 만료되어 LLM이 맥락을 잃는 문제 발생
- **해결**: 대화 입력 이벤트가 발생할 때마다 Context TTL을 슬라이딩 방식으로 자동 연장(Sliding Expiration)하는 인터셉터 로직 구축

## Engineering Practice — CLAUDE.md 기반 AI 협업 개발 프로세스 (본인이 직접 작성/주도)

이건 기술적 Decision이 아니라 본인이 구축한 **개발 문화/방법론**에 가까움.

TDD 기반 개발 프로세스를 Claude Code가 따르도록 정의한 프로젝트 규칙 문서. 아래는 실제 작성한 것과 유사한 예시이며, 완성본 그 자체는 아니고 이 외 추가 규칙은 별도 docs로 관리 중.

- **개발 철학**: 가독성보다 유지보수성, 빠른 개발보다 안정성/테스트/확장성 우선. 모든 기능은 반드시 Test → Implementation → Refactoring(TDD Red-Green-Refactor) 순서를 따름
- **아키텍처 원칙**: Controller → Service → Repository → Database 레이어드 아키텍처, Service끼리 직접 호출 최소화, Controller엔 로직 없음, Repository엔 Query만 존재
- **Entity/DTO 규칙**: Setter 금지, Builder 패턴 사용, Entity를 Controller에서 직접 반환하지 않고 반드시 DTO로 변환
- **gRPC 원칙**: Spring은 AI 서버를 직접 구현하지 않으며 gRPC Client만 가짐, 모든 AI 요청에 timeout/retry/Circuit Breaker 적용 가능하도록 설계
- **Claude Code 전용 규칙**: 여러 기능을 한 번에 구현하지 않고 작은 단위로 Test→구현→리팩토링 순서 강제, 코드 작성 전 반드시 "요구사항/설계 방향/테스트 케이스/구현 순서"를 먼저 출력하도록 규칙화, 추측 구현 금지(모르는 요구사항은 질문하도록)
- **완료 정의(Done Definition)**: 테스트 통과, 예외처리, Validation, API 응답 통일, 로그 작성, 리팩토링까지 모두 만족해야 "완료"로 인정 — 테스트 없는 기능은 미완료로 간주

> 이 문서 자체가 "AI를 단순 코드 생성기가 아니라 규칙 준수형 개발 파트너로 활용하기 위해 본인이 직접 설계한 개발 프로세스"라는 좋은 소재가 됨



## Reflection

**Walking City와의 연결**: Walking City에서는 "동시 AI 요청 처리"라는 문제를 관찰자/자문 입장에서 지켜만 봤다. Wilson에서는 동일한 문제를 이번엔 본인이 직접 시스템 구조(gRPC+MQ 분리)를 설계하며 해결했다. 하나의 문제를 다른 프로젝트에서 다시 만나 더 깊은 수준에서 해결한 경험.

**팀원 이탈과 PM 역할 흡수**: 원래 PM/Designer를 겸임하던 팀원(노현수)이 프로젝트 중간에 이탈하면서, 본인이 Backend/App 개발에 더해 PM 역할(기획, 일정 관리)까지 흡수해야 했다. 역할이 늘어난 상황에서도 프로젝트를 계속 진행시킨 경험은, 예상치 못한 팀 변화에 대응하는 유연성과 책임감을 보여줄 수 있는 소재.

**AI 서비스에 대한 관점**: 이 프로젝트를 진행하며, AI 서비스의 완성도는 모델 성능만큼이나 이를 뒷받침하는 서비스 아키텍처(실시간성, 확장성, 장애 복구력)에 달려있다는 것을 체감했다. LLM 응답이 아무리 좋아도, 그 응답이 지연되거나 끊기면 사용자는 좋은 AI 경험으로 느끼지 못한다.

## 실패/한계 (정직하게 기록)

- **현재 미완성**: 각 파트가 개별적으로 약 50% 완성됐고, 아직 파트 간 통합이 완료되지 않음
- **K8s 미배포**: Decision 2, 3에 서술된 K8s 기반 인프라(Ingress TLS Termination, Headless Service)는 설계 완료 단계이며, 실제로는 아직 각자 개별 Docker 컨테이너로 배포 중이라 K8s가 적용되지 않은 상태
- **검증 안 된 성과**: "데이터 유실률 0%", "페이로드 50% 이상 축소" 등은 설계상 기대되는 효과이며, 실제 측정된 결과가 아님. 통합 및 배포, 부하 테스트 이후 실측치로 교체 필요
- **아키텍처 설계 주체**: Decision 1(gRPC 채택)과 Decision 3(Headless Service+Round Robin)은 본인이 직접 논거를 세워 제안/설계한 것이 맞으나, Decision 2(K8s 인프라 보안 구조)는 팀원 2명과 공동 설계했고, Decision 4(MQ/직렬화)는 깊은 트레이드오프 검토 없이 채택된 약한 결정이므로 자소서에서 비중 있게 쓰지 않는 것을 권장

---

## 자소서/면접에서 쓸만한 포인트 메모

- **Backend/Full Stack 지원 시**: 본인이 직접 논거를 세워 REST 대신 gRPC를 제안한 과정(형태소 단위 스트리밍으로 체감 대기시간 최소화 + 바이너리 직접 전송으로 파싱 오버헤드 제거) — 이게 이 프로젝트에서 가장 강력한 개별 기여 사례. Headless Service+Round Robin 설계도 본인이 직접 문제를 진단하고 해결책을 설계한 사례
- **Software Engineer 지원 시**: TLS Termination 위치(경계 보안 vs 내부망 h2c)에 대한 트레이드오프 판단, GIL 병목을 물리적 파드 분리로 해결한 트러블슈팅, Redis Sliding Expiration으로 세션 만료 문제를 해결한 설계
- **Problem Solver 지원 시**: Walking City에서 자문으로만 겪었던 "동시 AI 요청 처리 한계"를, Wilson에서는 직접 구현 주체가 되어 gRPC 제안부터 해결까지 이어간 성장 스토리
- **PM/Product Engineer 지원 시**: 초고령사회 통계 기반 문제 정의, 노인·보호자 이중 케어 구조라는 서비스 기획, **CLAUDE.md로 AI 협업 개발 프로세스 자체를 설계한 경험** — TDD 워크플로우, 완료 정의(Done Definition), Claude Code 전용 규칙까지 본인이 직접 설계해 "AI를 통제 하에 두고 활용하는 개발 방법론"을 구축한 것은 최근 채용 시장에서 시의성 있는 강력한 소재
- **정직함이 강점이 되는 지점**: 아직 통합/배포되지 않은 상태를 숨기지 않고, 어떤 결정이 본인 주도였고 어떤 건 공동 설계였는지, 어떤 수치가 검증됐고 어떤 게 기대치인지 구분해서 말할 수 있다는 것 자체가 신뢰도를 높이는 포인트

---

## 나중에 채우면 좋을 것 (통합/검증 후 업데이트 필수)
- 파트 간 통합 완료 여부 및 실제 동작 확인
- K8s 실제 적용 여부 (현재는 개별 Docker 컨테이너 상태) 및 적용 후 Decision 2, 3 검증
- Decision 1의 정량 효과(응답 속도, 데이터 유실률) 실측치
- 부하 테스트 결과 (동시 사용자 수, 응답 시간 등)
- AI Engineer 팀원과의 gRPC .proto 스키마 연동 과정에서 실제 겪은 트러블슈팅 (있다면)
