# 곽도윤 포트폴리오

백엔드 중심 풀스택 엔지니어 포트폴리오. "무엇을 만들었는가"가 아니라 "어떤 문제를 어떻게 정의하고 왜 그렇게 판단했는가"를 보여주는 데 초점을 둔다. 디자인 컨셉과 콘텐츠 규칙은 [`CLAUDE.md`](./CLAUDE.md)에 정리되어 있다.

## Stack

- Next.js 16 (App Router, 정적 export — `output: "export"`)
- TypeScript strict
- Tailwind CSS v4
- Vitest
- Vercel 배포 대상

콘텐츠는 DB 없이 `src/content/projects/*.ts`의 타입이 강제된 데이터 레이어로 관리한다. 각 파일은 공통 `Project` 타입(`problem → decisions → implementation → outcome → reflection`)을 export한다.

## 개발

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## 검증

```bash
pnpm test              # 콘텐츠 레이어 유닛 테스트 (vitest)
pnpm lint               # eslint
npx tsc --noEmit        # 타입체크
pnpm build               # 정적 export 빌드 (out/)
```

`pnpm test`는 프로젝트 데이터가 필수 필드를 갖췄는지, slug가 중복되지 않는지, 금지어가 섞이지 않았는지, 모든 프로젝트에 problem과 최소 1개의 decision이 있는지, outcome에 `verified` 플래그가 있는지를 검사한다.

## 배포 도메인

`src/lib/site.ts`의 `NEXT_PUBLIC_SITE_URL` 환경변수로 OG 이미지·sitemap·robots에 쓰이는 절대 도메인을 관리한다. 배포 전 실제 도메인으로 설정할 것.

## 디렉토리 구조

```text
src/
  app/                 라우트 (/, /projects, /projects/[slug], /about)
  components/          UI 컴포넌트
  content/
    profile.ts         기본 정보 (학력·스택·활동·수상·발표)
    projects/*.ts       프로젝트별 Project 타입 데이터 + __tests__
```
