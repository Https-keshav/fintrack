import { CAT_COLORS } from "../../data/seed";
import { fmt } from "../../utils/format";

export default function Insights({
  dark:d, expenses, income, savingsRate,
  catSpend, topCat, expDelta, currM, prevM, incomeSources,
}) {
  const cardBg  = d ? "#111120" : "#ffffff";
  const cardBdr = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const txtSec  = d ? "#64748b" : "#94a3b8";
  const txtPri  = d ? "#f1f5f9" : "#0f172a";
  const card    = { background:cardBg, border:`1px solid ${cardBdr}`, borderRadius:16, padding:"20px 22px" };
  const sLbl    = { fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:txtSec };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:16 }}>

      {/* Top spending category */}
      <div style={{ ...card, borderLeft:`4px solid ${topCat ? CAT_COLORS[topCat.name] : "#f59e0b"}` }}>
        <div style={{ fontSize:30, marginBottom:10 }}>🏆</div>
        <p style={{ ...sLbl, marginBottom:8 }}>Top Spending Category</p>
        <p style={{ fontSize:26, fontWeight:800, color:txtPri, fontFamily:"'Bebas Neue', cursive", letterSpacing:"0.04em", lineHeight:1.1 }}>
          {topCat?.name || "—"}
        </p>
        <p style={{ fontSize:18, fontWeight:700, color: topCat ? CAT_COLORS[topCat.name] : "#f59e0b", fontFamily:"'DM Mono', monospace", marginTop:4 }}>
          {topCat ? fmt(topCat.value) : "—"}
        </p>
        {topCat && (
          <p style={{ fontSize:12, color:txtSec, marginTop:10 }}>
            {((topCat.value / expenses) * 100).toFixed(1)}% of your total spending
          </p>
        )}
      </div>

      {/* Savings rate */}
      <div style={card}>
        <div style={{ fontSize:30, marginBottom:10 }}>💸</div>
        <p style={{ ...sLbl, marginBottom:8 }}>Savings Rate</p>
        <p style={{
          fontSize:36, fontWeight:800, fontFamily:"'Bebas Neue', cursive",
          letterSpacing:"0.04em", lineHeight:1,
          color: savingsRate >= 20 ? "#22c55e" : savingsRate >= 10 ? "#f59e0b" : "#f43f5e",
        }}>
          {savingsRate}%
        </p>
        <div style={{ height:7, borderRadius:4, background: d ? "#1e1e30":"#e2e8f0", marginTop:14, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:4,
            width:`${Math.min(Math.abs(savingsRate),100)}%`,
            background: savingsRate >= 20 ? "#22c55e" : savingsRate >= 10 ? "#f59e0b" : "#f43f5e",
            transition:"width 0.6s ease",
          }} />
        </div>
        <p style={{ fontSize:12, color:txtSec, marginTop:10 }}>
          {savingsRate >= 20 ? "Excellent savings habit! 🎉" : savingsRate >= 10 ? "Good, but room to improve" : "Consider reducing expenses"}
        </p>
      </div>

      {/* Month-over-month */}
      <div style={card}>
        <div style={{ fontSize:30, marginBottom:10 }}>📅</div>
        <p style={{ ...sLbl, marginBottom:8 }}>Month-over-Month Expenses</p>
        {expDelta !== null ? (
          <>
            <p style={{
              fontSize:36, fontWeight:800, fontFamily:"'Bebas Neue', cursive",
              letterSpacing:"0.04em", lineHeight:1,
              color: expDelta > 0 ? "#f43f5e" : "#22c55e",
            }}>
              {expDelta > 0 ? "+" : ""}{expDelta}%
            </p>
            <p style={{ fontSize:12, color:txtSec, marginTop:10 }}>
              {currM?.label} vs {prevM?.label} · {expDelta > 0 ? "spending rose ↑" : "spending fell ↓🎉"}
            </p>
            <div style={{ display:"flex", gap:20, marginTop:14 }}>
              {[[currM?.label, currM?.Expenses,"#f43f5e"],[prevM?.label, prevM?.Expenses, txtSec]].map(([l,v,c]) => (
                <div key={l}>
                  <p style={{ fontSize:11, color:txtSec, marginBottom:3 }}>{l}</p>
                  <p style={{ fontSize:15, fontFamily:"'DM Mono', monospace", fontWeight:600, color:c }}>
                    {v ? fmt(v) : "—"}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize:14, color:txtSec, marginTop:8 }}>Need at least 2 months of data</p>
        )}
      </div>

      {/* Income sources */}
      <div style={card}>
        <div style={{ fontSize:30, marginBottom:10 }}>💼</div>
        <p style={{ ...sLbl, marginBottom:14 }}>Income Sources</p>
        {incomeSources.map(([k,v]) => (
          <div key={k} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:13, color:txtPri, fontWeight:500 }}>{k}</span>
              <span style={{ fontSize:13, fontFamily:"'DM Mono', monospace", color:"#22c55e", fontWeight:600 }}>
                +{fmt(v)}
              </span>
            </div>
            <div style={{ height:5, borderRadius:3, background: d ? "#1e1e30":"#e2e8f0" }}>
              <div style={{ height:"100%", borderRadius:3, width:`${(v/income)*100}%`, background:"#22c55e", transition:"width 0.5s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Avg daily spend */}
      <div style={card}>
        <div style={{ fontSize:30, marginBottom:10 }}>📆</div>
        <p style={{ ...sLbl, marginBottom:8 }}>Avg Daily Expense</p>
        <p style={{ fontSize:36, fontWeight:800, fontFamily:"'Bebas Neue', cursive", letterSpacing:"0.04em", lineHeight:1, color:"#f59e0b" }}>
          {fmt(Math.round(expenses / 90))}
        </p>
        <p style={{ fontSize:12, color:txtSec, marginTop:10 }}>Based on 90 days of tracked data</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
          {[
            ["Projected / month", fmt(Math.round(expenses/3))],
            ["Projected / year",  fmt(Math.round(expenses/90*365))],
          ].map(([l,v]) => (
            <div key={l} style={{ background: d ? "rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)", borderRadius:8, padding:"10px 12px" }}>
              <p style={{ fontSize:11, color:txtSec, marginBottom:4 }}>{l}</p>
              <p style={{ fontSize:13, fontFamily:"'DM Mono', monospace", color:txtPri, fontWeight:600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category % breakdown */}
      <div style={card}>
        <div style={{ fontSize:30, marginBottom:10 }}>📊</div>
        <p style={{ ...sLbl, marginBottom:14 }}>Category % Breakdown</p>
        {catSpend.map(c => (
          <div key={c.name} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:CAT_COLORS[c.name]||"#6b7280", flexShrink:0 }} />
                <span style={{ fontSize:13, color:txtPri }}>{c.name}</span>
              </div>
              <span style={{ fontSize:12, fontFamily:"'DM Mono', monospace", color:txtSec }}>
                {((c.value/expenses)*100).toFixed(0)}% · {fmt(c.value)}
              </span>
            </div>
            <div style={{ height:5, borderRadius:3, background: d ? "#1e1e30":"#e2e8f0", overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:3, width:`${(c.value/expenses)*100}%`, background:CAT_COLORS[c.name]||"#6b7280", transition:"width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}