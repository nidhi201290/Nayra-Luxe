export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "success" | "warning" | "error";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-blush text-charcoal",
    gold: "bg-gold/10 text-gold border border-gold/30",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    error: "bg-error/10 text-error",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
