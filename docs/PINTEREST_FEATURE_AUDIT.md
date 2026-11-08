# REA Analysis & Evidence — Pinterest Embed & Photo Gallery Interaction (`id=630785491580628631`)

- **Target:** `<iframe src="https://assets.pinterest.com/ext/embed.html?id=630785491580628631" height="354" width="450" frameborder="0" scrolling="no"></iframe>`
- **Inspected At:** 2026-11-08
- **REA Tools Executed:**
  1. `capture_browser_scenario` (Pass 1 — network & body capture): `ev_69e64d29473e2653cc1c3347ad76ef982cbdbc7be2e200a97f26d78d854f9a8c`
  2. `capture_browser_scenario` (Pass 2 — extended 256 KiB body limit + rendered DOM, accessibility, screenshot): `ev_d4f3052542116a0b73f970073a653bffb625ee9d379d677d2b21aa1f7a45708f`
  3. `analyze_javascript_application` (Static AST & semantic analysis of extracted scripts): `ev_4c6099adb1880fe237b6e43a0ca9ba73a6d2e7d5c68921f2c25e7d58e0a98bd7` (summary view: `ev_079182d06fd01f5ffda8baa2623a8758c09c5306c5198cf155b0f680454fac78`, module page view: `ev_bd0f34909b1116db0c1db2779749099a6244c28b0b76339fc228f020ec78ba16`)
  4. `export_evidence_bundle`: saved canonical 5-record bundle to `docs/REA_PINTEREST_EMBED_EVIDENCE.json` (15,679,286 bytes)

---

## 1. Captured Artifact Ledger (Observed)

| Transaction / File | URL / Path | Bytes | SHA-256 Digest | Evidence ID |
|---|---|---:|---|---|
| `request-1` (`embed.html`) | `https://assets.pinterest.com/ext/embed.html?id=630785491580628631` | 929 | `121db31dd40b4a29a335017e17d992209e2fcfcc985feb5499dad1f123016414` | `ev_d4f30525...` |
| `request-2` (`embed.js`) | `https://assets.pinterest.com/js/embed.js` | 3,035 | `7b0734f5bb5f4d4ce20fc7fd61ab410e7f4c4302fa17c06995bdf45cd8f5674f` | `ev_d4f30525...` |
| `request-3` (`pinit.js`) | `https://assets.pinterest.com/js/pinit.js` | 361 | `3faadebc89cdb21d11634a032816f152462d1cb8903eb21d0642501fcad065de` | `ev_d4f30525...` |
| `request-6` (`pinit_main.js`) | `https://assets.pinterest.com/js/pinit_main.js?0.769231973736804` | 68,091 | `79e9f1410dfcf6f141bae90a3c3195c275ec390f5d35fce5bcba4b4927a1a7e1` | `ev_d4f30525...` |
| `request-7` (`pin_info_jsonp.js`) | `https://widgets.pinterest.com/v3/pidgets/pins/info/?pin_ids=630785491580628631&sub=www&base_scheme=https&callback=PIN_...` | 3,155 | `50d3f4dd07f80cdc85e631e1ecaf469babc8cf00b8cc66a29ae9b692c7a57417` | `ev_d4f30525...` |
| `request-8` (Video Poster) | `https://i.pinimg.com/videos/thumbnails/originals/7f/69/8f/7f698ff05312039cbf21c84907e761a2.0000000.jpg` | 17,675 | `da25c71e75df85112cfa188cb24040f890c07396aac58a26966678d1b650c5e7` | `ev_d4f30525...` |
| `request-9` (Pin Video MP4) | `https://v1.pinimg.com/videos/mc/720p/7f/69/8f/7f698ff05312039cbf21c84907e761a2.mp4` | 4,948,061 | ETag `"0a02673bb8beaff2bcfca1b93b9986f7"` | `ev_69e64d29...` |
| Rendered DOM (`at_end.dom`) | `embed.html` hydrated DOM snapshot | 65,615 | `ab0e3bf09158ace81d84a069ae8465927c94db3496af5a6f2d741d5ac4f47952` | `ev_d4f30525...` |

---

## 2. Layer 1 Analysis — How the Pinterest Embed Loader Works (Observed)

From `ev_d4f3052542116a0b73f970073a653bffb625ee9d379d677d2b21aa1f7a45708f` (network content + final DOM) and `ev_4c6099adb1880fe237b6e43a0ca9ba73a6d2e7d5c68921f2c25e7d58e0a98bd7` (static AST analysis across 17,021 AST nodes):

1. **Iframe Bootstrap (`embed.html`)**:
   - Declares a strict CSP (`script-src *.pinterest.com *.pinadmin.com; img-src *.pinimg.com *.pinterest.com data:; style-src 'unsafe-inline'`) and `<meta name="referrer" content="no-referrer" />`.
   - Sets `body { background: transparent; text-align: center; height: 100vh; width: 100vw; padding: 0; margin: 0; }` so `embed.js` can measure the iframe viewport dimensions via `document.body.getBoundingClientRect()`.
2. **Anchor Synthesis (`embed.js`)**:
   - On `DOMContentLoaded`, parses `window.location.search` (`?id=630785491580628631`), validates that `id` matches `/^[0-9]*$/`, and measures `body.width`.
   - Because `width > 345` (450 px iframe width, or 1280 px in scenario), it sets `data-pin-width="large"`, creates `<a href="https://www.pinterest.com/pin/630785491580628631" data-pin-do="embedPin" data-pin-width="large">`, appends it to `document.body`, logs a beacon to `log.pinterest.com/?type=pidget&by=embed&event=build&me=embedPin&id=630785491580628631`, and injects `https://assets.pinterest.com/js/pinit.js`.
3. **Widget Hydration (`pinit.js` → `pinit_main.js` → JSONP `v3/pidgets/pins/info/`)**:
   - `pinit.js` creates a daily namespace `PIN_<dayBucket>` and injects `pinit_main.js?<random>`.
   - `pinit_main.js` issues a JSONP request to `widgets.pinterest.com/v3/pidgets/pins/info/?pin_ids=630785491580628631`.
   - The JSONP payload returns Pin `630785491580628631`:
     - **Description:** `"📸Photo gallery interaction design Made in Figma ❤"`
     - **Creator:** `"Manjesh UI Designer"` (`https://www.pinterest.com/manjeshuidesigner/`)
     - **Dominant Color:** `"#171717"`
     - **Video Asset (`V_720P`):** `https://v1.pinimg.com/videos/mc/720p/7f/69/8f/7f698ff05312039cbf21c84907e761a2.mp4` (`1920×1080`, duration `32,216 ms`)
   - `pinit_main.js` replaces the `<a data-pin-do="embedPin">` node with `<span class="PIN_..._embed_pin PIN_..._large PIN_..._hazVideo">` containing a 16:9 `<video preload="auto" loop playsinline>` (`padding-bottom: 55.93%`), play/pause overlay controls, a red `Save` button, and the creator footer.

---

## 3. Layer 2 Analysis — How the Showcased Web Feature ("Photo Gallery Interaction Design") Works (Observed from Video Frames + Inferred Web Mechanics)

Inspection of the 32.2-second 1080p video (`7f698ff05312039cbf21c84907e761a2.mp4`) reveals a **3-state interactive photo gallery** on a dark `#171717` canvas:

### State 1: Curved Panoramic Carousel ("Home" State — `00:01` to `00:10`, `00:29` to `00:31`)
- **Visual Structure (Observed):**
  - Three landscape cards are visible side-by-side across the viewport (`left / previous`, `center / active`, `right / next`) with narrow vertical gutters between them.
  - **Concave Cylindrical Mask:** The top and bottom edges of the entire horizontal photo strip curve inward toward the vertical center — taller at the left and right viewport edges, pinched in the middle — creating a panoramic curved-lens effect across all visible cards.
  - **Vertical Spine Title:** A large uppercase display title (`KATHAK DANCE` → `HAWA MAHAL` → `GOLDEN TEMPLE`) is rotated `-90deg` (reading bottom-to-top) and anchored dead-center over the active middle card (`z-index` above the image).
  - **Bottom Horizontal Ticker:** Along the bottom center, item titles sit in a horizontal row (`TAJ MAHAL` · **`KATHAK DANCE`** · `HAWA MAHAL`). The active center title is full white (`opacity: 1`); the adjacent left and right titles are muted (`opacity: ~0.3`).
- **Transition Mechanics (Observed at `00:05`, `00:08`):**
  - Stepping to the next item slides the horizontal photo track left while the top/bottom concave curve remains stationary in viewport coordinates, making each card smoothly morph in height as it passes under the curve.
  - Simultaneously, the center vertical title slides along the vertical axis and the bottom horizontal ticker shifts left to keep the active label centered.

### State 2: Staggered Detail Gallery (`00:11` to `00:20`, `00:24` to `00:26`)
- **Trigger (Observed at `00:10`):** Clicking the active center card (`GOLDEN TEMPLE`).
- **Visual & Layout Transition (Observed):**
  - A top-center navigation action **`BACK TO HOME`** appears in the header bar; the bottom horizontal ticker fades out.
  - The top and bottom concave curve masks flatten out completely, revealing rectangular photo frames.
  - Cards transition into a **staggered floating strip**: each card is framed smaller with alternating vertical offsets (left card shifted down, center card shifted up, right card shifted down) and a dimmed, offset secondary thumbnail layer peeking from behind each card (`z-index` behind the main photo).
  - The central vertical title (`GOLDEN TEMPLE`) drops **behind** the active center card (`z-index` below the center image), so its leading letters (`GOLD`) extend below the image and trailing letters (`PLE`) extend above it.
  - Horizontal panning (`00:13`–`00:19`) scrolls through the staggered cards while keeping the vertical title anchored on the center axis.

### State 3: Expanded Image Lightbox (`00:21` to `00:23`)
- **Trigger (Observed at `00:20`):** Clicking the active center image in State 2.
- **Visual & Layout Transition (Observed):**
  - The top-center button label changes from `BACK TO HOME` to **`CLOSE IMAGE`**.
  - The active center image scales up into a large centered frame, covering the vertical spine title behind it, while the adjacent left and right cards push outward toward the viewport edges.
  - Clicking **`CLOSE IMAGE`** (`00:23`–`00:24`) scales the center image back down to State 2 (`BACK TO HOME`).
  - Clicking **`BACK TO HOME`** (`00:26`–`00:29`) closes a horizontal elliptical shutter across the stage and re-opens in State 1 (Curved Panoramic Carousel).

---

## 4. Limitations & Unknowns (Preserved per REA Contract)

- **Prototype vs. Shipped DOM (Observation vs. Inference):** The Pinterest embed (`id=630785491580628631`) ships a pre-rendered MP4 video of a Figma prototype (`"📸Photo gallery interaction design Made in Figma ❤"` by Manjesh UI Designer). Therefore, the Pinterest widget loader (`embed.html` → `embed.js` → `pinit.js` → `pinit_main.js`) is directly observed as shipped HTML/JS, whereas the DOM/CSS implementation of the 3-state curved gallery is a clean-room web reconstruction inferred from the observed video frames.
- **REA Runtime Capture Limitations (`ev_69e64d29...`, `ev_d4f30525...`):**
  - Playwright `Response.body()` bytes are API results and do not expose request initiator stacks.
  - The 4.95 MB MP4 stream (`request-9`) remained `response-unfinished` at the 3-second scenario cutoff in REA and was fetched separately for frame inspection.
- **REA Static Analysis Limitations (`ev_4c6099ad...`):**
  - Static AST analysis parsed 4 JS files (17,021 AST nodes) without executing bundle bootstrap code; 2,945 dynamic property/call-flow unknowns in minified `pinit_main.js` remain static candidates.

---

## 5. Implementation Mapping for KIVRA Digital (`#karya` Section)

To replace `#karya` (`07 / Karya pilihan`) in `tes.html` and `style.css` following KIVRA Digital's design system and Ponytail minimal-code rules:

1. **Single Unified DOM Track (`.showcase-track` with 5 `.showcase-card` items):**
   - Uses KIVRA's existing portfolio media (`Hero.mp4` + 4 Shana Studio desktop screens) and palette (`--ink: #1b365d`, `--paper: #ffffff`, `--accent: #373ffd`, `--sky: #60c1e5`).
2. **CSS-Driven 3-State Machine (`data-mode="curve" | "detail" | "zoom"` + `--active` index):**
   - **Concave Lens Curve (`curve` mode):** `.showcase-viewport::before` and `::after` use oversized `border-radius: 50%` ellipses in `var(--ink)` overlapping the top and bottom of `.showcase-track`. In `detail` and `zoom` modes, `transform: scaleY(0)` flattens them smoothly.
   - **Vertical Spine Title (`.showcase-vtitle`):** Centered with `writing-mode: vertical-rl; transform: translate(-50%, -50%) rotate(180deg)`. Sits in front of the center card (`z-index: 4`) in `curve` mode, drops behind it (`z-index: 1`) in `detail` mode so top/bottom letters peek out, and fades (`opacity: 0`) in `zoom` mode.
   - **Staggered Detail & Ghost Layer (`detail` mode):** Cards scale down (`--card-w` narrower, alternating `translateY` offsets) and reveal `.showcase-card::before` (backed by `--card-bg`) offset behind each card.
   - **Bottom Horizontal Ticker (`.showcase-ticker`):** Translates horizontally using `--active` so the active work title stays centered (`opacity: 1`) flanked by previous/next titles (`opacity: 0.32`).
