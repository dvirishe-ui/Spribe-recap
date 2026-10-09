# SPRIBE Replay 2026 — concept prototype

An interactive, Spotify Wrapped-style annual recap for SPRIBE games, shown inside **Northstar Casino**, a **fictional** operator.
All player data is invented. This is a preview of a possible year-end 2026 product, not a real player report.

## Run locally

```bash
npm install
npm run dev        # opens on http://localhost:5173
npm test           # arithmetic / data-derivation tests
npm run build && npm run preview   # production build
```

Handy URL params: `?scenario=high-loss`, `?motion=reduce` (or `full`), `?view=activity`.
The same options are in the **Demo controls** button at the bottom of the screen (developer-only).

## What's where

| File | Purpose |
| --- | --- |
| `src/data.js` | The single editable `REPLAY_DATA` object + `deriveReplay()` (totals, % changes, new games, net = payouts − stakes, presentation mode) and `buildShareCardData()` (whitelist for the share card). |
| `src/components/Story.jsx` | The 7-slide animated story, progress bar, back/next, replay, keyboard + swipe navigation. |
| `src/components/Activity.jsx` | The calm, private activity statement and the restrained high-loss summary, with demo dialogs. |
| `src/components/ShareCard.jsx` | Personality share-card mockup (no betting, financial, account or location data). |
| `src/components/Sky.jsx`, `GameArt.jsx`, `Constellation.jsx` | Starfield, flight paths and original SVG illustrations. |

## Presentation modes

- **Story** (normal scenario): animated recap → "View my activity" opens the private statement.
- **Restrained** (2026 net loss ≥ `RESTRAINED_MODE_LOSS_THRESHOLD`, e.g. the high-loss scenario at −$50,000): no story, no share card,
  no celebration — just a private financial summary with support options.

## Accessibility

- Keyboard: ← / → (or PageUp / PageDown) to move, Home / End to jump; Tab through all controls; Esc closes dialogs.
- Swipe left/right on touch screens.
- `prefers-reduced-motion` (or the demo control) renders every scene in its final, static state.
