interface RadarChartProps {
  data: Record<string, number>;
  size?: number;
  color?: string;
}

export function RadarChart({ data, size = 200, color = "#75584d" }: RadarChartProps) {
  const keys = Object.keys(data);
  const vals = keys.map((k) => data[k] / 100);
  const n = keys.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  function polar(i: number, frac: number): [number, number] {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return [cx + frac * r * Math.cos(angle), cy + frac * r * Math.sin(angle)];
  }

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = vals.map((v, i) => polar(i, v));
  const pathD =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={keys.map((_, i) => polar(i, level).join(",")).join(" ")}
          fill="none"
          stroke="rgba(211,195,192,0.4)"
          strokeWidth="1"
        />
      ))}
      {keys.map((_, i) => {
        const [ax, ay] = polar(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={ax} y2={ay} stroke="rgba(211,195,192,0.3)" strokeWidth="1" />;
      })}
      <path d={pathD} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={color} />
      ))}
      {keys.map((k, i) => {
        const [lx, ly] = polar(i, 1.22);
        return (
          <text
            key={k}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "9px", fontFamily: "Manrope, sans-serif", fontWeight: 700, fill: "#444748", letterSpacing: "0.06em" }}
          >
            {k}
          </text>
        );
      })}
      {keys.map((k, i) => {
        const [lx, ly] = polar(i, vals[i] * 0.6);
        return (
          <text
            key={k + "val"}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "8px", fontFamily: "Manrope, sans-serif", fontWeight: 600, fill: color, opacity: 0.85 }}
          >
            {data[k]}
          </text>
        );
      })}
    </svg>
  );
}
