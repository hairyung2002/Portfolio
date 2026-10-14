# 포트폴리오 리디자인 구현 가이드

`docs/design/portfolio-prototype.html`이 화면, 문구, 모션의 기준이다.
브라우저로 열어서 직접 스크롤하고 클릭해 보면서 구현한다.
프로토타입은 한 파일짜리 시안이라 해시 라우팅과 `innerHTML` 렌더링을 쓴다. 이 구조는 옮기지 않는다.
옮길 것은 화면 구성, 수치(크기·간격·색), 모션의 순서와 느낌이다.

기존 CLAUDE.md의 규칙은 계속 유지한다. 여기에는 공개 금지 콘텐츠, 정직성 규칙, 접근성, 성능, 테스트가 포함된다.
이 문서와 CLAUDE.md가 충돌하는 부분은 이 문서를 따른다. 충돌하는 CLAUDE.md 섹션은 7번 항목에서 함께 고친다.

---

## 1. 라우트

| 경로 | 화면 | 프로토타입 해시 |
|---|---|---|
| `/` | 메인. 소개 → Activities → Featured Projects | `#` |
| `/projects` | 대표 4개 + 그 외 프로젝트 목록 | `#projects` |
| `/projects/[slug]` | 프로젝트 상세 | `#dirvana` |
| `/projects/[slug]/decisions/[n]` | 판단 상세 (신규) | `#dirvana-d1` |
| `/about` | 학력, 활동, 발표, 수상, 기술, 연락 | `#about` |

- 모든 페이지는 실제 URL을 가진 정적 페이지로 둔다. 공유, 검색 노출, 새로고침이 모두 그 URL에서 동작해야 한다.
- 판단 상세 페이지도 `generateStaticParams`로 정적 생성한다.

## 2. 페이지 전환 (줌 인/아웃)

프로토타입의 `go()` 함수가 기준이다.

- **더 깊은 곳으로 이동** (메인 → 상세, 상세 → 판단): 클릭한 요소의 위치에서 금속 테두리 프레임이 화면 전체로 커진다. 그동안 이전 화면은 확대되며 흐려지고, 그다음 Scanning Light가 한 번 지나가고 새 화면 블록이 순서대로 올라온다.
- **얕은 곳으로 이동** (뒤로): 화면 전체 프레임이 원래 요소 위치로 줄어든다. 돌아간 화면은 1.08배에서 1배로 선명해진다.
- **같은 깊이 이동** (다음 프로젝트 등): 옆으로 사라진 뒤 Scanning Light가 지나가고 새 화면이 들어온다.
- 깊이: `/` = 0, `/projects`·`/about` = 1, `/projects/[slug]` = 2, 판단 = 3.

구현 방향:
- 클라이언트 `TransitionProvider`가 내부 `Link` 클릭을 가로챈다.
- 클릭한 요소의 rect를 기록하고, 나가는 애니메이션을 재생한 뒤 `router.push`한다.
- 새 페이지가 마운트되면 들어오는 애니메이션을 재생한다.
- 뒤로 갈 때 돌아갈 요소는 `data-plate`/`data-row`/`data-dec` 속성과 slug로 찾는다. 이전 스크롤 위치는 sessionStorage에 깊이별로 저장한다.
- 브라우저 뒤로가기(popstate)도 같은 줌 아웃 연출을 타야 한다. 상단 "← 뒤로" 버튼과 ESC 키는 상위 경로로 이동한다.

## 3. 메인 스크롤 장면

GSAP ScrollTrigger를 쓴다. Lenis는 이미 `SmoothScrollProvider`에서 ScrollTrigger와 연결돼 있으니 그 위에 얹는다.

**데스크톱·태블릿 (641px 이상)**: `#stage`를 화면 높이의 3.2배만큼 고정(pin)하고, 한 타임라인을 스크롤에 묶는다(scrub 0.8).

| 진행률 | 동작 |
|---|---|
| 0 – .20 | 소개 화면이 2.1배로 커지며 blur 22px, 투명해짐. 이름 세 글자는 좌우로 흩어짐 |
| .13 – .31 | Activities 장면이 0.55배·blur 18px에서 1배로 다가옴 |
| .28 – .53 | 가로선이 왼쪽에서 그어지고, 항목이 위아래 번갈아 하나씩 나타남 |
| .53 – .62 | 정지 (읽는 구간) |
| .62 – .80 | Activities 장면이 1.9배로 커지며 사라짐 |
| .74 – .94 | Featured 장면이 다가오고 플레이트 4개가 차례로 선명해짐 |

- 장면이 겹쳐 있는 동안 보이지 않는 장면이 클릭을 가로채지 않게 진행률에 따라 `pointer-events`를 끄고 켠다.
- **모바일 (640px 이하)**: 고정하지 않는다. 첫 화면은 스크롤에 따라 확대·블러되며 사라지고, Activities는 세로 목록으로 바뀐다. 각 항목과 플레이트에는 들어올 때 다가오고 나갈 때 물러나는 깊이 효과(`depthPass`)를 준다.
- **진입 애니메이션**: 가로선 → Scanning Light → 이름 조립 → 금속 반사광 → 대문장 줄별 등장 순서다. 재생 중에는 스크롤을 잠그고, 휠·터치·키 입력이 들어오면 즉시 끝까지 넘긴다.
- **포인터 반응**: 마우스 위치에 따라 배경 빛과 이름의 금속 반사광 위치가 움직인다. 플레이트는 포인터를 약하게 따라온다(magnetic, 기존 `Magnetic` 컴포넌트 재사용 가능).
- **상세·About·판단 페이지**: 블록마다 `depthPass`를 적용한다. 강도는 메인보다 약하게(scale 0.9, blur 8px) 한다. 판단 페이지의 세로선은 스크롤에 따라 그려진다.
- **`prefers-reduced-motion`**: 줌, 블러, 고정, 진입 애니메이션을 전부 끄고 즉시 상태 전환만 한다.
- 확대된 장면 때문에 가로 스크롤이 생기지 않도록 `html, body, main`에 `overflow-x: clip`을 준다.
- **주의**: pin할 요소의 조상에 `transform`이나 `will-change: transform`이 있으면 pin이 깨진다. 프로토타입에서 실제로 이 문제가 있었다.

## 4. 콘텐츠 모델 변경

`src/content/projects/types.ts`를 프로토타입의 `DATA` 구조에 맞춘다.

```ts
interface Project {
  slug; name; period; featured;
  status: ProjectStatus;             // "운영 중" | "운영 종료" | "개발 완료 · 검증 전" | "구현 완료 · 측정 전" 등
  line: string;                      // 플레이트·목록용 한 줄
  tag: string;                       // 플레이트 하단 키워드
  insight: string;                   // 상세 상단 한 줄 결론. 강조 구간은 마크업 대신 토큰으로 표현 (예: *SQLite Write Lock*)
  role: string;
  context: string;                   // 배경 문단
  outcome: string[];                 // 검증된 결과
  pending?: string;                  // 미검증·측정 전 안내
  decisions: Decision[];
  threads: { dir: "이전" | "이후"; name: string; text: string; href: string }[];
}
interface Decision {
  title: string; subtitle: string;
  situation: string;
  options?: { title: string; desc?: string; chosen?: boolean }[];
  optionLabel?: string;              // "선택" | "지금이라면" | "시도한 순서"
  reasoning: string; tradeoff: string; result: string;
}
```

- 새 파일: `src/content/activities.ts` (메인 Activities + About 활동), `src/content/otherProjects.ts`, `src/content/about.ts`
- 문구는 프로토타입에 들어간 문장을 그대로 옮긴다. 원고(`docs/source`)와 대조해 확인을 마친 상태다.
- 기존 `projects.test.ts`의 공개 금지 콘텐츠 검사는 새 필드까지 검사하도록 확장한다.

## 5. 정리할 컴포넌트

- **삭제**: `StatRow`, `RoleTag`, `ProjectFilter` (새 디자인에서 쓰지 않음)
- **재작성**: `Hero`, `ProjectCard`(→ 플레이트), `DecisionLog`(→ 판단 목록 + 판단 페이지), `OutcomeList`, `SiteHeader`(경로 표시 + 뒤로 버튼 + Projects/About/GitHub/velog), `StatusBadge`(점 + 텍스트)
- **재사용**: `ScanLine`(Scanning Light), `Magnetic`, `SmoothScrollProvider`
- 디자인 토큰(`globals.css`)은 그대로 쓴다. 프로토타입에서 추가로 쓴 색은 `--ink-2: #c9cdd0`, `--muted: #9aa0a5`, `--border-2: #2c3035`, `--bright: #e3e6e8` 네 가지뿐이다.

## 6. 같이 고칠 것

- OG 이미지와 `og:url`이 `kwakdoyoon-portfolio.vercel.app`을 가리키고 있다. 실제 배포 도메인과 맞춘다(`src/lib/site.ts`).
- 메인 대문장은 미정이다. 프로토타입의 후보 버튼(시안용)은 구현에서 빼고, 문장은 상수 하나로 둬서 쉽게 바꿀 수 있게 한다.

## 7. CLAUDE.md 갱신

아래 섹션을 이 문서 기준으로 고친다.
- **§5 페이지 구조**: 1번 라우트 표 기준으로
- **§10~12 랜딩**: 3장면 구조로. Hero 스탯 행은 삭제
- **§15 프로젝트 카드**: 플레이트 구성으로
- **§16 상세 순서**: 한 줄 결론 → 역할·기간·상태 → 배경 → 결과 → 핵심 판단 → 이어진 것
- **§17 판단 시각화**: 별도 페이지, 상황 → 선택지 → 근거 → 트레이드오프 → 결과의 세로 흐름

## 8. 완료 기준

- [ ] `pnpm build`와 `pnpm test`가 통과한다
- [ ] 1440 / 1024 / 375px에서 가로 스크롤과 글자 잘림이 없다
- [ ] 모든 페이지를 URL로 직접 열 수 있다
- [ ] 브라우저 뒤로가기, 상단 뒤로 버튼, ESC가 모두 줌 아웃 연출로 상위 경로에 간다
- [ ] reduced motion에서 정적 전환으로 동작한다
- [ ] 키보드만으로 플레이트, 판단, 이어진 것을 탐색할 수 있고 포커스 링이 보인다
- [ ] 공개 금지 콘텐츠 테스트가 통과한다

## 9. 열린 결정 (구현 전에 도윤에게 확인)

1. **기존 Implementation·Reflection 섹션**: 프로토타입 상세 페이지에서는 빠졌다. 일부는 "이어진 것"으로 옮겼다. 완전히 없앨지, "이어진 것" 아래에 Reflection을 짧게 남길지 정해야 한다.
2. **메인 대문장 최종 문구**
3. **동데이 날짜, 봄축제 사이트의 정확한 월**