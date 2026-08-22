"use client";

import { useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&/\\";

/**
 * Headline text that decodes itself in (terminal-scramble reveal), then
 * comes alive under the cursor — nearby characters lift and scale.
 * Fully static (plain text, no effects) under prefers-reduced-motion.
 */
export function MagneticText({
  text,
  className = "",
  delay = 0,
  radius = 90,
  lift = 10,
}: {
  text: string;
  className?: string;
  delay?: number;
  radius?: number;
  lift?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = charRefs.current.filter((s): s is HTMLSpanElement => !!s);
    const locked = new Array(spans.length).fill(false);

    spans.forEach((span, i) => {
      const ch = text[i];
      if (ch === " ") {
        locked[i] = true;
        return;
      }
      window.setTimeout(
        () => {
          locked[i] = true;
          span.textContent = ch;
        },
        delay + i * 28
      );
    });

    const scrambleInterval = window.setInterval(() => {
      spans.forEach((span, i) => {
        if (locked[i]) return;
        span.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      });
    }, 40);

    const totalDelay = delay + text.length * 28 + 80;
    const stopScramble = window.setTimeout(() => window.clearInterval(scrambleInterval), totalDelay);

    let active = false;
    const activate = window.setTimeout(() => {
      active = true;
    }, totalDelay);

    let px = -9999;
    let py = -9999;
    let raf = 0;

    function handleMove(e: MouseEvent) {
      px = e.clientX;
      py = e.clientY;
    }
    function loop() {
      if (active) {
        for (const span of spans) {
          const rect = span.getBoundingClientRect();
          const dist = Math.hypot(px - (rect.left + rect.width / 2), py - (rect.top + rect.height / 2));
          const falloff = Math.max(0, 1 - dist / radius);
          span.style.transform = falloff > 0.01 ? `translateY(${-falloff * lift}px) scale(${1 + falloff * 0.35})` : "";
        }
      }
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.clearInterval(scrambleInterval);
      window.clearTimeout(stopScramble);
      window.clearTimeout(activate);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="inline-block [transition:transform_120ms_ease-out]"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
