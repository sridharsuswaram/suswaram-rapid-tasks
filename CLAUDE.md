@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project

**Vox** (repo/package/Firebase project/Vercel domain still `suswaram-rapid-tasks` — only the
on-screen brand changed, 2026-07-13) — a voice-first "brain dump" app. The product is not a task
manager; it's a capture tool: press the mic, speak a thought, it auto-saves with no save button,
and the user organizes/schedules it later from the Task Dump screen. v0.1 MVP, owner Sridhar
Suswaram (sridhar@suswaram.com). Sibling project to Momentum and Suswaram Expense Tracker, on a
different stack (Next.js/TypeScript, not Vite/JS), but now sharing their neumorphic visual identity
(see Design system below — this app started with a distinct soft-shadow look, then switched to
match Momentum/Expense Tracker on request). Logo: `src/components/logo.tsx` (mic + soundwave mark,
blue `#1a52b8` / orange `#f97316`), also duplicated as static markup in `src/app/icon.svg` for the
favicon since that file can't use Tailwind classes or dark-mode variants.

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

## Design system — Sridhar's signature neumorphic style

Matches Momentum/Expense Tracker's embossed look (switched from an earlier distinct soft-shadow
theme on request, 2026-07-13):

- Page background and card background are the **exact same colour**: `#eef0f5` light / `#1e2430`
  dark (`--neu-bg` in `globals.css`). Depth comes only from edge-lit box-shadow utility classes —
  `.neu-raised` / `.neu-raised-sm` (raised), `.neu-sunken` / `.neu-sunken-sm` (inputs, pressed/
  active states), `.neu-pressable` (adds the sunken shadow on `:active`). **No borders, no floating
  drop shadows** — every shadcn primitive (Button, Input, Select, Sheet, Dialog, Popover,
  DropdownMenu) was restyled to these classes instead of its default border/ring/shadow-md.
- `--primary` = blue `#1a52b8` light / `#6ea8ff` dark (was green). `--brand-orange` = `#f97316` /
  `#fb923c`, used for the mic's recording state and the logo's soundwave bars. Buttons render
  page-colored with colored text (`neu-raised-sm bg-background text-primary`), not solid fills —
  see `default`/`outline`/`secondary`/`destructive` variants in `button.tsx`.
- Toggled/selected states (filter chips, theme picker, the mic button while recording) use
  `.neu-sunken-sm`/`.neu-sunken` to read as "pressed in," not another raised layer.
- Status/priority chip colors (`STATUS`/`PRIORITY` maps in `lib/constants.ts`) stay distinct hues
  (purple/blue/orange/red/gray) — that's separate from the monochrome card/button chrome. Each
  `TaskCard` also gets a `border-l-4` colored accent stripe (`STATUS[...].accentClass`) matching its
  status, added on request since same-color cards read as monotonous without it.
- Mic button glow: `.animate-mic-glow` keyframe in `globals.css` (pulses an orange ring on top of
  the sunken/pressed shadow while recording). Waveform bars: `.animate-waveform-bar`.

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
