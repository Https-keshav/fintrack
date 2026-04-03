import { useState } from "react";

export default function SummaryCard({ title, value, sub, icon, color, dark: d }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: d ? "#111120" : "#fff",
        border: `1px solid ${d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 16,
        padding: "20px 22px",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov
          ? d ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)"
          : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color: d ? "#64748b" : "#94a3b8" }}>
          {title}
        </span>
        <span style={{ fontSize:20 }}>{icon}</span>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color, fontFamily:"'Bebas Neue', cursive", letterSpacing:"0.04em", marginBottom:4, lineHeight:1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize:12, color: d ? "#475569" : "#94a3b8", marginTop:6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}