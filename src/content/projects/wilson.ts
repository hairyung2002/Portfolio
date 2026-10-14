import type { Project } from "./types";

export const wilson: Project = {
  slug: "wilson",
  name: "Wilson",
  period: "2026.06 ~",
  featured: true,
  status: "개발 완료 · 검증 전",
  line: "실시간 음성 대화와 무거운 AI 분석을 분리한 치매 돌봄 플랫폼",
  tag: "AI 서비스 · 분산 구조",
  insight: "실시간 대화와 무거운 분석을 *같은 길에 두지 않았습니다.*",
  role: "PM · Backend · Mobile App",
  context:
    "치매 당사자와 보호자를 함께 돌보는 음성 AI 플랫폼입니다. AI가 먼저 안부를 묻고, 대화 내용은 백그라운드에서 분석돼 보호자 대시보드로 전달됩니다. 백엔드와 앱을 맡았고, 프로젝트 중간에 PM 역할을 함께 맡게 되었습니다.",
  outcome: ["2026 글로벌 피우다프로젝트 선정"],
  pending: {
    label: "측정 전",
    text: "개발은 완료했고, 응답 속도와 부하 처리 같은 성능 수치는 아직 측정하지 않았습니다.",
  },
  decisions: [
    {
      title: "대화는 gRPC로, 분석은 큐로",
      subtitle: "직접 제안한 분리 구조",
      situation:
        "음성 대화는 즉시 응답해야 하지만, BERT 기반 치매 징후·감정 분석은 수 초가 걸리는 무거운 연산입니다.",
      optionLabel: "선택",
      options: [
        { title: "REST로 한 번에 처리", desc: "분석이 끝날 때까지 대화가 대기" },
        { title: "gRPC 스트리밍 + 메시지 큐", desc: "대화와 분석의 경로를 분리", chosen: true },
      ],
      reasoning:
        "답변을 형태소 단위로 끊어 스트리밍하면 체감 대기가 줄고, gRPC는 음성을 바이너리로 바로 전달해 파싱 부담이 없습니다. 분석은 대화가 끝나면 큐로 넘기고 즉시 응답합니다.",
      tradeoff:
        "구성 요소와 운영 포인트가 늘어납니다. 큐는 형태소 조각의 순서 보장과 사용자 증가 시의 처리량을 함께 고려해 Kafka를 택했습니다.",
      result: "분석 부하와 관계없이 대화가 이어지는 구조로 구현했습니다. 응답 속도는 아직 측정 전입니다.",
    },
    {
      title: "침묵이 길어도 맥락을 잃지 않게",
      subtitle: "Redis 세션의 Sliding Expiration",
      situation:
        "고령 사용자는 대화 사이 침묵이 깁니다. 고정 TTL 세션이 대화 도중 만료되면서 LLM이 맥락을 잃었습니다.",
      reasoning:
        "대화가 이어지는 동안에만 세션이 살아 있도록, 대화 입력 이벤트가 들어올 때마다 TTL을 연장하는 인터셉터를 만들었습니다.",
      tradeoff: "입력마다 Redis에 쓰기가 한 번씩 더 생깁니다.",
      result: "긴 침묵 뒤에도 대화 맥락이 유지됩니다.",
    },
    {
      title: "한 연결에 몰리는 트래픽",
      subtitle: "Headless Service + 클라이언트 Round Robin",
      situation:
        "gRPC는 HTTP/2 연결 하나를 계속 재사용해서, AI 서버를 여러 개 띄워도 요청이 한 곳에 몰릴 수 있습니다.",
      optionLabel: "선택",
      options: [
        { title: "클러스터 L4 로드밸런서", desc: "재사용되는 연결 안의 요청은 나누지 못함" },
        { title: "gRPC 클라이언트 Round Robin", desc: "클라이언트가 직접 서버를 번갈아 선택", chosen: true },
      ],
      reasoning:
        "Headless Service로 모든 AI 서버 주소를 받아, Spring의 gRPC 클라이언트가 직접 번갈아 보내도록 설계했습니다.",
      tradeoff: "서비스 메시 없이 해결하는 대신, 분산 로직이 클라이언트 설정에 들어갑니다.",
      result: "설계를 마쳤고, 쿠버네티스 배포 후 실제 분산을 검증할 예정입니다.",
    },
  ],
  implementation:
    "Spring Boot 메인 백엔드 서버와 PostgreSQL/Redis 데이터 아키텍처를 설계하고, React Native(Expo) 기반 음성 인터페이스와 보호자 대시보드 앱을 개발했다. Mobile ↔ Backend ↔ AI Server 간 gRPC/REST/MQ 데이터 파이프라인은 AI 엔지니어 팀원과 공동으로 설계했다.\n\n트러블슈팅으로는 두 가지를 해결했다. FastAPI에서 STT/TTS와 치매 분석 모델이 같은 프로세스에서 동시 실행될 때 CPU-bound 연산이 GIL을 점유해 음성 대화가 끊기는 문제는, 분석 로직을 별도 멀티프로세싱 워커 파드로 물리적으로 분리해 해결했다. 고령층 특성상 대화 사이 침묵이 길어 Redis 세션 컨텍스트가 도중에 만료되는 문제는, 대화 입력이 있을 때마다 TTL을 슬라이딩 방식으로 연장하는 인터셉터로 해결했다.\n\n이와 별개로 CLAUDE.md 기반 AI 협업 개발 프로세스(TDD Red-Green-Refactor, 레이어드 아키텍처 원칙, 완료 정의)를 직접 작성해 팀의 개발 방법론으로 주도했다.",
  reflection:
    "K8s 기반 인프라는 설계까지만 끝났고, 실제로는 각자 개별 Docker 컨테이너로 배포 중이다. 이 페이지의 아키텍처 서술 중 상당 부분은 설계 의도이며, 배포·부하 테스트 이후 실측치로 교체할 부분이 남아 있다.\n\nWalking City에서는 '동시 AI 요청 처리' 문제를 자문 입장에서 지켜만 봤다면, Wilson에서는 같은 문제를 이번엔 직접 시스템 구조(gRPC+MQ 분리)를 설계하며 마주했다.",
  threads: [
    {
      dir: "이전",
      name: "Walking City",
      text: "자문 입장에서 지켜본 \"동시 AI 요청 처리\" 한계를, Wilson에서는 직접 구조를 제안하고 구현해 풀었습니다.",
      href: "/projects/walking-city",
    },
  ],
};
