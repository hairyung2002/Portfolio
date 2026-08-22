export function ProseText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="flex max-w-[68ch] flex-col gap-4 text-[15px] leading-relaxed text-ink-muted">
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
