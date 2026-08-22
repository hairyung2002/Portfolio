"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollReveal({
  children,
  className = "",
  index = 0,
  variant = "flip",
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  variant?: "flip" | "panel";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const fromVars =
      variant === "flip"
        ? {
            opacity: 0,
            y: 44,
            rotateX: -28,
            scale: 0.94,
            filter: "blur(6px)",
            transformPerspective: 800,
            transformOrigin: "50% 100%",
          }
        : { opacity: 0, y: 56, filter: "blur(4px)" };

    const tween = gsap.fromTo(el, fromVars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.9,
      delay: index * 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
