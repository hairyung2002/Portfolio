"use client";

import { useEffect, useRef, useState } from "react";

export interface Stat {
  value: string;
  label: string;
  note?: string;
}

function CountingValue({ value }: { value: string }) {
  // Only count up when the value is a number with an optional trailing token
  // (e.g. "10,000+"). Anything else renders as-is.
  const match = value.match(/^([\d,]+)(\D*)$/);
  const isNumeric = match !== null;
  // Only animate figures big enough for the count-up to read as motion.
  const shouldCount =
    match !== null && Number(match[1].replace(/,/g, "")) >= 100;
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(shouldCount ? "0" : value);

  useEffect(() => {
    if (!match || !shouldCount) return;
    const el = ref.current;
    if (!el) return;

    const target = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          // Append the suffix ("+", "회" …) only once the count has landed,
          // so mid-animation never reads as an oddly specific figure.
          setDisplay(
            current.toLocaleString("en-US") + (progress === 1 ? suffix : "")
          );
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.classList.add("animate-stat-flash");
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <p
      ref={ref}
      className={`leading-none font-bold tracking-tight tabular-nums ${
        isNumeric
          ? "font-mono text-[28px] text-ink sm:text-[34px]"
          : "text-[22px] text-metal sm:text-[26px]"
      }`}
    >
      {display}
    </p>
  );
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="corner-marks grid grid-cols-1 divide-y divide-border border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex flex-col gap-1.5 p-6">
          <span className="font-mono text-[10.5px] text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
          <CountingValue value={stat.value} />
          <p className="text-[13px] text-ink-muted">{stat.label}</p>
          {stat.note && <p className="font-mono text-[10.5px] text-status-active">{stat.note}</p>}
        </div>
      ))}
    </div>
  );
}
