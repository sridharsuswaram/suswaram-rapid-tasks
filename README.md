# Vox

Speak it. We'll remember. Organize later.

_Product name: **Vox**. Repo, npm package, Firebase project, and Vercel domain remain
`suswaram-rapid-tasks` — only the on-screen branding changed._

A voice-first brain dump app: press the mic, say your thought, it's saved instantly with no
save button. Organize it into a schedule whenever you get a moment.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion + Firebase
(Auth, Firestore) + the browser's native Web Speech API for voice-to-text.

## Project structure

```
src/
  app/            Routes: / (home/mic), /dump, /today, /calendar, /task/[id], /settings, /login, /signup
  components/      ui/ (shadcn primitives), home/, tasks/, layout/, search/, filters/, auth-guard.tsx
  hooks/          useAuth, useTasks, useVoiceRecorder, useVoiceLanguage, useReminderEngine
  services/       tasksService.ts (single data-access layer), exportService.ts, importService.ts,
                  reminders/ (notification provider abstraction + polling engine), firebase/ (client)
  lib/            constants.ts, utils.ts
  types/          task.ts, speech-recognition.d.ts
firebase/
  firestore.rules     Paste into Firebase Console > Firestore Database > Rules
  firestore.indexes.json   Composite indexes the app's queries need (manual-creation fallback below)
```

`src/services/tasksService.ts` is the single data access layer — every screen calls these
functions, never the Firebase SDK directly. Route protection (`src/components/auth-guard.tsx`) runs
client-side, since Firebase Auth state lives in the browser SDK rather than a server-readable cookie.

## 1. Set up Firebase

1. Create a project at the [Firebase console](https://console.firebase.google.com/) (Spark/free
   plan is enough — no billing account required).
2. **Authentication → Sign-in method** → enable the **Email/Password** provider.
3. **Firestore Database** → **Create database** → start in **production mode** (any region).
4. Still in Firestore, open the **Rules** tab, replace the contents with the entire contents of
   [`firebase/firestore.rules`](firebase/firestore.rules), and **Publish**. This scopes every task
   document to `request.auth.uid == resource.data.user_id`, so users can only ever read/write their
   own tasks.
5. Composite index (required): every screen fetches tasks through the single `listTasks()` query
   (`where user_id ==` + `orderBy created_at desc`), which needs one composite index. In Firestore
   → **Indexes** tab → **Add index**: Collection ID `tasks`, fields `user_id` (Ascending) then
   `created_at` (Descending), scope **Collection**. Wait ~1 minute for it to go from "Building" to
   "Enabled". Without this, list screens (Task Dump, Today, Calendar) will silently show no tasks
   even though they saved correctly — the app doesn't yet surface this error on screen (see
   `use-tasks.ts`), so check the browser console for a "query requires an index" error if that
   happens.
   `firebase/firestore.indexes.json` also declares 2 more composite indexes for `listByStatus`/
   `listByDate` in `tasksService.ts` — those aren't called by any current screen (everything
   filters client-side after the one `listTasks()` fetch), so they're only needed if a future
   screen queries Firestore that way directly. (If you have the Firebase CLI,
   `firebase deploy --only firestore:indexes` applies the whole file at once instead of doing this
   by hand.)
6. **Project Settings → General → Your apps** → add a **Web app** (the `</>` icon) → copy the
   `firebaseConfig` values shown.
7. Copy `.env.example` to `.env.local` and paste those values in:

   ```bash
   cp .env.example .env.local
   ```

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

## 2. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. You'll land on `/login` until you sign up for an account (Firebase
Auth, email + password) — from there you're redirected to the mic home screen.

Voice input uses the browser's native `SpeechRecognition` API — it works in Chrome and Edge over
`https://` or `localhost`. Safari/Firefox support is inconsistent; when unsupported, the home
screen falls back to a plain text box so the "dump a thought" flow still works everywhere.

## Other commands

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Reminder architecture

`src/services/reminders/` is a small provider abstraction so future notification channels don't
require touching the engine or any screen:

- `types.ts` — `NotificationProvider` interface (`send(message)`) and `ReminderEngine` interface.
- `browser-provider.ts` — the one **working** implementation today, using the native `Notification`
  Web API. Turn it on from Settings → Browser reminders (requires a one-time permission prompt).
- `stub-providers.ts` — typed placeholders for Email, WhatsApp, Telegram, SMS, and Firebase Push.
  They're wired into the interface but intentionally unimplemented in this v0.1.
- `engine.ts` — polls every 30s while the app is open, computing each scheduled task's next
  reminder time from its `reminder_frequency` and firing through every available provider.

This only fires while a browser tab is open — there's no server-side cron yet. The `last_reminded`
column and the provider interface are what a future queue/cron worker would build on.

## Deploying to Vercel

1. Push this repo to GitHub (or another Git provider Vercel supports).
2. In the [Vercel dashboard](https://vercel.com/new), import the repository. Vercel auto-detects
   Next.js — no build command changes needed.
3. Under **Settings → Environment Variables**, add the same six `NEXT_PUBLIC_FIREBASE_*` variables
   from `.env.local`.
4. Deploy. Every push to the connected branch redeploys automatically.
5. In the Firebase console → **Authentication → Settings → Authorized domains**, add your Vercel
   domain so email/password auth works from production.

## What's intentionally not built (v0.1 scope)

Per the product brief, this MVP stops short of: AI-anything (categorization, priorities,
summaries), calendar/reminders integrations (Google/Outlook/Apple/WhatsApp/Telegram/email),
recurring tasks, dashboards/analytics, offline mode/PWA, and native apps. The reminder provider
interface above is deliberately shaped so those channels can be added later without a rewrite.
