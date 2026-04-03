import CategoryBadge from "../CategoryBadge";
import { fmt } from "../../utils/format";
import { EXPENSE_CATS } from "../../data/seed";

export default function Transactions({
  dark:d, txs, filtered, filt, setF, toggleSort,
  isAdmin, setShowAdd, setEditTx, deleteTx,
}) {
  const cardBg  = d ? "#111120" : "#ffffff";
  const cardBdr = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const txtSec  = d ? "#64748b" : "#94a3b8";
  const txtPri  = d ? "#f1f5f9" : "#0f172a";
  const card    = { background:cardBg, border:`1px solid ${cardBdr}`, borderRadius:16, padding:"20px 22px" };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ ...card, display:"flex", flexWrap:"wrap", gap:10, alignItems:"center", marginBottom:16 }}>
        <input
          value={filt.search}
          onChange={e => setF("search", e.target.value)}
          placeholder="🔍  Search transactions..."
          style={{
            flex:1, minWidth:160, padding:"8px 12px", borderRadius:8,
            border:`1px solid ${cardBdr}`,
            background: d ? "#0d0d1a":"#f8fafc", color:txtPri,
            fontSize:14, outline:"none", fontFamily:"inherit",
          }}
        />

        <select value={filt.type} onChange={e => setF("type", e.target.value)} style={{
          padding:"8px 12px", borderRadius:8, border:`1px solid ${cardBdr}`,
          background: d ? "#0d0d1a":"#f8fafc", color:txtSec,
          fontSize:13, cursor:"pointer", outline:"none", fontFamily:"inherit",
        }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filt.category} onChange={e => setF("category", e.target.value)} style={{
          padding:"8px 12px", borderRadius:8, border:`1px solid ${cardBdr}`,
          background: d ? "#0d0d1a":"#f8fafc", color:txtSec,
          fontSize:13, cursor:"pointer", outline:"none", fontFamily:"inherit",
        }}>
          <option value="all">All Categories</option>
          {[...EXPENSE_CATS,"Income"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {isAdmin && (
          <button onClick={() => setShowAdd(true)} style={{
            padding:"8px 20px", borderRadius:8, border:"none",
            background:"#f59e0b", color:"#0f172a",
            fontSize:14, fontWeight:700, cursor:"pointer",
            whiteSpace:"nowrap", flexShrink:0,
          }}>
            + Add Transaction
          </button>
        )}
      </div>

      <p style={{ fontSize:13, color:txtSec, marginBottom:12 }}>
        Showing <strong style={{ color:txtPri }}>{filtered.length}</strong> of {txs.length} transactions
      </p>

      {/* Table */}
      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          {/* Header row */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"108px 1fr 115px 125px 90px 64px",
            minWidth:640, gap:0, padding:"10px 20px",
            borderBottom:`1px solid ${cardBdr}`,
            fontSize:11, fontWeight:700, letterSpacing:"0.1em",
            textTransform:"uppercase", color:txtSec,
          }}>
            {[["date","Date"],["description","Description"],["category","Category"],["amount","Amount"],["type","Type"],["",""]].map(([k,l]) => (
              <div key={k+l}>
                {k && k !== "type" && k !== "category" ? (
                  <button onClick={() => toggleSort(k)} style={{
                    background:"none", border:"none", cursor:"pointer", padding:0,
                    fontFamily:"inherit", fontSize:11, fontWeight:700,
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    color: filt.sortBy === k ? "#f59e0b" : txtSec,
                    display:"flex", alignItems:"center", gap:4,
                  }}>
                    {l} {filt.sortBy === k ? (filt.sortDir === "desc" ? "↓" : "↑") : ""}
                  </button>
                ) : <span>{l}</span>}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", color:txtSec }}>
              <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
              <p style={{ fontWeight:600, fontSize:16, marginBottom:6, color:txtPri }}>No transactions found</p>
              <p style={{ fontSize:13 }}>Try adjusting your filters or search terms</p>
            </div>
          ) : filtered.map((t, i) => (
            <div
              key={t.id}
              className={d ? "tx-row" : "tx-row-light"}
              style={{
                display:"grid",
                gridTemplateColumns:"108px 1fr 115px 125px 90px 64px",
                minWidth:640, gap:0, padding:"12px 20px",
                alignItems:"center", transition:"background 0.12s",
                borderBottom: i < filtered.length - 1 ? `1px solid ${cardBdr}` : "none",
              }}
            >
              <div style={{ fontSize:12, fontFamily:"'DM Mono', monospace", color:txtSec }}>{t.date}</div>
              <div style={{ fontSize:14, fontWeight:500, color:txtPri, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:12 }}>{t.description}</div>
              <div><CategoryBadge category={t.category} /></div>
              <div style={{ fontSize:14, fontWeight:700, fontFamily:"'DM Mono', monospace", color: t.type==="income" ? "#22c55e":"#f43f5e" }}>
                {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
              </div>
              <div>
                <span style={{
                  fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:20,
                  textTransform:"uppercase", letterSpacing:"0.06em",
                  background: t.type==="income" ? "rgba(34,197,94,0.14)" : "rgba(244,63,94,0.14)",
                  color: t.type==="income" ? "#22c55e" : "#f43f5e",
                }}>
                  {t.type}
                </span>
              </div>
              <div style={{ display:"flex", gap:2, justifyContent:"flex-end" }}>
                {isAdmin && (
                  <>
                    <button onClick={() => setEditTx(t)} title="Edit" style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:0.5, padding:"4px 5px", borderRadius:6, transition:"opacity 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity="1"}
                      onMouseLeave={e => e.currentTarget.style.opacity="0.5"}>✏️</button>
                    <button onClick={() => deleteTx(t.id)} title="Delete" style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, opacity:0.5, padding:"4px 5px", borderRadius:6, transition:"opacity 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity="1"}
                      onMouseLeave={e => e.currentTarget.style.opacity="0.5"}>🗑️</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}