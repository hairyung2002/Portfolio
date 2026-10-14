import Link from "next/link";
import type { Thread } from "@/content/projects";

/** "이어진 것": 이 프로젝트의 경험이 앞뒤 어디로 연결됐는가. */
export function ThreadList({ threads }: { threads: Thread[] }) {
  return (
    <ul className="threads" data-in>
      {threads.map((t) => (
        <li key={t.name}>
          <Link className="thr" href={t.href}>
            <span className="dir">{t.dir === "이전" ? "← 이전" : "이후 →"}</span>
            <span>
              <b>{t.name}</b>
              <span className="tx">{t.text}</span>
            </span>
            <span className="arr" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
