import type { Ref } from "react";

/**
 * Signature element — 검은 화면 위를 지나가는 얇은 빛의 띠.
 * 스스로 움직이지 않는다. 페이지 진입·전환 같은 제한된 순간에만
 * TransitionProvider와 메인 진입 연출이 한 번씩 통과시킨다.
 */
export function ScanLine({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref} className="scan" aria-hidden="true" />;
}
