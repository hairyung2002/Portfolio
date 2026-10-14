import { Fragment } from "react";

/** 빈 줄로 나뉜 문단을 렌더링한다. `코드` 구간은 모노스페이스로. */
export function ProseText({ text }: { text: string }) {
  return (
    <div className="prose" data-in>
      {text.split("\n\n").map((p, i) => (
        <p key={i}>
          {p.split(/`([^`]+)`/g).map((part, j) => (j % 2 ? <code key={j}>{part}</code> : <Fragment key={j}>{part}</Fragment>))}
        </p>
      ))}
    </div>
  );
}
