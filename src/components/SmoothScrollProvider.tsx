"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, registerLenis } from "@/lib/motion";

/**
 * Imperative Lenis + ScrollTrigger wiring — never renders a wrapper element,
 * so there is no hydration mismatch between server and client output.
 * Fully inert under prefers-reduced-motion (native scroll, no GSAP ticker).
 * 경로가 바뀔 때의 스크롤 위치는 TransitionProvider가 관리한다.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.12,
      duration: 1.1,
      smoothWheel: true,
    });
    registerLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  return <>{children}</>;
}
