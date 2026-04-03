import { useState, useMemo, useRef } from "react";
import { SEED, EXPENSE_CATS }        from "./data/seed";
import { fmt, mLbl }                  from "./utils/format";
import Header                         from "./components/Header";
import SummaryCard                    from "./components/SummaryCard";
import TransactionModal               from "./components/TransactionModal";
import Dashboard                      from "./components/tabs/Dashboard";
import Transactions                  from "./components/tabs/Transactions";
import Insights                       from "./components/tabs/Insights";

export default function App() {
  const idRef = useRef(25);
  const [dark,    setDark]    = useState(true);
  const [role,    setRole]    = useState("admin");
  const [tab,     setTab]     = useState("dashboard");
  const [txs,     setTxs]     = useState(SEED);
  const [filt,    setFilt]    = useState({ type:"all", category:"all", search:"", sortBy:"date", sortDir:"desc" });
  const [showAdd, setShowAdd] = useState(false);
  const [editTx,  setEditTx]  = useState(null);

  const d       = dark;
  const isAdmin = role === "admin";

  // ── Derived metrics ───────────────────────────────────────────────────────
  const income   = useMemo(() => txs.filter(t => t.type==="income" ).reduce((s,t) => s+t.amount, 0), [txs]);
  const expenses = useMemo(() => txs.filter(t => t.type==="expense").reduce((s,t) => s+t.amount, 0), [txs]);
  const balance  = income - expenses;
  const savingsRate = income > 0 ? +((balance / income) * 100).toFixed(1) : 0;

  // ── Monthly chart data ────────────────────────────────────────────────────
  const monthly = useMemo(() => {
    const map = {};
    txs.forEach(t => {
      const m = t.date.slice(0,7);
      if (!map[m]) map[m] = { month:m, Income:0, Expenses:0 };
      t.type === "income" ? (map[m].Income += t.amount) : (map[m].Expenses += t.amount);
    });
    return Object.values(map)
      .map(m => ({ ...m, Net: m.Income - m.Expenses, label: mLbl(m.month) }))
      .sort((a,b) => a.month.localeCompare(b.month));
  }, [txs]);

  // ── Category spending ─────────────────────────────────────────────────────
  const catSpend = useMemo(() => {
    const map = {};
    txs.filter(t => t.type==="expense").forEach(t => { map[t.category] = (map[t.category]||0) + t.amount; });
    return Object.entries(map).map(([name,value]) => ({ name,value })).sort((a,b) => b.value - a.value);
  }, [txs]);

  // ── Filtered / sorted transactions ────────────────────────────────────────
  const filtered = useMemo(() => {
    let arr = [...txs];
    if (filt.type !== "all")     arr = arr.filter(t => t.type === filt.type);
    if (filt.category !== "all") arr = arr.filter(t => t.category === filt.category);
    if (filt.search) {
      const q = filt.search.toLowerCase();
      arr = arr.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return arr.sort((a,b) => {
      const dir = filt.sortDir === "asc" ? 1 : -1;
      if (filt.sortBy === "date")   return dir * (new Date(a.date) - new Date(b.date));
      if (filt.sortBy === "amount") return dir * (a.amount - b.amount);
      return dir * a.description.localeCompare(b.description);
    });
  }, [txs, filt]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const addTx    = t  => { setTxs(p => [{ ...t, id: idRef.current++ }, ...p]); setShowAdd(false); };
  const updateTx = t  => { setTxs(p => p.map(x => x.id === t.id ? t : x)); setEditTx(null); };
  const deleteTx = id => setTxs(p => p.filter(t => t.id !== id));
  const setF     = (k,v) => setFilt(f => ({ ...f, [k]:v }));
  const toggleSort = col => setFilt(f => ({ ...f, sortBy:col, sortDir: f.sortBy===col && f.sortDir==="desc" ? "asc":"desc" }));

  // ── Insight helpers ───────────────────────────────────────────────────────
  const topCat   = catSpend[0];
  const prevM    = monthly[monthly.length - 2];
  const currM    = monthly[monthly.length - 1];
  const expDelta = currM && prevM ? +((currM.Expenses - prevM.Expenses) / prevM.Expenses * 100).toFixed(1) : null;

  const incomeSources = useMemo(() => {
    const map = {};
    txs.filter(t => t.type==="income").forEach(t => {
      const k = t.description.includes("Salary")     ? "Salary"
              : t.description.includes("Freelance")   ? "Freelance"
              : t.description.includes("Consulting")  ? "Consulting"
              : t.description.includes("Dividend")    ? "Dividend" : "Other";
      map[k] = (map[k]||0) + t.amount;
    });
    return Object.entries(map).sort(([,a],[,b]) => b - a);
  }, [txs]);

  // ── Style tokens ──────────────────────────────────────────────────────────
  const bg     = d ? "#09090f" : "#f0f2f7";
  const txtPri = d ? "#f1f5f9" : "#0f172a";
  const txtSec = d ? "#64748b" : "#94a3b8";
  const cardBdr = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const isAdminColor = "#f59e0b";
  const isViewerColor = "#60a5fa";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Instrument Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 2px; }
        .tx-row:hover { background: rgba(255,255,255,0.03) !important; }
        .tx-row-light:hover { background: rgba(0,0,0,0.02) !important; }
        input:focus, select:focus { border-color: #f59e0b !important; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); outline: none; }
        .nav-btn:hover { background: rgba(245,158,11,0.1); }
        @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .dot-pulse { animation: dot-pulse 2s ease-in-out infinite; }
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .mobile-tab-bar { display: flex !important; }
        }
        .mobile-tab-bar { display: none; }
      `}</style>

      <div style={{ minHeight:"100vh", background:bg, color:txtPri, fontFamily:"'Instrument Sans', sans-serif", transition:"background 0.3s, color 0.3s" }}>

        <Header dark={d} setDark={setDark} role={role} setRole={setRole} tab={tab} setTab={setTab} />

        <main style={{ maxWidth:1320, margin:"0 auto", padding:"24px 24px 64px" }}>

          {/* Role badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"5px 14px", borderRadius:20, marginBottom:24,
            fontSize:12, fontWeight:600,
            background: isAdmin ? "rgba(245,158,11,0.1)" : "rgba(96,165,250,0.1)",
            border:`1px solid ${isAdmin ? "rgba(245,158,11,0.28)" : "rgba(96,165,250,0.28)"}`,
            color: isAdmin ? isAdminColor : isViewerColor,
          }}>
            <div className="dot-pulse" style={{ width:6, height:6, borderRadius:"50%", background: isAdmin ? isAdminColor : isViewerColor }} />
            {isAdmin ? "Admin Mode — Full Access" : "Viewer Mode — Read Only"}
          </div>

          {/* Tab views */}
          {tab === "dashboard" && (
            <Dashboard
              dark={d} txs={txs}
              income={income} expenses={expenses}
              balance={balance} savingsRate={savingsRate}
              monthly={monthly} catSpend={catSpend}
            />
          )}

          {tab === "transactions" && (
            <Transactions
              dark={d} txs={txs} filtered={filtered}
              filt={filt} setF={setF} toggleSort={toggleSort}
              isAdmin={isAdmin} setShowAdd={setShowAdd}
              setEditTx={setEditTx} deleteTx={deleteTx}
            />
          )}

          {tab === "insights" && (
            <Insights
              dark={d} expenses={expenses} income={income}
              savingsRate={savingsRate} catSpend={catSpend}
              topCat={topCat} expDelta={expDelta}
              currM={currM} prevM={prevM}
              incomeSources={incomeSources}
            />
          )}
        </main>

        {/* Modals */}
        {showAdd && <TransactionModal onSave={addTx} onClose={() => setShowAdd(false)} dark={d} />}
        {editTx  && <TransactionModal tx={editTx} onSave={updateTx} onClose={() => setEditTx(null)} dark={d} />}
      </div>
    </>
  );
}