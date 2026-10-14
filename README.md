# 곽도윤 포트폴리오

백엔드 중심 풀스택 엔지니어 포트폴리오. "무엇을 만들었는가"가 아니라 "어떤 문제를 어떻게 정의하고 왜 그렇게 판단했는가"를 보여주는 데 초점을 둔다. 디자인 컨셉과 콘텐츠 규칙은 [`CLAUDE.md`](./CLAUDE.md), 화면·모션 기준은 [`docs/portfolio-prototype.html`](./docs/portfolio-prototype.html)과 [`docs/HANDOFF.md`](./docs/HANDOFF.md)에 정리되어 있다.

## Stack

- Next.js 16 (App Router, 정적 export — `output: "export"`)
- TypeScript strict
- Tailwind CSS v4
- GSAP + ScrollTrigger, Lenis
- Vitest
- Vercel 배포 대상

콘텐츠는 DB 없이 `src/content/`의 타입이 강제된 데이터 레이어로 관리한다. 프로젝트는 공통 `Project` 타입(한 줄 결론 → 배경 → 결과 → 판단 → 이어진 것)을 export한다.

## 개발

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## 검증

```bash
pnpm test              # 콘텐츠 레이어·라우트 유닛 테스트 (vitest)
pnpm lint              # eslint
npx tsc --noEmit       # 타입체크
pnpm build             # 정적 export 빌드 (out/)
```

`pnpm test`는 프로젝트 데이터의 필수 필드, slug 중복, 공개 금지 콘텐츠(모든 콘텐츠 파일 대상), 진행 중 프로젝트의 측정 전 안내, 링크 대상 경로를 검사한다.

## 배포 도메인

`src/lib/site.ts`가 OG 이미지·sitemap·robots에 쓰는 절대 도메인을 정한다. `NEXT_PUBLIC_SITE_URL`이 있으면 그 값을, 없으면 Vercel이 빌드 때 넣어주는 `VERCEL_PROJECT_PRODUCTION_URL`을 쓴다. 커스텀 도메인을 쓴다면 `NEXT_PUBLIC_SITE_URL`로 지정한다.

## 디렉토리 구조

```text
src/
  app/                       라우트 (/, /projects, /projects/[slug], /projects/[slug]/decisions/[n], /about)
  components/
    TransitionProvider.tsx   페이지 전환(줌 인/아웃/옆으로), 스크롤 기억, ESC·뒤로
    IndexStage.tsx           메인 스크롤 장면과 진입 애니메이션
    DepthScene.tsx           목록·상세·판단·About의 깊이 효과
  content/
    profile.ts               이름·연락처·메인 대문장(HEADLINE)
    activities.ts            메인 Activities + About 활동
    about.ts                 학력·발표·수상·기술
    otherProjects.ts         그 외 프로젝트 목록
    projects/*.ts            프로젝트별 Project 데이터 + __tests__
  lib/
    routes.ts                화면 깊이·상위 경로 계산
    motion.ts                GSAP 등록, 스크롤 잠금, 장면 등록(useScene), 공용 트윈
```
