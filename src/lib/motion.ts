"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** 모든 연출의 시간·감속 기준. CLAUDE.md §22의 micro / normal / dramatic 구분을 따른다. */
export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  leave: "power2.in",
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── scroll ─────────────────────────────────────────── */

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToY(y: number, smooth = false) {
  if (lenis) lenis.scrollTo(y, { immediate: !smooth, force: true });
  else window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
}

export function lockScroll() {
  lenis?.stop();
  document.documentElement.classList.add("is-locked");
}

export function unlockScroll() {
  document.documentElement.classList.remove("is-locked");
  lenis?.start();
}

/* ── scene gating ───────────────────────────────────── */

/*
 * 들어오는 연출(줌 인·옆으로)이 끝나기 전에 스크롤 장면이 붙으면
 * 둘이 같은 요소의 opacity·transform을 두고 싸운다. 전환 중에는 장면 설정을
 * 잡아 두었다가 연출이 끝나면 한 번에 실행한다.
 */
let scenesReady = true;
const waiting = new Set<() => void>();

export function holdScenes() {
  scenesReady = false;
}

export function releaseScenes() {
  scenesReady = true;
  const queued = [...waiting];
  waiting.clear();
  queued.forEach((run) => run());
}

/**
 * 스크롤에 묶인 장면을 등록한다. setup은 root로 범위가 잡힌 gsap.context 안에서
 * 실행되므로, 언마운트 시 만든 트윈·ScrollTrigger가 모두 되돌려진다.
 * reduced motion에서는 아예 실행하지 않는다.
 */
export function useScene<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (root: T, ctx: gsap.Context) => void | (() => void),
) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    let ctx: gsap.Context | null = null;
    let cleanup: void | (() => void);
    const run = () => {
      ctx = gsap.context((self) => {
        cleanup = setup(root, self);
      }, root);
      ScrollTrigger.refresh();
    };

    if (scenesReady) run();
    else waiting.add(run);

    return () => {
      waiting.delete(run);
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // setup은 마운트 시점의 장면 정의다. 다시 실행하지 않는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ── intro ──────────────────────────────────────────── */

let navigated = false;
let introSkipper: (() => void) | null = null;

/** 첫 진입 화면에서만 진입 애니메이션을 재생한다. 한 번이라도 이동했다면 false. */
export function isFirstScreen() {
  return !navigated;
}

export function markNavigated() {
  navigated = true;
}

export function setIntroSkipper(fn: (() => void) | null) {
  introSkipper = fn;
}

export function finishIntro() {
  introSkipper?.();
}

/* ── shared tweens ──────────────────────────────────── */

/**
 * 한 요소가 화면을 지나가는 동안의 깊이감:
 * 멀리서(작고 흐리게) 다가와 선명하게 머물다가, 나갈 때 뒤로 물러난다.
 */
export function depthPass(el: HTMLElement, blur: number, scaleIn: number, leave = true) {
  const vh = window.innerHeight;
  const total = vh + el.offsetHeight;
  const inLen = vh * 0.32;
  const outLen = vh * 0.3;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
  });
  tl.fromTo(
    el,
    { scale: scaleIn, opacity: 0, filter: `blur(${blur}px)` },
    { scale: 1, opacity: 1, filter: "blur(0px)", duration: inLen, ease: "power2.out" },
    0,
  );
  if (leave) {
    tl.to(
      el,
      { scale: 0.94, opacity: 0.12, filter: `blur(${Math.round(blur * 0.6)}px)`, duration: outLen, ease: "power2.in" },
      Math.max(inLen, total - outLen),
    );
  }
  tl.to({}, { duration: 0.0001 }, total);
  return tl;
}

/** Scanning Light 한 번 통과. */
export function scanTween(scan: HTMLElement) {
  return gsap.fromTo(
    scan,
    { y: -window.innerHeight * 0.4, opacity: 1 },
    {
      y: window.innerHeight * 1.05,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(scan, { opacity: 0 });
      },
    },
  );
}
