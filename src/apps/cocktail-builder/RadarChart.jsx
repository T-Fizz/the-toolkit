const AXES = ["bitter", "sweet", "sour", "boozy", "herbal", "fruity", "smoky"];

export default function RadarChart({ profile, size = 160, max = 5 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const n = AXES.length;

  const point = (axis, value) => {
    const i = AXES.indexOf(axis);
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min((value ?? 0) / max, 1) * radius;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const labelPos = (axis) => {
    const i = AXES.indexOf(axis);
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = radius + 12;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const profilePoly = AXES.map((a) => {
    const p = point(a, profile[a]);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {[0.33, 0.66, 1].map((r) => (
        <polygon
          key={r}
          points={AXES.map((a) => {
            const p = point(a, max * r);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="#2E2A24"
          strokeWidth={r === 1 ? 1 : 0.5}
        />
      ))}
      {AXES.map((a) => {
        const p = point(a, max);
        return <line key={a} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2E2A24" strokeWidth={0.5} />;
      })}
      <polygon points={profilePoly} fill="#B8956A33" stroke="#B8956A" strokeWidth={1.5} />
      {AXES.map((a) => {
        const p = labelPos(a);
        return (
          <text
            key={a}
            x={p.x}
            y={p.y}
            fill="#8A7B6B"
            fontSize={9}
            fontFamily="system-ui, sans-serif"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            {a}
          </text>
        );
      })}
    </svg>
  );
}
