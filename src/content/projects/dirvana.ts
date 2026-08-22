import type { Project } from "./types";

export const dirvana: Project = {
  slug: "dirvana",
  name: "Dirvana",
  oneLiner: "동국대 2025 가을축제 사이트 — 운영 중 발생한 실제 장애를 근본 원인까지 추적해 구조적으로 방어한 기록",
  status: "운영 종료",
  period: "2025.09 (1개월 집중 개발)",
  roles: ["Backend", "Infra"],
  myRole: "BE 파트 리더 & FE 개발 팀원 — 인프라 전 영역과 핵심 기능 3종을 풀스택으로 전담",
  teamSize: "총 31명 (기획/디자인 6, FE 6, BE 8, 대외협력 11)",
  stack: [
    { category: "Language", items: ["Python", "TypeScript"] },
    { category: "Backend", items: ["Django REST Framework", "Google Gemini API"] },
    { category: "Database", items: ["SQLite3", "Amazon S3", "RDS"] },
    { category: "Infra", items: ["AWS EC2", "CloudFront", "WAF", "ALB"] },
    { category: "Client", items: ["React", "Axios", "Zustand"] },
  ],
  links: [
    { label: "GitHub (Backend)", url: "https://github.com/LikeLion-at-DGU/2025_fall_festival_BE" },
    { label: "GitHub (Frontend)", url: "https://github.com/LikeLion-at-DGU/2025_fall_festival_front" },
  ],
  featured: true,

  problem:
    "기존 교내 축제 사이트는 시간표·부스 위치 같은 정적 정보를 보여주는 데 그쳤다. 사용자는 필요한 정보만 확인하고 바로 이탈했고, 참여를 유도할 장치가 없었다. 목표를 '정보 전달'에서 '사용자가 직접 참여하고 축제 경험을 확장하는 서비스'로 재정의했다.\n\n다만 기능을 늘리는 데 집중하는 동안 코드 품질과 인프라를 함께 챙기려던 초기 의도가 흐려졌다. '교내 서비스라 공격받을 일은 없을 것'이라는 판단 아래 보안 설정 없이 축제 당일 오전 9시 서비스를 열었고, 이 판단은 그날 실제 장애로 이어졌다.",

  decisions: [
    {
      title: "CloudFront + AWS WAF 기반 방어 구조 도입",
      situation:
        "EC2 Public IP가 그대로 노출된 상태였고 CDN·WAF·Rate Limit이 전무했다. 축제 1일차 13시 `/api/like/`에 초당 100회 이상, 16시 `/api/game/success/`에 초당 200회 이상의 비정상 POST 요청이 들어왔다. 프론트를 거치지 않고 백엔드 API를 직접 호출하는 방식이었다.",
      options: [
        "EC2를 그대로 노출한 채 Django Throttle만 적용",
        "CloudFront + WAF로 서비스 앞단에 방어 계층을 둔다",
      ],
      reasoning:
        "공격 IP 차단(Nginx), DRF AnonRateThrottle(10/min) 적용, 도메인 변경을 순서대로 시도했지만 전부 임시방편에 그쳤다. Throttle은 Gunicorn Worker가 요청을 이미 할당받은 뒤 Django 레벨에서 검사하기 때문에 리소스 점유 자체를 막지 못했고, 도메인을 바꿔도 EC2 Public IP로 직접 접근이 가능했다. 비정상 요청은 애플리케이션 코드가 아니라 네트워크 레벨에서 막아야 한다고 판단했다.",
      tradeoff:
        "WAF Rate-Based Rule 임계값(5분간 IP당 100회 초과 시 차단)은 임의로 정하지 않고, 공격 이전까지의 GA 활성 사용자 수와 정상 API 요청 빈도를 기준으로 산출했다. 임계값을 너무 낮추면 정상 사용자 트래픽까지 차단할 위험이 있었다.",
      result:
        "Client → CloudFront → WAF → ALB → EC2(Private Subnet) → RDS 구조로 전환했다. EC2 Security Group에서 80/443 포트를 CloudFront IP 대역에서만 허용해 Origin 직접 접근을 차단하고, AWS Managed Rule Set(SQL Injection/XSS 방어)과 IP Reputation Rule을 함께 적용했다.\n\n장애 당시에는 '대량 트래픽 때문에 서버가 죽었다'고 판단했지만, 이후 로그를 다시 분석한 결과 실제 원인은 SQLite의 파일 기반 Single Write Lock이었다. 공격성 POST 요청이 DB Write 엔드포인트(`/api/like/`, `/api/game/success/`)에 몰리며 동시 Write 경합이 발생했고, `database is locked` 에러로 서비스 전체가 응답 불능 상태가 됐다. CloudFront/WAF 구조는 이 중복 요청 자체를 Edge에서 차단해 문제를 근본적으로 우회했다.",
    },
    {
      title: "서버 발급 세션 ID로 사용자 식별",
      situation:
        "게임·좋아요 기능의 중복 참여를 막아야 했다. 특히 게임은 중복 참여 시 쿠폰 중복 지급이라는 실제 비즈니스 오류로 이어질 수 있었다.",
      options: ["프론트엔드에서 참여 여부를 관리한다", "백엔드가 발급한 세션 ID로 식별한다"],
      reasoning:
        "클라이언트가 보내는 데이터는 신뢰할 수 없고, 쿠폰 발급처럼 실질적 가치가 있는 로직은 서버에서 검증해야 한다고 판단했다.",
      tradeoff:
        "세션 ID를 클라이언트 session storage에 저장하는 방식은 JS로 직접 조작이 가능해 위변조 여지가 남았다. 지금 다시 설계한다면 비로그인 상태에서도 위변조가 어려운 JWT 기반 식별을 쓸 것이다.",
      result: "게임 중복 참여 방지와 좋아요 사용자 구분은 가능해졌지만, 완전한 위변조 방지에는 한계가 있는 구조로 남았다.",
    },
    {
      title: "Gemini API로 다국어 번역 기능 구현",
      situation: "교환학생 대상 다국어 번역 기능이 필요했다.",
      options: ["번역 모델을 직접 구축한다", "외부 LLM API를 연동한다"],
      reasoning:
        "한 달짜리 프로젝트에서는 모델 개발보다 빠른 구현이 중요했고, LLM 기반 번역 품질이 충분히 준수했다.",
      tradeoff: "별도 ML 인프라 없이 기능을 제공할 수 있었지만, 번역 품질과 응답 속도를 외부 API에 전적으로 의존하게 됐다.",
      result: "별도 인프라 구축 없이 다국어 번역 기능을 제공했다.",
    },
  ],

  implementation:
    "BE 파트 리더로서 API 설계 방향과 개발 일정을 관리하고, 기능별 구현 분배와 코드 리뷰를 맡았다. 배포·인프라 전 영역(EC2, CloudFront, WAF, ALB, RDS)도 직접 담당했다.\n\n풀스택으로 직접 구현한 기능은 세 가지다. 카드 매칭 게임 이벤트는 성공 시 쿠폰을 지급하는 구조로, 교내 주점 주문 시스템과 API로 연동해 발급된 쿠폰을 조회·전달하도록 설계했다. Gemini API를 연동해 다국어 번역 기능을 제공했고, 좋아요·게임 중복 참여를 막기 위한 세션 기반 사용자 식별 API를 구현했다.\n\n장애 대응 과정에서는 1차 공격 이후 IP 차단, Throttling, 도메인 변경을 순서대로 시도했다. 모두 임시방편에 그친 뒤, CloudFront + WAF 구조로 전환해 안정화시켰다. 2일차 오전 재공격 시도가 있었지만 CloudFront 단에서 차단됐고, 이후 서비스는 안정적으로 운영됐다.",

  outcome: [
    { label: "GA 기준 3일간 누적 활성 사용자 10,000명 이상, 최대 DAU 8,000명", verified: true },
    { label: "게임 이벤트 누적 참여 20,000회 이상 (1인 1일 최대 5회 참여 가능한 구조)", verified: true },
    {
      label: "2차례의 실제 공격 상황을 1일차 내에 구조적으로 방어 체계를 구축해 대응, 이후 재공격 시도에도 안정 운영",
      verified: true,
    },
  ],

  reflection:
    "SQLite는 근본적으로 프로덕션 동시 Write에 부적합한 구조였지만, 한 달이라는 프로젝트 기간 안에서는 RDBMS 마이그레이션 대신 CloudFront/WAF로 중복 요청 자체를 차단하는 방식으로 우회했다. 이때 인식한 한계는 이후 2026년 봄 축제 프로젝트에서 MySQL 볼륨 마운트 구조로 실제 전환하며 이어졌다.\n\nBE 파트 리더로서 인프라 설계, 배포, 핵심 기능 구현, 장애 대응까지 대부분을 직접 담당했는데, 이는 프로젝트 전체가 리더 한 사람에게 과도하게 의존하는 구조를 만들었다. 리더의 역할은 '대신 다 해내는 것'이 아니라 '팀원이 각자의 역할을 해낼 수 있도록 병목을 없애는 것'이라는 걸 이 경험으로 배웠다.\n\n장애를 인지한 계기도 팀원의 수동 발견이었다. 로깅과 웹훅을 연동해 이상 트래픽 발생 시 자동 알림이 오는 구조였다면, 장애 인지와 초기 대응 속도를 앞당길 수 있었을 것이다.",
};
