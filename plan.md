# CareCircle AI frontend plan

## Implementation approach

Build a self-contained React + TypeScript + Vite SPA with a route-aware shell and realistic mock data. The frontend will demonstrate the full caregiver workflow without requiring a backend: review the day, inspect records, use the voice/text assistant, review a proposed action, confirm it, and see the UI reflect the result. The data layer is intentionally isolated in `src/data.ts` so it can later be replaced by typed API hooks without reworking the presentation layer.

The shell uses a persistent desktop sidebar, responsive mobile navigation, a contextual header, and a global quick-action pattern. Pages are rendered from the URL path with lightweight history navigation so every primary route is directly addressable and can later be swapped for React Router without changing page components.

## Design direction

### Style options

- **Quiet clinical editorial** — 0.08 probability; white panels, blue accents, hospital-like utility.
- **Warm family command center** — 0.06 probability; warm neutrals, soft green trust cues, compact operational cards.
- **Playful care companion** — 0.04 probability; rounded color blocks, illustrated metaphors, more expressive motion.

**Chosen direction: Warm family command center.**

- **Design movement:** editorial operations UI with warm material surfaces and soft utility color blocks.
- **Core principles:** clarity before decoration; important states are named, not color-only; AI suggestions are visually distinct from confirmed records; every screen answers who, what, when, and what happens next.
- **Color philosophy:** an ivory canvas keeps long caregiver sessions gentle; deep ink text carries trust and contrast; a signature mineral teal marks confirmed care coordination; amber and coral are reserved for attention, overdue, and risk.
- **Layout paradigm:** a left rail anchors the circle identity while the content area uses an asymmetric lead card plus stacked, narrow operational panels rather than a centered dashboard grid.
- **Signature elements:** the CareCircle linked-ring mark; a slim teal “trust rail” beside confirmed records; warm tinted status chips with explicit labels.
- **Interaction philosophy:** interactions feel reversible and legible. The assistant progressively exposes transcript, interpretation, confirmation, and saved result instead of jumping from speech to success.
- **Animation:** short 160–220ms ease-out transitions for cards, drawer states, and assistant recording; no looping movement except a restrained recording pulse; respect reduced-motion preferences.
- **Typography system:** Plus Jakarta Sans for UI and headings, with generous line-height and compact uppercase metadata. Strong numeric weight for counts; sentence-case labels for calm readability.
- **Brand essence:** a shared care cockpit for families coordinating the details that keep someone well; reassuring, observant, practical.
- **Brand voice:** direct, warm, quietly confident. Example lines: “Here’s what deserves attention today.” / “Nothing is saved until you confirm it.”
- **Wordmark & logo:** the wordmark pairs a compact linked-ring C mark with a two-line `CareCircle / AI` lockup, making the circle feel like a shared system rather than a single-person assistant.
- **Signature brand color:** mineral teal `#147d78`.

## Structure

- `src/App.tsx` — shell, navigation, route switching, page components, local interaction states.
- `src/data.ts` — typed mock data for the care recipient, tasks, medications, appointments, notes, family and notifications.
- `src/styles.css` — design tokens, responsive layout, component states, accessibility and motion.
- `public/manus-routes.json` — complete page route manifest for the managed preview.
- `app.config.ts` — platform logo metadata.

## Build workflow

1. Install the pinned Vite/React/TypeScript dependencies.
2. Start the Vite server on the managed runtime port (`3000`) bound to `0.0.0.0`.
3. Check the route manifest, run a production build, and inspect the responsive preview for the dashboard and assistant.
4. Fix any actionable diagnostics or build errors.
5. Commit the completed frontend to `main` so the managed project records a checkpoint.
