# CLAUDE.md

## 0. 컨텍스트

백엔드/프론트 풀스택 엔지니어 지원용 개인 포트폴리오 웹사이트를 만든다.

채용 담당자가 이력서와 함께 열어보는 링크이며,
**"무엇을 만들었는가"가 아니라 "어떤 문제를 어떻게 정의하고 왜 그렇게 판단했는가"**를 보여주는 것이 목적이다.

읽는 사람은 두 부류다.

* 3분 안에 훑고 판단하는 리크루터 → 첫 화면에서 핵심이 잡혀야 한다.
* 기술 면접관 → 프로젝트 상세로 들어가면 의사결정 근거와 트레이드오프를 확인할 수 있어야 한다.

이 사이트 자체도 평가 대상이다.

**코드 품질, 접근성, 성능, 정보 구조가 곧 포트폴리오의 일부다.**

---

# 1. 입력 데이터

`docs/source/`에 원본 마크다운이 있다.

먼저 아래 8개 파일을 **전부 읽고 시작한다.**

| 파일                                | 내용                      |
| --------------------------------- | ----------------------- |
| `01_기본정보.md`                      | 학력, 스택, 활동 이력, 연락처      |
| `02_이력서.md`                       | 전체 요약 + 기타 프로젝트 목록      |
| `03_project01_Dirvana.md`         | 축제 사이트 / 장애 대응 · 인프라    |
| `03_project02_PromptPlace.md`     | AI 프롬프트 마켓 / 프론트엔드 · 결제 |
| `03_project03_WalkingCity.md`     | 산책 추천 / RAG             |
| `03_project04_Wilson.md`          | 시니어 케어 AI / 분산 아키텍처     |
| `03_project05_ProxyWebService.md` | Nexo / C 프록시 엔진         |
| `03_project06_DongDay.md`         | 동데이 / PM · 사용자 검증       |

이 파일들은 **내부용 원재료**다.

원본을 그대로 렌더링하지 않는다.

사이트에 들어갈 콘텐츠는 반드시 공개용으로 재작성한다.

---

# 2. 절대 규칙 — 공개하면 안 되는 내용

아래 내용은 원본에 존재하더라도 사이트에 절대 들어가면 안 된다.

하나라도 노출되면 작업 실패로 간주한다.

* `## 자소서/면접에서 쓸만한 포인트` 섹션 전체
* `## 나중에 채우면 좋을 것`
* `## 나중에 채울 것`
* 전화번호
* 본인 외 팀원 실명
* 팀원 이탈 관련 서술
* 동데이 IR 자료의 가동률·매출 수치
* Wilson의 `"데이터 유실률 0%"`, `"페이로드 50% 축소"` 등 미검증 기대치를 실제 성과처럼 표현하는 것
* 원본에 적힌 자기평가 코멘트
* `"이 Decision은 억지 없이 탄탄하다"` 등의 메타 발언
* `"자소서에서 비중 있게 쓰지 말 것"` 등의 메타 발언
* 학점
* 어학 점수

팀원 이탈 관련 내용은 필요한 경우 다음처럼 중립적으로 표현한다.

> "프로젝트 중간에 PM 역할을 함께 맡게 되어"

---

# 3. 정직성 규칙

원본의 가장 큰 강점은 **진행 상태와 한계를 정확하게 구분하는 것**이다.

이를 지우고 모든 프로젝트를 완성된 성공 사례처럼 포장하지 않는다.

모든 프로젝트 카드와 상세 페이지에는 상태 배지를 표시한다.

가능한 상태:

* 운영 중
* 운영 종료
* 개발 중
* 설계 단계

프로젝트별 규칙:

### Wilson

통합 전이며 K8s는 설계 단계임을 명시한다.

아키텍처 항목은:

> `설계 의도`

로 명확하게 라벨링한다.

설계 내용과 실측 결과를 시각적으로 구분한다.

### Nexo

구현 단계(상태 배지: 개발 중)임을 명시한다.

엔진 구동 확인·부하테스트 전이므로 목표 수치를 실측 결과처럼 표현하지 않는다.

**설계 결정 로그** 중심으로 보여준다.

### Walking City

아키텍처는 자문·설계 참여였으며 직접 구현은 프론트엔드였음을 정확히 표기한다.

### 동데이

개발은 팀 내 AI 도구 활용으로 진행되었으며 본인 기여는:

* 기획
* 리딩
* 대외협력
* 사용자 검증

이었다는 점을 명확히 한다.

### 수치

출처가 확인된 수치만 실제 성과로 표현한다.

검증된 수치:

* Dirvana GA 누적 활성 사용자 10,000명
* Dirvana 최대 DAU 8,000
* 게임 참여 20,000회
* 동데이 컨택 15곳 중 3곳 파일럿
* K-HTML 200명 참가
* K-HTML 본선 16팀

미검증 수치는 성과처럼 표현하지 않는다.

---

# 4. 기술 스택

* Next.js 15
* App Router
* TypeScript strict
* Tailwind CSS v4
* Vitest
* Vercel

콘텐츠는 DB 없이 타입이 강제된 데이터 레이어로 관리한다.

`src/content/projects/*.ts`가 공통 `Project` 타입 객체를 export한다.

`Project` 타입은 아래 구조를 필수 필드로 강제한다.

```ts
type Project = {
  problem: string
  decisions: Decision[]
  implementation: string
  outcome: Outcome
  reflection: string
}
```

각 Decision:

```ts
type Decision = {
  title: string
  situation: string
  options: string[]
  reasoning: string
  tradeoff: string
  result: string
}
```

각 Outcome에는 반드시 `verified: boolean` 플래그를 포함한다.

이 순서가 이 포트폴리오의 핵심 논지다.

> 문제 정의 → 판단 → 구현 → 결과 → 회고

기능 목록보다 **판단 근거와 트레이드오프가 먼저 보이는 구조**를 유지한다.

---

# 5. 페이지 구조

## `/`

랜딩 페이지.

포함:

* 한 줄 소개
* 핵심 지표 3개
* 대표 프로젝트 4개
* 연락처

대표 프로젝트:

* Dirvana
* Wilson
* PromptPlace
* Nexo

Walking City와 동데이는 전체 프로젝트 목록에는 포함하지만 랜딩에서는 제외한다.

동데이는 일반 기술 프로젝트와 다른 성격을 가지므로:

> **기술이 아니라 판단으로 보여주는 카드**

라는 별도 톤으로 구성한다.

---

## `/projects`

전체 프로젝트 목록.

역할/스택 필터:

* Backend
* Frontend
* Infra
* PM

프로젝트 상태와 핵심 문제를 빠르게 파악할 수 있어야 한다.

---

## `/projects/[slug]`

프로젝트 상세.

`Project` 타입의 구조를 그대로 렌더링한다.

권장 정보 흐름:

1. Problem
2. Decisions
3. Implementation
4. Outcome
5. Reflection

---

## `/about`

포함:

* 학력
* 스택
* 활동
* 수상
* PyCon 2026 연사 예정

`02_이력서.md`의 기타 프로젝트 8개는 `/about` 하단에 **한 줄 요약 리스트**로만 보여준다.

프로젝트에 GitHub / 배포 링크가 존재하면 눈에 띄게 노출한다.

특히 PromptPlace는 `promptplace.kr` 실서비스이므로 배포 링크를 명확하게 강조한다.

---

# 6. 디자인 방향

## 핵심 컨셉

전체 사이트의 디자인 주제는:

# DIGITAL INDUSTRIAL

그리고 이를 한 문장으로 정의한다.

> **"운영되는 시스템을 다루는 엔지니어를, 정밀한 산업 제품처럼 보여주는 포트폴리오."**

디자인에서 "개발자 포트폴리오"라는 전형적인 시각 언어를 피한다.

대신 다음의 감각을 사용한다.

* precision
* engineering
* industrial design
* aerospace interface
* advanced manufacturing
* polished metal
* machined surfaces
* dark materials
* controlled light
* technical instrumentation
* cinematic digital environments

단, 흔한 SF 영화 UI처럼 만들지 않는다.

**미래적인 느낌은 네온이나 사이버펑크가 아니라 정밀함과 절제에서 만들어낸다.**

---

# 7. COLOR SYSTEM

전체 배경은 매우 어두운 black을 사용한다.

기본 방향:

```text
Background
#050607

Elevated Surface
#0B0D0F

Primary Metal
#B7BCC0

Bright Metal
#E3E6E8

Dark Metal
#555B60

Warm Neutral
#A7A39C

Primary Text
#F1F3F4

Secondary Text
#858A8E
```

위 색상은 시작점이다.

실제 구현 전에 시각적 조화를 검토하고 필요하면 ±10~20 정도의 범위에서 조정할 수 있다.

중요한 원칙:

* 형광색을 사용하지 않는다.
* 네온 그린을 사용하지 않는다.
* 강한 오렌지/레드 포인트를 사용하지 않는다.
* 과도한 보라색을 사용하지 않는다.
* 검정 + 형광색이라는 전형적인 AI/개발자 포트폴리오 조합을 피한다.

금속색은 단순한 텍스트 색상이 아니다.

**빛의 방향과 표면을 표현하는 데 사용한다.**

---

# 8. METAL LANGUAGE

금속은 디자인 장식이 아니라 사이트의 시각적 언어다.

금속을 표현할 때:

* brushed metal
* anodized aluminum
* gunmetal
* machined steel
* polished chrome

등의 물성을 참고한다.

하지만 실제 금속 텍스처 이미지를 과도하게 사용하지 않는다.

CSS gradient, subtle noise, blur, light reflection, mask, opacity 등을 활용해 **디지털 표면으로 해석한다.**

금속의 핵심은:

> **빛이 표면을 따라 이동하는 것**

이다.

따라서 정적인 silver 색상만 사용하는 것은 금지한다.

가능하다면 다음과 같은 효과를 제한적으로 활용한다.

* moving light reflection
* soft metallic gradient
* specular highlight
* subtle surface noise
* masked reflection
* edge highlight
* depth through shadow

모든 효과는 매우 절제되어야 한다.

---

# 9. SIGNATURE ELEMENT

이 사이트를 다른 개발자 포트폴리오와 구별하는 **시그니처 인터랙션 하나**를 반드시 만든다.

권장 방향:

## "Scanning Light"

페이지를 이동하거나 프로젝트를 탐색할 때,

검은 화면 위를 아주 얇은 빛의 띠가 지나가면서 콘텐츠의 표면을 드러내는 듯한 효과.

예:

```text
████████████████████████████
        ──── LIGHT ────
████████████████████████████
```

실제 구현은 위 예시처럼 단순한 선이 아니라:

* gradient
* blur
* opacity
* mask
* transform

등을 활용한다.

이 효과는:

* 페이지 진입
* 프로젝트 전환
* 중요한 인터랙션

등 제한된 순간에만 사용한다.

항상 움직이지 않는다.

**사이트 전체에 계속 돌아가는 애니메이션을 만들지 않는다.**

---

# 10. LANDING PAGE — HIGHEST VISUAL IMPACT

랜딩 페이지는 이 사이트에서 가장 실험적이어야 한다.

첫 5~10초 안에:

> "이건 일반적인 개발자 포트폴리오가 아니다."

라는 인상을 줘야 한다.

하지만 정보를 찾기 어렵게 만들면 안 된다.

---

## Hero

Hero는 단순한 중앙 정렬형 소개문을 사용하지 않는다.

금지:

```text
Hi, I'm XXX
Full Stack Developer
[View Projects]
```

대신 **거대한 typography + 작은 technical metadata + 공간 + 움직이는 빛**으로 구성한다.

예시 구조:

```text
┌─────────────────────────────────────────────────────────┐
│  NAME                                  INDEX / 01       │
│                                                         │
│                                                         │
│       BUILDING SYSTEMS                                 │
│       THAT SURVIVE                                     │
│       REAL CONDITIONS.                                 │
│                                                         │
│                              BACKEND / FRONTEND / INFRA │
│                                                         │
│  ↓ SCROLL                                               │
└─────────────────────────────────────────────────────────┘
```

문구 자체는 실제 원본 데이터에 있는 경험과 일치하도록 작성한다.

새로운 경험이나 성과를 만들어내지 않는다.

---

# 11. LANDING MOTION

랜딩에는 강한 모션을 사용한다.

단, "많이 움직이는 것"이 목적이 아니다.

모션은 다음의 역할을 해야 한다.

* hierarchy
* depth
* transition
* emphasis
* storytelling

가능한 기술:

* GSAP
* Framer Motion
* CSS transform
* CSS mask
* clip-path
* scroll-driven animation
* spring motion
* text reveal
* stagger
* parallax
* magnetic interaction
* cursor interaction

이미 프로젝트에 animation library가 있다면 기존 라이브러리를 우선 사용한다.

불필요한 dependency를 추가하지 않는다.

---

# 12. HERO INTERACTION

가능하다면 Hero에서 다음과 같은 상호작용을 사용한다.

### Pointer-reactive light

마우스 위치에 따라 아주 미세한 빛의 중심이 이동한다.

### Magnetic interaction

CTA나 프로젝트 링크가 포인터를 아주 약하게 따라온다.

### Typography movement

스크롤에 따라 거대한 typography가 미세하게 이동하거나 scale된다.

### Surface reflection

특정 요소에 hover하면 금속 표면을 스치는 빛처럼 highlight가 지나간다.

효과의 강도는 낮게 유지한다.

**"Wow"는 가능하지만 "gaming website"처럼 보이면 실패다.**

---

# 13. INFORMATION HIERARCHY

화려함보다 정보 전달이 우선이다.

리크루터가 3분 안에 다음을 파악할 수 있어야 한다.

1. 누구인가
2. 어떤 엔지니어인가
3. 무엇을 만들었는가
4. 어떤 문제를 해결했는가
5. 어떤 규모의 시스템을 다뤘는가
6. 어디에서 더 볼 수 있는가

Hero에서 이것이 빠르게 파악되어야 한다.

---

# 14. PROJECT SECTION

랜딩의 강한 시각적 에너지와 프로젝트 상세의 정보 밀도를 명확하게 분리한다.

프로젝트 섹션은:

**editorial + technical + restrained**

하게 만든다.

카드에 지나치게 많은 효과를 넣지 않는다.

프로젝트는 "예쁜 카드"가 아니라 **엔지니어링 사례**로 보여야 한다.

---

# 15. PROJECT CARD

각 프로젝트 카드에는 최소한:

* 프로젝트명
* 상태
* 한 줄 문제 정의
* 역할
* 핵심 기술
* 주요 결과

가 보여야 한다.

기술 스택을 로고 벽처럼 나열하지 않는다.

예:

나쁜 방식:

```text
Next.js / React / TypeScript / Redis / PostgreSQL / Docker
```

좋은 방식:

```text
고트래픽 상황에서 캐시 전략을 선택하고
장애 격리 구조를 설계했다.

Backend · Infrastructure
```

기술은 **문제를 해결한 맥락 안에서 등장해야 한다.**

---

# 16. PROJECT DETAIL

상세 페이지는 최대한 읽기 쉬워야 한다.

랜딩과 달리 애니메이션 강도를 크게 낮춘다.

핵심 구조:

```text
PROJECT

[Status] [Role] [Period]

Problem
────────────────────────

무엇이 문제였는가?


Decisions
────────────────────────

01
Situation

Options

Reasoning

Tradeoff

Result


02
...


Implementation
────────────────────────

무엇을 직접 구현했는가?


Outcome
────────────────────────

검증된 결과
+
검증되지 않은 설계 기대치의 명확한 구분


Reflection
────────────────────────

무엇을 배웠고
무엇이 아직 한계인가?
```

Decision은 이 사이트의 핵심 콘텐츠다.

기능을 나열하지 않는다.

---

# 17. DECISION VISUALIZATION

Decision은 일반적인 accordion이나 카드보다 더 editorial하게 보여준다.

다음 관계가 시각적으로 이해되어야 한다.

```text
SITUATION
    ↓
OPTIONS
 ┌───────┬───────┬───────┐
 │   A   │   B   │   C   │
 └───────┴───────┴───────┘
          ↓
      REASONING
          ↓
       TRADEOFF
          ↓
        RESULT
```

사용자가 "왜 이 기술을 골랐는가?"를 한눈에 이해할 수 있어야 한다.

---

# 18. TYPOGRAPHY

Typography는 전체 디자인에서 가장 중요한 요소 중 하나다.

권장 방향:

### Display

현대적이고 기하학적인 grotesk / neo-grotesk / contemporary sans.

### Body

높은 가독성의 neutral sans-serif.

### Data / Metadata

monospace 또는 technical sans.

세 가지 역할을 명확하게 구분한다.

예:

```text
DISPLAY
→ large geometric sans

BODY
→ highly readable sans

DATA
→ monospace
```

세리프 중심의 editorial 디자인은 사용하지 않는다.

특히:

> 크림색 배경 + 세리프 대제목 + 테라코타

조합은 금지한다.

---

# 19. LAYOUT

Grid는 정밀해야 한다.

하지만 모든 요소가 정렬된 기업 홈페이지처럼 보이지 않도록 한다.

사용 가능한 요소:

* asymmetric grid
* oversized typography
* edge alignment
* overlapping layers
* full-bleed sections
* negative space
* sticky compositions
* large scale transitions

그러나 전체적으로 underlying grid는 일관되어야 한다.

**정밀함 속의 비대칭**을 목표로 한다.

---

# 20. VISUAL CONTRAST

페이지 전체를 같은 강도로 디자인하지 않는다.

의도적인 intensity curve를 만든다.

```text
LANDING
██████████  100%

ABOUT
██████      60%

PROJECT LIST
████        40%

PROJECT DETAIL
███         30%

CONTACT
████        40%
```

랜딩은 가장 강렬하다.

프로젝트 상세는 가장 읽기 쉽다.

---

# 21. NAVIGATION

Navigation은 작고 정밀하게 만든다.

가능한 구조:

```text
[NAME]

                    WORK
                    ABOUT
                    GITHUB
                    CONTACT
```

고정 navigation을 사용할 수 있다.

하지만 navigation 자체가 디자인의 주인공이 되면 안 된다.

---

# 22. MICRO INTERACTIONS

인터랙션은 다음 정도로 제한한다.

* hover reveal
* subtle magnetic movement
* metallic reflection
* opacity transition
* scale
* cursor context
* image crop transition
* text underline movement

모든 인터랙션에는 일관된 easing과 duration 체계를 사용한다.

예:

```text
micro: 150–250ms
normal: 300–500ms
dramatic: 600–1000ms
```

필요한 경우에만 더 긴 duration을 사용한다.

---

# 23. RESPONSIVE

다음을 반드시 지원한다.

* desktop
* laptop
* tablet
* mobile

모바일에서는 데스크톱의 복잡한 composition을 단순히 축소하지 않는다.

필요하면 layout 자체를 재설계한다.

375px 기준:

* 가로 스크롤 없음
* 텍스트 clipping 없음
* interactive element overflow 없음
* navigation 사용 가능
* project content 읽기 가능

---

# 24. ACCESSIBILITY

다음을 반드시 충족한다.

* semantic HTML
* keyboard navigation
* visible focus ring
* sufficient contrast
* accessible buttons/links
* meaningful alt text
* reduced motion support

`prefers-reduced-motion`을 지원한다.

Reduced motion 환경에서는:

* parallax 제거
* cursor animation 제거
* complex transition 제거
* 단순 opacity / instant state transition 사용

---

# 25. PERFORMANCE

화려한 UI보다 성능을 우선한다.

특히:

* 불필요한 JS 제거
* 이미지 최적화
* layout shift 방지
* animation frame 최적화
* GPU-heavy effect 최소화
* continuous animation 최소화

가능하면:

```text
transform
opacity
clip-path
```

등 성능에 유리한 속성을 사용한다.

매 프레임마다 React state를 업데이트하는 방식의 애니메이션은 피한다.

---

# 26. DESIGN PLANNING — CODE BEFORE DESIGN

코드를 작성하기 전에 반드시 디자인 플랜을 먼저 제시한다.

플랜에는 반드시 다음이 포함되어야 한다.

### 1. Design Concept

사이트의 디자인 방향을 한 문장으로 정의한다.

### 2. Color Palette

4~6개의 hex 색상을 제시한다.

각 색상의 역할을 설명한다.

### 3. Typography

Display / Body / Data용 서체를 제안한다.

실제 사용 가능한 웹폰트를 기준으로 한다.

### 4. Layout Concept

Grid, spacing, composition을 설명한다.

### 5. Motion System

animation의 종류와 강도를 정의한다.

### 6. Signature Element

이 포트폴리오만의 시그니처 인터랙션 하나를 정의한다.

### 7. ASCII Wireframe

최소한 다음 두 화면을 작성한다.

* `/`
* `/projects/[slug]`

---

# 27. SELF-CRITIQUE BEFORE IMPLEMENTATION

디자인 플랜을 작성한 후 스스로 검토한다.

다음 질문에 답한다.

### Q1

이 디자인을 다른 개발자 포트폴리오에도 그대로 붙일 수 있는가?

YES라면 다시 디자인한다.

### Q2

"검정 + 네온"이라는 흔한 AI/개발자 포트폴리오처럼 보이는가?

YES라면 다시 디자인한다.

### Q3

금속이라는 단어를 빼도 디자인의 논리가 유지되는가?

NO라면 단순한 metal aesthetic에 머물러 있는 것이다.

금속을:

* precision
* reflection
* material
* depth
* engineering

이라는 디자인 원리로 다시 해석한다.

### Q4

랜딩이 너무 화려해서 프로젝트 내용을 방해하는가?

YES라면 animation intensity를 낮춘다.

### Q5

프로젝트 상세가 일반적인 SaaS case study처럼 보이는가?

YES라면 decision 중심 구조를 강화한다.

---

# 28. 작업 순서

각 단계가 끝나면 **반드시 멈추고 확인받는다.**

한 번에 전부 만들지 않는다.

## STEP 1

원본 8개 파일 정독.

각 프로젝트에 대해:

> "이 프로젝트가 증명하는 것"

을 한 문장으로 정리해서 보고한다.

---

## STEP 2

`CLAUDE.md`의 규칙을 기반으로 콘텐츠 안전 기준을 확인한다.

---

## STEP 3

`Project` 타입 정의.

그리고 프로젝트 1개:

**Dirvana**

만 데이터 변환한다.

톤과 분량을 확인받는다.

---

## STEP 4

승인 후 나머지 프로젝트 데이터 변환.

---

## STEP 5

디자인 플랜 제시.

다음을 포함한다.

* Concept
* Color palette
* Typography
* Layout
* Motion system
* Signature interaction
* `/` ASCII wireframe
* `/projects/[slug]` ASCII wireframe

**승인받기 전에는 코드를 구현하지 않는다.**

---

## STEP 6

구현.

순서:

1. Design tokens
2. Global typography
3. Layout system
4. Navigation
5. Landing
6. Project list
7. Project detail
8. About
9. Responsive
10. Animation polish

---

## STEP 7

검증.

반드시:

* TypeScript typecheck
* Vitest
* prohibited-content grep
* production build
* Lighthouse
* mobile 375px test

를 수행한다.

---

# 29. TESTING

Vitest로 데이터 레이어를 검증한다.

최소한 다음을 검사한다.

* 필수 필드 존재
* slug 중복 없음
* 금지어 미포함
* 프로젝트 상태 존재
* 모든 프로젝트에 problem 존재
* 모든 프로젝트에 최소 1개의 decision 존재
* outcome의 verified 플래그 존재

---

# 30. PROHIBITED CONTENT VERIFICATION

작업 마지막에는 **빌드 결과물 전체**를 대상으로 금지어를 grep한다.

최소 검색 대상:

```text
전화번호
자소서
면접에서 쓸만한
나중에 채
팀원 실명
```

원본의 자기평가 메타 문구도 검사한다.

검증 결과를 반드시 보고한다.

예:

```text
Prohibited Content Scan

전화번호        0
자소서          0
면접에서 쓸만한 0
나중에 채       0
팀원 실명       0

PASS
```

---

# 31. BUILD REQUIREMENTS

최종 결과는 반드시:

```text
pnpm build
```

성공해야 한다.

TypeScript error:

```text
0
```

이어야 한다.

---

# 32. FINAL QUALITY BAR

최종 결과는 다음 질문에 YES여야 한다.

### Content

* 3분 안에 핵심이 파악되는가?
* 모든 프로젝트가 문제 → 판단 → 구현 → 결과 → 회고 구조를 갖는가?
* 미검증 수치를 성과처럼 보여주지 않는가?

### Design

* 일반적인 개발자 포트폴리오처럼 보이지 않는가?
* 현대적이고 미래지향적인가?
* 금속의 물성을 단순 색상이 아닌 빛과 깊이로 표현하는가?
* 랜딩이 기억에 남는가?
* 프로젝트 상세는 읽기 쉬운가?

### Engineering

* TypeScript strict인가?
* 정적 빌드가 가능한가?
* 접근성이 좋은가?
* 375px에서 깨지지 않는가?
* prefers-reduced-motion을 지원하는가?
* 불필요한 animation / JS를 사용하지 않는가?

### Identity

최종적으로 이 사이트를 보고 사용자가 다음을 느껴야 한다.

> **"이 사람은 단순히 기능을 구현하는 개발자가 아니라, 실제로 운영될 시스템을 생각하면서 설계하고 판단하는 엔지니어다."**
