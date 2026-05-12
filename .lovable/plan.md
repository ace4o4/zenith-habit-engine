
# Project Zenith — Build Plan

A high-fidelity, sensory-rich habit tracker. Stack adapted to the project's existing **TanStack Start + React 19 + Vite + Tailwind v4** (instead of Next.js App Router). All design, physics, 3D, and offline-first behavior from the brief are preserved verbatim.

## Stack mapping

| Brief | Implementation |
|---|---|
| Next.js App Router | TanStack Start file routes (`src/routes/`) |
| Tailwind config | Tailwind v4 tokens in `src/styles.css` |
| Framer Motion | `motion` (Framer Motion v11) |
| React Three Fiber | `@react-three/fiber` + `three` |
| Zustand | `zustand` |
| LocalForage (IndexedDB) | `localforage` + zustand `persist` middleware with custom storage adapter |

All client-only code (R3F, IndexedDB, `navigator.vibrate`) gated via `useHydrated()` / `<ClientOnly>` to avoid SSR breakage.

## Design tokens (added to `src/styles.css`)

Add semantic tokens (oklch equivalents of the brief's hex/rgba values) so Tailwind utilities like `bg-void`, `bg-glass`, `border-glass`, `text-primary`, `text-muted` work everywhere. Plus a CSS var `--accent-neon` gradient and a reusable `.glass-bento` utility:

```
backdrop-blur-xl bg-white/[0.02] border border-white/[0.06]
rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden
```

Body sets `bg-void` and tight-tracking text-primary as defaults. Dark-only — no light mode.

## File structure

```
src/
  routes/
    index.tsx              # Dashboard (replaces placeholder)
  components/
    zenith/
      CinematicCanvas.tsx  # R3F bg, ClientOnly wrapped
      CommandTerminal.tsx  # NLP-parsed pill input
      BentoDashboard.tsx   # Responsive grid + stagger mount
      HabitCard.tsx        # Glass bento card, hover spring
      LiquidCheckbox.tsx   # Custom SVG + spring + haptics
      HeatmapStrip.tsx     # Per-habit day matrix
      ProgressRing.tsx     # SVG ring for duration habits
      OverallStats.tsx     # Top-level streak / progress bento
  store/
    habits.ts              # Zustand store + persist
    storage.ts             # LocalForage adapter for zustand persist
  lib/
    parseHabit.ts          # NL parser ("Read 10 pages for 30 days")
    date.ts                # YYYY-MM-DD helpers, streak calc
```

Existing `__root.tsx`, `router.tsx`, error/404 boundaries are kept intact; only meta updated to "Zenith".

## State engine (Zustand + LocalForage)

Exact schema from the brief:

```ts
type HabitMap = Record<string, boolean>; // 'YYYY-MM-DD': true
interface HabitEntity {
  id: string; title: string; createdAt: number;
  duration: number | 'lifetime';
  history: HabitMap; streak: number;
}
```

Selectors: `getOverallProgress()`, `getStreak(habitId)` (recomputes on toggle), `getCompletionRate(habitId)`. Persisted via custom `createJSONStorage` adapter wrapping `localforage` (IndexedDB), `skipHydration: true` + manual rehydrate inside a `useHydrated`-guarded effect to prevent SSR mismatch.

## Component specs

**CinematicCanvas** — fixed full-viewport `<canvas>` behind UI, opacity ~0.10. Low-poly wireframe icosahedron + subtle topographic plane. Slow auto-rotate; mouse `(x,y)` and `scrollY` drive small additional rotation via `useFrame`. Wrapped in `<ClientOnly>` with a transparent fallback.

**CommandTerminal** — single floating pill at top center, `glass-bento` style. Placeholder: *"I will [Action] for [Duration]…"*. On submit, `parseHabit(input)` extracts title + duration (regex for `for N days|weeks|months|lifetime`). Spring-mount the new card.

**BentoDashboard** — responsive CSS grid (1 / 2 / 3 cols at sm/md/lg). Children mount with cascade: `staggerChildren: 0.06`, each card `initial={{opacity:0, y:24, scale:.98}} animate={{opacity:1,y:0,scale:1}}` with spring `stiffness: 220, damping: 24`. `AnimatePresence` for unmount.

**HabitCard** — `glass-bento`. Top row: title (500/600 tight) + flame streak chip. Bottom row: `HeatmapStrip` (last 30 days dot grid, completed = neon gradient, idle = muted glass square) and a `ProgressRing` for fixed-duration habits showing % complete. `whileHover={{ y: -4, scale: 1.01 }}` spring.

**LiquidCheckbox** (the hero interaction) — pure SVG, no `<input>`.
- Idle: `<rect rx="8">` muted glass border.
- Active: `motion.path` checkmark with `pathLength` 0→1 over 0.4s; radial gradient fill bursts from center using an SVG `<radialGradient>` keyed to the neon stops; localized `filter: drop-shadow(0 0 12px #4facfe)`.
- Spring: `{ type: "spring", stiffness: 400, damping: 25 }`.
- On toggle: call `toggleDay()` then `if ('vibrate' in navigator) navigator.vibrate(50)`.

## Phase milestones (executed in one pass)

1. **Void** — install deps, write tokens + `glass-bento` utility, build store + LocalForage adapter, replace placeholder index meta.
2. **Glass** — `LiquidCheckbox`, base bento card, `CommandTerminal` with NL parser.
3. **Grid** — `BentoDashboard`, `HabitCard`, `HeatmapStrip`, `ProgressRing`, `OverallStats`, wire to store, streak/progress selectors.
4. **Cinema** — mount `CinematicCanvas` in `__root.tsx` (ClientOnly), add cascade mount animations, polish empty state, verify zero TS errors.

## Technical details

- **Deps to add:** `motion`, `zustand`, `localforage`, `three`, `@react-three/fiber`. (No `@react-three/drei` needed — kept light to respect bundle size.)
- **SSR safety:** R3F canvas + any `window`/`navigator`/IndexedDB access wrapped in `<ClientOnly>` or `useEffect`. Zustand store created at module scope but rehydrated only after mount.
- **Type strictness:** all components fully typed, `HabitMap`/`HabitEntity` exported from `store/habits.ts`.
- **Routes:** single dashboard route at `/`. No additional routes needed (app, not content site), so hash/route-split rules don't apply.
- **Accessibility:** `LiquidCheckbox` uses `role="checkbox"`, `aria-checked`, keyboard `Space`/`Enter` toggling, visible focus ring in neon.
- **Performance:** R3F `frameloop="demand"` + `dpr={[1, 1.5]}` cap; heatmap memoized; selectors via zustand shallow.

## Out of scope

- No auth, no Lovable Cloud (offline-only per brief).
- No light mode.
- No analytics/share features beyond local stats.

Ready to implement on approval.
