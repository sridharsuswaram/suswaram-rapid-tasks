@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project

**Suswaram Rapid Tasks** — a voice-first "brain dump" app. The product is not a task manager; it's
a capture tool: press the mic, speak a thought, it auto-saves with no save button, and the user
organizes/schedules it later from the Task Dump screen. v0.1 MVP, owner Sridhar Suswaram
(sridhar@suswaram.com). Sibling project to Momentum and Suswaram Expense Tracker but on a
different stack (Next.js/TypeScript, not Vite/JS) and a different visual identity (soft-shadow
Apple/Notion/Linear look, not the neumorphic style used in those other two apps).

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

No test suite yet. Verify changes with `npm run build` + `npm run lint` (both must be clean) plus
manual browser checks — voice recording specifically needs a real Chrome/Edge window with mic
permission; it cannot be exercised by an automated preview tool.

## Architecture

Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui (`base-nova` style, `@base-ui/react`
primitives — components use a `render` prop for polymorphism, e.g.
`<Button render={<Link href="...">...</Link>} />`, **not** Radix's `asChild`). Firebase (Auth +
Firestore) for the backend. Framer Motion for list/transition animation. No demo/localStorage mode
— a real Firebase project is required from the start (see README for one-time setup).

Originally built on Supabase; migrated to Firebase 2026-07-06 after Sridhar's Supabase account hit
its account-wide free-tier cap (2 free projects, enforced per-account across every org he owns —
not per-org, so a new org doesn't grant a fresh allowance). Firebase's Spark (free) plan has no
project-count cap.

**Single data-access layer**: `src/services/tasksService.ts`. Every screen calls these functions —
never the Firestore SDK directly. `src/hooks/use-tasks.ts` wraps it with a realtime subscription
(`subscribeToTasks`, backed by Firestore `onSnapshot`) so all open tabs/screens stay in sync.
Task documents store dates as plain ISO strings (not Firestore `Timestamp` objects), matching the
`Task` type used everywhere — the migration didn't touch this type or any date-formatting code.

**Auth**: `src/hooks/use-auth.tsx` (`AuthProvider`/`useAuth`) wraps Firebase Auth
(`onAuthStateChanged`/`signInWithEmailAndPassword`/`createUserWithEmailAndPassword`/`signOut`).
Route protection is **client-side**: `src/components/auth-guard.tsx`, mounted in
`src/components/providers.tsx`, redirects based on `useAuth()` + `usePathname()`. There is no
Next.js middleware/proxy file — Firebase Auth state lives in the browser SDK, not a
server-readable cookie, so there's no equivalent to Supabase's `@supabase/ssr` edge helper.

**Reminder architecture** (`src/services/reminders/`): a `NotificationProvider` interface
(`types.ts`) so future channels plug in without touching the engine. `browser-provider.ts` is the
only real implementation (native `Notification` API, gated behind a user-initiated permission
request in Settings). `stub-providers.ts` holds typed-but-unimplemented placeholders for
Email/WhatsApp/Telegram/SMS/Firebase Push. `engine.ts` polls every 30s while the tab is open,
computing each task's next trigger from `reminder_frequency` + `scheduled_date`/`scheduled_time`,
and is mounted globally via `useReminderEngine()` in `src/components/providers.tsx`. There is no
server-side cron — reminders only fire while the app is open in a tab.

**Voice**: `src/hooks/use-voice-recorder.ts` wraps the browser `SpeechRecognition` /
`webkitSpeechRecognition` API (typed in `src/types/speech-recognition.d.ts`, since `lib.dom.d.ts`
ships the result/alternative interfaces but not the recognizer class itself). Home screen
(`src/app/page.tsx`) auto-saves the transcript as a `status: "dump"` task the moment recording
stops — no save button, per the product's core "speed over ceremony" requirement. When
`SpeechRecognition` isn't supported, the screen falls back to a plain textarea.

### Domain logic

- **Statuses**: `dump → scheduled → in_progress → completed`, plus `cancelled`/`archived` as side
  exits. `scheduleTask()` in tasksService flips `dump → scheduled` and sets `is_dump: false`.
- **Reminder frequency**: stored per-task (`none`/`one_time`/offset-before-variants/repeating
  `every_*`/`custom`). `custom` is accepted by the UI and schema but the engine intentionally does
  not fire for it yet (no custom-rule builder in v0.1).
- Colors/labels for status & priority chips live in `src/lib/constants.ts` (`STATUS`, `PRIORITY`
  maps) — add new ones there, not inline in components.

## Design system — soft-shadow, not neumorphic

Deliberately different from Momentum/Expense Tracker's embossed style:

- Page background (`#faf9f7` light / `#101211` dark) and card background (`#f1f2ee` / `#191c19`)
  are **distinct** colors — depth comes from a real soft drop shadow (`.shadow-soft` /
  `.shadow-soft-lg` utility classes in `src/app/globals.css`), not edge lighting.
- Primary = green (`--primary`), Accent = orange (`--brand-orange`), rounded corners throughout
  (`--radius: 1rem`). Dark mode via `next-themes`, toggled in Settings.
- Mic button glow: `.animate-mic-glow` keyframe in `globals.css`. Waveform bars:
  `.animate-waveform-bar`.

## Things that look like bugs but aren't

- shadcn components here use Base UI, not Radix — no `asChild` prop exists; use `render={<Link
  .../>}` instead, and Select's `onValueChange` receives `string | null` (guard with `v && ...`).
- Tailwind v4: no `tailwind.config.js`; theme tokens are CSS variables inside `@theme inline` in
  `globals.css`.
- Firestore composite indexes: `listByStatus`/`listByDate`/`listTasks` each combine a `where` on
  `user_id` with another filter/orderBy — if a query throws a "the query requires an index" error,
  it means `firebase/firestore.indexes.json` wasn't applied; see README step 1.5 for the fix
  (click the link in the error, or `firebase deploy --only firestore:indexes`).
- `getUserId()` in `tasksService.ts` reads `auth.currentUser?.uid` synchronously — it assumes
  `AuthGuard`/`useTasks` already confirmed a signed-in user before calling any service function.
  Don't call tasksService functions before auth state has resolved.
