import { fmt } from "../utils/format";

export default function ChartTooltip({ active, payload, label, dark: d }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: d ? "#1a1a2e" : "#fff",
      border: `1px solid ${d ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
      borderRadius:10, padding:"10px 14px", fontSize:13,
    }}>
      <p style={{ fontWeight:600, marginBottom:6, color: d ? "#e2e8f0" : "#1e293b" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color:p.color, fontFamily:"'DM Mono', monospace", margin:"2px 0" }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}