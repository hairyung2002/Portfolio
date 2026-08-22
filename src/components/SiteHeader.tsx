import Link from "next/link";
import { profile } from "@/content/profile";
import { Magnetic } from "./Magnetic";

const NAV = [
  { href: "/projects", label: "WORK" },
  { href: "/about", label: "ABOUT" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-[13px] tracking-wide text-ink hover:text-metal">
          {profile.name}
        </Link>
        <nav className="flex items-center gap-6 font-mono text-[12px] tracking-wide uppercase">
          {NAV.map((item) => (
            <Magnetic key={item.href} strength={6}>
              <Link href={item.href} className="text-ink-muted transition-colors hover:text-ink">
                {item.label}
              </Link>
            </Magnetic>
          ))}
          <Magnetic strength={6}>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              GITHUB ↗
            </a>
          </Magnetic>
          <Magnetic strength={6}>
            <a href={`mailto:${profile.contact.email}`} className="hidden text-ink-muted transition-colors hover:text-ink sm:inline">
              CONTACT
            </a>
          </Magnetic>
        </nav>
      </div>
    </header>
  );
}
