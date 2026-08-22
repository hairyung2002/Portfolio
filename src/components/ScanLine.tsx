"use client";

import { useEffect, useState } from "react";

/**
 * Signature element — a single sweep of light on entry.
 * Never loops; disabled entirely under prefers-reduced-motion.
 * Pass a `key` (e.g. the route slug) from the parent to replay it on navigation.
 */
export function ScanLine() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!play) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-scan absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-transparent via-accent/15 to-transparent blur-2xl" />
      <div className="animate-scan absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-transparent via-ink/20 to-transparent blur-xl" />
      <div className="animate-scan absolute inset-x-0 top-0 h-px bg-ink shadow-[0_0_28px_3px_rgba(233,235,236,0.45)]" />
    </div>
  );
}
