# 002 — Animate contact form success/error banners

- **Status**: TODO
- **Commit**: 5c0c4d1
- **Severity**: MEDIUM
- **Category**: Missed opportunity — Teleporting state (audit category 8)
- **Estimated scope**: 2 files, ~40 lines

## Problem

The contact form's success and error messages appear instantly via a `hidden` class toggle — they teleport into view with no bridge, and the banner then occupies layout space with zero visual connection to the button that was just clicked. The success case is the site's highest-emotion rare moment (someone volunteered to contact the trust and their message went through) — it renders flat.

Current code verbatim:

```html
<!-- src/pages/contact.astro:75-80 — current -->
<p id="form-success" class="hidden rounded-md bg-green-50 p-4 text-base font-semibold text-green-800">
  Your message has been received! We'll get back to you soon.
</p>
<p id="form-error" class="hidden rounded-md bg-red-50 p-4 text-base font-semibold text-green-800">
  That didn't work. Please try again.
</p>
```

```ts
// src/pages/contact.astro:105-120 — current (the toggle logic)
    success?.classList.add('hidden');
    error?.classList.add('hidden');
    try {
      const formData = new FormData(form);
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        success?.classList.remove('hidden');
        form.reset();
      } else {
        error?.classList.remove('hidden');
      }
    } catch {
      error?.classList.remove('hidden');
    }
```

Frequency: rare — a visitor submits the contact form at most a couple of times. This is the tier where standard animation is eligible.

## Target

Entry animation via `@starting-style` — no JS changes needed to get the animation; the JS only swaps the `hidden` class, and CSS handles appear/disappear via the transition. Banners enter with a slide-and-fade from just below the button: `opacity 0 → 1` + `translate 0 4px → 0 0`, 250ms, `ease-out`.

- 250ms `ease-out`: modal/banner entry budget is 200–500ms; the low end keeps the banner feeling responsive rather than sluggish, and `ease-out` (starts fast) matches the audit's decision order — entering → `ease-out`. A 0.2s entry for error/success. Success may extend to 300ms with the same ease if the longer beat feels earned, but 250ms uniform for both keeps one rule and is the recommended default.
- `translate: 0 4px` (its own height ×~10% for a typical 40px-tall banner): small enough to feel like a materialization, not a slide-in. Never `scale(0)`.
- `@starting-style` covers entry without a mounted-attribute hack; the `hidden` class toggle remains the display mechanism — the banner animates on every reveal since class-removal creates a new element style context.

```css
/* target — added to src/pages/contact.astro inside a <style> block */
#form-success,
#form-error {
  transition:
    opacity 0.25s ease-out,
    translate 0.25s ease-out,
    display 0.25s allow-discrete;
}

#form-success:not(.hidden),
#form-error:not(.hidden) {
  @starting-style {
    opacity: 0;
    translate: 0 4px;
  }
}
```

Exit: the banners currently never exit (they are only ever re-hidden on the next submit). Keep exit transitions out of scope for this pass — the existing behavior (swap/reveal on next submit, no fade-out) is acceptable because the banners appear **only** after a state change that the user initiated once; they don't register as transient toasts. Verified during audit: they only close when the next submit attempt starts (`success?.classList.add('hidden')` at `contact.astro:105-106`), a rare flow.

Reduced motion: already handled globally — `global.css:102-112` squashes all transitions to 0.01ms under `prefers-reduced-motion: reduce`, so the banner appears instantly for those users (correct per audit: fewer/gentler, not zero — an instant swap is gentler than motion).

For Firefox/Safari ≤16 users where `@starting-style` is unsupported (Firefox 129+, Safari 17.5+ support it; older fall back to the current instant appearance — acceptable per progressive enhancement).

## Repo conventions to follow

This site uses no JS motion library; all motion is CSS transitions stated once. Astro `<style>` blocks in the page file are scoped (`data-astro-cid`), and the page already contains a scoped `<script>` — both live in `src/pages/contact.astro`. Add a minimal scoped `<style>` block to the page (Astro scopes it to this page's elements — the `#form-success`/`#form-error` selectors compile to include the cid and match), placed **before** the `<script>` tag.

Exemplar — the homepage testimonial arrows already transition `transition-colors` with Tailwind's `duration-` utilities (`src/components/Testimonials.astro:22-27`), and the mobile drawer uses `class`-toggled `transition-transform duration-` utilities (`src/pages/media.astro:169`). This plan uses the same mechanism: a class toggle revealing an element styled with a transition, expressed as plain CSS in a scoped style block (matching how `Layout.astro` writes CSS) rather than Tailwind utilities because the values are non-standard (250ms, `@starting-style`).

## Steps

1. `src/pages/contact.astro` — immediately after the closing `</form>` tag (line 81) and before the first `<script is:inline>` (line 87), insert a scoped style block (see "Target"). Astro scoped styles apply to all markup in the same component, so `#form-success, #form-error` selectors will match. Insert only the block below:

```html
<style>
  #form-success,
  #form-error {
    transition:
      opacity 0.25s ease-out,
      translate 0.25s ease-out,
      display 0.25s allow-discrete;
  }

  #form-success:not(.hidden),
  #form-error:not(.hidden) {
    @starting-style {
      opacity: 0;
      translate: 0 4px;
    }
  }
</style>
```

2. No JS changes. The current JS at `contact.astro:105-120` toggles `hidden`, which is the correct display mechanism; the `transition` + `@starting-style` handle the animation on reveal. The `display 0.25s allow-discrete` transition property makes the display swap wait for the transition; not needed for entry (the element is being un-hidden — `@starting-style` handles entry on every appearance of an element with `display: none → block`), but including `display … allow-discrete` would only matter for exit. Drop it to keep the rule minimal and avoid Chromium-only legacy behavior:

```css
  #form-success,
  #form-error {
    transition:
      opacity 0.25s ease-out,
      translate 0.25s ease-out;
  }
```

(Use this simpler version in the actual step; the earlier `allow-discrete` variant is superseded — entry only needs `opacity`/`translate` transitions plus `@starting-style`.)

3. Do not change `text-green-800`/`text-green-800`/`bg-green-50`/`bg-red-50` colors or the banner text.

## Boundaries

- Do NOT touch the Turnstile scripts, form field markup, or the submit handler logic at `contact.astro:99-127` except as described (no changes there).
- Do NOT remove or replace the `hidden`-class mechanism.
- Do NOT add JS animation, Web Animations API, or a mounted attribute.
- Do NOT add exit animations (scope is entry only, per audit: banners never exit in current flows).
- Do NOT create motion CSS tokens/files; this stays a page-scoped `<style>` block.
- If `#form-success` / `#form-error` are not found at `src/pages/contact.astro:75-79` with the class list exactly as shown, STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx astro check` — expect 0 errors.
- **Feel check** (requires a browser; dev server is running at localhost:4321):
  - Open `http://localhost:4321/contact`. The form requires Turnstile; for a feel check of the **error** path (which requires no valid Turnstile token — backend rejects), submit with the Turnstile widget unresolved if it renders; if the widget blocks submit entirely client-side, temporarily test the `#form-error` reveal by toggling the class in DevTools: `document.getElementById('form-error').classList.remove('hidden')` in the console — the error banner must enter with a fast (250ms) fade-and-4px-rise that lands in place, never sliding from far away.
  - Console-toggle the same for `#form-success`. In DevTools → Animations panel, slow playback to 10%: confirm the banner starts at `opacity: 0; translate: 0 4px` and settles to `1 / 0 0` with a single ease-out curve — no overshoot, no spring.
  - Re-hide via `classList.add('hidden')`, wait 300ms, reveal again — must animate identically (no stuck `@starting-style` state).
  - Toggle `prefers-reduced-motion: reduce` in DevTools Rendering panel and reveal a banner: it should appear instantly with no translate movement (global squash handles this).
  - Rapid reveal — spam `classList.remove('hidden')` while settling: no restart-jump (CSS transitions retarget; `@starting-style` only applies to first style of a newly displayed element).
- **Done when**: submitting or console-toggling either banner produces a uniform 250ms fade-and-rise entry on supported browsers (Graceful fallback: instant appearance elsewhere), expected for a rare, high-emotion moment, and `npx astro check` passes with 0 errors.
