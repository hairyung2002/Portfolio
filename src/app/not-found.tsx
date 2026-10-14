import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
  description: "요청한 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <section className="layer" aria-label="찾을 수 없음">
      <div className="wrap">
        <p className="eyebrow">ERROR / 404</p>
        <h1 className="lhead metal" tabIndex={-1}>
          Not Found
        </h1>
        <p className="context">요청하신 경로를 찾을 수 없습니다. 주소가 바뀌었거나 존재하지 않는 페이지일 수 있습니다.</p>
        <nav className="pnav" aria-label="이동">
          <Link href="/">
            <span className="k">← INDEX</span>
            <span className="v">메인으로</span>
          </Link>
          <Link href="/projects">
            <span className="k">PROJECTS →</span>
            <span className="v">전체 프로젝트</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}
