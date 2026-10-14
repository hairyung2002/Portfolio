import Link from "next/link";

type NavLink = { href: string; k: string; v: string };

/** 페이지 하단의 이전/다음 이동. */
export function PageNav({ label, prev, next }: { label: string; prev: NavLink; next: NavLink }) {
  return (
    <nav className="pnav" data-in aria-label={label}>
      <Link href={prev.href}>
        <span className="k">{prev.k}</span>
        <span className="v">{prev.v}</span>
      </Link>
      <Link href={next.href}>
        <span className="k">{next.k}</span>
        <span className="v">{next.v}</span>
      </Link>
    </nav>
  );
}
