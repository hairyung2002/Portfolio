import { Fragment } from "react";

/** 콘텐츠의 `*구간*` 토큰을 <em>으로 바꾼다. 마크업을 데이터에 넣지 않기 위한 최소 문법. */
export function Emph({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*(.+?)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export function plain(text: string) {
  return text.replace(/\*/g, "");
}
