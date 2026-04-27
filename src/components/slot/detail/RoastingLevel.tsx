const LABELS = ["Light", "Medium Light", "Medium", "Medium Dark", "Dark"]

interface RoastingLevelProps {
  level: number
  color?: string
}

export function RoastingLevel({ level, color = "#75584d" }: RoastingLevelProps) {
  return (
    <div>
      <div className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-pill transition-colors duration-300"
            style={{ background: i <= level ? color : "rgba(211,195,192,0.3)" }}
          />
        ))}
      </div>
      <span
        className="font-display text-[11px] font-semibold tracking-[0.05em]"
        style={{ color }}
      >
        {LABELS[level - 1]?.toUpperCase()}
      </span>
    </div>
  )
}
