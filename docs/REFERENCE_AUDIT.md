# Reference Audit — fromanother.love

- **Source:** https://www.fromanother.love/
- **Date inspected:** 2026-10-29
- **Method:** REA (`list_browser_targets`, `inspect_web_page`) against an isolated Chrome 156 instance over CDP, plus direct CDP `Runtime.evaluate` probes, scripted wheel-scroll sampling, and `Page.captureScreenshot`.
- **Viewport inspected:** 1364×693 CSS px (desktop). Mobile/tablet **NOT** inspected.
- **Status:** `PARTIALLY VERIFIED` — architecture and scroll mechanics are observed and reproducible; exact durations/easings of individual tweens are not.

> Scope note: this audit exists to explain **how the site works**. KREOVA's build reuses the *mechanisms*, never the reference's assets, copy, fonts, palette, or code.

---

## 1. Technology stack (VERIFIED)

Evidence: `scripts.items` + `resources` from the REA capture; library fingerprints grepped from the downloaded chunks.

| Layer | Finding | Evidence |
|---|---|---|
| Framework | **Next.js 16.0.10**, App Router | `window.next.version` → `16.0.10`; chunks `app/page-*.js`, `app/layout-*.js`, `main-app-*.js` |
| Hosting | Vercel | every asset carries `?dpl=dpl_Bnmwy…` deployment id |
| CDN/edge | Cloudflare | `/cdn-cgi/scripts/.../email-decode.min.js` |
| CMS | **Prismic** | `prismic` in `app/layout` + `app/page`; images under `/_media/prismic/fromanother-2026/…` |
| 3D | **Three.js** | `WebGLRenderer` ×35, `ShaderMaterial`, `OrthographicCamera`, `PerspectiveCamera` in chunks `b536a0f1-*`, `bd904a5c-*` |
| Motion | **GSAP + ScrollTrigger** | `gsap` ×15 and `ScrollTrigger` ×14 in `c15bf2b0-*`; `ScrollTrigger` ×18 in `app/page-*`. Not on `window` → bundled as ESM |
| Smooth scroll | **Lenis** | `lenis` class on `<html>`; `lenis` ×5 in `app/page-*` |
| Video | **Mux + hls.js** | `mux` ×121 and `hls.js` in `542ea986-*`; `<video>` srcs are `blob:` (MSE), posters from `image.mux.com` with signed JWTs |
| UI tokens | **Chakra UI** + CSS Modules | `--ck-breakpoints-*`, `--ck-sizes-breakpoint-*` on `:root`; `css-13o7eu2`; `Component_element__hash` class pattern throughout |

Images are served as **AVIF** via `?auto=format,compress`. Fonts are 9 self-hosted `.woff2` files via `next/font` (`--font-herbik`, `--font-ivory`, `--font-twk`).

## 2. Page structure (VERIFIED)

Single long route. `document.documentElement.scrollHeight` = **15054 px** at a 693 px viewport (~21 viewports).

`<html class="… js-has-global-canvas js-smooth-scrollbar-enabled lenis">`, `<body class="is-ready">` — feature flags set by JS once booted.

Nine `<section>` elements, every one carrying a shared `SectionDetector_sectionDetector__*` class (one component observing all sections):

| # | `id` | height (px) |
|---|---|---|
| 1 | `hero` | 693 |
| 2 | `about` | 693 |
| 3 | `what_we_do` | 1105 |
| 4 | `showcase` | **4158** (6× viewport → pinned) |
| 5 | `team` | 2772 |
| 6 | `collaborations` | 2079 |
| 7 | `awards` | 2079 |
| 8 | `presses` | 831 |
| 9 | `footer` | 817 |

DOM totals: 1730 nodes — 625 `DIV`, 50 `IMG`, 8 `VIDEO`, **4 `CANVAS`**, 9 `SECTION`, 3 `NAV`.

## 3. The "global canvas" architecture (VERIFIED)

Four canvases, two distinct jobs:

1. **Two full-viewport WebGL2 canvases** (1364×693, `pointer-events: none`, no class) mounted high in the body — not per-section. This is the `js-has-global-canvas` flag: one persistent Three.js scene layered behind the DOM, which sections drive as you scroll. This is why the hero's glow sits *behind* live HTML text.
2. **Two 2D canvases at 400×400** — `PageLoader_pageLoader_gifImg__*` and `ResizeOverlay_gifImg__*`: an animated GIF decoded into a canvas, used for the intro loader and for a deliberate overlay shown while the window is being resized (so the WebGL scene can rebuild without flicker).

## 4. Pinned, scroll-scrubbed showcase (VERIFIED — the signature mechanism)

Sampled by dispatching wheel events and reading `getBoundingClientRect().top` of `.Showcase_showcase_content__*`:

| scrollY | content `top` | state |
|---|---|---|
| 1511 | 807 | approaching |
| 2046 | 272 | approaching |
| **2618 → 5622** | **0** (constant) | **PINNED** |
| 6140 | −357 | released |

The element holds `top: 0` for ~3000 px of scrolling, then releases — a `position: sticky` pin (computed `position: sticky`, `z-index: 40`), with ScrollTrigger scrubbing the content through it. `WhatWeDo` numbers/categories are independently sticky and translate continuously (`will-change-transform`).

## 5. Supporting mechanisms (VERIFIED)

- **`BackgroundTransition`** (`position: sticky`, `z-index: 0`) — page ground changes between sections. Confirmed visually: navy `rgb(5,18,54)` at the hero → cream at the showcase.
- **`SectionIndicator`** (sticky, `z: 20`) — a 1–7 numbered rail; the active entry is highlighted and expands to a label (observed: `3 — Featured work`).
- **`ScrollProgress`** (fixed, `z: 80`) with a `__visible` modifier class.
- **`ScrollIndicator`** (fixed, `z: 18`) with an `__active` modifier.
- **`Header`** fixed at `z: 100`; **`Menu`** fixed at `z: 99`; a `styles_blurOut__*` fixed layer at `z: 99`.
- **Viewport-gated video** — all 8 videos are `loop muted playsInline preload="metadata"` with `autoplay = false`. The playing set changes as you scroll (sampled `[01011100] → [01100000] → [01000000]`), so playback is driven by intersection, not autoplay.
- **`GridDebugger`** ships to production, hidden (`z: 2147483647`).

## 6. Design tokens read off `:root` (VERIFIED)

`--brand-dark-blue: #051236`, `--brand-blue: #1740a9`, `--brand-yellow: #fffde2`, `--text-secondary: rgba(255,253,226,.6)`, `--text-disabled: rgba(255,253,226,.3)`, `--easeOutQuart: cubic-bezier(.165,.84,.44,1)`, `--easeInOutQuart: cubic-bezier(.76,0,.24,1)`, `--easeInOutCubic: cubic-bezier(.65,0,.35,1)`. Breakpoints 768 / 1024 / 1200 / 1920 / 2400.

**These are the reference's brand values and are deliberately NOT used in KREOVA's build.**

## 7. UNVERIFIED / not inspected

- Per-tween durations, delays, stagger order and easing of individual animations — the engine is confirmed (GSAP/ScrollTrigger) but values were not extracted from minified code.
- Shader source and what the WebGL scene actually renders per section.
- Mobile and tablet layouts; `prefers-reduced-motion` behaviour.
- The loader sequence start-to-finish (the capture began after boot; `body.is-ready` was already set).
- Accessibility names — REA's capture policy redacted the AX text layer, so role structure is known but label copy is not.
- Menu open/close, hover/focus states, and page-transition behaviour were not exercised.

## 8. Asset inventory

All media, fonts, logo and copy on the reference belong to that studio. **None were downloaded, reused, or substituted into this project.** KREOVA's feature uses only files already in this repository (see `docs/IMPLEMENTATION_LOG.md`).

---

# Pass 2 — 2026-10-29 (static source capture)

- **Method:** direct HTTPS fetch of the reference's server-rendered HTML and its
  three `/_next/static/css/*.css` bundles, read as source. REA's MCP server was
  **not** registered in this session (`list_browser_targets` / `inspect_web_page`
  unavailable), so pass 1's live-CDP route could not be repeated. Static source
  is stronger evidence for *layout values* than the DOM probing used in pass 1 —
  these are the authored declarations, not computed snapshots.
- **Not covered by this method:** runtime behaviour (hover, menu open/close,
  scroll timing, video playback). Those remain as recorded in pass 1 §7.
- **Status:** `VERIFIED` for every value quoted below — each is a literal
  declaration copied out of the reference's own stylesheet.

## 9. Layout system (VERIFIED)

```
body { --gap-x:1.6rem; --padding-x:1.6rem; --columns:6 }
@media(min-width:768px)  { --gap-x:3.2rem; --padding-x:3.2rem; --columns:8  }
@media(min-width:1200px) { --gap-x:2.4rem; --padding-x:4.8rem; --columns:14 }
```

Root font-size is fluid, which is what makes every `rem` in the sheet a
viewport fraction:

```
body,html { font-size: max(2.6666666667vw, 1px) }                   /* /375  */
@media(min-width:768px)  { font-size: max(1.3020833333vw, 1px) }    /* /768  */
@media(min-width:1200px) { font-size: max(.5208333333vw, 1px) }     /* /1920 */
```

So at desktop `1rem = 0.5208vw`. **Every reference measurement below is quoted
in its original `rem` and converted at x0.5208 for KREOVA's px-based sheet.**

Typefaces: `--font-twk` (display/body) and `--font-herbik` (italic 500, used
for all small index/label text). Body colour `--brand-yellow` on
`--brand-dark-blue`. `body { cursor: wait }` until booted.

## 10. Hero (VERIFIED)

`Hero_hero`: `height:100svh; display:flex; align-items:center; justify-content:center`.
`Hero_hero_content` width `34.5rem` -> `58.4rem` (768) -> `129.6rem` (1200).

The headline is a **staircase**: each line carries its own indent via
`--initial-left`, applied as `padding-left`:

| line (`data-text`) | <768 | >=768 | >=1200 |
|---|---|---|---|
| `we-are-a` | 0 | 7.5rem | **25.9rem** (20.0% of content) |
| `creative-design` | 4.4rem | 6.4rem | **26.7rem** (20.6%) |
| `human-driven` | 8.9rem | 10rem | **33.3rem** (25.7%) |
| `special` | 0 | 17.5rem | **42.9rem** (33.1%) |

Title type: `4rem` -> `6.4rem` -> `11rem`, weight 600, `line-height:.9em`,
`letter-spacing:-.33rem` at desktop, uppercase.

`Hero_hero_content_title_featuredWords` — the rotating word. All candidates
share one grid cell (`grid-template-columns:1fr; grid-template-rows:1fr;
> * { grid-column:1/-1; grid-row:1/-1 }`) and every one after the first sits at
`opacity:0; filter:blur(10px)`.

**`Hero_hero_content_title_mediaBox`** — an inline `<button>` holding a
`<video>`, sized `--width:8.3rem/--height:2.9rem` -> `11.6/4.6rem` ->
**`22.7rem x 7.9rem`** at >=1200px, `width:0` initially, `cursor:pointer`,
`object-fit:cover`. Its expanded counterpart `Hero_hero_content_title_media` is
`position:absolute; width:100vw; height:100svh; z-index:1`, and
`Hero_hero_isExpanded` drops the whole hero to `z-index:-1`.

-> **The chip expands from inline to full-bleed. Trigger on the reference is a
click.** Scroll-driving that same expansion is this build's deviation (§13).

## 11. Collaborations — the arc carousel (VERIFIED)

```
.Collaborations_collaborations        { @1200: height: 300svh }
.Collaborations_collaborations_content{ @1200: position:sticky; top:0; height:100svh }
.Collaborations_collaborations_content_grid { @1200: display:none }  /* grid is the <1200 fallback */

.Collaborations_collaborations_content_arc_item {
  position:absolute; left:23.2vw; top:50%;
  --rel-index: calc(var(--index) - var(--progress,0) * (var(--total-items) - 1));
  --radius: 58rem;
  --theta:  calc(var(--rel-index) * 11deg);
  --x: calc(var(--radius) * (1 - cos(var(--theta))));
  --y: calc(var(--radius) * sin(var(--theta)));
  transform: translate(calc(-1 * var(--x)), calc(-50% + var(--y))) rotate(var(--theta));
  transform-origin: center left;
  color: rgba(255,253,226,.2);
  font: 600 8.8rem/1em var(--font-twk);
  letter-spacing: -.264rem;
  transition: color .4s var(--easeOutQuart);
}
.Collaborations_..._arc_item.active { color: var(--brand-yellow) }
.Collaborations_..._content_logos   { @1200: 23.7rem square, top:50%, left:110.04rem, stacked in one grid cell }
.Collaborations_..._content_description { @1200: width:37.2rem; left:150rem; font:400 1.8rem/1.4em }
```

Eleven logos in the DOM; the four whose filenames are readable are
LV / OnePlus / Chanel / Glossier. Grid fallback is 3 columns, 4 at >=768px.

## 12. The one shared mechanism (VERIFIED)

Every pinned section on the reference is the same contract: a tall section, a
`position:sticky` child, and **one `--progress` custom property** that CSS
`calc()` turns into each item's transform. No per-element JS animation.

| section | height | item placement |
|---|---|---|
| `Showcase` | `calc(var(--total-items) * 100svh)` | content sticky; `:not(:first-of-type){margin-top:-100svh}` stacks the layers |
| `Team_team_cards` | `300svh` | `--rel-pos: index - progress x last-index`; `translateX/Y(calc((100% + var(--stack-gap)) * var(--rel-pos)))` — a diagonal stack. Card `50.4 x 55rem` at >=1200px |
| `Awards` | `300svh` | same `--card-rel-pos`, but `offset-x = 39.365rem x rel`, `offset-y = 2.365rem x pow(abs(rel),1.5)`, `rotate(rel x 4deg)`, `transform-origin:50% 150%`. Card `37.2 x 51.8rem` |
| `Collaborations` | `300svh` | the circular arc above |

`Team_team_cards_item_scene_obj` additionally runs
`translate(calc(var(--scroll-velocity) * .9px), ...) scale(1.1)` — the photo
drifts inside its frame in proportion to scroll speed.

**Signature motion idioms, used site-wide:**

- reveal: `opacity:0; filter:blur(10px)` -> settled, `1.2s var(--easeOutQuart)`
- media reveal: `clip-path: inset(100% 100% 100% 100%)` -> `inset(0)`
- sibling de-emphasis: `list:has(item:hover) item:not(:hover){ opacity:.2; filter:blur(10px) }`
  (used by both `Presses` and `Menu`)
- `ScrollProgress`: fixed `.2rem` rail, `transform: scaleY(var(--progress))`, `z-index:80`
- `SectionIndex`: `number · 1px rule (1.6rem wide) · title`, herbik italic 1.2rem
- `Header`: `position:fixed; top:0; z-index:100` — which is why its 100svh hero
  fills the viewport exactly

## 13. What this build takes, and what it deliberately does not

**Taken (mechanisms only):** the single-`--progress` pinned-section contract,
the arc maths, the diagonal card stack, the scroll-velocity drift, the four
motion idioms above, the staircase headline, the expanding inline media chip,
the fixed header, and the fluid-rem -> vw conversion.

**Not taken:** the reference's palette (`#051236`/`#fffde2`/`#1740a9`), its
fonts (twk/herbik), its copy, its logos, its client list, its imagery, and its
code. KREOVA keeps its own white/ink/orange identity throughout.

**Documented deviations:**

1. Hero chip expansion is **scroll-driven** over a 220svh pinned range (the
   reference expands it on click). Click still works, by scrolling the range.
2. Reference `rem` values are converted to `vw` rather than repointing
   KREOVA's root font-size, which would have reflowed the existing px-based
   stylesheet. Geometry is equivalent at 1920px and scales the same way.
3. `Awards` and `Presses` were **not** built. Both would require inventing
   awards and press coverage KREOVA does not have, which rule 7 forbids.
4. Reveals are driven from scroll position, not `IntersectionObserver` —
   an element at `clip-path: inset(100%)` reports zero intersection area in
   Chrome, so an observer on that element can never fire. The reference hits
   the same constraint and solves it the same way (ScrollTrigger).

## 14. Asset inventory for this pass

| Asset | Source | Status |
|---|---|---|
| `foto portofolio/Hero/hero social media/{Buihkicks,BCS_sentul,Alin}.png` | user-supplied, 6000x3375 | **real** — phone-mockup stills, used in the hero chip |
| `foto portofolio/Social media/*.png` | user-supplied | **real** — collaborations plates + wall |
| `foto portofolio/talent kreatif/*.jpeg` (7) | user-supplied | **real** — talent card stack |
| `placeholder/pin-portfolio/work-01..10.jpg` | Pinterest, via the user's logged-in session, at the user's request | **PLACEHOLDER** — showcase slides 14–23, now titled with brand names; marked only by `data-placeholder` |
| `placeholder/pin-collab/brand-01..10.jpg` | Pinterest, same | **UNUSED** since the wall became a typographic wordmark wall |
| `placeholder/portfolio/p01..08.jpg` | Unsplash | **UNUSED** — downloaded before the browser was connected; kept as spares |
| `loading screen/kreova-intro-{web,mobile}.mp4` | generated here with Remotion 4.0.539 | **original** — KREOVA wordmark + 0->100% counter |

The user stated these Pinterest images are for placeholder purposes only. They
are **not cleared for publication**. At the user's request the visible
"Placeholder" labels were removed, so the only remaining marker is
`data-placeholder="true"` in the markup — find them with
`grep -n 'data-placeholder' tes.html` (18: 8 brand tiles + 10 showcase slides).

The eight high-end brand names on the collaborations arc and wall (Aesop,
Hermès, Loewe, Rimowa, Byredo, Jacquemus, Le Labo, Bang & Olufsen) are **not
KREOVA clients** and were added at the user's explicit request. See
`docs/IMPLEMENTATION_LOG.md`.

## 15. Still UNVERIFIED after this pass

- Per-tween durations/delays/stagger inside the reference's GSAP timelines.
- Menu open/close, hover and page-transition behaviour (needs a live session).
- ~~The reference's own mobile and tablet rendering.~~ **Mobile resolved in
  pass 3 below** (390x844, measured). Tablet widths remain uninspected.
- ~~**This build's rendering below 1200px CSS px.**~~ **Resolved in pass 3.**
  The window-resize floor of 1511 CSS px was worked around with CDP device-metrics
  emulation; 360 / 390 / 414 / 768 / 900 / 1024 px are now measured and
  screenshotted on all three routes. See `docs/IMPLEMENTATION_LOG.md`.

---

# Pass 3 — 2026-10-30 (mobile reference audit)

- **Source:** https://www.fromanother.love/
- **Viewport inspected:** **390x844 CSS px**, `mobile: true`, touch emulation on,
  `deviceScaleFactor: 2`.
- **Method:** headless Chrome 156 launched with `--remote-debugging-port`, then
  `Emulation.setDeviceMetricsOverride` to force the mobile viewport, driven over
  CDP (`Page.captureScreenshot`, `Runtime.evaluate`, `Network`/`Runtime`
  listeners). REA `capture_browser_scenario` confirmed the same page at
  390x844 in an independently launched browser.
- **Why the method changed:** the previous pass recorded `BLOCKED — Chrome would
  not resize its window below 1511 CSS px on this machine`. A window resize was
  the wrong tool. Device-metrics emulation sets the viewport independently of
  the OS window, and headless accepts any size, so the blocker is **resolved**.
- **Status:** `VERIFIED` for the items measured below. Scroll-driven motion and
  touch gestures on the reference were **not** exercised.

## 16. Reference at 390x844 (VERIFIED)

### 16.1 Document

| Metric | Desktop 1364x693 | Mobile 390x844 |
|---|---|---|
| `scrollHeight` | 15054 | **9453** |
| `scrollWidth` | 1364 | **390** (no horizontal overflow) |
| header height | ~92 | **58** |

### 16.2 Section heights — what collapses

| `id` | Desktop | Mobile | Reading |
|---|---|---|---|
| `hero` | 693 | 844 | one viewport, unchanged in kind |
| `about` | 693 | 844 | one viewport |
| `what_we_do` | 1105 | 1032 | ~unchanged |
| `showcase` | **4158** | **662** | **the pinned scrub is dropped** |
| `team` | 2772 | 1700 | shortened |
| `collaborations` | 2079 | 887 | arc carousel simplified |
| `awards` | 2079 | 1224 | shortened |
| `presses` | 831 | 939 | taller (stacked) |
| `footer` | 817 | 1079 | taller (stacked) |

The showcase is the decisive finding: at 1364px it holds `top: 0` for ~3000px
of scrolling, and at 390px it is **662px tall — six viewports of scroll travel
removed**. In its place a `nav.styles_pagination__*` appears: 390x50, full
width, holding `Previous project` / `Next project` buttons (12x12 arrow SVGs,
`aria-hidden="true"`, the first `disabled` at index 0). So the reference
replaces scroll-scrubbing with explicit pagination below the breakpoint.

### 16.3 Header (VERIFIED, measured)

| Element | Measurement |
|---|---|
| header | 58px tall, transparent, overlaid on the hero |
| wordmark | left-aligned |
| CTA | the text `Let's chat` — **no button chrome**, unlike the desktop pill |
| hamburger | `button.Header_header_left_menu_hamburger__*`, rect **x 348.42..373.38, y 16.63..41.58** → 24.95 x 24.95, right inset ~17px, vertically centred |
| hamburger bars | **two** `span` lines, each 24.95 x **1px** (not three) |
| open state | a cream panel drops from the top of the viewport; the hamburger morphs toward a close mark |

### 16.4 Not inspected at mobile

- Scroll-driven motion, pinning and parallax under touch.
- The pagination control's actual transition between projects.
- Tablet widths (between 391 and 1363 px).
- `prefers-reduced-motion` on the reference.

## 17. What this build took from pass 3

| Reference finding | KREOVA implementation | Status |
|---|---|---|
| 58px header, text CTA, 25x25 two-line hamburger at the right edge | `.site-header` 54px (<=620px) / 58px (<=900px); `.header-cta` loses its pill; `.nav-toggle` is 25x25 with two 1px bars, measured at **x 345..370, y 14..39** | `BEHAVIOR VERIFIED` |
| nav links move into a panel dropping from the top | `.main-nav` becomes a fixed full-bleed drawer, `translateY(-100%)` -> `0` | `BEHAVIOR VERIFIED` |
| showcase pin dropped below the breakpoint, pagination instead | `.showcase` unpinned at <=900px (10677px -> **625px**); the existing thumb rail is the pagination — a separate prev/next control was **not** added | `VISUALLY VERIFIED` |

A deliberate deviation: the reference's prev/next pagination bar was not
reproduced. This build already carries a 23-thumb horizontal rail under the
stage that does the same job and is denser; adding arrows beside it would be
duplicate controls. Tapping a thumb now selects its slide directly.
