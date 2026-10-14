"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { decisionNumberOf, depthOf, normalizePath, projectSlugOf } from "@/lib/routes";
import { usePageTransition } from "./TransitionProvider";

type Crumb = { label: string; href?: string; mono?: boolean };

function crumbsFor(path: string, names: Record<string, string>): Crumb[] {
  const crumbs: Crumb[] = [{ label: "INDEX", href: "/", mono: true }];
  if (path === "/about") crumbs.push({ label: "About" });
  if (path === "/projects") crumbs.push({ label: "Projects" });

  const slug = projectSlugOf(path);
  if (slug && names[slug]) {
    const n = decisionNumberOf(path);
    crumbs.push({ label: "Projects", href: "/projects" });
    crumbs.push(n ? { label: names[slug], href: `/projects/${slug}` } : { label: names[slug] });
    if (n) crumbs.push({ label: `D${n}` });
  }
  return crumbs;
}

/** 경로 표시 + 뒤로 + 메뉴. 작고 정밀하게, 주인공이 되지 않게. */
export function SiteHeader({ projectNames }: { projectNames: Record<string, string> }) {
  const path = normalizePath(usePathname());
  const { back } = usePageTransition();
  const inProjects = path.startsWith("/projects");
  const crumbs = crumbsFor(path, projectNames);

  return (
    <header className="bar">
      <Link className="home" href="/">
        {profile.name}
      </Link>
      <nav className="crumbs" aria-label="현재 위치">
        {crumbs.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 && (
              <span className="sep" aria-hidden="true">
                /
              </span>
            )}
            {c.href ? (
              <Link href={c.href} className={c.mono ? "mono" : undefined}>
                {c.label}
              </Link>
            ) : (
              <span className="cur" aria-current="page">
                {c.label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
      {depthOf(path) > 0 && (
        <button className="back" type="button" onClick={back}>
          ← 뒤로 <kbd>ESC</kbd>
        </button>
      )}
      <nav className="links" aria-label="메뉴">
        <Link href="/projects" aria-current={inProjects ? "page" : undefined}>
          Projects
        </Link>
        <Link href="/about" aria-current={path === "/about" ? "page" : undefined}>
          About
        </Link>
        <span className="sep2" aria-hidden="true" />
        <a className="ext" href={profile.contact.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a className="ext" href={profile.contact.blog} target="_blank" rel="noopener noreferrer">
          velog ↗
        </a>
      </nav>
    </header>
  );
}
