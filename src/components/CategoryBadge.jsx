import { CAT_COLORS } from "../data/seed";

export default function CategoryBadge({ category }) {
  const c = CAT_COLORS[category] || "#6b7280";
  return (
    <span style={{
      fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20,
      background: c + "22", color: c, letterSpacing:"0.04em", whiteSpace:"nowrap",
    }}>
      {category}
    </span>
  );
}