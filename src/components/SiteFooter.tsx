import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="corner-marks border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] tracking-wide text-ink-muted uppercase">
          © 2026 {profile.name} — Contact
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px]">
          <a href={`mailto:${profile.contact.email}`} className="text-ink-muted transition-colors hover:text-ink">
            {profile.contact.email}
          </a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors hover:text-ink">
            GitHub ↗
          </a>
          <a href={profile.contact.blog} target="_blank" rel="noopener noreferrer" className="text-ink-muted transition-colors hover:text-ink">
            velog ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
