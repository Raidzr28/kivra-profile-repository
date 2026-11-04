# Implementation Plan — KREOVA

Scope of this round: port the mechanisms audited in
`docs/REFERENCE_AUDIT.md` §9–§12 onto the existing KREOVA site, replace the
hero video with the new hero stills, extend the portfolio, and add a brand
collaborations section.

## Stack (unchanged)

Static HTML + CSS + vanilla JS, served by Vercel (`vercel.json` rewrites `/`
to `tes.html`). **No framework was introduced.** Every ported mechanism is
`calc()` on CSS custom properties driven by one scroll handler — the reference
itself does the same thing, just with GSAP setting the property. Adding
GSAP/ScrollTrigger/Lenis here would have bought nothing the existing 180 lines
of vanilla JS do not already do.

One build-time dependency was added, isolated from the site:

- `remotion-intro/` — Remotion 4.0.539, used **only** to render the two intro
  MP4s. It is not loaded by the site; it ships two files into
  `loading screen/` and is otherwise inert. Delete the folder and the site
  still works.

## Component tree (added / changed)

```
tes.html
├── .scroll-rail                      [NEW]  fixed progress rail (z 80)
├── .site-header                      [CHANGED] fixed on this page only
└── main
    ├── section.hero-v2               [REPLACES section.hero]
    │   └── .hero-v2-pin              sticky 100svh inside a 220svh section
    │       ├── .hero-stage
    │       │   ├── h1.hero-headline  3 staircase .hl-line, each with --indent
    │       │   │   └── button.hero-chip      inline media box, reserves layout
    │       │   └── .hero-v2-footer   description + CTAs, fades with --hp
    │       └── .hero-media           lerps chip rect -> full viewport by --hp
    │           ├── .hero-media-frame   3 cross-fading stills
    │           └── .hero-media-caption appears past --hp 0.55
    ├── section.showcase              [EXTENDED] 13 -> 23 slides
    ├── section.collab                [NEW] 300svh pinned brand-name arc
    │   └── .collab-pin
    │       ├── .collab-arc           4 .collab-arc-item on a circle
    │       ├── .collab-logos         cross-fading plates in one grid cell
    │       └── .collab-aside         index + description + counter
    ├── section.collab-wall           [NEW] 13-tile logo grid (3 real, 10 placeholder)
    └── section.talent-stack          [NEW] 300svh pinned diagonal card stack
        └── .talent-cards             7 .talent-card, one grid cell
```

## Animation architecture

One contract, copied from the reference (audit §12):

1. A section is tall (`220svh` / `300svh` / `count x step`).
2. Its first child is `position: sticky; top: 0; height: 100svh`.
3. One scroll handler writes a single `--progress` (or `--hp`) onto the
   section.
4. CSS `calc()` turns `--progress` + each item's `--index` into a transform.
   **No JS touches individual items.**

```js
pinProgress(section) = clamp01((scrollY - section.offsetTop)
                               / (section.offsetHeight - innerHeight))
```

All handlers live in one `scrollHandlers` array behind a single
rAF-throttled `scroll` listener, so N mechanisms still cost one listener and
one frame callback.

### Per-section maths (reference values, converted at x0.5208 rem -> vw)

| Mechanism | Formula |
|---|---|
| Hero chip | `top/left = chip * (1 - hp)`, `w/h = chip + (viewport - chip) * hp`; image `scale(3.2 - 2.2*hp)` |
| Collab arc | `theta = (index - progress*(n-1)) * 11deg`, `r = 30.2vw`, `translate(-r(1-cos t), -50% + r sin t) rotate(t)` |
| Talent stack | `rel = index - progress*(n-1)`, `translateX/Y((100% + gap) * rel)`, plus `--scroll-velocity * .9px` drift at `scale(1.1)` |

### Motion idioms (audit §12)

| Token | Value |
|---|---|
| `--ease-out-quart` | `cubic-bezier(.165,.84,.44,1)` |
| `--ease-in-out-quart` | `cubic-bezier(.76,0,.24,1)` |
| `--reveal-dur` | `1.2s` |
| `[data-reveal]` | `opacity:0; filter:blur(10px)` -> settled |
| `[data-reveal-media]` | `clip-path: inset(100%)` -> `inset(0)` |
| `.dim-siblings` / `.dim-item` | `:has(:hover)` -> non-hovered at `opacity:.2; blur(10px)` |

## Responsive strategy

Follows the reference's own breakpoint (1200px) for the pinned mechanisms:

- `>=1200px` — arc and card stack pinned and scrubbed.
- `<1200px` — `.collab` (arc) hidden entirely; `.collab-wall` grid carries the
  content, matching the reference's own `display:none` on its arc.
- `<900px` — hero section shortens to `180svh`, staircase indents halve,
  hero footer stacks.
- `prefers-reduced-motion` — every pinned section collapses to `height:auto`,
  sticky becomes static, the card stack becomes an `auto-fit` grid, and all
  reveals resolve immediately.

## Testing plan

Executed against `http-server` on `127.0.0.1:8899` through the Chrome
extension. See `docs/IMPLEMENTATION_LOG.md` for results:

1. Console errors / failed requests — none.
2. Broken images across all 75 — none.
3. Horizontal overflow sampled every 600px down the full 18,723px page.
4. Each pinned mechanism driven to specific `--progress` values and
   screenshotted.
5. Measured geometry (`getBoundingClientRect`) compared against the
   reference's declared values.

**Not covered:** viewports below 1511 CSS px — Chrome would not resize its
window narrower on this machine.
