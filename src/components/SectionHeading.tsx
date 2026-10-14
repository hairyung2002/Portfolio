/** 상세 페이지 섹션 제목: 한국어 제목 + 작은 영문 라벨. */
export function SectionHeading({ title, label, id }: { title: string; label: string; id?: string }) {
  return (
    <h2 className="sec" id={id} data-in>
      {title} <span className="mono">{label}</span>
    </h2>
  );
}
