import type { CSSProperties } from "react";
import { timeline } from "@/content/activities";

/** 메인 두 번째 장면. 가로선 위아래로 활동이 번갈아 놓인다(모바일은 세로 목록). */
export function ActivityTimeline() {
  const first = timeline[0].date.slice(0, 4);
  const last = timeline[timeline.length - 1].date.slice(0, 4);
  return (
    <section className="idx-tl" aria-labelledby="activities-title">
      <div className="rest-head">
        <p className="eyebrow">
          ACTIVITIES · {first} — {last}
        </p>
        <h2 className="scene-title" id="activities-title">
          Activities
        </h2>
      </div>
      <div className="tl-wrap">
        <span className="tl-line" aria-hidden="true" />
        <ol className="tl" style={{ "--n": timeline.length + 1 } as CSSProperties}>
          {timeline.map((e, i) => (
            <li key={`${e.date}-${e.title}`} className={`tl-item ${i % 2 ? "down" : "up"}`}>
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-stem" aria-hidden="true" />
              <div className="tl-card">
                <span className="tl-d">{e.date}</span>
                <span className="tl-t">{e.title}</span>
                {e.sub && <span className="tl-s">{e.sub}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
