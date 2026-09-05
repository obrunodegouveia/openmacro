# Cloud sync and Google sign-in

OpenMacro works with no account and no backend — that stays the default. This
guide turns on the optional layer: sign in with Google at **openmacro.org** and
carry your streak and XP between devices.

Everything below is one-time setup in two consoles. Nothing here is secret
except the Google client secret, which never leaves Supabase.

---

## How it fits together

```
                    signed out                     signed in
  progress   ->  AsyncStorage on device   ->   Postgres row, RLS-scoped to you
                             \                        /
                              \___ merged once _____ /
                                   on first sign-in
```

- `EXPO_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` absent → the app never mentions
  accounts. This is what a fresh clone does.
- Both present → the "Continue with Google" strip appears on the learning path.
- Signed in → reads and writes go to your account instead of the device.

The anon key is **safe to ship**. It grants nothing on its own: every table has
row-level security allowing `auth.uid() = user_id` and nothing else.

---

## 1. Create the Supabase project

1. <https://supabase.com/dashboard> → **New project**. Note the region — put it
   near your learners, not near you.
2. **Project Settings → API** gives you two values:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Do **not** copy the `service_role` key. It bypasses row-level security and has
no business in a client app.

## 2. Create the tables

Paste [`supabase/migrations/0001_progress.sql`](../supabase/migrations/0001_progress.sql)
into **SQL Editor → New query** and run it. Or, with the CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Check **Authentication → Policies** afterwards: both `profiles` and
`lesson_progress` should show RLS enabled with one policy each. If RLS is off,
stop — the tables are world-readable.

## 3. Create the Google OAuth client

In <https://console.cloud.google.com/>:

1. Create (or pick) a project.
2. **APIs & Services → OAuth consent screen** — External, fill in the app name,
   support email and developer contact. Scopes `email`, `profile`, `openid` are
   enough; nothing else is requested. While the app is in *Testing* only the
   accounts you list can sign in, so publish it when you are ready for real
   learners.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**,
   type **Web application**.

   **Authorised JavaScript origins**

   ```
   https://openmacro.org
   http://localhost:8081        # expo start --web
   ```

   **Authorised redirect URIs** — this one catches people out. It points at
   *Supabase*, not at openmacro.org. Google returns to Supabase, which then
   returns to your app.

   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

4. Copy the client ID and client secret.

## 4. Connect the two

In the Supabase dashboard:

- **Authentication → Providers → Google**: enable, paste the client ID and
  secret, save. The secret lives here and only here — never in the repo.
- **Authentication → URL Configuration**:

  | Field | Value |
  |-------|-------|
  | Site URL | `https://openmacro.org` |
  | Redirect URLs | `https://openmacro.org/**`, `http://localhost:8081/**`, `openmacro://auth-callback` |

  The `openmacro://` entry is the native app's deep link, matching `scheme` in
  `app.json`. Leave it out and sign-in works on the web but hangs on device.

## 5. Point the app at it

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your anon public key>
```

```bash
npx expo start --clear --web
```

`EXPO_PUBLIC_*` values are inlined at build time, so `--clear` matters and any
change needs a rebuild.

---

## 6. Deploy to openmacro.org

```bash
npx expo export --platform web      # -> dist/
```

`dist/` is a static single-page app. Host it anywhere that can serve static
files, with **one requirement**: unknown paths must fall back to `index.html`,
or a hard refresh on `/lesson/banks-create-deposits` 404s.

Vercel:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Netlify (`_redirects`): `/*  /index.html  200`
Cloudflare Pages: SPA fallback is the default.

GitHub Pages has no rewrite rules at all, so the workaround was a `404.html`
copy of `index.html` — the router takes over once the bundle boots, but the
response still carries a 404 status and crawlers read deep links as missing.
That target is retired: the web course is now the Next.js site at
openmacro.org, which prerenders every lesson as real HTML. Fine for a demo, not for the real
domain: put openmacro.org on a host that can return 200.

Then point `openmacro.org` at the host and make sure the domain matches the
Authorised JavaScript origin and Supabase Site URL exactly — including
`https://` and no trailing slash.

---

## Working offline while signed in

Finishing a lesson never depends on the network. The result is committed to a
device-local mirror, the UI updates immediately, and pushing it to Postgres is
a separate retryable step — the account bar says *"Saved on this device · syncs
when you're back online"* while anything is outstanding.

The queue is a **state, not a log**: rather than recording each write as an
operation to replay, the mirror is marked dirty and the flush reconciles it
with the cloud through the same `mergeSnapshots` used at sign-in. That matters
because the merge is idempotent — replaying an operation log risks
double-counting `completions` when a push half-succeeds, whereas merging maxima
can be retried forever with the same result.

Streak dates are baked in at completion time, not at flush time. A lesson
finished on Monday and synced on Wednesday still credits Monday.

## What happens to progress you made before signing in

The first time you sign in on a device, local progress is merged into the
account, taking the best of each side: higher XP, longer streak, more recent
activity, per-lesson best score and completion count. It runs once per account
per device.

XP takes the **maximum, not the sum**. Summing would double-count the common
case where the local store is just a stale copy of the same account, and
inflating XP is worse than under-crediting a genuinely new device. The rule
lives in `mergeSnapshots` in `src/services/progressRules.ts`.

## What has actually been tested

Being straight about this, because "it compiles" is not "it works":

| | status |
|---|---|
| App runs untouched with no Supabase config | verified |
| Account UI appears only when configured | verified |
| Sign-in builds the right authorize URL | verified — correct endpoint, `provider=google`, `redirect_to` = page origin, `code_challenge` + `code_challenge_method=s256` |
| PKCE verifier persisted locally before redirect | verified |
| Google consent screen, callback, session creation | **not tested** — needs a real project and client |
| Progress reads/writes against Postgres | **not tested** |
| Local → cloud merge on first sign-in | **not tested** end to end |

Everything up to handing off to Supabase is exercised. Everything after it is
code that has never run. Expect to hit at least one allow-list mismatch on the
first real attempt — that is the normal failure, and the error Supabase returns
names the URL it rejected.

The client uses **PKCE**, not the library's default implicit flow, so both web
and native come back with `?code=`. If you switch it to implicit, native
sign-in breaks: a fragment cannot be read back from `openAuthSessionAsync`, and
`exchangeCodeForSession` has nothing to exchange.

## Known limitations

Worth knowing before you rely on this, and all good first contributions:

- **No cross-device conflict resolution.** Two devices used offline in parallel
  will not have their XP added together — the merge takes the higher value. See
  `mergeSnapshots` for why maxima beat sums here.
- **Sync retries are opportunistic**, not push-based: on app start, after each
  completed lesson, and when the app returns to the foreground. There is no
  connectivity listener, so a device that regains signal while sitting idle in
  the foreground waits until the next of those. Adding `expo-network` would
  close that.
- **No account deletion in-app.** "Reset progress" deletes your rows, but the
  `auth.users` record remains; removing it is a dashboard action today.
- **No email or anonymous auth.** Google is the only provider wired up; adding
  another is a few lines in `AuthProvider` plus enabling it in Supabase.
