export default function Header({ dark, setDark, role, setRole, tab, setTab }) {
    const d = dark;
    const cardBdr = d ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const txtSec  = d ? "#64748b" : "#94a3b8";
  
    return (
      <header style={{
        position:"sticky", top:0, zIndex:40, backdropFilter:"blur(16px)",
        background: d ? "rgba(9,9,15,0.88)" : "rgba(240,242,247,0.88)",
        borderBottom:`1px solid ${cardBdr}`,
      }}>
        <div style={{
          maxWidth:1320, margin:"0 auto", padding:"0 24px", height:58,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:"linear-gradient(135deg,#f59e0b,#d97706)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:800, color:"#fff",
            }}>₹</div>
            <span style={{ fontWeight:700, fontSize:18, letterSpacing:"-0.02em" }}>
              Fintrack
            </span>
          </div>
  
          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display:"flex", gap:4 }}>
            {[["dashboard","Dashboard"],["transactions","Transactions"],["insights","Insights"]].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} className="nav-btn" style={{
                padding:"6px 18px", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:13, fontWeight:600,
                background: tab === k ? "#f59e0b" : "transparent",
                color: tab === k ? "#0f172a" : txtSec,
                transition:"all 0.2s",
              }}>
                {l}
              </button>
            ))}
          </nav>
  
          {/* Controls */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <select value={role} onChange={e => setRole(e.target.value)} style={{
              background: d ? "#1e1e30" : "#fff",
              border:`1px solid ${cardBdr}`,
              borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700,
              letterSpacing:"0.08em", color:txtSec, cursor:"pointer", textTransform:"uppercase",
            }}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
  
            <button onClick={() => setDark(!d)} style={{
              width:36, height:36, borderRadius:8,
              border:`1px solid ${cardBdr}`,
              background: d ? "#1e1e30" : "#fff",
              cursor:"pointer", fontSize:17,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {d ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
  
        {/* Mobile tab bar */}
        <div className="mobile-tab-bar" style={{ gap:4, padding:"6px 12px 10px", borderTop:`1px solid ${cardBdr}` }}>
          {[["dashboard","📊","Dashboard"],["transactions","💳","Txns"],["insights","💡","Insights"]].map(([k,ic,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex:1, padding:"6px 4px", borderRadius:8, border:"none",
              cursor:"pointer", fontSize:12, fontWeight:600,
              background: tab === k ? "#f59e0b" : "transparent",
              color: tab === k ? "#0f172a" : txtSec,
            }}>
              {ic} {l}
            </button>
          ))}
        </div>
      </header>
    );
  }