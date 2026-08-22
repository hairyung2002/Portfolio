"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Project } from "@/content/projects/types";
import { StatusBadge } from "./StatusBadge";
import { RoleTag } from "./RoleTag";

type QuickSetter = (value: number) => void;

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const quick = useRef<{ rx: QuickSetter; ry: QuickSetter; y: QuickSetter; s: QuickSetter } | null>(null);
  const reduceMotion = useRef(true);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = cardRef.current;
    if (!el || reduceMotion.current) return;

    gsap.set(el, { transformPerspective: 700 });
    quick.current = {
      rx: gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3.out" }),
      ry: gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
      s: gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" }),
    };
  }, []);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion.current || !quick.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quick.current.ry(px * 10);
    quick.current.rx(-py * 10);
    quick.current.y(-6);
    quick.current.s(1.015);
  }

  function handleLeave() {
    if (!quick.current) return;
    quick.current.rx(0);
    quick.current.ry(0);
    quick.current.y(0);
    quick.current.s(1);
  }

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.slug}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="corner-marks group relative flex flex-col gap-4 overflow-hidden border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 ease-out hover:border-metal hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6),0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-ink/[0.08] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sheen motion-reduce:hidden"
      />

      <div className="flex items-center justify-between">
        {index !== undefined && (
          <span className="font-mono text-[11px] text-ink-muted">{String(index).padStart(2, "0")}</span>
        )}
        <StatusBadge status={project.status} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink">
          {project.name}
          <span className="ml-1.5 inline-block -translate-x-1 text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.oneLiner}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border pt-4">
        {project.roles.map((role) => (
          <RoleTag key={role} label={role} />
        ))}
      </div>
    </Link>
  );
}
