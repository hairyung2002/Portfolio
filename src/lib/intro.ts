/** 메인 진입 애니메이션 대상을 첫 페인트 전에 숨기는 html 클래스. */
export const INTRO_CLASS = "intro-pending";

/** 하드 로드에서만 실행되는 인라인 스크립트. reduced motion이면 아무것도 숨기지 않는다. */
export const introScript = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("${INTRO_CLASS}")`;
