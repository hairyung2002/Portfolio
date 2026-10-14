import type { Pending } from "@/content/projects/types";

/** 검증된 결과(초록 점)와 측정 전 안내(점선 상자)를 시각적으로 분리한다. */
export function OutcomeList({ items, pending }: { items: string[]; pending?: Pending }) {
  return (
    <div data-in>
      {items.length > 0 && (
        <ul className="outs">
          {items.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      )}
      {pending && (
        <p className="pending">
          <b>{pending.label}</b> · {pending.text}
        </p>
      )}
    </div>
  );
}
