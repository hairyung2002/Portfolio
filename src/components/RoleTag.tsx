export function RoleTag({ label }: { label: string }) {
  return (
    <span className="border border-border px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-metal uppercase">
      {label}
    </span>
  );
}
