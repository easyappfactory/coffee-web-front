interface FlavorBarsProps {
  bars: { name: string; value: number }[]
  color?: string
  maxValue?: number
}

export function FlavorBars({ bars, color = "#75584d", maxValue = 100 }: FlavorBarsProps) {
  return (
    <div className="flex flex-col gap-3">
      {bars.map((b) => (
        <div key={b.name}>
          <div className="mb-[5px] flex justify-between">
            <span className="font-display text-[11px] font-semibold tracking-[0.05em] text-ink-2">
              {b.name.toUpperCase()}
            </span>
            <span className="font-display text-[11px] font-bold" style={{ color }}>
              {b.value}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-pill bg-border">
            <div
              className="h-full rounded-pill"
              style={{
                width: `${(b.value / maxValue) * 100}%`,
                background: color,
                transition: "width 0.8s cubic-bezier(.16,1,.3,1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
