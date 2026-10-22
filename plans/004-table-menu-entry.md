# 004 — Animate the guide table download menu (rev A)

- **Status**: TODO (rev A — supersedes the original; original CSS made the menu permanently invisible, see "Revision note")
- **Commit**: 5c0c4d1
- **Severity**: LOW
- **Category**: Missed opportunity — spatial story (audit category 3/8)
- **Estimated scope**: 1 file, ~25 lines

## Revision note (rev A)

The original plan's CSS set the closed-state values on the base class:

```css
/* WRONG — as originally planned: base class pins the invisible state with no resting override */
.table-export-menu { opacity: 0; transform: scale(0.97); transform-origin: top left; }
```

With `.table-export-menu:not(.hidden)` only carrying the `transition` + `@starting-style`, nothing ever sets the resting visible state — the open menu computes to `opacity: 0` forever. Verified empirically by the executor on Chrome 150: the menu never appears.

Rev A fixes this by moving the resting state to the default (no base opacity/transform override) and using `@starting-style` on the revealed element only — the same pattern that plan 002 uses successfully (`contact.astro` banners animate 0→1 with identical structure).

## Problem

The "Download this table" menu on the costs-and-funding guide page pops into view via a `hidden` class toggle with no connection to its trigger button. Its only sibling menu on guide pages — the header "Guide" dropdown — fades in over 0.15s (`src/components/Header.astro:231-235`), so this menu reads as inconsistent rather than merely unanimated: two dropdown menus on the same page, one animated, one teleporting.

The menu's own trigger chevron already rotates (`transition-transform duration-150` at `[slug].astro:167,200`), which makes the teleport contrast sharper.

Current code verbatim:

```js
// src/pages/guide/[slug].astro:171-173 — current: menu element
    var menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.className = 'absolute left-0 top-12 z-10 hidden rounded-lg border border-border bg-white p-2 shadow-[0_12px_24px_-12px_rgb(11_31_42/0.25)]';
```

```js
// src/pages/guide/[slug].astro:196-208 — current: open/close via hidden toggle
    function openMenu() {
      menu.classList.remove('hidden');
      isOpen = true;
      btn.setAttribute('aria-expanded', 'true');
      chevron.style.transform = 'rotate(180deg)';
      menuItems[0].focus();
    }
    function closeMenu() {
      menu.classList.add('hidden');
      isOpen = false;
      btn.setAttribute('aria-expanded', 'false');
      chevron.style.transform = '';
    }
```

```css
/* src/pages/guide/[slug].astro:293-296 — current: the existing global style block where the new rules go */
<style is:global>
  @page {
    margin: 14mm 15mm;
  }
</style>
```

Frequency: occasional — only readers of the costs-and-funding guide page who click the per-table export button. Standard animation is eligible.

## Target

Entry: scale-in from the trigger with fade — `opacity 0 → 1` and `scale 0.97 → 1`, 200ms, `ease-out`, `transform-origin: top left` (menu is `absolute left-0 top-12` per `[slug].astro:173`, anchored below-left of the button — origin must be at the trigger corner, not center).

- 200ms `ease-out`: dropdown band 150–250ms; matches the sibling header dropdown's 0.15s vocabulary closely while giving the scale+fade room to read.
- `scale 0.97` (never `scale(0)`): per audit category 3, `scale(0.9–0.97)` + `opacity: 0`. 0.97 is the subtle end.
- `transform-origin: top left` — the menu grows from the trigger corner (spatial consistency), not from its center (modals are exempt; this is not a modal).
- Reduced motion: handled by the global squash at `src/styles/global.css:102-112` — transitions collapse to 0.01ms; menu appears instantly.
- Keyboard: menu already moves focus to `menuItems[0]` on open (`[slug].astro:201`). Animation does not interact with focus or keyboard handlers; it is purely visual.
- Resting state: the visible (`:not(.hidden)`) menu has default `opacity: 1` / `transform: none` — the `@starting-style` block supplies the initial values on each reveal; the base class carries only `transform-origin`. This is the exact pattern of plan 002 (`#form-success:not(.hidden) { @starting-style {...} }` with default resting values), verified working on this site.

```css
  /* target */
  .table-export-menu {
    transform-origin: top left;
  }

  .table-export-menu:not(.hidden) {
    transition:
      opacity 0.2s ease-out,
      transform 0.2s ease-out;
    @starting-style {
      opacity: 0;
      transform: scale(0.97);
    }
  }
```

Exit: stays instant (current behavior — `closeMenu` adds `hidden` → `display: none` immediately). Acceptable: the single motion story is the reveal; adding a `transition-behavior: allow-discrete` exit is out of scope.

## Repo conventions to follow

The page already has a `<style is:global>` block for `@page` margins at `src/pages/guide/[slug].astro:293-296` — append the menu rules there. It is `is:global`, and the menu is built via `document.createElement` bypassing scoped cids, so a `is:global` style block is the only place that can target it.

Sibling exemplar — the header sub-dropdown (`src/components/Header.astro:231-241`) is the same class of surface: an absolutely positioned menu fading at 0.15s. This plan harmonizes the second menu with that vocabulary.

## Steps

1. `src/pages/guide/[slug].astro:173` — add the class `table-export-menu` to the front of the menu's className string:

```js
// becomes:
    menu.className = 'table-export-menu absolute left-0 top-12 z-10 hidden rounded-lg border border-border bg-white p-2 shadow-[0_12px_24px_-12px_rgb(11_31_42/0.25)]';
```

2. `src/pages/guide/[slug].astro:293-296` — inside the existing `<style is:global>` block, after the `@page` rule, add:

```css
  .table-export-menu {
    transform-origin: top left;
  }

  .table-export-menu:not(.hidden) {
    transition:
      opacity 0.2s ease-out,
      transform 0.2s ease-out;
    @starting-style {
      opacity: 0;
      transform: scale(0.97);
    }
  }
```

3. No JS changes: `openMenu`/`closeMenu` keep working via the `hidden` class; keyboard nav, focus, and downloads unchanged.

## Boundaries

- Do NOT touch `openMenu`/`closeMenu` logic, keyboard navigation, or focus behavior.
- Do NOT add `will-change` or layer hints.
- Do NOT animate `left`/`top`/`height`/`width` — transform and opacity only.
- Do NOT add `opacity: 0` or `transform: scale(0.97)` to the base `.table-export-menu` class (rev A: this was the original plan's bug — the base class must only carry `transform-origin`, or the menu becomes permanently invisible).
- Do NOT animate the `.menu-item` buttons inside the menu (they already have hover/focus color styles at `[slug].astro:186`).
- Do NOT change the menu's `absolute left-0 top-12` anchoring.
- If the menu element creation is not at `src/pages/guide/[slug].astro:171-173` with that className, or the `@page` style block is not at `293-296`, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx astro check` — expect 0 errors.
- **Feel check** (dev server running; the menu only exists on pages with tables — the costs-and-funding page):
  - Open `http://localhost:4321/guide/costs-and-funding`, scroll to the "Download this table" button, click it: menu must enter over 200ms — fading in while scaling from 97% to 100% anchored at its top-left corner. In DevTools Animations panel at 10%, confirm a single ease-out curve on both properties, no overshoot/bounce.
  - Opacity sampling over the first ~100ms: rising values between ~0.1 and ~0.9 (NOT pinned at 0 — a pinned 0 indicates the rev-1 bug regressed).
  - After settling: computed `opacity: 1`, `transform: none` (or `matrix(1,...)`), `transform-origin: 0px 0px` (top left), chevron `rotate(180deg)`.
  - Close (Escape), reopen: identical entry.
  - Keyboard: focus the button, press Enter — focus lands on the first menu item immediately; ArrowDown cycles.
  - Trigger a CSV download: menu closes, label shows "Downloaded!", file downloads.
  - Toggle `prefers-reduced-motion: reduce`: menu appears instantly, no scale movement.
- **Done when**: the menu enters with a 200ms origin-anchored scale+fade, settles fully visible (opacity 1), keyboard and download flows functional, reduced-motion instant, and `npx astro check` passes with 0 errors.
