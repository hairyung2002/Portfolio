import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
  description: "요청한 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center gap-8 px-6 py-24">
      <span className="font-mono text-xs tracking-[0.15em] text-ink-muted uppercase">Error / 404</span>
      <h1 className="text-5xl font-bold tracking-tight text-ink sm:text-6xl">
        PAGE NOT FOUND.
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-ink-muted">
        요청하신 경로를 찾을 수 없습니다. 주소가 바뀌었거나 존재하지 않는 페이지일 수 있습니다.
      </p>
      <div className="flex items-center gap-6 font-mono text-[13px] tracking-wide uppercase">
        <Link href="/" className="text-ink transition-colors hover:text-metal">
          ← Home
        </Link>
        <Link href="/projects" className="text-ink-muted transition-colors hover:text-ink">
          Work
        </Link>
      </div>
    </div>
  );
}
