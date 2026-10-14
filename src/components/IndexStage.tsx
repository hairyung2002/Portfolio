"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  depthPass,
  gsap,
  isFirstScreen,
  lockScroll,
  prefersReducedMotion,
  scanTween,
  ScrollTrigger,
  scrollToY,
  setIntroSkipper,
  unlockScroll,
  useScene,
} from "@/lib/motion";
import { INTRO_CLASS } from "@/lib/intro";

/*
 * 메인 스크롤 장면 (HANDOFF §3).
 * 데스크톱·태블릿: #stage를 화면 높이 3.2배만큼 고정하고 한 타임라인을 스크롤에 묶는다.
 *   0 – .20  소개가 커지며 흐려지고 이름 세 글자가 흩어진다
 *   .13–.31  Activities가 깊은 곳에서 다가온다
 *   .28–.53  가로선이 그어지고 항목이 번갈아 나타난다
 *   .53–.62  정지 (읽는 구간)
 *   .62–.80  Activities가 커지며 사라진다
 *   .74–.94  Featured가 다가오고 플레이트가 차례로 선명해진다
 * 모바일: 고정 없이 블록마다 다가오고 물러나는 깊이 효과.
 */
function setupScroll(root: HTMLElement, pinned: { current: ScrollTrigger | null }) {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 641px)", () => {
    const hero = root.querySelector<HTMLElement>(".hero-in")!;
    const tls = root.querySelector<HTMLElement>(".idx-tl")!;
    const rest = root.querySelector<HTMLElement>(".idx-rest")!;
    root.classList.add("stacked");

    gsap.set([tls, rest], { opacity: 0, scale: 0.55, filter: "blur(18px)" });
    gsap.set(".plate", { opacity: 0, scale: 0.8, filter: "blur(10px)" });
    gsap.set(".tl-line", { scaleX: 0 });
    gsap.set(".tl-item", { opacity: 0, y: (i: number) => (i % 2 ? 18 : -18) });

    // 겹쳐 있는 장면 중 보이지 않는 장면이 클릭을 가로채지 않게 한다.
    const pointer = (p: number) => {
      hero.style.pointerEvents = p < 0.12 ? "auto" : "none";
      tls.style.pointerEvents = p > 0.3 && p < 0.62 ? "auto" : "none";
      rest.style.pointerEvents = p > 0.86 ? "auto" : "none";
    };
    pointer(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 0,
        end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => pointer(self.progress),
      },
    });
    pinned.current = tl.scrollTrigger ?? null;

    tl.to(hero, { scale: 2.1, filter: "blur(22px)", opacity: 0, duration: 0.2, ease: "power2.in" }, 0)
      .to(
        ".name .ch",
        {
          yPercent: (i: number) => [-14, 0, 14][i] ?? 0,
          xPercent: (i: number) => [-30, 0, 30][i] ?? 0,
          duration: 0.2,
          ease: "power1.in",
        },
        0,
      )
      .to(tls, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.18, ease: "power2.out" }, 0.13)
      .to(".tl-line", { scaleX: 1, duration: 0.22, ease: "none" }, 0.28)
      .to(".tl-item", { opacity: 1, y: 0, duration: 0.05, stagger: 0.016, ease: "power2.out" }, 0.29)
      .to(tls, { scale: 1.9, filter: "blur(20px)", opacity: 0, duration: 0.18, ease: "power2.in" }, 0.62)
      .to(rest, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.18, ease: "power2.out" }, 0.74)
      .to(".plate", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.12, stagger: 0.025, ease: "power2.out" }, 0.78)
      .to({}, { duration: 0.06 }, 0.94);

    return () => {
      root.classList.remove("stacked");
      pinned.current = null;
      [hero, tls, rest].forEach((el) => (el.style.pointerEvents = ""));
    };
  });

  mm.add("(max-width: 640px)", () => {
    gsap
      .timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(".hero-in", { scale: 1.35, filter: "blur(14px)", opacity: 0, ease: "power1.in" });
    root
      .querySelectorAll<HTMLElement>(".idx-tl .rest-head, .tl-item, .idx-rest .rest-head, .plate, .idx-foot")
      .forEach((el) => depthPass(el, 12, 0.82));
    gsap.fromTo(
      ".tl-line",
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl-wrap", start: "top 80%", end: "bottom 55%", scrub: 0.4 } },
    );
  });

  ScrollTrigger.refresh();
  return () => mm.revert();
}

/** 가로선 → Scanning Light → 이름 조립 → 금속 반사광 → 대문장 줄별 등장. */
function playIntro(root: HTMLElement, name: HTMLElement, onDone: () => void) {
  const scan = document.querySelector<HTMLElement>(".scan");
  document.documentElement.classList.remove(INTRO_CLASS);
  scrollToY(0);
  lockScroll();

  const headline = gsap
    .timeline()
    .from(".headline .hl-in", { yPercent: 115, rotate: 1.5, duration: 1.05, stagger: 0.11, ease: "expo.out" })
    .fromTo(".headline em", { "--gx": "0%" }, { "--gx": "100%", duration: 1.6, ease: "power2.inOut" }, "-=0.6");

  gsap.set(name, { "--bxn": 0 });
  const intro = gsap.timeline({
    onComplete: () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      setIntroSkipper(null);
      unlockScroll();
      onDone();
    },
  });
  intro.from("[data-hair]", { scaleX: 0, opacity: 0, duration: 0.8, ease: "expo.out" });
  if (scan) intro.add(scanTween(scan), 0.25);
  intro
    .from(".name .ch", { yPercent: 70, opacity: 0, filter: "blur(22px)", scale: 1.18, duration: 1.2, stagger: 0.13, ease: "expo.out" }, 0.35)
    .to(name, { "--bxn": 1, duration: 1.8, ease: "power2.inOut" }, 0.9)
    .to(name, { "--bxn": 0.5, duration: 0.9, ease: "power2.out" })
    .add(headline, 1.05)
    .from("[data-boot]", { opacity: 0, y: 14, duration: 0.7, stagger: 0.08, ease: "expo.out" }, 1.6)
    .from(".cue .tick", { scaleY: 0, duration: 0.8, ease: "expo.out" }, 2.1);

  // 재생 중 휠·터치·키 입력이 들어오면 즉시 끝까지 넘긴다.
  function skip() {
    intro.progress(1);
  }
  window.addEventListener("wheel", skip, { passive: true });
  window.addEventListener("touchstart", skip, { passive: true });
  window.addEventListener("keydown", skip);
  setIntroSkipper(skip);

  return () => {
    window.removeEventListener("wheel", skip);
    window.removeEventListener("touchstart", skip);
    window.removeEventListener("keydown", skip);
    setIntroSkipper(null);
    if (intro.isActive()) unlockScroll();
  };
}

export function IndexStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pinned = useRef<ScrollTrigger | null>(null);

  useScene(ref, (root, ctx) => {
    const name = root.querySelector<HTMLElement>(".name")!;
    let booting = false;
    let teardownScroll: (() => void) | undefined;
    let teardownIntro: (() => void) | undefined;

    // 포인터 위치에 따라 이름의 금속 반사광이 움직인다.
    const onMove = (e: PointerEvent) => {
      if (booting) return;
      const x = e.clientX / window.innerWidth;
      gsap.to(name, { "--bxn": 0.15 + x * 0.7, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    };
    const hover = window.matchMedia("(hover: hover)").matches;
    if (hover) window.addEventListener("pointermove", onMove, { passive: true });

    if (isFirstScreen()) {
      booting = true;
      teardownIntro = playIntro(root, name, () => {
        booting = false;
        // 진입이 끝난 뒤 만드는 장면도 같은 context에 기록해야 언마운트 때 되돌려진다.
        ctx.add(() => {
          teardownScroll = setupScroll(root, pinned);
        });
      });
    } else {
      teardownScroll = setupScroll(root, pinned);
    }

    return () => {
      if (hover) window.removeEventListener("pointermove", onMove);
      teardownIntro?.();
      teardownScroll?.();
    };
  });

  // 진입 애니메이션을 쓰지 않는 환경에서도 숨김 클래스가 남지 않게 한다.
  useEffect(() => {
    if (prefersReducedMotion()) document.documentElement.classList.remove(INTRO_CLASS);
  }, []);

  // 고정 장면에서 키보드 포커스가 아직 보이지 않는 장면으로 들어가면 그 장면까지 스크롤한다.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onFocus = (e: FocusEvent) => {
      const st = pinned.current;
      const el = e.target as Element;
      if (!st) return;
      const at = (p: number) => st.start + (st.end - st.start) * p;
      if (el.closest(".idx-rest") && st.progress < 0.9) scrollToY(at(0.97));
      else if (el.closest(".hero-in") && st.progress > 0.1) scrollToY(at(0));
    };
    root.addEventListener("focusin", onFocus);
    return () => root.removeEventListener("focusin", onFocus);
  }, []);

  // SCROLL ↓ : 고정 장면이면 Activities를 읽는 구간으로, 아니면 그 섹션으로.
  useEffect(() => {
    const root = ref.current;
    const cue = root?.querySelector<HTMLButtonElement>("[data-cue]");
    if (!root || !cue) return;
    const onCue = () => {
      const st = pinned.current;
      if (st) {
        scrollToY(st.start + (st.end - st.start) * 0.56, true);
        return;
      }
      const target = root.querySelector<HTMLElement>(".idx-tl");
      if (target) scrollToY(target.getBoundingClientRect().top + window.scrollY - 80, !prefersReducedMotion());
    };
    cue.addEventListener("click", onCue);
    return () => cue.removeEventListener("click", onCue);
  }, []);

  return (
    <div ref={ref} className="wrap stage" id="stage">
      {children}
    </div>
  );
}
