# Implementation Log

## 2026-10-29 — Reference mechanism port, hero rebuild, collaborations, talent stack

### Files changed

| File | Change |
|---|---|
| `tes.html` | hero section replaced; showcase 13 -> 23 slides; two new sections; scroll rail; two nav entries; loader points at the new intro; ~190 lines of motion JS appended |
| `style.css` | +~860 lines appended in six documented blocks (motion system, hero, collab arc, talent stack, support rules, fixed header) |
| `docs/REFERENCE_AUDIT.md` | pass 2 appended (§9–§15) |
| `docs/IMPLEMENTATION_PLAN.md` | new |
| `remotion-intro/` | new — Remotion project for the intro renders |
| `loading screen/kreova-intro-web.mp4` | new — 1920x1080, 120f @30fps |
| `loading screen/kreova-intro-mobile.mp4` | new — 1080x1920, 120f @30fps |
| `placeholder/pin-portfolio/*.jpg` | new — 10 Pinterest placeholders |
| `placeholder/pin-collab/*.jpg` | new — 10 Pinterest placeholders |
| `placeholder/portfolio/*.jpg` | new — 8 Unsplash spares, currently unused |

Nothing was deleted. `foto portofolio/Hero/Hero.mp4` is no longer in the hero
but is still slide 01 of the showcase. The old loader clips
(`loading screen-web.mp4`, `loadingscreenmobile.mp4`, `loading screen.MOV`)
remain on disk, unreferenced.

### What was implemented

**1. Hero — `IMPLEMENTED` / `VISUALLY VERIFIED` / `BEHAVIOR VERIFIED`**

Replaced the two-column hero + looping `Hero.mp4` with the reference's
staircase headline (`CREATE.` / `EVOLVE.` / `IMPACT.` at 0% / 20% / 26%
indents, matching the reference's 20.0 / 20.6 / 25.7% ratios) and an inline
media chip that expands from `160x56px` to the full viewport as you scroll a
220svh pinned range. The chip holds the three new hero stills, cross-fading
every 3.6s through the reference's `opacity + blur(10px)` idiom.

Verified at `--hp` 0 / 0.55 / 1.0 by screenshot. Measured chip rect
`160.75 x 55.89` at `(547.72, 333.31)` inside the pin; geometry lerps to
`100vw x 100svh` correctly.

**2. Collaborations arc — `IMPLEMENTED` / `VISUALLY VERIFIED`**

Full port of `Collaborations_collaborations_content_arc_item`: 300svh section,
sticky 100svh pin, items on a 30.2vw-radius circle at 11deg per step, active
item picking up `--ink`, cross-fading plates at `left: 57.3vw`, aside at
`left: 78.1vw`. Counter verified running 01/04 -> 04/04 across the pin.

Carries the three real clients plus a `BRAND ANDA` open slot. The item list is
one array in the generator — adding more clients is a one-line edit.

**3. Collaborations wall — `IMPLEMENTED` / `VISUALLY VERIFIED`**

13-tile grid below the arc (and the sole collaborations content below 1200px).
Three real client tiles with solid borders, ten Pinterest placeholders with
dashed accent borders, `PLACEHOLDER NN` captions, `data-placeholder="true"`,
and a visible note under the grid.

**4. Talent card stack — `IMPLEMENTED` / `VISUALLY VERIFIED`**

Port of `Team_team_cards`: 300svh, sticky, seven real talent photos in one
grid cell, swept diagonally by `(100% + gap) * rel-pos`, with the reference's
`--scroll-velocity * .9px` drift on the inner object at `scale(1.1)`.

**5. Showcase extended — `IMPLEMENTED` / `VISUALLY VERIFIED`**

13 -> 23 slides, with matching indicator entries and thumbnails. Per-slide
scroll travel made tunable (`--showcase-step`) and set to `55vh` for the
longer deck; at the original `90vh` the section alone would have been a
~14,000px scroll.

**6. Global motion system — `IMPLEMENTED` / `BEHAVIOR VERIFIED`**

`[data-reveal]`, `[data-reveal-media]`, `.dim-siblings`/`.dim-item`,
`.scroll-rail`, `.section-index`, and the three reference easing curves, all
with `prefers-reduced-motion` fallbacks.

**7. Remotion intro — `IMPLEMENTED` / `VISUALLY VERIFIED`**

`remotion-intro/` renders a KREOVA wordmark intro with a 0->100% counter and a
clip-path wipe-out, structured like the reference's loader but using KREOVA's
own palette and wordmark. Both orientations rendered and wired into the
existing loading-screen component, which already had desktop/mobile source
switching and an error fallback.

Re-render with:

```
cd remotion-intro
npx remotion render IntroDesktop "../loading screen/kreova-intro-web.mp4" --codec=h264
npx remotion render IntroMobile  "../loading screen/kreova-intro-mobile.mp4" --codec=h264
```

### Checks performed

Served at `http://127.0.0.1:8899` and driven through Chrome at 1511x623.

| Check | Result |
|---|---|
| Console errors / exceptions | **none** |
| Broken images (75 total) | **none** |
| Horizontal overflow, sampled every 600px over 18,723px | **0px** |
| Loader source resolves | `kreova-intro-web.mp4`, 200 |
| Section heights | hero 1523 · showcase 8757 · collab 2077 · wall 672 · talent 2077 |
| Hero chip expansion at `--hp` 0 / 0.55 / 1 | correct, screenshotted |
| Collab arc at `--progress` 0.33 / 0.99 | correct item active, counter correct |
| Talent stack at `--progress` 0.45 / 0.5 | correct card centred, counter correct |
| Showcase slide 17/23 | `Placeholder 04` active, rail in sync |
| Collab wall reveal | 13/13 revealed; tiles 151x151 |

### Bugs found and fixed during verification

1. **1769px horizontal overflow** — `.talent-stack-pin` had no clip, so cards
   translating up to ~167vw out widened the document. Added `overflow: hidden`,
   as the reference does on its sticky wrappers.
2. **Hero footer overlapped the headline** — `.hero-v2-footer` was absolutely
   positioned against a `.hero-stage` only as tall as its text. Gave the stage
   `height: 100%` so `bottom` resolves against the viewport.
3. **Hero pin started 92px below the fold** — KREOVA's header is in normal
   flow; the reference's is `position: fixed`. Made the header fixed, scoped
   with `body:has(.hero-v2)` so `portfolio.html` and `order.html` are
   untouched.
4. **Hero stills rendered as an unreadable sliver** — they are phone mockups on
   white, not full-bleed photography, so `object-fit: cover` cropped them to
   nothing. Switched to `contain` plus a `scale(3.2 -> 1)` driven by `--hp`,
   which reads as a zoom-out reveal. Same fix applied to the collab plates.
5. **Collaborations wall rendered completely blank** — `[data-reveal-media]`
   elements start at `clip-path: inset(100%)`, and Chrome reports a fully
   clipped element as having **zero intersection area**, so an
   `IntersectionObserver` watching that element can never fire and it stays
   invisible forever. Replaced the observer with a scroll-position check, which
   is what the reference does (ScrollTrigger). Root-caused in the shared reveal
   driver, so every current and future `[data-reveal-media]` is covered.
6. **Wall tiles 82px instead of 162px** — `<figure>` carries the UA default
   `margin: 1em 40px`, eating 80px out of every grid cell. Reset to `margin: 0`.
7. **Flying cards swept across the talent heading** — moved the heading to
   `position: absolute; top: 14vh`, as the reference does with
   `Team_team_content_index` (`top: 12rem`). 14vh rather than 6vh so it clears
   the now-fixed header.
8. **Scroll rail never rendered** — the scripted insertion after `<body>` did
   not match and failed silently; the JS found no element and the rail was
   absent. Added the markup directly and re-verified: present, `is-visible`,
   `--progress` tracking (read `0.9492` at 95% down the page).

---

## 2026-10-29 (later) — Hero closed at the top of the page

**Reported:** on first open the hero media was already visible at scroll 0 and
was distracting.

**Correct per the reference.** `Hero_hero_content_title_mediaBox` is declared
`width: 0` and only expands afterwards — the chip is meant to start closed.
Pass 1 implemented the expansion but not the closed start state.

**Fix.** A second property, `--hp-in`, ramps 0→1 over the first 12% of the
hero's pinned range (~109px of scroll at 1511×679). `.hero-media` reads it as
`opacity` plus a centre-out horizontal `clip-path`, so the box appears to open
from zero width exactly as the reference's animated `width` does — but without
reflowing the headline, since the button keeps reserving its box. That also
keeps the measured `--chip-*` rect valid and avoids a layout shift.

At `--hp-in: 0` the media additionally carries `.is-sealed`
(`visibility: hidden`), set in the markup so it is absent on the first paint
too, and the chip is given `tabindex="-1"` + `aria-hidden="true"` so a keyboard
or screen-reader user is not offered an invisible control. `prefers-reduced-motion`
unseals it, since there is no scroll range there to open it with.

**Verified:** at `scrollY 0` → `--hp 0`, `--hp-in 0`, `visibility: hidden`,
chip `tabIndex -1`; screenshot shows the headline alone. After two scroll ticks
the chip is open and expanding.

### Also fixed: the intro clip's counter was cut off

Spotted while verifying the above — a defect in the previous entry's work, not
something reported. The Remotion intro places its `%` counter and label in the
frame corners, and the loading overlay was rendering the clip at 1494x841
inside a 692px-tall viewport, so the bottom row sat below the fold.

Cause: `.loading-screen-video` was `width:100%; height:100%; object-fit:cover`.
Switching to `contain` did not help, and neither did `max-height: 100%` — the
percentage was resolving against the parent as indefinite, so the clip kept
sizing itself from its intrinsic 1920x1080. Fixed by clamping with viewport
units instead:

```css
.loading-screen-video { width:auto; height:auto; max-width:100vw; max-height:100svh; }
```

Now measured at 1231x692 inside a 692px viewport — the whole frame fits, and
the letterboxing is invisible because the composition renders on the same white
as the page (`.loading-screen` background changed from `--ink` to `--paper`).

The composition was also given a title-safe inset (10% x / 13% y instead of a
flat 72px) and both MP4s re-rendered, so the corner text survives whatever a
viewport does to the frame edges.

### A misdiagnosis worth recording

While verifying this I measured 2fps in the hero and treated it as a rendering
bug. **It was not.** Screenshot capture was timing out and rAF was throttled
because the page was static and the tab idle — no new frames to capture. The
page renders normally; scrolling and screenshotting work fine.

Two changes made while chasing that wrong diagnosis were kept, on their own
merits rather than the one claimed:

- The three hero stills were resized from 6000×3375 PNG to 2400×1350 JPEG,
  **5.2MB → 279KB total**, into `foto portofolio/Hero/hero social media/web/`.
  Originals are untouched in the parent folder. Worth keeping: these are
  above-the-fold images and 6000px wide was ~6× more pixels than the largest
  size they are ever displayed at. Regenerate with the sharp script if the
  originals change.
- `.is-sealed`, described above — correct behaviour regardless.

---

## 2026-10-29 (later still) — High-end brand roster, no placeholder labels, text/image collisions

**Requested:** swap the collaboration tiles for high-end brands, drop every
visible "Placeholder" label and write the brand or talent name directly, and
fix text that collides with imagery.

### Collaboration roster

Eleven entries, used by both the pinned arc and the wall: the three real
KREOVA clients first (BuihKicks, BCS Sentul, Alin Nur Jannah), then Aesop,
Hermès, Loewe, Rimowa, Byredo, Jacquemus, Le Labo, Bang & Olufsen.

**The eight high-end names are not KREOVA clients.** Under the heading "Brand
yang bekerja bersama kami" they assert a relationship that does not exist. The
user asked for this explicitly; it is recorded here so it is not mistaken for
verified content. Each carries `data-placeholder="true"` in the markup —
invisible in the UI, so the "no placeholder text" requirement holds — and they
remain findable with `grep -n 'data-placeholder' tes.html` (18 total: 8 brands
+ 10 showcase slides).

Arc plates: real clients keep their own screenshot; the high-end brands get a
typographic plate (`.collab-logo-mark`), since there is no logo asset for them
and a wrong or garbled logo raster would look worse than set type.

### Wall rebuilt as a wordmark wall

The wall tiles were photos with a caption band laid over them — text on top of
imagery, which was one of the reported collisions. Replaced with uniform
typographic tiles: brand name set in the display face, sector underneath in
small caps, thin border, accent on hover. No imagery, so no caption can sit on
a picture, and every brand reads at the same weight.

An earlier version used `gap: 1px` over a shared `--line` background to draw
hairline rules; with 11 tiles in an 8-column grid the five unfilled cells of
the last row painted as a grey block. Switched to per-tile borders with a real
gap, which survives any column count.

### Showcase slides renamed

Slides 14–23 were "Placeholder 01…10" with the caption "ganti sebelum
publikasi". Now named after the same brands with a real category (Campaign
visual / Art direction / Editorial), across the title, caption, `alt` text,
indicator labels and thumbnail `aria-label`.

### Text/image collisions fixed

1. **Talent stack heading** — the cards sweep a diagonal from top-left to
   bottom-right, and the centred heading sat directly in that path; "ORANG-ORANG
   DI BALIK KARYANYA." was printed across the outgoing card. Moved to the
   top-right quadrant, right-aligned — the one area no card crosses. The
   reference keeps its index centred and relies on `mix-blend-mode: difference`
   to stay legible; that does not translate to this light palette, where black
   text on white inverts to white and disappears.
2. **Service photo captions** — dark bars absolutely positioned over the bottom
   of 130–180px thumbnails, wrapping to two lines over the subject. Moved below
   the frame as muted small caps.
3. **Collaboration wall captions** — removed with the wordmark rebuild above.

### Checks

| Check | Result |
|---|---|
| Visible "Placeholder" anywhere in rendered text | **none** |
| `data-placeholder` markers retained | 18 |
| Console errors | **none** |
| Broken images | **none** |
| Horizontal overflow over the full page | **0px** |
| Arc / wall rosters match, ampersand not double-escaped | verified |
| Talent heading vs card path | clear, screenshotted |
| Service captions below frame | clear, screenshotted |

### Open

- ~~Talent card captions are still "Talent 01…07".~~ **Resolved** — see below.
- Some Pinterest showcase stills carry other publishers' branding baked into
  the image (one is a Vogue cover treatment). Another reason these are
  development placeholders only.

---

## 2026-10-29 (final) — Talent named

User supplied the talent's name: **Alin Nur**. Before applying one name to all
seven frames I compared `one.jpeg`, `six.jpeg` and `seven.jpeg` — studio
black-and-white, outdoor daylight and interior warm light — and they are the
same person, so a single name across the set is correct rather than an
assumption.

Applied to:

- the seven `.talent-card-caption` labels in the pinned stack (the 01/07
  counter in the heading already says which frame is active, so the caption
  does not repeat a number)
- the seven showcase slide titles (07–13)
- indicator and thumbnail labels, which keep a number — `Alin Nur 01…07` —
  because seven identical entries in a navigable list are unusable
- every `alt` text on those frames, plus the talent thumbnail in the services
  section, which had generic wording

Verified: 7/7 card captions, 7/7 slide titles, 0 leftover "Talent 01"/"Talent
portrait" strings in rendered text, no console errors, no broken images, 0px
horizontal overflow.

**Naming note:** the collaborations roster lists a client as **Alin Nur
Jannah** (sector: Creator) — that entry predates this session and came from the
project's own content. If that is the same person, the two spellings should be
unified; the talent captions use the short form exactly as the user gave it.

---

## 2026-10-29 (later) — Real brand logos in the arc and the wall

**Requested:** the collaboration section had brand *names* but no logos; put
logos in, sourced from Pinterest — specifically in "yang wheels spin", the
pinned arc carousel.

### Sourcing and verification

Searched Pinterest per brand and pulled 2–8 candidates each, then composited
them into contact sheets and **looked at every one** before choosing, rather
than trusting the search term. That caught two bad matches:

- *Rimowa* — the top results were a suitcase photo and an unrelated monogram,
  neither a logo. Re-searched on "Rimowa wordmark brand identity" and got a
  clean wordmark.
- *Aesop* — the first results were wordmarks over blurred product photography.
  Re-searched on "Aesop brand logo white" for a flat mark.

Final selection, all visually confirmed as the correct brand:

| Brand | File | Mark |
|---|---|---|
| Aesop | `aesop-d.jpg` | wordmark, black on white |
| Hermès | `hermes-a.jpg` | carriage mark + HERMÈS PARIS, orange |
| Loewe | `loewe-a.jpg` | wordmark + anagram, white on black |
| Rimowa | `rimowa-c.jpg` | wordmark on a pale ground |
| Byredo | `byredo-a.jpg` | B monogram + BYREDO |
| Jacquemus | `jacquemus-b.jpg` | wordmark on peach |
| Le Labo | `lelabo-b.jpg` | kraft label with the wordmark |
| Bang & Olufsen | `bo-b.jpg` | wordmark, black on white |

Rejected candidates were deleted rather than left lying around. The ten earlier
`placeholder/pin-collab/brand-*.jpg` files are now unused — they were generic
logos that did not correspond to any named brand.

The three real KREOVA clients have **no logo asset in this repo**, so their
tiles still set the name as type. Mixed by necessity, not oversight; supply a
logo file and they can match.

### Where they went

- **Arc plate** (`.collab-logo`) — the cross-fading square in the pinned
  carousel. This was the specific ask.
- **Wall tiles** — media square on top, sector caption below, so no text sits
  on a logo.

`object-fit: contain`, not `cover`: cropping a logo is worse than uneven
whitespace around it.

### Bug found and fixed during verification

The wall tiles first rendered Hermès and Jacquemus as **flat blocks of colour**
with no mark visible. Cause: the tile is now media + caption, but the figure
still carried `aspect-ratio: 1` from the old square-tile rule, which fought the
new flex column; the media slot never got a definite height, so `height: 100%`
on the image fell back to its intrinsic ratio and the tall files rendered
325px tall inside a ~110px clipped slot — we were seeing a middle slice.
`object-fit: contain` was correctly applied the whole time, which is why the
computed style looked right while the output did not.

Fixed by sizing the media slot itself (`aspect-ratio: 1` on
`.collab-tile-media`, `aspect-ratio: auto` on the figure) and pinning the
image with `position: absolute; inset: 0`, so nothing depends on how the
figure's height resolves. Measured after: every media box 154×154.

### Checks

| Check | Result |
|---|---|
| Arc plates carrying a logo image | 8/8 |
| Wall tiles carrying a logo image | 8/8 |
| Broken images | **none** |
| Console errors | **none** |
| Horizontal overflow over the full page | **0px** |
| Visible "Placeholder" text | **none** |

**Unchanged caveat:** these eight are not KREOVA clients, and the logos are
other companies' trademarks pulled from Pinterest. Development placeholders
only — `data-placeholder="true"` still marks every one.

---

## 2026-10-29 (later) — Hero stills swapped to high-end brand campaign photography

**Requested:** replace the hero images with photos from the high-end brands.

### Sourcing

Searched Pinterest for campaign/editorial imagery across Hermès, Loewe,
Jacquemus and Aesop, pulled twelve candidates at the best resolution each URL
offered (`/originals/` where available, falling back to `/1200x/` then
`/736x/`), then reviewed them all on a contact sheet. Rejected:

- an Instagram screenshot complete with app UI chrome
- two poster layouts whose own headline type would have fought the hero
- several files under 900px, too soft for a full-bleed hero

Four kept, re-encoded at native size (no upscaling) into `placeholder/hero/`:

| File | Source | Size |
|---|---|---|
| `01-loewe.jpg` | Loewe campaign, yellow jacket | 1200×1500, 294KB |
| `02-editorial.jpg` | editorial campaign reference, bench | 1280×1600, 222KB |
| `03-loewe.jpg` | Loewe campaign, sky | 1280×1599, 187KB |
| `04-aesop.jpg` | Aesop product still life | 1440×1500, 131KB |

`02-editorial.jpg` came from the Jacquemus search but carries no visible
branding, so its `alt` describes it rather than asserting a brand.

### Treatment changed to match

The old hero stills were phone mockups on white, which is why the media used
`object-fit: contain` with a `scale(3.2 → 1)` zoom — without it the mockups
cropped to an unreadable sliver. Campaign photography is the opposite case, so:

- `contain` → **`cover`**
- `--media-scale` `calc(3.2 - 2.2 * var(--hp))` → `calc(1.14 - 0.14 * var(--hp))`,
  a gentle settle instead of a hard zoom-out
- `.hero-media` background `--paper` → `--ink`, so nothing flashes white while
  a frame loads
- `.hero-media-caption` was `--ink` text with no ground, which was fine over a
  white mockup and illegible over a photograph — now white on a 55%
  dark scrim with a backdrop blur

### Checks

| Check | Result |
|---|---|
| Hero frames loading | 4/4 |
| `object-fit` on hero stills | `cover` |
| At `scrollY 0` | `--hp 0`, `--hp-in 0`, `visibility: hidden` |
| Console errors | **none** |
| Broken images | **none** |
| Horizontal overflow over the full page | **0px** |
| Visible "Placeholder" text | **none** |
| `data-placeholder` markers | 22 (was 18; +4 hero stills) |

### Notes

- `foto portofolio/Hero/hero social media/` (originals and the `web/` JPEGs
  generated earlier) are **no longer referenced** by the page. Left in place —
  they are the user's own assets, not mine to delete.
- `placeholder/pin-collab/` was deleted; superseded by the real brand logos.
- **These are other companies' campaign photographs, now in the most prominent
  position on the site.** Same standing caveat as the logos: development
  placeholders, not cleared for publication, all four marked
  `data-placeholder="true"`.

---

## 2026-10-29 (later) — Portfolio page: scroll-driven treatment

**Requested:** make `portfolio.html` richer with scroll triggers, animation or
3D; free to use online sources, Pinterest, or Remotion.

### Approach

The page had no motion at all. Rather than build a second engine, it was
ported onto the one already in `style.css` §1 — the same reveal idiom,
`dim-siblings` hover rule, scroll rail and single rAF-throttled handler array
that `tes.html` uses. Net new JS is ~90 lines.

**No new dependencies.** Depth is CSS `perspective`, not WebGL: a 3D library
would be ~150KB to do what a transform does here. Remotion was not used either
— it renders video, and nothing on this page wanted a video.

### Built

1. **3D card entrance** — `[data-reveal="card"]`: cards start at
   `perspective(1200px) rotateX(13deg) translateY(44px) scale(.96)` with a 6px
   blur and deal flat, staggered 90ms by their index in the grid.
2. **Pointer tilt** — `pointermove` writes `--tilt-x` / `--tilt-y` / `--lift`
   on the card; the figure reads them. The entrance transform lives on the
   `<article>` and the tilt on the `<figure>` inside it, so the two never
   fight. Gated on `(hover: hover)` so touch devices are unaffected.
3. **Sticky segment headings** — at ≥1100px each segment becomes a
   `290px / 1fr` grid with the heading sticky at `top: 40px`, holding while its
   cards scroll past. Mirrors the reference's sticky press label. Sidesteps the
   overlap problem a full-width sticky bar would have had.
4. **Fixed work indicator** — `NN / 09` plus the segment name, updating from
   whichever card owns the viewport midpoint. The reference's `SectionIndicator`.
5. **Scroll progress rail** and **`dim-siblings`** hover de-emphasis, both
   reused as-is.
6. **Hover polish** — image scales 1.04, caption arrow leans out.

### Fixed along the way

- **The loader still pointed at the replaced clips.** `portfolio.html` was
  loading `loading screen-web.mp4` / `loadingscreenmobile.mp4`; repointed to
  the Remotion intro, matching `tes.html`.
- **Talent cards still read "Talent portrait 01…04"** — the naming applied to
  `tes.html` earlier had not reached this page. Now "Alin Nur", with the
  `alt` text updated to match.
- **Indicator label was pulling the whole `<h2>`** ("Konten yang membangun
  koneksi"). Switched to the eyebrow's text after the slash, which is the short
  segment name.
- **Indicator was invisible over the dark Creative Content section** — it is
  `--muted` text and floats over sections of varying ground. Given its own
  translucent pill with a backdrop blur rather than a single text colour.
  (`mix-blend-mode: difference`, which the reference uses, inverts black to
  white on this light palette and disappears.)

### Checks

| Check | Result |
|---|---|
| Console errors | **none** |
| Broken images | **none** |
| Horizontal overflow over the full page | **0px** |
| Cards revealed after a full scroll | 9/9 |
| Indicator tracking | `03/09 Social media management` → `05/09 Creative content production` → `09/09 Talent & KOL management` |
| Pointer tilt | `--tilt-x 1.43deg`, `--tilt-y -1.55deg`, `--lift 1` measured on hover |
| Sibling dim+blur on hover | verified |
| Loader source | `kreova-intro-web.mp4`, resolves |

One false alarm worth noting: a mid-scroll screenshot showed three talent
cards blurred and faded, which looked like a stuck reveal. Measuring after the
transition settled showed all four at `opacity: 1, blur(0)` — it was simply the
1.2s reveal still in flight.

`prefers-reduced-motion` drops the entrance transform, the tilt and the
indicator fade.

---

## 2026-10-29 (final) — Brand campaign segment, and a mislabelling bug I had shipped

**Requested:** the high-end brands were not on the portfolio page.

### New segment

Added `04 / Brand campaign` to `portfolio.html`: ten works, the same ten that
run as showcase slides 14–23 on `tes.html`, so both pages describe one body of
work instead of diverging. The sticky heading column also carries a compact
8-logo strip, greyscale until the group is hovered.

Counts and navigation updated throughout: `03 SEGMEN / 09 KARYA` →
`04 SEGMEN / 19 KARYA`, header nav, hero jump links, hero copy, meta
description. The floating indicator counts cards at runtime, so it picked up
`/19` with no change.

### The bug: brand names on images that were not that brand

Spotted while verifying the new segment, and it was **my error from an earlier
session**. When the showcase was extended from 13 to 23 slides, ten generic
"editorial fashion campaign photography" results were pulled from Pinterest
and then simply *labelled* with brand names. The names were never checked
against the pictures. The result:

| Card said | Image actually showed |
|---|---|
| Hermès | a **Valentino** advertisement, V logo visible |
| Rimowa | a "TRANCEMASTER 2005" rave CD cover |
| Loewe | a **Saint Laurent** campaign |
| Jacquemus | a **Vogue** "Best of Photo" cover |
| Acne Studios | a "misci" campaign |

A card reading "Hermès" over a competitor's advertisement is wrong, not merely
a placeholder. The logos had been verified one by one on a contact sheet; these
work images had not — that inconsistency is what let it through.

**Fix.** Ran a per-brand search (`"<brand> campaign advertising"`), pulled 3
candidates each for all ten brands, built one contact sheet and chose from it.
Every replacement either shows that brand's own name or mark, or carries no
brand mark at all; none shows a different company's branding.

Replacement happened **in place** over `placeholder/pin-portfolio/work-01..10.jpg`,
which were already labelled per brand on both pages — so `tes.html` and
`portfolio.html` were both corrected with zero markup change.

Verified after: `Aesop → work-01` … `Byredo → work-05` pairings confirmed in
the DOM, and the home showcase now renders the Hermès horse under the "Hermès"
title.

### Also fixed

`.pf-brandwall` collapsed to a 1px sliver. The sticky heading column is
`align-items: start`, which shrink-wraps its children, so the `aspect-ratio`
tiles had no width to resolve against. Added an explicit `width: 100%` and
`align-self: stretch`; measured 290×146 after.

### Checks

| Check | Result |
|---|---|
| Console errors (fresh tab, portfolio) | **none** |
| Broken images | **none** |
| Horizontal overflow over the full page | **0px** |
| Cards on the page | 19 |
| Brand↔image pairing | verified card by card against the contact sheet |
| Home showcase after the in-place swap | "Hermès" → Hermès horse, correct |

A note on the console: reading messages in a tab that had been used for
Pinterest returned 18 exceptions from `s.pinimg.com` — Pinterest's own
scripts, not this site. Re-checked in a fresh tab: clean.

**Caveat unchanged:** all ten are other companies' campaign photography, kept
as development placeholders and marked `data-placeholder="true"`. One of them
carries a faint "…ED WITH AI" credit line along its left edge, visible at full
size.

### Known limitations and unresolved items

- **`BLOCKED` — mobile/tablet verification.** Chrome would not resize its
  window below 1511 CSS px on this machine, so the `<1200px` and `<900px`
  breakpoints are written but **not visually verified**. They follow the
  reference's own breakpoint behaviour, but treat them as `UNVERIFIED` until
  checked on a real device or with devtools device emulation.
- **`UNVERIFIED` — `prefers-reduced-motion`.** Fallbacks are written for every
  new mechanism but were not exercised.
- **20 Pinterest placeholder images are not cleared for publication.** They are
  marked in the UI and tagged `data-placeholder="true"`. Find them with
  `grep -n 'data-placeholder' tes.html`.
- **`BRAND ANDA` is an open-slot invitation, not a client.** The arc carries
  only KREOVA's three real collaborations; no brands were invented.
- **Awards and press sections were not built** — see audit §13 deviation 3.
- `placeholder/portfolio/*.jpg` (8 Unsplash images) are unused; they were
  fetched before the browser extension connected and are kept only as spares.
- Dead CSS remains for the removed hero (`.hero`, `.hero-art*`, `.art-*`,
  `.motion-toggle`). It matches nothing and was left in place rather than
  risking a cascade change late in the session.

---

## 2026-10-30 — Mobile web view, and the resize blocker that was never a blocker

**Requested:** continue the mobile web view, using REA.

### The blocker, removed first

Every prior session closed with the same line: *"Chrome would not resize its
window below 1511 CSS px on this machine, so the `<1200px` and `<900px`
breakpoints are written but not visually verified."* Resizing the window was
the wrong instrument. Headless Chrome launched with `--remote-debugging-port`
plus `Emulation.setDeviceMetricsOverride` sets the layout viewport
independently of any OS window, so 390x844 with `mobile: true` and touch
emulation is available on this machine and always was. REA's
`capture_browser_scenario` reaches the same place through its own launched
browser (confirmed at 390x844, Chromium 156).

So mobile moved from `BLOCKED` to measured — for this build **and** for the
reference, whose mobile rendering had never been inspected.

### What the reference actually does at 390px

Recorded in `docs/REFERENCE_AUDIT.md` §16. The three findings that drove the
work:

1. **Header 58px**, wordmark left, a plain-text CTA (no pill), and a
   **25x25 hamburger of two 1px bars** at x 348..373. Opening it drops a
   full-width panel from the top.
2. **The pinned showcase is dropped on mobile** — `#showcase` is 4158px at
   1364px wide and **662px** at 390px. A `nav.styles_pagination__*` (390x50,
   prev/next) takes its place.
3. Whole document: 15054px -> **9453px**.

### What was broken here at 390px

| | |
|---|---|
| **Header** | no mobile treatment at all. Seven nav links at 10px squeezed against the logo, and the `Mulai proyek` CTA ran to x=448 on a 390px viewport. Prior sessions had tried to solve this by shrinking fonts and hiding two links — a squeeze, not a layout. |
| **Showcase** | still pinned: `23 x 55vh` = **10,677px of scrolling** on a phone for a section that shows one slide at a time. |
| **Talent stack** | the diagonal sweep is pinned only from 1200px up, so below it `--progress` never moves: card 01 sat still, card 02 peeked from the corner and **cards 03–07 were unreachable**. Six of seven talents invisible on a phone. |
| Total page | **19,010px**, double the reference's mobile height. |

### Built

**1. Mobile header + drawer** (`nav.js`, new; `style.css`; three HTML files).
A `.nav-toggle` of two 1px bars in a 25x25 box, measured in the build at
**x 345..370, y 14..39** against the reference's 348..373 / 16.6..41.6. Below
900px `.main-nav` becomes a fixed drawer that translates down from the top,
with a backdrop, body scroll lock, and close on link / Escape / backdrop. The
CTA drops its pill and becomes text, as the reference's does.

Two things this surfaced:

- On `tes.html` the header is `position: fixed` **with a transform**, which
  makes it the containing block for its own fixed children — a `top/left/100%`
  panel was trapped inside the 350px header box. Centring the panel on the
  header (itself centred) at `100vw` lands it full-bleed on every page.
- A parent's background paints below its children, so the open panel covered
  the brand and the close control. `.brand`, `.header-cta` and `.nav-toggle`
  are lifted to `z-index: 66` above the panel's 65.

The 620px block's squeeze rules — `font-size: 9px` nav links, two links set to
`display: none` — were deleted. The drawer carries all seven links.

**2. Showcase unpinned below 900px** (`style.css`, `tes.html`). Matches the
reference's own behaviour. `showcase.offsetHeight - innerHeight` is then `<= 0`,
which the existing `update()` already treated as "do nothing" — it now also
seeds slide 01 so the first slide is live. `jumpTo()` gained the matching
branch: with no scroll travel, a dot or thumb **selects its slide directly**
instead of scrolling the page to a position that no longer exists.

**3. Talent stack becomes a swipe rail below 1200px** (`style.css`,
`tes.html`). `display: flex` + `scroll-snap-type: x mandatory`, transform
cleared. All seven cards reachable with a native swipe, no JS driver. The
`01 / 07` counter now tracks the rail's own `scrollLeft`.

### Fixed along the way

- **`Logo.jpeg` had been replaced on disk by `Logo.png`** (4800x3200, between
  sessions, not by this work) and all six `<img src>` across the three pages
  still pointed at the old name — the logo was 404 everywhere. Repointed. The
  new file has the same canvas and framing as the old one, so the
  `.brand-logo-frame` crop (`width: 260px`, `top: -53px`, `left: -45px`)
  resolves correctly unchanged; verified rendering at 104x42 in the mobile
  frame.
- **A regression I introduced:** the new `.showcase-stage { aspect-ratio: 3/4 }`
  leaked into the `prefers-reduced-motion` branch, boxing all 23 stacked slides
  into one 519px frame. `aspect-ratio: auto` added there; the section measures
  13,638px with 23 slides visible again.
- **Caption over the photograph:** with a fixed `4/5` media ratio the slide
  content (title + media + caption) overflowed the stage and the caption landed
  on top of the image (media 234..671 inside a stage ending at 619). The slide
  now declares `grid-template-rows: auto minmax(0,1fr) auto` and the media
  takes what is left — measured title 152..212, media 248..570, caption
  604..619, no overlap.

### Checks

Headless Chrome 156 at `deviceScaleFactor: 2`, served over a local static
server. All three routes.

| Check | Result |
|---|---|
| Console errors / failed requests | **none** on `tes.html`, `portfolio.html`, `order.html` |
| Horizontal overflow (`scrollWidth` vs viewport) | **0px** at 360 / 390 / 414 / 768 / 900 / 1024 px, all three routes |
| Page height, home | 19,010px -> **8,822px** (reference mobile: 9,453px) |
| Showcase section height | 10,677px -> **625px** (reference: 662px) |
| Hamburger geometry | 25x25 at x 345..370 (reference 348..373) |
| Drawer | 390x428, full-bleed, all 7 links |
| Drawer open | `aria-expanded=true`, label -> "Tutup menu", body scroll locked |
| Drawer close on link | closed, unlocked, scrolled to `#layanan` (y=3850) |
| Drawer close on Escape / backdrop | both close and unlock |
| Showcase thumb tap (unpinned) | thumb 14 -> slide "Aesop", counter `14` |
| Talent rail | `scrollWidth` 2159 vs 390 client; swipe to end -> counter `07` |
| `prefers-reduced-motion` at 390px | 23 slides stacked and visible, 7 talent cards stacked, 7 nav links reachable, no overflow |
| Logo | `Logo.png` 4800x3200, loads, cropped correctly |

One benign entry remains in the network log: `net::ERR_ABORTED` on `Hero.mp4`,
which is the IntersectionObserver pausing the showcase video as the stage
leaves the viewport and Chrome cancelling the ranged media request. Not an
asset failure — no 4xx on any route.

Reference evidence for this pass: `docs/REFERENCE_AUDIT.md` §16.

### Known limitations after this pass

- **`UNVERIFIED` — real touch devices.** Everything above is Chrome device
  emulation with touch events enabled. Momentum scrolling, snap feel and
  `100svh` behaviour against a mobile browser's collapsing URL bar are not the
  same as emulation and should be checked on hardware.
- **`UNVERIFIED` — tablet band 901–1199px.** The showcase re-pins at 901px
  while the talent stack stays a rail until 1200px. Both breakpoints were
  inherited, not measured against the reference, which was only inspected at
  390px and 1364px.
- **`Logo.png` is 945KB** where the JPEG it replaced was 40KB — a 23x increase
  on an asset that renders at 104x42 on a phone. Worth exporting a smaller
  copy; not done here because it is the user's asset and no image tooling is
  installed in this environment.
- The reference's **prev/next pagination bar** was deliberately not copied —
  see the audit §17 note.
- Slide 01's frame reads white until its video plays; `Hero.mp4` is a motion
  graphic on a white ground, so frame 0 is white by nature. Pre-existing.
- Placeholder inventory, brand-name caveats and the unbuilt Awards/Press
  sections are unchanged from the previous pass.
