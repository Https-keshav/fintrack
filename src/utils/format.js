export const fmt  = n => "₹" + Math.abs(n).toLocaleString("en-IN");
export const fmtK = n =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
  : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K`
  : `₹${n}`;
export const mLbl = m =>
  new Date(m + "-01").toLocaleString("en", { month:"short", year:"2-digit" });