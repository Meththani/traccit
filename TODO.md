# CareCircle AI frontend outcomes

## Responsive application shell and navigation
- [ ] Provide a responsive application shell with a persistent desktop sidebar and mobile drawer or bottom navigation.
- [ ] Include a header with care recipient/circle selector, notifications entry, profile menu, and optional help.
- [ ] Include clear labels for all primary sections, active route state, smaller-screen collapse behavior, a global quick action, and page headers with title, context, and one primary action.
- [ ] Keep the UI usable at mobile, tablet, and desktop sizes without horizontal overflow; use large touch targets, readable contrast, keyboard-visible focus, semantic headings, labels, and accessible dialogs or announcements where relevant.

## Dashboard and shared-care overview
- [ ] Show today overview counts for pending, completed, overdue, and upcoming items, with count interactions opening relevant filtered lists.
- [ ] Show upcoming reminders and appointments ordered by time, needs-attention items, task summaries with title/assignee/due time/status, family activity with actor/timestamp, and quick actions for task, appointment, care note, and assistant.
- [ ] Use explicit status text such as Overdue and Awaiting confirmation; include useful empty/loading/error patterns and retry affordances in the presentation.

## Voice assistant and trust-first action flow
- [ ] Provide a large push-to-talk microphone button with idle, recording, processing, and error states, plus a text fallback.
- [ ] Show permission guidance or a microphone-unavailable message, visible transcript with correction affordance, conversation history, and optional read-aloud controls.
- [ ] Show an action preview for writes with task title, assignee, resolved date/time, timezone, and reminder settings.
- [ ] Keep confirmation, edit, and cancel visible for consequential actions; disable duplicate submission while pending.
- [ ] Distinguish clarification, confirmation, processing, saved, and failure states, and only show success after the simulated persistence confirmation.

## Care records: tasks, medications, appointments and notes
- [ ] Show care tasks with title, status, assignee, due date/time, priority, recipient, search, filters, create/edit affordances, clear overdue/unassigned states, and completion/reopen actions.
- [ ] Show medication reminders with recurrence, local time, timezone, responsible caregiver, separate acknowledge/report-completion actions, and explicit scheduled/sent/acknowledged/missed/failed status labels without dose-changing controls.
- [ ] Show appointment list and calendar-oriented date grouping with clinician/clinic, location, date/time, timezone, notes, assigned caregiver, reminder and scheduled/completed/cancelled status.
- [ ] Show chronological care notes with author, timestamp, search/filter affordances, original note content, and visibly labeled AI summary state with source references and review status.
- [ ] Keep form labels, validation affordances, recoverable input state, and submit-in-progress behavior explicit in the UI.

## Family circle, notifications and settings
- [ ] Show current care circle and care recipient, family members with roles and membership status, invitations with pending/accepted/expired status, revocation affordances, and responsibility distribution.
- [ ] Show notifications with event title, timestamp, channel, related record, unread/failed/missed/recent filters, read/acknowledge affordances, and accurate queued/delivered/failed status labels.
- [ ] Show profile, timezone, language, voice preference, notification channels, privacy/consent and sign-out controls.

## Demo readiness and delivery
- [ ] Keep mock data isolated so backend APIs can replace it later without changing the page structure.
- [ ] Serve `/manus-routes.json` with every primary page route and validate the production build.
- [ ] Save the completed frontend as a managed checkpoint after diagnostics and build checks pass.
