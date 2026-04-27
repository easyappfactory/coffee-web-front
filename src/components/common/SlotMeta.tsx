import { cn } from "@/lib/utils";

interface SlotMetaProps {
  duration: string;
  category: string;
  className?: string;
}

export function SlotMeta({ duration, category, className }: SlotMetaProps) {
  return (
    <span className={cn("text-xs font-medium uppercase tracking-widest text-ink-muted", className)}>
      {duration} · {category}
    </span>
  );
}
