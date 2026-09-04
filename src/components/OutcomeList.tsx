import type { OutcomeItem } from "@/content/projects/types";

export function OutcomeList({ items }: { items: OutcomeItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border border border-border">
      {items.map((item) => (
        <li key={item.label} className="flex items-start gap-3 px-4 py-3.5 text-sm leading-relaxed">
          <span
            aria-hidden="true"
            className={`mt-0.5 w-4 shrink-0 font-mono text-xs ${
              item.verified ? "text-status-active" : "text-status-design"
            }`}
          >
            {item.verified ? "✓" : "△"}
          </span>
          <span className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1">
            <span className={item.verified ? "text-ink" : "text-ink-muted"}>{item.label}</span>
            <span
              className={`whitespace-nowrap border px-1.5 py-0.5 text-[10.5px] ${
                item.verified
                  ? "border-status-active/30 bg-status-active-bg font-mono tracking-wide text-status-active uppercase"
                  : "border-status-design/30 bg-status-design-bg font-medium text-status-design"
              }`}
            >
              {item.verified ? "Verified" : (item.note ?? "설계 의도 · 미검증")}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
