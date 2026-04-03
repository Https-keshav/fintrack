import { useState } from "react";
import { EXPENSE_CATS } from "../data/seed";

export default function TransactionModal({ tx, onSave, onClose, dark: d }) {
  const [form, setForm] = useState(
    tx
      ? { ...tx }
      : {
          date: new Date().toISOString().slice(0, 10),
          description: "",
          amount: "",
          category: "Food",
          type: "expense",
        }
  );

  const set = (k, v) =>
    setForm(f => ({
      ...f,
      [k]: v,
      ...(k === "type" ? { category: v === "income" ? "Income" : "Food" } : {}),
    }));

  const cardBdr = d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const inp = {
    background: d ? "#09090f" : "#f8fafc",
    border: `1px solid ${cardBdr}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    width: "100%",
    color: d ? "#e2e8f0" : "#1e293b",
    outline: "none",
    fontFamily: "inherit",
  };
  const lbl = {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: d ? "#64748b" : "#94a3b8",
    display: "block", marginBottom: 8,
  };

  const valid = form.description.trim() && Number(form.amount) > 0 && form.date;

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.78)",
      backdropFilter:"blur(6px)", zIndex:50,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div style={{
        width:"100%", maxWidth:440,
        background: d ? "#111120" : "#fff",
        border: `1px solid ${cardBdr}`,
        borderRadius:20, padding:28,
      }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ margin:0, fontSize:20, fontWeight:700, color: d ? "#f1f5f9" : "#0f172a", fontFamily:"'Instrument Sans', sans-serif" }}>
            {tx ? "Edit Transaction" : "New Transaction"}
          </h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color: d ? "#64748b" : "#94a3b8", lineHeight:1, padding:"0 4px" }}>
            ×
          </button>
        </div>

        {/* Type */}
        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Type</label>
          <div style={{ display:"flex", gap:8 }}>
            {["expense","income"].map(t => (
              <button key={t} onClick={() => set("type", t)} style={{
                flex:1, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:14, fontWeight:600, textTransform:"capitalize",
                background: form.type === t
                  ? (t === "income" ? "#22c55e" : "#f43f5e")
                  : (d ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                color: form.type === t ? "#fff" : (d ? "#94a3b8" : "#64748b"),
                transition:"all 0.15s",
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Description</label>
          <input
            style={inp}
            value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="e.g. Grocery Shopping"
          />
        </div>

        {/* Amount + Date */}
        <div style={{ display:"flex", gap:12, marginBottom:16 }}>
          <div style={{ flex:1 }}>
            <label style={lbl}>Amount (₹)</label>
            <input
              style={inp} type="number" min="1"
              value={form.amount}
              onChange={e => set("amount", e.target.value)}
              placeholder="0"
            />
          </div>
          <div style={{ flex:1 }}>
            <label style={lbl}>Date</label>
            <input
              style={{ ...inp, colorScheme: d ? "dark" : "light" }}
              type="date"
              value={form.date}
              onChange={e => set("date", e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom:26 }}>
          <label style={lbl}>Category</label>
          <select style={inp} value={form.category} onChange={e => set("category", e.target.value)}>
            {(form.type === "income" ? ["Income"] : EXPENSE_CATS).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{
            flex:1, padding:"11px 0", borderRadius:10,
            border:`1px solid ${cardBdr}`, background:"transparent",
            cursor:"pointer", fontSize:14, fontWeight:600,
            color: d ? "#94a3b8" : "#64748b",
          }}>
            Cancel
          </button>
          <button
            onClick={() => valid && onSave({ ...form, amount: Number(form.amount), id: tx?.id })}
            style={{
              flex:1, padding:"11px 0", borderRadius:10, border:"none",
              cursor: valid ? "pointer" : "not-allowed",
              fontSize:14, fontWeight:700,
              background: valid ? "#f59e0b" : (d ? "rgba(255,255,255,0.08)" : "#e2e8f0"),
              color: valid ? "#0f172a" : (d ? "#334155" : "#94a3b8"),
              transition:"all 0.15s",
            }}
          >
            {tx ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}