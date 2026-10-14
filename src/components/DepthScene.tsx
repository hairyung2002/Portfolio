"use client";

import { useRef, type ReactNode } from "react";
import { depthPass, gsap, useScene } from "@/lib/motion";

/**
 * 목록·상세·판단·About의 공통 스크롤 장면. `[data-in]` 블록마다 메인보다 약한
 * 깊이 효과(scale .9, blur 8px)를 주고, 판단 페이지의 세로선은 스크롤에 따라 그린다.
 */
export function DepthScene({ children, className = "wrap" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useScene(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-in]").forEach((el) => depthPass(el, 8, 0.9));

    const line = root.querySelector<HTMLElement>(".flow-line");
    if (line?.parentElement) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: line.parentElement, start: "top 75%", end: "bottom 70%", scrub: 0.4 },
        },
      );
    }
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
