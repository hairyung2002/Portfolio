import type { ProjectDecision } from "@/content/projects/types";

function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex flex-col items-start py-1.5 pl-1">
      <span className="h-4 w-px bg-metal-dim" />
      <span className="-mt-[3px] text-[10px] leading-none text-metal-dim">▼</span>
    </div>
  );
}

function DecisionBlock({
  decision,
  index,
  defaultOpen = false,
}: {
  decision: ProjectDecision;
  index: number;
  defaultOpen?: boolean;
}) {
  const summaryLine = decision.result.split("\n\n")[0];

  return (
    <details open={defaultOpen} className="group corner-marks border border-border bg-surface">
      <summary
        className="flex cursor-pointer list-none items-start gap-3 bg-surface-2 px-5 py-3.5 transition-colors duration-150 hover:bg-surface-2/70 [&::-webkit-details-marker]:hidden"
      >
        <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-metal">
          D{String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="text-[15px] font-bold text-ink">{decision.title}</h3>
          <p className="line-clamp-1 text-[13px] leading-relaxed text-ink-muted group-open:hidden">
            {summaryLine}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 font-mono text-[11px] tracking-wide text-ink-muted uppercase transition-transform duration-200 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="flex flex-col gap-0 border-t border-border px-5 py-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.15em] text-ink-muted uppercase">Situation</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink">{decision.situation}</p>
        </div>

        <FlowArrow />

        <div>
          <p className="font-mono text-[11px] tracking-[0.15em] text-ink-muted uppercase">Options</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {decision.options.map((option, i) => (
              <div key={i} className="flex gap-2 border border-metal-dim bg-bg px-3 py-2.5 text-sm leading-relaxed text-ink-muted">
                <span className="shrink-0 font-mono text-xs text-metal">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>

        <FlowArrow />

        <div>
          <p className="font-mono text-[11px] tracking-[0.15em] text-ink-muted uppercase">Reasoning</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink">{decision.reasoning}</p>
        </div>

        <FlowArrow />

        <div className="border-l-2 border-status-building pl-4">
          <p className="font-mono text-[11px] tracking-[0.15em] text-status-building uppercase">Tradeoff</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-muted">{decision.tradeoff}</p>
        </div>

        <FlowArrow />

        <div className="border-l-2 border-accent pl-4">
          <p className="font-mono text-[11px] tracking-[0.15em] text-accent uppercase">Result</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink">{decision.result}</p>
        </div>
      </div>
    </details>
  );
}

export function DecisionLog({ decisions }: { decisions: ProjectDecision[] }) {
  return (
    <div className="flex flex-col gap-6">
      {decisions.map((decision, i) => (
        <DecisionBlock key={decision.title} decision={decision} index={i} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
