import type { Project } from "./types";

export const wilson: Project = {
  slug: "wilson",
  name: "Wilson",
  oneLiner: "초고령사회 대응 음성 AI 플랫폼 — 실시간 대화와 백그라운드 분석을 분리하는 아키텍처를 직접 근거를 세워 제안한 기록",
  status: "개발 중",
  period: "2026.06 ~ 진행 중",
  roles: ["Backend", "PM"],
  myRole:
    "PM 겸 Backend Engineer 겸 Mobile App Developer — Backend·App 구현 전담, 프로젝트 중간에 PM 역할도 함께 맡음. 시스템 아키텍처는 AI 담당 팀원들과 공동 설계",
  teamSize: "총 4명 (Backend·App·PM 본인 / Designer 1 / AI 1 / AI+Infra 1)",
  stack: [
    { category: "Mobile", items: ["React Native (Expo)", "TypeScript", "TanStack Query", "Zustand"] },
    { category: "Backend", items: ["Java 17", "Spring Boot 3.x", "Spring Security", "Spring Data JPA"] },
    { category: "AI Server (팀원 담당)", items: ["Python", "FastAPI", "OpenAI Whisper/TTS API", "PyTorch", "BERT"] },
    { category: "Database", items: ["PostgreSQL", "Redis"] },
    { category: "Messaging", items: ["Apache Kafka"] },
    { category: "IPC/Infra", items: ["gRPC (HTTP/2)", "Docker", "Kubernetes (설계 단계)", "AWS ALB"] },
  ],
  featured: true,

  problem:
    "2025년 한국 고령인구 비중은 20.3%로 초고령사회에 진입했고, 독거노인 비중은 32.8%에 달한다. 노인의 67.2%가 디지털 적응에 어려움을 느끼는데, 기존 AI 챗봇은 '사용자가 먼저 말을 걸어야 하는' 수동적 텍스트 방식에 머물러 있었다. 동시에 노인 돌봄의 81.4%를 가족이 부담하고 보호자의 스트레스 경험률이 46.3%에 달하는데도, 기존 서비스는 노인 단독 케어에 치우쳐 보호자를 위한 통합 케어는 없었다. AI가 먼저 말을 거는 선제적 음성 인터페이스와, 노인·보호자를 동시에 케어하는 이중 구조를 핵심 방향으로 잡았다.",

  decisions: [
    {
      title: "실시간 대화와 무거운 AI 연산 분리 (gRPC + Message Queue) — 본인이 제안",
      situation:
        "음성 대화는 실시간 응답이 필수인 반면, 대화 기반 치매 징후·감정 분석(BERT)은 연산이 무거워 수 초가 걸렸다.",
      options: ["REST API로 통합 처리한다", "실시간 구간은 gRPC 스트리밍, 분석 구간은 메시지 큐로 분리한다"],
      reasoning:
        "형태소 단위로 끊어 스트리밍하면 체감 대기시간을 줄일 수 있고, gRPC는 음성 데이터를 바이너리로 직접 전달할 수 있어 REST 대비 파싱 오버헤드가 없다는 두 가지 근거로 gRPC를 제안했다.",
      tradeoff:
        "REST보다 초기 구현 복잡도가 높아지는 대신, 실시간 구간과 분석 구간의 부하가 서로에게 전파되지 않는 구조를 얻었다.",
      result:
        "대화 구간은 gRPC h2c 스트리밍으로, 분석 구간은 MQ 발행 후 백그라운드 처리로 분리했다. AI 분석 부하와 무관한 응답 속도, 분석 서버 장애 시 데이터 유실 방지가 기대 효과이나 파트 간 통합 전이라 아직 실측 검증 전이다.",
    },
    {
      title: "K8s 내부 통신 보안 구조 (Ingress TLS Termination + h2c) — 팀원과 공동 설계, 설계 단계",
      situation: "Pod 간 내부 통신까지 TLS를 적용하면 인증서 관리와 CPU 암복호화 오버헤드가 늘어난다.",
      options: ["내부 통신에도 TLS를 전면 적용한다", "외부 구간만 TLS로 종단하고 내부는 평문 HTTP/2(h2c)로 구성한다"],
      reasoning: "경계 보안(Perimeter Security) 관점에서 인증서 관리 포인트를 인프라 단으로 일원화하는 쪽이 유리하다고 판단했다.",
      tradeoff: "내부 통신 보안을 경계로 위임하는 트레이드오프를 감수했다.",
      result:
        "설계는 완료했으나, 현재는 각자 개별 Docker 컨테이너로 배포 중이라 K8s 자체가 아직 적용되지 않았다. 실제 배포 후 검증이 필요하다.",
    },
    {
      title: "gRPC Keep-Alive 쏠림 해결 (Headless Service + Client-Side Round Robin) — 본인이 설계, 설계 단계",
      situation:
        "gRPC는 HTTP/2 기반 단일 커넥션을 재사용하기 때문에, AI Pod가 여러 개 떠 있어도 트래픽이 특정 Pod로만 쏠릴 수 있었다.",
      options: [
        "클러스터 레벨 로드밸런서에 맡긴다",
        "K8s Headless Service로 Pod IP 목록을 직접 받아 클라이언트에서 Round Robin을 적용한다",
      ],
      reasoning:
        "같은 K8s 단위로 관리되는 내부 통신에는 일반적인 클러스터 로드밸런서가 관여할 수 없다고 판단해, gRPC 클라이언트 레벨에서 직접 분산시키는 방법을 설계했다.",
      tradeoff: "별도 Service Mesh 없이 부하를 분산할 수 있는 대신, 클라이언트 라이브러리 설정에 로드밸런싱 로직을 직접 구현해야 했다.",
      result: "설계는 완료했지만 K8s가 아직 적용되지 않아 실제 배포·검증 전이다.",
    },
  ],

  implementation:
    "Spring Boot 메인 백엔드 서버와 PostgreSQL/Redis 데이터 아키텍처를 설계하고, React Native(Expo) 기반 음성 인터페이스와 보호자 대시보드 앱을 개발했다. Mobile ↔ Backend ↔ AI Server 간 gRPC/REST/MQ 데이터 파이프라인은 AI 엔지니어 팀원과 공동으로 설계했다.\n\n트러블슈팅으로는 두 가지를 해결했다. FastAPI에서 STT/TTS와 치매 분석 모델이 같은 프로세스에서 동시 실행될 때 CPU-bound 연산이 GIL을 점유해 음성 대화가 끊기는 문제는, 분석 로직을 별도 멀티프로세싱 워커 파드로 물리적으로 분리해 해결했다. 고령층 특성상 대화 사이 침묵이 길어 Redis 세션 컨텍스트가 도중에 만료되는 문제는, 대화 입력이 있을 때마다 TTL을 슬라이딩 방식으로 연장하는 인터셉터로 해결했다.\n\n이와 별개로 CLAUDE.md 기반 AI 협업 개발 프로세스(TDD Red-Green-Refactor, 레이어드 아키텍처 원칙, 완료 정의)를 직접 작성해 팀의 개발 방법론으로 주도했다.",

  outcome: [
    { label: "2026 글로벌 피우다프로젝트 대학생 지원 프로그램에 선정되어 개발 진행 중", verified: true },
    {
      label: "AI 분석 부하와 무관한 실시간 응답, 분석 서버 장애 시 데이터 유실 방지",
      verified: false,
      note: "설계 의도·기대 효과 — 파트 간 통합 전이라 실측 전",
    },
    {
      label: "K8s 기반 무중단 로드밸런싱 및 내부 통신 보안 구조",
      verified: false,
      note: "설계 완료, 실제로는 개별 Docker 컨테이너로 배포 중 — K8s 미적용",
    },
  ],

  reflection:
    "현재 각 파트(Backend/App/AI Server)가 개별적으로 약 50% 정도 완성된 상태이고, 아직 파트 간 통합은 되지 않았다. K8s 기반 인프라도 설계까지만 끝났고 실제로는 각자 개별 Docker 컨테이너로 배포 중이다. 이 페이지의 아키텍처 서술 중 상당 부분은 설계 의도이며, 통합·배포·부하 테스트 이후 실측치로 교체할 부분이 남아 있다.\n\n원래 5명이었던 팀에서 PM 겸 디자인을 맡았던 팀원이 프로젝트 중간에 이탈해, 본인이 Backend/App 개발에 더해 PM 역할(기획, 일정 관리)까지 함께 맡게 됐다. Walking City에서는 '동시 AI 요청 처리' 문제를 자문 입장에서 지켜만 봤다면, Wilson에서는 같은 문제를 이번엔 직접 시스템 구조(gRPC+MQ 분리)를 설계하며 마주했다.",
};
