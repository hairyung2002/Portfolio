"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

/**
 * 포인터를 아주 약하게 따라오는 래퍼. transform만 쓰고 React state는 건드리지 않는다.
 * 터치 기기와 reduced motion에서는 움직이지 않는다.
 */
export function Magnetic({ children, strength = 8, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function handleMove(e: MouseEvent<HTMLSpanElement>) {
    if (!enabled.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  }

  return (
    <span ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
