import { AXES } from "./ingredients.js";

/*
 * Flavor radar. 7-axis polygon. Each axis is a flavor dimension (sweet, acid,
 * umami, spicy, fatty, fresh, salty). Values clamp to [0, MAX] for the plot.
 * The grey background polygon is the full range; the gold polygon is the
 * current sandwich profile.
 */

const AXIS_LABELS = {
  sweet: "sweet",
  acid: "acid",
  umami: "umami",
  spicy: "spicy",
  fatty: "fat",
  fresh: "fresh",
  salty: "salty",
};

export default function RadarChart({ profile, size = 200, max = 10 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  const n = AXES.length;

  const point = (axis, value) => {
    const i = AXES.indexOf(axis);
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(value / max, 1) * radius;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const labelPos = (axis) => {
    const i = AXES.indexOf(axis);
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = radius + 14;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const bgPolygon = AXES.map((a) => {
    const p = point(a, max);
    return `${p.x},${p.y}`;
  }).join(" ");

  const profilePolygon = AXES.map((a) => {
    const p = point(a, profile[a] ?? 0);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {/* rings */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
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
      {/* axes spokes */}
      {AXES.map((a) => {
        const p = point(a, max);
        return <line key={a} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2E2A24" strokeWidth={0.5} />;
      })}
      {/* current profile */}
      <polygon points={profilePolygon} fill="#B8956A33" stroke="#B8956A" strokeWidth={1.5} />
      {/* labels */}
      {AXES.map((a) => {
        const p = labelPos(a);
        return (
          <text
            key={a}
            x={p.x}
            y={p.y}
            fill="#8A7B6B"
            fontSize={10}
            fontFamily="system-ui, sans-serif"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            {AXIS_LABELS[a]}
          </text>
        );
      })}
    </svg>
  );
}
