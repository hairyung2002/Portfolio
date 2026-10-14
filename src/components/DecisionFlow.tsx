import type { ReactNode } from "react";
import type { Decision } from "@/content/projects";

function Step({ no, en, ko, result, children }: { no: number; en: string; ko: string; result?: boolean; children: ReactNode }) {
  return (
    <li className={result ? "step result" : "step"} data-in>
      <span className="sk">
        <span className="mono">
          {String(no).padStart(2, "0")} {en}
        </span>
        <b>{ko}</b>
      </span>
      {children}
    </li>
  );
}

/** 판단 페이지의 세로 흐름: 상황 → 선택지 → 근거 → 트레이드오프 → 결과. */
export function DecisionFlow({ decision }: { decision: Decision }) {
  const { options } = decision;
  const hasOptions = !!options && options.length > 0;
  const no = (k: number) => (hasOptions || k < 2 ? k : k - 1);

  return (
    <div className="flow">
      <span className="flow-line" aria-hidden="true" />
      <ol className="steps">
        <Step no={no(1)} en="SITUATION" ko="상황">
          <p>{decision.situation}</p>
        </Step>
        {hasOptions && (
          <Step no={no(2)} en="OPTIONS" ko="선택지">
            <div className="opts">
              {options.map((o) => (
                <div key={o.title} className={o.chosen ? "opt chosen" : "opt"}>
                  <span className="ol">{o.chosen ? (decision.optionLabel ?? "선택") : "대안"}</span>
                  <b>{o.title}</b>
                  {o.desc && <span>{o.desc}</span>}
                </div>
              ))}
            </div>
          </Step>
        )}
        <Step no={no(3)} en="REASONING" ko="근거">
          <p>{decision.reasoning}</p>
        </Step>
        <Step no={no(4)} en="TRADEOFF" ko="트레이드오프">
          <p>{decision.tradeoff}</p>
        </Step>
        <Step no={no(5)} en="RESULT" ko="결과" result>
          <p>{decision.result}</p>
        </Step>
      </ol>
    </div>
  );
}
