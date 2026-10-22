# Animation Plans

Plans produced by the `improve-animations` audit of 2026-10-22 (commit `5c0c4d1`). The four findings came out of a `find-animation-opportunities` sweep of the whole site; these plans implement everything that survived the gate.

| # | Plan | Severity | Status | Recommended order |
|---|---|---|---|---|
| 001 | [Button press feedback](001-btn-press-feedback.md) — `.btn:active` scale(0.98) | MEDIUM | DONE | executed; verified live (press sampled `matrix(0.989438)` mid-transition, settled `scale(0.98)`, released back to `none`) |
| 002 | [Contact banner entry](002-contact-banner-starting-style.md) — success/error `@starting-style` fade-rise | MEDIUM | DONE | executed; verified (opacity sampled 0→0.055→0.26→0.53→0.87 over 185ms, settles 1, re-reveals identical; `@starting-style` parsed in CSSOM) |
| 003 | [GuideExport sheet height](003-guide-export-sheet-height.md) — `interpolate-size` height+opacity | LOW | DONE | executed with verified deviation: animated `::details-content` (Chromium UA pseudo, MDN pattern) instead of the body div because Chromium's `content-visibility: hidden` on close suppresses child transitions; `@supports` gate verified via CSSOM walk (0 un-gated closed-state rules); open h=37→166→276→339px/opacity 0.11→1 over 250ms, close animates symmetric |
| 004 | [Table menu entry](004-table-menu-entry.md) — origin-anchored scale+fade | LOW | DONE | executed as rev A (orig: base pinned `opacity:0` with no resting state — permanently invisible; caught by executor STOP rule, reverted, plan revised) ; verified (opacity 0.135→0.261→0.488→0.685→0.844 over ~130ms, settles opacity 1/transform none, origin top-left, keyboard + CSV flow intact) |
- **Plans 002–004 share the `hidden`-class-toggle + `@starting-style` pattern.** If executed by separate agents, they will each apply the same idiom independently — that is by design (each plan is self-contained), not drift.
- **All four need `npx astro check` (0 errors) plus their own feel check.** Verify in a real browser; the plans contain exact feel-check steps including reduced-motion and print-path verification (003).
- **Reduced motion is already handled globally** (`src/styles/global.css:102-112`); every plan relies on that pattern instead of duplicating per-element overrides.
