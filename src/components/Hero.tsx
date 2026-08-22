"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/content/profile";
import { Magnetic } from "./Magnetic";
import { MagneticText } from "./MagneticText";
import { ScanLine } from "./ScanLine";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const light = lightRef.current;
    const content = contentRef.current;
    const grid = gridRef.current;
    if (!section) return;

    let cleanupPointer = () => {};
    if (!reduceMotion && light) {
      const handleMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        light.style.setProperty("--px", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        light.style.setProperty("--py", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      };
      section.addEventListener("mousemove", handleMove);
      cleanupPointer = () => section.removeEventListener("mousemove", handleMove);
    }

    let trigger: ScrollTrigger | undefined;
    if (!reduceMotion && content && grid) {
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=70%",
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          content.style.transform = `translateY(${p * -90}px) scale(${1 - p * 0.08})`;
          content.style.opacity = `${1 - p}`;
          grid.style.transform = `translateY(${p * 50}px)`;
        },
      });
    }

    return () => {
      cleanupPointer();
      trigger?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          ref={gridRef}
          className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        />
        <div
          ref={lightRef}
          className="absolute inset-0 opacity-90 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(760px circle at var(--px, 60%) var(--py, 10%), color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%)",
          }}
        />
      </div>

      <ScanLine />

      <div
        ref={contentRef}
        className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pt-16 pb-20 will-change-transform sm:pt-24 sm:pb-28"
      >
        <div className="animate-fade-up flex items-start justify-between font-mono text-xs tracking-wide text-ink-muted uppercase">
          <span>{profile.name}</span>
          <div className="flex flex-col items-end gap-1 text-right">
            <span>Index / 01</span>
            <span className="text-metal">{profile.role}</span>
          </div>
        </div>

        <h1 className="max-w-3xl text-[clamp(2.6rem,7.5vw,5.25rem)] leading-[1.05] font-bold tracking-tight text-ink">
          <MagneticText text="운영되는 시스템을" delay={150} className="block" />
          <MagneticText text="다루는 엔지니어." delay={550} className="block text-metal" />
        </h1>

        <p className="animate-fade-up max-w-[52ch] text-[15px] leading-relaxed text-ink-muted [animation-delay:950ms] sm:text-base">
          {profile.intro}
        </p>

        <div className="animate-fade-up flex flex-wrap items-center justify-between gap-6 pt-4 [animation-delay:1050ms]">
          <div className="flex flex-wrap gap-5 font-mono text-[13px]">
            <Magnetic strength={12}>
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-ink transition-colors hover:text-metal">
                GitHub ↗
              </a>
            </Magnetic>
            <Magnetic strength={12}>
              <a href={profile.contact.blog} target="_blank" rel="noopener noreferrer" className="text-ink transition-colors hover:text-metal">
                velog ↗
              </a>
            </Magnetic>
            <Magnetic strength={12}>
              <a href={`mailto:${profile.contact.email}`} className="text-ink transition-colors hover:text-metal">
                {profile.contact.email}
              </a>
            </Magnetic>
          </div>
          <span className="font-mono text-[11px] tracking-widest text-ink-muted uppercase">↓ Scroll</span>
        </div>
      </div>
    </section>
  );
}
