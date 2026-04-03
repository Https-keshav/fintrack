import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine,
  } from "recharts";
  import SummaryCard   from "../SummaryCard";
  import ChartTooltip  from "../ChartTooltip";
  import { CAT_COLORS } from "../../data/seed";
  import { fmt, fmtK  } from "../../utils/format";
  
  export default function Dashboard({ dark:d, txs, income, expenses, balance, savingsRate, monthly, catSpend }) {
    const cardBg  = d ? "#111120" : "#ffffff";
    const cardBdr = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const txtSec  = d ? "#64748b" : "#94a3b8";
    const txtPri  = d ? "#f1f5f9" : "#0f172a";
    const grid    = d ? "#1a1a2e" : "#e2e8f0";
    const card    = { background:cardBg, border:`1px solid ${cardBdr}`, borderRadius:16, padding:"20px 22px" };
    const sLbl    = { fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:txtSec };
  
    return (
      <div>
        {/* Summary cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:16, marginBottom:20 }}>
          <SummaryCard title="Net Balance"    value={fmt(balance)}      sub={`${savingsRate}% savings rate`}                         icon="💰" color={balance >= 0 ? "#22c55e" : "#f43f5e"} dark={d} />
          <SummaryCard title="Total Income"   value={fmt(income)}       sub={`${txs.filter(t=>t.type==="income").length} entries`}   icon="📈" color="#22c55e" dark={d} />
          <SummaryCard title="Total Expenses" value={fmt(expenses)}     sub={`${txs.filter(t=>t.type==="expense").length} entries`}  icon="📉" color="#f43f5e" dark={d} />
          <SummaryCard title="Savings Rate"   value={`${savingsRate}%`} sub={`${fmt(balance)} saved total`}                         icon="🎯" color="#f59e0b" dark={d} />
        </div>
  
        {/* Charts row */}
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,2fr) minmax(0,1fr)", gap:16, marginBottom:16 }}>
  
          {/* Area chart */}
          <div style={card}>
            <p style={{ ...sLbl, marginBottom:18 }}>Monthly Overview — Income vs Expenses</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly} margin={{ top:5, right:5, bottom:0, left:-10 }}>
                <defs>
                  <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="label" tick={{ fill:txtSec, fontSize:12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill:txtSec, fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip dark={d} />} />
                <Area type="monotone" dataKey="Income"   name="Income"   stroke="#22c55e" fill="url(#gi)" strokeWidth={2.5} dot={{ fill:"#22c55e", r:4, strokeWidth:0 }} activeDot={{ r:6 }} />
                <Area type="monotone" dataKey="Expenses" name="Expenses" stroke="#f43f5e" fill="url(#ge)" strokeWidth={2.5} dot={{ fill:"#f43f5e", r:4, strokeWidth:0 }} activeDot={{ r:6 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", justifyContent:"center", gap:22, marginTop:10 }}>
              {[["Income","#22c55e"],["Expenses","#f43f5e"]].map(([l,c]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:txtSec }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
                </div>
              ))}
            </div>
          </div>
  
          {/* Pie chart */}
          <div style={card}>
            <p style={{ ...sLbl, marginBottom:14 }}>Spending Breakdown</p>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie data={catSpend} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="value">
                  {catSpend.map(e => <Cell key={e.name} fill={CAT_COLORS[e.name] || "#6b7280"} />)}
                </Pie>
                <Tooltip
                  formatter={v => [fmt(v)]}
                  contentStyle={{ background: d ? "#1a1a2e":"#fff", border:"none", borderRadius:8, fontSize:12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop:6 }}>
              {catSpend.slice(0,5).map(c => (
                <div key={c.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:CAT_COLORS[c.name]||"#6b7280", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:txtSec }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize:12, fontFamily:"'DM Mono', monospace", color:txtPri }}>{fmt(c.value)}</span>
                </div>
              ))}
              {catSpend.length > 5 && (
                <p style={{ fontSize:11, color:txtSec, textAlign:"center", marginTop:4 }}>
                  +{catSpend.length - 5} more categories
                </p>
              )}
            </div>
          </div>
        </div>
  
        {/* Bar chart */}
        <div style={card}>
          <p style={{ ...sLbl, marginBottom:16 }}>Monthly Net Savings</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={monthly} margin={{ top:5, right:5, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="label" tick={{ fill:txtSec, fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fill:txtSec, fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip dark={d} />} />
              <ReferenceLine y={0} stroke={grid} strokeWidth={1.5} />
              <Bar dataKey="Net" name="Net Savings" radius={[6,6,0,0]}>
                {monthly.map(m => <Cell key={m.month} fill={m.Net >= 0 ? "#22c55e" : "#f43f5e"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }