"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  EASE,
  finishIntro,
  gsap,
  holdScenes,
  lockScroll,
  markNavigated,
  prefersReducedMotion,
  releaseScenes,
  scanTween,
  ScrollTrigger,
  scrollToY,
  unlockScroll,
} from "@/lib/motion";
import {
  depthOf,
  normalizePath,
  parentOf,
  returnTargetSelector,
  transitionKind,
  type TransitionKind,
} from "@/lib/routes";
import { ScanLine } from "./ScanLine";

interface PageTransition {
  /** 연출을 거쳐 이동한다. source는 줌 인 프레임이 시작될 요소. */
  navigate: (href: string, source?: Element | null) => void;
  /** 한 단계 위 경로로 줌 아웃한다. */
  back: () => void;
}

const TransitionContext = createContext<PageTransition | null>(null);

export function usePageTransition(): PageTransition {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside <TransitionProvider>");
  return ctx;
}

type Box = { left: number; top: number; width: number; height: number };

/** 화면에 보이는 요소면 그 위치, 아니면 화면 가운데 30% 상자. */
function boxOf(el?: Element | null): Box {
  if (el && el.getClientRects().length) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) return r;
  }
  const w = window.innerWidth * 0.3;
  const h = window.innerHeight * 0.3;
  return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h };
}

function originWithin(el: HTMLElement, box: Box) {
  const b = el.getBoundingClientRect();
  return `${box.left + box.width / 2 - b.left}px ${box.top + box.height / 2 - b.top}px`;
}

function fullScreen(): Box {
  return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
}

/*
 * 고정(pin)된 장면은 position: fixed라서, 조상에 transform을 걸면 기준 상자가 바뀌어
 * 화면 밖으로 튄다. 고정 중이면 그 장면 자체를, 아니면 main 전체를 움직인다.
 */
function leavingTarget(main: HTMLElement): HTMLElement {
  const pinned = ScrollTrigger.getAll().find((st) => st.pin && st.isActive);
  return (pinned?.pin as HTMLElement | undefined) ?? main;
}

/** 스크롤 위치를 바꾼 직후, 스크럽 중인 장면을 그 위치의 상태로 바로 맞춘다. */
function settleScrubs() {
  ScrollTrigger.update();
  ScrollTrigger.getAll().forEach((st) => st.getTween()?.progress(1));
}

// 깊이별로 하나씩 기억하되, 같은 깊이의 다른 페이지(다른 프로젝트)에는 복원하지 않는다.
const scrollKey = (path: string) => `scroll:${depthOf(path)}`;

function saveScroll(path: string) {
  try {
    sessionStorage.setItem(scrollKey(path), JSON.stringify({ path, y: Math.round(window.scrollY) }));
  } catch {}
}

function readScroll(path: string): number | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(scrollKey(path)) ?? "null") as { path: string; y: number } | null;
    return saved?.path === path ? saved.y : null;
  } catch {
    return null;
  }
}

function focusHeading(main: HTMLElement) {
  main.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
}

function isPlainClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}

export function TransitionProvider({ header, children }: { header: ReactNode; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const mainRef = useRef<HTMLElement>(null);
  const zoomerRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const prevPath = useRef(normalizePath(pathname));
  const pending = useRef<{ kind: TransitionKind; from: string } | null>(null);
  const busy = useRef(false);
  const queued = useRef<string | null>(null);
  const watchdog = useRef<number | undefined>(undefined);

  const navigateRef = useRef<PageTransition["navigate"]>(() => {});

  const settle = useCallback(() => {
    window.clearTimeout(watchdog.current);
    unlockScroll();
    busy.current = false;
    if (mainRef.current) focusHeading(mainRef.current);
    const next = queued.current;
    queued.current = null;
    if (next) navigateRef.current(next);
  }, []);

  const navigate = useCallback<PageTransition["navigate"]>(
    (href, source) => {
      const to = normalizePath(href);
      const from = normalizePath(window.location.pathname);
      if (to === from) {
        if (window.scrollY > 0) scrollToY(0, !prefersReducedMotion());
        return;
      }
      if (busy.current) {
        queued.current = to;
        return;
      }

      markNavigated();
      saveScroll(from);
      const kind = transitionKind(from, to);
      const push = () => {
        pending.current = { kind, from };
        router.push(to, { scroll: false });
      };

      const main = mainRef.current;
      const zoomer = zoomerRef.current;
      if (prefersReducedMotion() || !main || !zoomer) {
        push();
        return;
      }

      busy.current = true;
      finishIntro();
      lockScroll();
      if (kind !== "out") holdScenes();

      const target = leavingTarget(main);

      // 이동이 끝내 커밋되지 않으면(네트워크 오류 등) 화면을 되살린다.
      window.clearTimeout(watchdog.current);
      watchdog.current = window.setTimeout(() => {
        if (!pending.current) return;
        pending.current = null;
        gsap.set([main, target], { clearProps: "all" });
        zoomer.hidden = true;
        releaseScenes();
        settle();
      }, 6000);

      const leave = () => {
        if (target !== main) gsap.set(main, { opacity: 0 });
        push();
      };

      if (kind === "in") {
        const box = boxOf(source);
        gsap.set(target, { transformOrigin: originWithin(target, box) });
        zoomer.hidden = false;
        gsap.set(zoomer, { ...box, opacity: 1 });
        gsap
          .timeline({ onComplete: leave })
          .to(target, { scale: 1.08, opacity: 0, filter: "blur(10px)", duration: 0.6, ease: EASE.leave }, 0)
          .to(zoomer, { ...fullScreen(), duration: 0.8, ease: EASE.inOut }, 0.04);
      } else if (kind === "out") {
        zoomer.hidden = false;
        gsap.set(zoomer, { ...fullScreen(), opacity: 0 });
        gsap
          .timeline({ onComplete: leave })
          .to(zoomer, { opacity: 1, duration: 0.25 }, 0)
          .to(target, { scale: 0.94, opacity: 0, filter: "blur(8px)", duration: 0.45, ease: EASE.leave }, 0);
      } else {
        gsap.timeline({ onComplete: leave }).to(target, { opacity: 0, x: -40, duration: 0.4, ease: EASE.leave });
      }
    },
    [router, settle],
  );
  useLayoutEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const back = useCallback(() => {
    const path = normalizePath(window.location.pathname);
    if (depthOf(path) > 0) navigate(parentOf(path));
  }, [navigate]);

  // 새 화면이 커밋된 직후, 칠하기 전에 들어오는 연출을 시작한다.
  // 자식(페이지)의 레이아웃 이펙트가 먼저 돌기 때문에, 줌 아웃으로 돌아온 화면은
  // 스크롤 장면이 이미 붙어 있어 이전 스크롤 위치를 그대로 복원할 수 있다.
  useLayoutEffect(() => {
    const from = prevPath.current;
    const to = normalizePath(pathname);
    prevPath.current = to;
    if (from === to) return;

    markNavigated();
    const p = pending.current;
    pending.current = null;
    const viaHistory = p === null;
    const kind = p?.kind ?? transitionKind(from, to);

    const main = mainRef.current;
    const zoomer = zoomerRef.current;
    const scan = scanRef.current;
    if (!main || !zoomer || !scan) return;

    if (prefersReducedMotion()) {
      scrollToY(kind === "out" ? (readScroll(to) ?? 0) : 0);
      focusHeading(main);
      return;
    }

    if (viaHistory) {
      // 브라우저 뒤로/앞으로: 나가는 연출 없이 바로 이 단계로 왔다.
      busy.current = true;
      finishIntro();
      lockScroll();
    }

    if (kind === "out") {
      const y = readScroll(to);
      ScrollTrigger.refresh();
      scrollToY(y ?? 0);
      settleScrubs();

      const selector = returnTargetSelector(from, to);
      const box = boxOf(y !== null && selector ? main.querySelector(selector) : null);

      zoomer.hidden = false;
      gsap.set(zoomer, { ...fullScreen(), opacity: 1 });
      gsap.set(main, { clearProps: "all" });
      gsap.set(main, { transformOrigin: originWithin(main, box), scale: 1.08, opacity: 0, filter: "blur(10px)" });
      gsap
        .timeline({
          onComplete: () => {
            zoomer.hidden = true;
            settle();
          },
        })
        .to(zoomer, { ...box, duration: 0.8, ease: EASE.inOut })
        .to(main, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: EASE.out, clearProps: "all" }, "<0.1")
        .to(zoomer, { opacity: 0, duration: 0.35 }, "-=0.25");
      return;
    }

    scrollToY(0);
    gsap.set(main, { clearProps: "all" });

    if (viaHistory) {
      gsap.timeline({ onComplete: settle }).add(scanTween(scan));
      return;
    }

    // 지금 화면에 보이는 블록만 순서대로 올린다. 나머지는 스크롤 장면이 맡는다.
    const visible = Array.from(main.querySelectorAll<HTMLElement>("[data-in]")).filter(
      (el) => el.getBoundingClientRect().top < window.innerHeight * 0.92,
    );
    gsap.set(visible, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        releaseScenes();
        settle();
      },
    });
    tl.add(scanTween(scan));
    if (visible.length) {
      tl.add(
        gsap.fromTo(
          visible,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.055, ease: EASE.out, clearProps: "opacity,transform" },
        ),
        "-=0.6",
      );
    }
    if (!zoomer.hidden) {
      tl.to(
        zoomer,
        {
          opacity: 0,
          duration: 0.45,
          onComplete: () => {
            zoomer.hidden = true;
          },
        },
        "<",
      );
    }
  }, [pathname, settle]);

  // 내부 링크 클릭을 가로채 연출을 거친다. window 캡처 단계라서 next/link의
  // 기본 이동보다 먼저 받는다. 새 탭 열기·외부 링크·같은 페이지 앵커는 건드리지 않는다.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const onClick = (e: MouseEvent) => {
      if (!isPlainClick(e)) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.hash && normalizePath(url.pathname) === normalizePath(window.location.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      navigateRef.current(url.pathname, a);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      back();
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [back]);

  // 포인터를 따라 아주 약하게 움직이는 배경 빛. 루트가 아닌 빛 요소에만 변수를 써서
  // 문서 전체의 스타일 재계산을 피한다.
  useEffect(() => {
    const spot = spotRef.current;
    if (!spot || prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        spot.style.setProperty("--mx", `${e.clientX}px`);
        spot.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const value = useMemo(() => ({ navigate, back }), [navigate, back]);

  // main은 전환 연출의 대상이라 provider가 직접 소유한다. 고정 헤더는 main 밖에 둬야
  // main에 transform이 걸려도 따라 움직이지 않는다.
  return (
    <TransitionContext.Provider value={value}>
      <div ref={spotRef} className="spot" aria-hidden="true" />
      <ScanLine ref={scanRef} />
      <div ref={zoomerRef} className="zoomer" aria-hidden="true" hidden />
      {header}
      <main ref={mainRef} id="main">
        {children}
      </main>
    </TransitionContext.Provider>
  );
}
