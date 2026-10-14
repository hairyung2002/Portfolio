/**
 * HTML 파싱 중에 동기로 실행돼 첫 페인트 전에 DOM을 고치는 스크립트.
 * 클라이언트 이동에서는 실행되지 않는다(하드 로드 전용).
 * 클라이언트 렌더에서 type을 바꿔 React의 <script> 경고를 피한다.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
