# CLAUDE.md — Reference-Driven Agency Website Recreation

## 1. Project Objective

Build a polished company-profile website for a creative, digital, branding, or interactive agency by recreating the UI reference(s) supplied by the user.

The user's chosen reference is the source of truth. The objective is faithful recreation, not redesign, reinterpretation, simplification, or generic inspiration.

**Do not invent missing details. Do not silently substitute visual or behavioral elements. Do not claim a detail is exact unless it has been verified against the reference.**

The user will provide the reference website URL(s), screenshots, screen recordings, and/or specific instructions. Wait for those materials before making reference-specific design decisions.

## 2. Non-Negotiable Rules

1. **Reference first.** Inspect the supplied source before implementing its design.
2. **No guessing.** Never invent layout dimensions, copy, font, colors, assets, section order, interaction behavior, animation timing, breakpoints, or transitions when they can be inspected or asked about.
3. **Evidence-based implementation.** For every important UI feature, record the available evidence and how it was verified.
4. **Flag uncertainty.** If a detail cannot be observed or measured, add it to `docs/REFERENCE_AUDIT.md` as `UNVERIFIED` and ask the user for the required screenshot, recording, URL, or clarification. Do not quietly approximate it.
5. **No premature coding.** First audit the reference, then establish a section/component inventory and implementation plan. Start implementation only after the available evidence is sufficient or the user explicitly authorizes a documented approximation.
6. **Preserve the reference.** Do not add extra sections, decorative elements, animations, gradients, shadows, rounded corners, or effects that are absent from the reference.
7. **No placeholder content in final UI.** Do not leave lorem ipsum, fake client logos, invented testimonials, fabricated metrics, or arbitrary portfolio content. Ask for supplied content or clearly mark temporary placeholders during development.
8. **No false completion claims.** A feature is complete only after it has been implemented and checked. Distinguish `IMPLEMENTED`, `VISUALLY VERIFIED`, `BEHAVIOR VERIFIED`, and `UNVERIFIED`.
9. **Keep a change log.** Record meaningful deviations, blockers, and decisions in `docs/IMPLEMENTATION_LOG.md`.
10. **Respect intellectual property and access.** Use only assets the user supplies or is authorized to use, or assets whose permitted use is clear. Do not bypass authentication, paywalls, anti-bot controls, or other access restrictions.

## 3. First Response When This File Is Loaded

Before writing UI code:

1. Ask the user to provide the preferred reference URL(s).
2. Ask for any available screenshots or screen recordings, particularly for states that cannot be accessed or inspected reliably.
3. Ask which routes/pages are in scope and whether the recreation should be desktop-only or responsive across desktop, tablet, and mobile.
4. Inspect the existing repository and report its framework, package manager, scripts, current structure, and existing implementation before changing anything.
5. Do not ask the user to repeat details already provided.
6. If the reference URL is supplied, inspect it first. Do not make assumptions based only on its thumbnail, search snippet, or first viewport.

If access to the reference is blocked or a state cannot be reproduced, state exactly what is unavailable and request the smallest useful additional piece of evidence.

## 4. Reference Audit Procedure

Inspect every relevant route and interactive state that the user has included in scope.

### 4.1 Page and section inventory

Record:
- Route and page title.
- Section order and section boundaries.
- Header/navigation structure and sticky behavior.
- Hero layout, headline, supporting text, CTAs, and media.
- Portfolio/work cards, their ordering, aspect ratios, and hover states.
- Services, about, process, clients, testimonials, statistics, contact, and footer sections where present.
- Backgrounds, separators, borders, overlays, and decorative elements.
- Responsive changes at available viewport sizes.

Do not assume the page contains all of these sections. Include only what is observed in the source.

### 4.2 Visual measurements

Where possible, inspect and record:
- Reference viewport dimensions and browser zoom.
- Container width, side margins, grid columns, gaps, and section spacing.
- Typography: font family, weight, size, line-height, letter spacing, line breaks, and text alignment.
- Colors, gradients, borders, radii, shadows, and opacity.
- Image/video source, crop, aspect ratio, object position, and layering.
- Element positions and overlap behavior.

Use browser inspection and computed styles when available. If exact values cannot be accessed, measure from screenshots and mark them as estimates rather than exact values. Ask for a higher-resolution capture when measurement uncertainty materially affects the result.

### 4.3 Interaction and motion audit

Do not infer interaction from appearance alone. Test and record:
- Hover, focus, active, pressed, and disabled states.
- Cursor behavior and magnetic effects.
- Menu open/close behavior.
- Click destinations and CTA actions.
- Scroll-triggered reveals and their trigger positions.
- Pinned sections and horizontal scrolling.
- Parallax, image masks, clipping, text splitting, and stagger order.
- Page transitions, loading sequences, and route changes.
- Video playback, looping, poster images, and loading behavior.
- Reduced-motion behavior, if observable.

For each animation, document:
- Trigger.
- Target elements.
- Start and end states.
- Direction and distance.
- Duration and delay.
- Easing.
- Stagger order.
- Scroll scrub/pin behavior.
- Repeat/loop behavior.
- Mobile differences.

If a value cannot be measured, do not label it exact. Use the closest observable evidence and list the remaining uncertainty.

## 5. Required Documentation

Create and maintain these files:

### `docs/REFERENCE_AUDIT.md`
Include:
- Source URL(s) and date inspected.
- Routes and viewports inspected.
- Section inventory.
- Visual specifications and measured values.
- Interaction/animation inventory.
- Asset inventory and source.
- Evidence for each major decision.
- `VERIFIED`, `PARTIALLY VERIFIED`, or `UNVERIFIED` status.
- Questions that need the user's input.

### `docs/IMPLEMENTATION_PLAN.md`
Include:
- Proposed component tree.
- Route structure.
- Asset mapping.
- Design tokens.
- Animation architecture.
- Responsive strategy.
- Testing plan.
- Dependencies required and why.

### `docs/IMPLEMENTATION_LOG.md`
For each meaningful implementation stage, record:
- Files changed.
- What was implemented.
- Checks performed.
- Differences from the reference.
- Known defects and unresolved uncertainties.

Do not create fabricated audit evidence. These documents must reflect work actually performed.

## 6. Technical Stack

Inspect the existing project first. Preserve a working stack unless there is a documented reason to change it. Do not overwrite or migrate the project without explaining the reason and receiving authorization when the change is substantial.

For a new project, the default recommendation is:
- React + Vite + TypeScript.
- Tailwind CSS for styling, if compatible with the selected setup.
- GSAP + ScrollTrigger for complex timelines and scroll-driven motion.
- Motion for React for component-level interactions, only where useful.
- Lenis for smooth scrolling only if the reference requires it.
- Three.js / React Three Fiber only when the reference demonstrably uses 3D/WebGL or a comparable 3D experience is explicitly requested.
- Lucide React only for icons when they match the reference.
- Playwright for browser verification.

Do not install every library by default. Inspect the reference first, then select the smallest suitable dependency set. Check official documentation for current APIs and version compatibility.

## 7. Asset Fidelity

Create an asset map in `docs/REFERENCE_AUDIT.md`.

For every major image, video, logo, icon, and font, record:
- Element/component using it.
- Original source URL or user-provided file name.
- License/permission status where relevant.
- Whether it is the original asset or a temporary substitute.
- Crop, aspect ratio, and positioning requirements.

Rules:
- Prefer the exact asset supplied by the user or legally available from the source.
- Do not replace a distinctive image with an unrelated stock image.
- Do not recreate a logo using ordinary text if the actual logo asset is available.
- Do not hotlink assets from the source website without checking permission and reliability.
- Do not fabricate client identities, project images, brand marks, or copy.
- If the original asset cannot be obtained, explain the limitation and request an approved asset or explicit permission to use a clearly identified substitute.
- Never claim asset parity when using a substitute.

## 8. Implementation Architecture

- Build reusable components only where they preserve the reference's behavior and styling.
- Keep content, layout, and animation logic reasonably separated.
- Use semantic HTML and accessible controls.
- Preserve the source's content hierarchy and section order.
- Avoid monolithic components and unnecessary dependencies.
- Avoid conflicting animation engines controlling the same CSS properties.
- For GSAP in React, use appropriate cleanup/context patterns so animations and ScrollTriggers are reverted on unmount or reinitialization.
- Avoid layout shifts caused by missing image dimensions, fonts, or media.
- Use responsive image sizes and lazy loading where appropriate.
- Avoid unnecessary global event listeners and expensive per-frame React state updates.
- Respect `prefers-reduced-motion`; provide an appropriate reduced-motion experience without breaking navigation or content access.
- Do not use smooth scrolling or custom cursors in ways that make the page inaccessible or interfere with native browser behavior.

## 9. Responsive Behavior

Do not assume the desktop design can simply be scaled down.

Inspect and document available desktop, tablet, and mobile references. Specifically check:
- Navigation changes.
- Grid column count and ordering.
- Typography scale and line breaks.
- Media crop and aspect ratio.
- Scroll pinning and horizontal interaction.
- Touch alternatives for hover-only interactions.
- Overflow and viewport-height behavior.

If no mobile reference is available, implement a sensible responsive version only after documenting that it is an adaptation, not an exact reproduction. Ask the user if exact mobile parity is required.

## 10. Browser Verification and Quality Assurance

Run the application and verify the actual rendered page in a browser. Use Playwright or available browser tooling when possible.

Minimum checks:
- All in-scope routes load.
- No fatal console errors or failed critical requests.
- No missing assets.
- No horizontal overflow at target viewport sizes unless the reference intentionally uses it.
- Navigation, buttons, links, menus, and interactive cards work.
- Scroll-triggered animations run at the intended positions.
- Animations do not remain stuck after route changes or viewport resizing.
- Mobile and desktop behavior matches the audited specification.
- Reduced-motion preference does not make content inaccessible.
- Loading and layout stability are acceptable.

Capture screenshots at the same viewport dimensions as the reference. Compare the result against the reference section by section. If image comparison tools are available, use them to identify differences. Do not claim pixel-perfect accuracy from a visual glance alone.

After each major section:
1. Run the page.
2. Capture a screenshot.
3. Compare with the reference.
4. Record mismatches.
5. Fix the highest-impact mismatch first.
6. Repeat until the section meets the agreed acceptance criteria.

## 11. Definition of Done

Do not mark the project complete until:
- All agreed routes and sections are implemented.
- All required assets are accounted for.
- All specified interactions and animations have been tested.
- Desktop and agreed responsive viewports have been checked.
- Major visual mismatches have been fixed or explicitly approved by the user.
- Critical console errors and broken links are resolved.
- Remaining deviations and unverified details are documented.
- The user receives a concise summary of files changed, tests run, and remaining limitations.

Use these statuses accurately:
- `NOT STARTED`
- `IMPLEMENTED`
- `VISUALLY VERIFIED`
- `BEHAVIOR VERIFIED`
- `UNVERIFIED`
- `BLOCKED`

## 12. Working Style

- Work in small, reviewable phases.
- Before making broad architectural changes, explain the impact.
- Do not delete existing user work without explicit approval.
- Do not claim to have inspected a website, run a test, or captured a screenshot unless that action actually happened.
- If a tool is unavailable, state the limitation and use the next-best evidence source.
- Ask targeted questions only when the answer materially affects fidelity.
- When blocked by missing reference evidence, pause the affected implementation rather than guessing.
- Keep code readable and maintainable; fidelity does not justify fragile hacks without documenting them.

## 13. Initial Deliverable

Once the user supplies the reference, first deliver:
1. A reference audit.
2. A list of observable sections and interactions.
3. A list of assets that can and cannot be accessed.
4. A list of unresolved questions and uncertainties.
5. A proposed component/animation plan.
6. A verification plan.

Then wait for user approval before large-scale implementation if significant uncertainties remain. If the user explicitly authorizes proceeding with documented approximations, clearly label those areas and do not present them as exact.
