import type { Project } from "./types";

export const dirvana: Project = {
  slug: "dirvana",
  name: "Dirvana",
  period: "2025.09",
  featured: true,
  status: "운영 종료",
  line: "축제 첫날 공격으로 멈춘 서비스를 당일 구조 전환으로 되살린 기록",
  tag: "운영 · 장애 대응 · 인프라",
  insight: "트래픽 때문에 죽은 줄 알았던 서버, 원인은 *SQLite Write Lock*이었습니다.",
  role: "BE 파트 리더 · 인프라 전담",
  context:
    "동국대 2025 가을축제 사이트입니다. 31명 팀에서 백엔드 8명을 이끌며 배포와 인프라 전체를 맡았습니다. 축제 첫날 두 차례의 L7 HTTP Flood로 서비스가 멈췄고, 그날 저녁 방어 구조를 바꿔 남은 이틀을 안정적으로 운영했습니다.",
  outcome: [
    "3일 누적 활성 사용자 10,000명 이상, 최대 DAU 8,000명 (GA)",
    "카드 매칭 게임 누적 참여 20,000회 이상 (GA)",
    "2일차 재공격을 Edge에서 차단하고 이후 안정 운영",
  ],
  decisions: [
    {
      title: "공격은 서비스 앞단에서 막는다",
      subtitle: "CloudFront + AWS WAF 다층 방어",
      situation:
        "EC2 Public IP가 그대로 노출된 상태에서, 프론트를 거치지 않고 API를 직접 호출하는 요청이 초당 100~200회씩 들어왔습니다.",
      optionLabel: "선택",
      options: [
        { title: "EC2 노출 유지 + Django Throttle", desc: "코드에서 요청 수를 제한" },
        { title: "CloudFront + WAF로 앞단 방어", desc: "요청이 서버에 닿기 전에 걸러냄", chosen: true },
      ],
      reasoning:
        "IP 차단, DRF Throttle, 도메인 변경을 차례로 시도했지만 모두 임시방편이었습니다. Throttle은 Gunicorn Worker가 요청을 받은 뒤에 검사하므로 리소스 점유를 막지 못했고, 도메인을 바꿔도 Public IP로 바로 접근할 수 있었습니다.",
      tradeoff:
        "임계값이 낮으면 정상 사용자도 차단됩니다. \"5분간 IP당 100회 초과 시 차단\"은 공격 전까지의 GA 활성 사용자 수와 정상 요청 빈도로 산출했습니다.",
      result:
        "Client → CloudFront → WAF → ALB → EC2(Private) → RDS 구조로 바꾸고, EC2는 CloudFront IP 대역만 받도록 막았습니다. 2일차 재공격은 Edge에서 차단됐습니다.",
    },
    {
      title: "다시 본 로그가 가리킨 진짜 원인",
      subtitle: "사후 분석과 SQLite WAL 모드",
      situation:
        "당시엔 트래픽 과부하로 판단하고 EC2 재배포로 복구했습니다. 축제가 끝난 뒤 DB 로그를 다시 확인했습니다.",
      optionLabel: "지금이라면",
      options: [
        { title: "RDBMS로 전면 마이그레이션", desc: "동시 쓰기 문제를 근본적으로 해결" },
        { title: "SQLite WAL 모드부터 전환", desc: "운영 중에도 위험이 낮은 즉시 조치", chosen: true },
      ],
      reasoning:
        "공격이 DB 쓰기 API에 몰리면서 파일 단위 Write Lock을 쓰는 SQLite에서 경합이 생겼고, database is locked 에러로 DB를 쓰는 기능 전체가 멈춘 것이었습니다. 운영 중인 서비스를 옮기는 일은 정합성과 중단 위험이 큽니다.",
      tradeoff:
        "WAL 모드는 읽기와 쓰기의 충돌을 줄이지만 쓰기끼리의 경합까지 없애지는 못합니다. 축제처럼 즉시 대응해야 하는 상황의 1차 조치입니다.",
      result:
        "당시엔 원인을 몰라 앞단 차단으로 우회했습니다. 이 회고는 2026 봄축제 사이트를 MySQL 볼륨 마운트 구조로 바꾸는 결정으로 이어졌습니다.",
    },
    {
      title: "쿠폰 중복 지급은 서버가 막는다",
      subtitle: "서버 발급 세션 ID로 사용자 식별",
      situation:
        "카드 매칭 게임에 성공하면 주점 쿠폰이 발급됩니다. 중복 참여는 곧 쿠폰 중복 지급이었습니다.",
      optionLabel: "선택",
      options: [
        { title: "프론트엔드에서 참여 여부 관리" },
        { title: "서버가 세션 ID를 발급하고 검증", chosen: true },
      ],
      reasoning:
        "클라이언트가 보내는 값은 믿을 수 없고, 실제 가치가 오가는 로직은 서버에서 검증해야 한다고 판단했습니다.",
      tradeoff:
        "세션 ID를 session storage에 저장해 JS로 조작할 여지가 남았습니다. 다시 설계한다면 위변조가 어려운 JWT 기반 비로그인 식별을 쓰겠습니다.",
      result: "게임 중복 참여와 좋아요 중복은 막았지만, 완전한 위변조 방지는 남은 과제로 기록했습니다.",
    },
  ],
  implementation:
    "BE 파트 리더로서 API 설계 방향과 개발 일정을 관리하고, 기능별 구현 분배와 코드 리뷰를 맡았다. 배포·인프라 전 영역(EC2, CloudFront, WAF, ALB, RDS)도 직접 담당했다.\n\n풀스택으로 직접 구현한 기능은 세 가지다. 카드 매칭 게임 이벤트는 성공 시 쿠폰을 지급하는 구조로, 교내 주점 주문 시스템과 API로 연동해 발급된 쿠폰을 조회·전달하도록 설계했다. Gemini API를 연동해 다국어 번역 기능을 제공했고, 좋아요·게임 중복 참여를 막기 위한 세션 기반 사용자 식별 API를 구현했다.\n\n장애 대응 과정에서는 1차 공격 이후 IP 차단, Throttling, 도메인 변경을 순서대로 시도했다. 모두 임시방편에 그친 뒤, CloudFront + WAF 구조로 전환해 안정화시켰다. 2일차 오전 재공격 시도가 있었지만 CloudFront 단에서 차단됐고, 이후 서비스는 안정적으로 운영됐다.",
  reflection:
    "SQLite는 근본적으로 프로덕션 동시 Write에 부적합한 구조였지만, 한 달이라는 프로젝트 기간 안에서는 RDBMS 마이그레이션 대신 CloudFront/WAF로 중복 요청 자체를 차단하는 방식으로 우회했다. 이때 인식한 한계는 이후 2026년 봄 축제 프로젝트에서 MySQL 볼륨 마운트 구조로 실제 전환하며 이어졌다.\n\nBE 파트 리더로서 인프라 설계, 배포, 핵심 기능 구현, 장애 대응까지 대부분을 직접 담당했는데, 이는 프로젝트 전체가 리더 한 사람에게 과도하게 의존하는 구조를 만들었다. 리더의 역할은 '대신 다 해내는 것'이 아니라 '팀원이 각자의 역할을 해낼 수 있도록 병목을 없애는 것'이라는 걸 이 경험으로 배웠다.\n\n장애를 인지한 계기도 팀원의 수동 발견이었다. 로깅과 웹훅을 연동해 이상 트래픽 발생 시 자동 알림이 오는 구조였다면, 장애 인지와 초기 대응 속도를 앞당길 수 있었을 것이다.",
  threads: [
    {
      dir: "이후",
      name: "2026 봄축제 사이트",
      text: "SQLite의 한계를 인식한 경험을 바탕으로 DB를 MySQL 볼륨 마운트 구조로 바꿨습니다.",
      href: "/projects",
    },
    {
      dir: "이후",
      name: "동데이",
      text: "리더 혼자 모든 걸 떠안아 병목이 됐던 방식 대신, 역할을 나누고 조율에 집중했습니다.",
      href: "/projects/dongday",
    },
  ],
  links: [
    { label: "GitHub · Backend", url: "https://github.com/LikeLion-at-DGU/2025_fall_festival_BE" },
    { label: "GitHub · Frontend", url: "https://github.com/LikeLion-at-DGU/2025_fall_festival_front" },
  ],
};
