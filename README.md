# Fintrack — Financial Dashboard

> A clean, responsive financial tracking dashboard built with React JS + Tailwind CSS.

---

## Quick Start

```bash
# 1. Create a new Vite + React project
npm create vite@latest fintrack -- --template react
cd fintrack

# 2. Install dependencies
npm install
npm install recharts

# 3. Install & configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Replace src/App.jsx with FintrackDashboard.jsx
# 5. Start the dev server
npm run dev
```

**tailwind.config.js** — make sure content includes your source files:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css** — add Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

No other configuration is needed. Google Fonts (Bebas Neue, Instrument Sans, DM Mono) are loaded via `@import` inside the component's injected `<style>` tag, so no separate font setup is required.

---

## Project Overview

Fintrack is a single-file React application that lets users track income and expenses across three main views: a summary Dashboard, a Transactions table, and an Insights panel. The app simulates two user roles — **Admin** (read + write) and **Viewer** (read-only) — switchable via a dropdown without any backend.

---

## Architecture Decisions

### Single-file Component (`FintrackDashboard.jsx`)

**Why:** The spec asked for pure React JS + Tailwind CSS with no routing library or complex folder structure. Keeping everything in one file makes the deliverable portable and easy to evaluate. In a production setting, each section (Dashboard, Transactions, Insights, Modal) would be split into its own file under `src/components/`.

### State Management — `useState` + `useMemo`

**Why not Redux/Zustand?** The state is neither deeply nested nor shared across non-parent-child components. Everything lives in the top-level `App` component and flows down as props. Using Context or a store would add indirection for no gain at this scale.

**State shape:**
```
txs        → Transaction[]          (master list)
dark       → boolean                (theme toggle)
role       → "admin" | "viewer"     (simulated RBAC)
tab        → "dashboard" | "transactions" | "insights"
filt       → { type, category, search, sortBy, sortDir }
showAdd    → boolean                (modal open/close)
editTx     → Transaction | null     (which row is being edited)
```

**Derived state via `useMemo`:** `income`, `expenses`, `balance`, `savingsRate`, `monthly`, `catSpend`, `filtered`, `incomeSources` — all are computed from `txs` and `filt`, so they stay in sync automatically without manual synchronization calls.

### ID Generation — `useRef`

```js
const idRef = useRef(25);
// usage:
{ ...newTx, id: idRef.current++ }
```

`useRef` is used instead of a module-level variable so the counter persists across re-renders without triggering them. Starting at 25 ensures no collision with seed data IDs 1–24.

---

## Feature Breakdown

### 1. Dashboard Overview

**What:** Four KPI cards at the top, followed by three Recharts visualizations.

**Cards:**
| Card | Formula | Accent color |
|------|---------|--------------|
| Net Balance | `income − expenses` | Green if positive, Red if negative |
| Total Income | Sum of `type === "income"` | Green |
| Total Expenses | Sum of `type === "expense"` | Red |
| Savings Rate | `(balance / income) × 100` | Amber |

**Charts:**
- **Area Chart (Monthly Overview):** Plots `Income` and `Expenses` per calendar month using gradient fills. Uses Recharts `AreaChart` with custom `<defs>` gradients.
- **Donut Chart (Spending Breakdown):** Pie chart with `innerRadius` showing the top spending categories. Recharts `PieChart` with `Cell` per category.
- **Bar Chart (Monthly Net Savings):** Shows `Income − Expenses` per month. Bars are individually coloured green (positive) or red (negative) using the `Cell` override pattern.

**Why Recharts?** It's the most commonly bundled chart library in React projects (available in the Claude artifact environment without install), has a declarative JSX API, and is responsive out of the box via `ResponsiveContainer`.

### 2. Transactions Section

**What:** A filter toolbar + sortable data table.

**Filters:**
- Free-text search (matches `description` or `category`, case-insensitive)
- Type dropdown: All / Income / Expense
- Category dropdown: All or any specific category

**Sorting:** Clicking the `Date` or `Amount` column headers toggles ascending/descending order. The active sort column is highlighted amber. Sorting logic lives inside the `filtered` `useMemo` computation so it re-evaluates reactively whenever filters or the master list change.

**Why no external table library?** The spec calls for "simple filtering/sorting". A plain CSS Grid layout with a custom sort function keeps the dependency count low and the code readable.

**Admin-only controls:** The `+ Add Transaction` button and the ✏️ / 🗑️ action icons only render when `role === "admin"`. This is a UI-layer gate — there's no backend enforcing it, which is consistent with the spec's instruction to "simulate roles on the frontend."

### 3. Role-Based UI

| Feature | Admin | Viewer |
|---------|-------|--------|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |

The role selector is a `<select>` in the header. Switching roles is instant — no reload or navigation.

The animated dot badge below the header communicates the active role at a glance, using amber for Admin and blue for Viewer.

### 4. Insights Section

Six insight cards in a responsive grid:

| Card | Insight |
|------|---------|
| Top Spending Category | Which category consumed the most, with its % of total expenses |
| Savings Rate | Colour-coded (green ≥ 20%, amber ≥ 10%, red < 10%) with a progress bar |
| Month-over-Month Expenses | % change from the previous to the current month |
| Income Sources | Bar breakdown of Salary / Freelance / Consulting / Dividend |
| Avg Daily Expense | `total expenses ÷ 90 days`, plus projected monthly and annual figures |
| Category % Breakdown | Horizontal bars for every expense category |

### 5. Add / Edit Modal (`TransactionModal`)

**Why a modal instead of an inline form?** Modals keep the table view uncluttered. The same component handles both Add and Edit by checking whether `tx` prop is `null` or an existing transaction object.

**No `<form>` element:** Per the React artifact constraints, form submission is handled by an `onClick` on the save button, which validates fields inline before calling `onSave`.

**Validation:** The save button is only active (amber, clickable) when `description`, `amount > 0`, and `date` are all filled. Otherwise it renders greyed out with `cursor: not-allowed`.

**Type → Category linkage:** Switching the type toggle from `expense` to `income` automatically resets the category to `"Income"`, and vice versa to `"Food"`. This prevents invalid combinations like `{ type: "income", category: "Food" }`.

---

## Design System

### Aesthetic: "Midnight Terminal"

**Concept:** A Bloomberg-terminal-inspired dark-first interface. Numbers are the heroes; everything else recedes. The amber accent (#f59e0b) functions as the system's signal color.

**Fonts:**
| Font | Role |
|------|------|
| Bebas Neue | KPI card values and insight headlines — wide, bold, commanding |
| Instrument Sans | Body text, labels, navigation — clean and neutral |
| DM Mono | Amounts in tables and tooltips — monospaced for column alignment |

**Color palette:**
| Token | Dark mode | Light mode |
|-------|-----------|------------|
| Page background | #09090f | #f0f2f7 |
| Card background | #111120 | #ffffff |
| Card border | rgba(255,255,255,0.07) | rgba(0,0,0,0.07) |
| Primary text | #f1f5f9 | #0f172a |
| Secondary text | #64748b | #94a3b8 |
| Income accent | #22c55e | #22c55e |
| Expense accent | #f43f5e | #f43f5e |
| Amber (primary) | #f59e0b | #f59e0b |

### Dark / Light Mode

Toggled via a 🌙 / ☀️ button in the header. All colours are passed as props (`dark={d}`) or inlined as ternary expressions — no CSS class toggling. This avoids the need for Tailwind's `dark:` variant configuration.

### Responsiveness

- **Cards:** `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` — automatically collapses from 4 columns to 2 to 1.
- **Charts row:** `minmax(0, 2fr) minmax(0, 1fr)` — avoids grid blowout on small screens.
- **Transaction table:** Wrapped in `overflow-x: auto` so narrow screens can scroll horizontally rather than breaking the layout.
- **Mobile nav:** A `<style>` media query hides the header nav and shows a bottom tab bar at ≤ 700 px.

---

## Data Model

```ts
type Transaction = {
  id:          number;
  date:        string;        // "YYYY-MM-DD"
  description: string;
  amount:      number;        // Always positive; sign implied by `type`
  category:    Category;
  type:        "income" | "expense";
};

type Category =
  | "Food" | "Housing" | "Utilities" | "Entertainment"
  | "Health" | "Shopping" | "Transport" | "Income";
```

Amounts are always stored as positive numbers. The sign is applied at render time (`+` for income, `−` for expense) so arithmetic stays clean.

---

## Seed Data

24 transactions across January–March 2025 covering:
- **3 months** of salary (₹85,000/month)
- **Freelance** (Jan) and **Consulting** (Feb) side income
- **Dividend** income (Mar)
- Regular expenses: Rent, Groceries, Utilities, Food delivery, Entertainment, Health, Shopping, Transport

This gives enough data for all three charts to show meaningful trends and for the Insights panel to surface real observations.

---

## File Structure (if split into components)

```
src/
├── App.jsx                    # Root, all state
├── components/
│   ├── Header.jsx             # Nav + role selector + dark mode
│   ├── SummaryCard.jsx        # KPI card
│   ├── CategoryBadge.jsx      # Coloured pill
│   ├── ChartTooltip.jsx       # Recharts custom tooltip
│   ├── TransactionModal.jsx   # Add / edit modal
│   ├── tabs/
│   │   ├── Dashboard.jsx      # Charts + summary cards
│   │   ├── Transactions.jsx   # Table + filters
│   │   └── Insights.jsx       # Insight cards
├── data/
│   └── seed.js                # SEED array + CAT_COLORS
├── utils/
│   └── format.js              # fmt(), fmtK(), mLbl()
└── index.css                  # Tailwind directives
```

---

## Optional Enhancements (not implemented, but straightforward to add)

| Enhancement | Approach |
|-------------|----------|
| Data persistence | `useEffect` to `localStorage.setItem` on `txs` change; read on mount |
| CSV export | `blob = new Blob([csvString])` + `URL.createObjectURL` |
| Animations | Framer Motion `<motion.div>` on card mount with `initial/animate` |
| Date range filter | Add `dateFrom`/`dateTo` to `filt` state and filter in `useMemo` |
| Budget alerts | Compare category totals to user-defined limits stored in state |
| Multi-currency | Store `currency` per transaction; convert at display time |

---

## Known Limitations

- **No persistence:** All data resets on page refresh. Intentional per spec (no localStorage in artifact environment).
- **Simulated RBAC:** Role enforcement is UI-only. A real implementation would validate permissions server-side.
- **Static date range:** The "90 days" figure in Avg Daily Expense is hardcoded; a production version would compute it from `max(date) - min(date)`.
- **No pagination:** The transaction table renders all rows. For > 500 rows, virtual scrolling (e.g. `react-window`) would be needed.
