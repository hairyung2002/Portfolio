export function Section({
  title,
  index,
  children,
  first = false,
}: {
  title: string;
  index?: number;
  children: React.ReactNode;
  first?: boolean;
}) {
  // Latin titles get the mono / tracked / uppercase treatment; Korean titles
  // would only look letter-spaced and broken, so they render as plain metal.
  const isLatin = /^[\x00-\x7F]+$/.test(title);

  return (
    <section>
      <div
        className={`flex items-baseline gap-3 ${first ? "" : "mt-2 border-t border-border pt-10"}`}
      >
        {index !== undefined && (
          <span className="font-mono text-xs text-ink-muted">{String(index).padStart(2, "0")}</span>
        )}
        <h2
          className={
            isLatin
              ? "font-mono text-xs font-semibold tracking-[0.15em] text-metal uppercase"
              : "text-sm font-semibold text-metal"
          }
        >
          {title}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
