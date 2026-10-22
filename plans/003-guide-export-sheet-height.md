# 003 — Animate the print sheet open/close in GuideExport

- **Status**: TODO
- **Commit**: 5c0c4d1
- **Severity**: LOW
- **Category**: Missed opportunity — Teleporting state (audit category 8)
- **Estimated scope**: 1 file, ~30 lines

## Problem

The "Print or save" sheet on guide pages is a `<details>` block whose body snaps open/closed instantly — a teleporting state change with no bridge. Only the chevron animates (rotating 0.15s at `GuideExport.astro:17`), which makes the snap of the content itself feel more abrupt by contrast.

Current code verbatim:

```html
<!-- src/components/GuideExport.astro:11-20 — current -->
<details class="guide-export group mt-4 border-t border-border pt-3" data-guide-export>
  <summary class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 font-bold [&::-webkit-details-marker]:hidden">
    <span class="flex items-center gap-2">
      <Icon name="tabler:printer" class="h-5 w-5 text-primary" />
      Print or save
    </span>
    <Icon name="tabler:chevron-down" class="h-4 w-4 transition-transform group-open:rotate-180" />
  </summary>

  <div class="flex flex-col gap-4 pt-4 pb-1">
```

```html
<!-- src/components/GuideExport.astro:20-48 — the body that snaps -->
  <div class="flex flex-col gap-4 pt-4 pb-1">
    <fieldset class="flex flex-col gap-1">
      <legend class="meta mb-1 font-semibold">What to include</legend>
      ...
    </fieldset>
    <div class="flex flex-col gap-2">
      <button type="button" class="btn btn-sm" data-action="print">...</button>
      <button type="button" class="btn btn-secondary btn-sm" data-action="copy">...</button>
    </div>
    <p class="meta">To save a PDF, choose "Save as PDF" in the print window.</p>
  </div>
</details>
```

Frequency: occasional — triggered by readers who want to print/copy, a small subset of guide readers. Eligible for standard animation per the frequency tier.

## Target

Animate the `<details>` open state with an opacity+height transition, using CSS `height` interpolation via `interpolate-size: allow-keywords` (Chromium 129+) and `@starting-style` for the content wrapper. Option: scale from 0.97 as well; the audit calls for entry at `scale(0.95–0.97)` plus `opacity: 0` — for an expanding sheet (not a popover anchored to a specific trigger point), a rise-and-fade reads more naturally than a scale, and avoids animating height AND scale simultaneously (double-transform cost).

Choice: animate `height` + `opacity` via `interpolate-size`/`transition-behavior: allow-discrete` (Chromium-only today) with a **graceful fallback to the current snap** in browsers without support (Firefox and WebKit get the instant open they have today — acceptable, not a regression).

- Duration 250ms, `ease-out` on open. Close duration 200ms (slightly faster close — the user is done). Both duratons are inside the 150–250ms dropdown/accordion band.
- `transform: translateY(0)` never used here (keep to opacity/height for stack simplicity).
- Opacity entrance from 0 → 1 alongside the height expansion.
- Reduced motion: the global squash at `src/styles/global.css:102-112` already handles this — height/opacity transitions collapse to 0.01ms, and the sheet opens instantly. This is the desired "gentler, not zero" behavior: content still appears.
- Print path: the guide sidebar/mobile wrappers carry `.no-print` parent classes, which hide this whole subtree in print — the animation cannot fire during print layin. Verified: `@media print { .no-print { display: none !important } }` at `src/styles/global.css:517-523`.

```css
/* target — appended inside a <style> block in src/components/GuideExport.astro */
.guide-export-body {
  overflow: hidden;
  opacity: 0;
  height: 0;
  transition: height 0.25s ease-out, opacity 0.25s ease-out;
}

.guide-export[open] .guide-export-body {
  height: auto;
  opacity: 1;
  transition: height 0.25s ease-out, opacity 0.25s ease-out;
  transition-behavior: allow-discrete;  /* enables height: auto animation where supported */
}

.guide-export[open] .guide-export-body {
  @starting-style {
    opacity: 0;
    height: 0;
  }
}

/* height keyword interpolation — where supported, lets height:auto animate */
@supports (interpolate-size: allow-keywords) {
  html {
    interpolate-size: allow-keywords;
  }
}
```

Selector notes: `.guide-export-body` must be the direct child of `<details>` that wrap the existing body div. Crucially, in the fallback (Firefox/old Safari), the `.guide-export-body { height: 0; opacity: 0 }` closed-state rule would **break the old instant-open behavior by leaving content invisible** — this must NOT happen. To guarantee no regression: set the closed-state styles inside `@supports (height: auto) and (transition-behavior: allow-discrete)`... no — CSS `@supports` cannot test `interpolate-size` support reliably via `height: auto` alone. Correct approach per MDN ("Animating to and from `height: auto`"): gate the closed-state `height: 0` on `@supports (interpolate-size: allow-keywords)` so that unsupported browsers never get the zero-height state; they keep the current visible-always-when-open behavior with only opacity transitioning (opacity needs no gate — `@starting-style` on open is harmless where the rule is present but inactive in browsers that scroll past it). Print: safely excluded from the get-go via `.no-print` on ancestors.

## Repo conventions to follow

The component already owns a `<style>`-less `.astro` file with Tailwind classes and a `<script>` block. Add a scoped `<style>` block inside `src/components/GuideExport.astro` after the markup (line 49) and before the `<script>` (line 51). The component is used on `src/pages/guide/[slug].astro` (twice — mobile inline panel and printed page context via `GuideExport` import at `[slug].astro:66` etc.) — the style is scoped to the component and applies everywhere the component renders.

Exemplar — the mobile drawer in `src/pages/media.astro:169` (translate-y-full + `transition-transform duration-200`) is the site's existing expanding-surface vocabulary; this plan matches that 200-250ms plain-CSS-transition idiom but uses height for a vertical sheet from a chevron-anchored details (not a drawer from an edge).

## Steps

1. `src/components/GuideExport.astro:20` — add a class to the body wrapper div: change `<div class="flex flex-col gap-4 pt-4 pb-1">` to `<div class="guide-export-body flex flex-col gap-4 pt-4 pb-1">`. Note: keep Tailwind `flex flex-col gap-4 pt-4 pb-1` classes intact — the `.guide-export-body` class carries only motion styles; do not remove the Tailwind padding classes that create spacing inside the open sheet.
2. `src/components/GuideExport.astro` — after the closing `</details>` (line 49) and before the `<script>` (line 51), insert the scoped style block (exact text):

```html
<style>
  @supports (interpolate-size: allow-keywords) {
    .guide-export-body {
      height: 0;
      opacity: 0;
      overflow: hidden;
      transition: height 0.25s ease-out, opacity 0.25s ease-out;
    }
    .guide-export[open] .guide-export-body {
      height: auto;
      @starting-style {
        opacity: 0;
        height: 0;
      }
    }
  }
</style>
```

3. Do not touch the existing chevron Tailwind rotation class (`transition-transform group-open:rotate-180`) — it already animates; keep it.
4. Old browser fallback: outside the `@supports` block no styles apply, so the sheet retains its current instant open — that is the deliberate behavior; do not add un-gated rules.

## Boundaries

- Do NOT add `will-change`, `backface-visibility`, or layering hints to the sheet.
- Do NOT animate the `<summary>` or the icon.
- Do NOT touch the script at `GuideExport.astro:51-108` (print/copy logic is unrelated and must keep working).
- Do NOT remove the `no-print` ancestor behavior; verify print output still omits the sheet visually.
- Do NOT collapse the markup — the body div must remain a direct child of `<details>` with the `guide-export-body` class.
- Correctness rule: if any printed output, print-window (`/guide/print`), or copy-text flow breaks, revert step 2's interpolation and keep only the opacity fade at reduced confidence rather than shipping a broken print.
- The `.guide-export` selector is used twice on guide pages (mobile + printed-context) — both instances must animate, which the shared `.guide-export` class selector handles.
- If the current code is not found at `src/components/GuideExport.astro:11-49` with the markup shown above (drift since commit 5c0c4d1), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx astro check` — expect 0 errors.
- **Functional check (print)**: open `http://localhost:4321/guide/introduction`, click "Print or save", then trigger print-preview from the browser (Cmd+P on macOS): sheet content must not appear in the print output (`.no-print` ancestor hides it) — confirming step 2 did not break print.
- **Feel check**:
  - On `http://localhost:4321/guide/introduction`, click "Print or save" summary — in Chromium (verify in Chrome/Edge ≥129): the sheet expands over 250ms with a visible height-and-opacity ease (no snap, no double-animation). Chevron rotates as before.
  - Re-click to close — sheet collapses over ~250ms (same curve — no separate close-duration rule is used, close reuses the same transition; if it feels sluggish in a future review, a faster close-keyframes rule could be added, but this plan ships one duration).
  - DevTools Animations panel at 10%: confirm the height expansion is a single smooth ease-out to `auto` and the opacity reaches 1 before the height finishes... (note: with `allow-discrete` height:auto both properties share the 250ms curve; confirm no flash-of-invisible-content mid-animation).
  - Firefox / Safari check: the sheet must still open with content visible (instant open — today's behavior). If content is ever invisible after open on any browser, the gate failed — fix or revert per the correctness rule above.
- **Done when**: Chromium shows a 250ms height+opacity entry on open (with chevron), non-Chromium retains instant open, print output unaffected, `npx astro check` 0 errors, and the `/guide/print` copy-text flow (Click "Copy text" in the sheet, confirm clipboard text starts with a section heading like `START HERE`) still works.
