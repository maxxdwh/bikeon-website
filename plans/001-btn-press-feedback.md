# 001 — Add press feedback to all buttons

- **Status**: TODO
- **Commit**: 5c0c4d1
- **Severity**: MEDIUM
- **Category**: Missed opportunity — Feedback gap (audit category 8)
- **Estimated scope**: 1 file, ~10 lines

## Problem

Buttons site-wide have hover-color transitions but **no `:active` press feedback**. Every button press — CTAs ("Read the Guide", "Send message"), drawer buttons, download menus, booklets — feels dead: the color changes on hover, but the press itself gives no tactile confirmation that the interface heard the click.

The single `.btn` class rule at `src/styles/global.css:316` is the base for every button on the site (`.btn`, `.btn-secondary`, `.btn-ghost`, `.btn-sm` all share it; inline buttons like `.menu-toggle`, `#testimonial-prev/next`, publisher chips have their own rules but also have no active state). Verified: `grep ':active' src/` returns zero matches — no press feedback anywhere in the codebase.

Current code verbatim:

```css
/* src/styles/global.css:316 — current */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 3rem;
  padding: 0 1.5rem;
  border-radius: 999px;
  border: 2px solid var(--blue-700);
  background: var(--blue-700);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s;
}
```

Frequency: buttons are used tens of times per visit — the "tens/day" tier. Per the audit, this tier permits only near-imperceptible motion: scale 0.95–0.98 and ≤160ms.

## Target

```css
/* target — src/styles/global.css, added after the .btn:hover rule */
.btn:active {
  transform: scale(0.98);
}
```

And extend the transition on the `.btn` base rule:

```css
/* target — src/styles/global.css:331 — transition list gains transform */
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s,
    transform 0.16s ease-out;
```

- Scale 0.98 (not 0.95): the frequency tier allows only near-imperceptible motion. A 2% scale-down reads as physical press; 5% would read as a bounce.
- 160ms with `ease-out`: matches audit category 3's press-feedback budget (100–160ms, `transform: scale(0.97)` guidance, 0.95–0.98 band).
- No hover gating needed — `:active` only fires during the actual press.
- Reduced motion: the global squash at `src/styles/global.css:102-112` already collapses transitions to 0.01ms under `prefers-reduced-motion: reduce`; the press feedback becomes effectively instant (a 0.98 scale snap is imperceptible pixel movement) — no extra handling required.
- `transform` is a compositor-only property — no layout/paint triggered.

## Repo conventions to follow

This codebase expresses all motion as short CSS transitions on a single class. Extend the existing `.btn` transition list in place at `src/styles/global.css:316-335`; do not create a separate `.btn-press` class or a new token file.

Exemplar — the existing transition vocabulary is `0.15s` color transitions (see `.sub a` at `src/components/Header.astro:179-181`, `.panel` at `src/styles/global.css:245`). This plan adds one property to the existing list; the 0.16s duration is within 10ms of the house 0.15s style and sits inside the 100–160ms press budget, so it reads as the same motion family.

## Steps

1. `src/styles/global.css:331` — extend the transition property list of `.btn` from three properties to four, adding `transform 0.16s ease-out` as the last entry (exact text in "Target" above).
2. `src/styles/global.css` — immediately after the existing `.btn:hover` rule (ends at line 341), insert the new rule `.btn:active { transform: scale(0.98); }`.
3. Nothing else. `.btn-secondary`, `.btn-ghost`, and `.btn-sm` share `.btn`'s transition and inherit the `:active` via the shared base class selector chain (`.btn:active` matches any element carrying class `btn`, which all variants carry). Do not add separate `:active` rules for variants.

## Boundaries

- Do NOT touch `.field`, `.panel`, `.menu-toggle`, `#testimonial-prev/next`, `.publisher-chip`, or any other class. The scope of this plan is the `.btn` base rule and its two-line addition. (Inline-styled buttons like the testimonial arrows at `src/components/Testimonials.astro:22-27` have their own transition — adding press feedback there is out of scope; the audit's highest-leverage target was the shared `.btn`.)
- Do NOT change the duration of the existing three color transitions.
- Do NOT add `@media (prefers-reduced-motion)` handling inside `.btn` — the global rule at `global.css:102-112` already covers it.
- Do NOT add comments to the CSS.
- Do NOT add `will-change` or `translate` properties.
- If the `.btn` rule is not found at `src/styles/global.css:316` with the transition list shown above, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx astro check` — expect 0 errors.
- **Feel check**:
  - Open `http://localhost:4321/` (dev server already running), hover any "Read the Guide" CTA, then press and hold: a subtle 2% scale-down appears on press and reverses within 160ms of release. In DevTools Animations panel at 10% playback, confirm the scale-out is a single 160ms curve with no spring/bounce tail.
  - On `http://localhost:4321/contact`, press-and-hold "Send message": same 0.98 scale on the form's primary button.
  - On `http://localhost:4321/guide/costs-and-funding`, press the "Download this table" button: the small `.btn-sm` variant shows the same press.
  - Spamming press/release rapidly shows the transition retargeting mid-motion (CSS transitions retarget; no restart-jump).
- **Done when**: pressing any `.btn`-classed button on any page produces a uniform, subtle 0.98 scale-down within 160ms, and `npx astro check` passes with 0 errors.
