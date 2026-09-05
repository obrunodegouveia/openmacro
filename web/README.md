# openmacro.org

The public website for **OpenMacro** — the open-source, gamified platform
teaching macroeconomics, central banking and credit creation.

It is the manifesto, the playable demo, the contributor hub and the App Store
waitlist, in one page.

> The OpenMacro **mobile app** lives in the repository root (Expo / React
> Native). This directory is the marketing site and is deployed independently.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Animation | Motion (Framer Motion's current package) |
| Components | Radix primitives + local `src/components/ui` |
| Icons | Lucide, plus a local GitHub mark |
| Hosting | Cloud Run (containerised), project `deep-atlas-484612-m0` |

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Optional configuration lives in `.env.example`; copy it to `.env.local`. The
site runs fully without any of it.

```bash
npm run build        # production build (also type-checks)
npm run lint
npx tsc --noEmit
```

## How it is put together

```
src/
  app/
    page.tsx                 Composes the sections; ships JSON-LD for SEO
    layout.tsx               Fonts, metadata, viewport
    globals.css              The design system: colour tokens, glass, motion
    privacy/page.tsx         Privacy + COPPA notice
    opengraph-image.tsx      Social card, rendered by Satori
    api/waitlist/route.ts    Waitlist signups
    api/healthz/route.ts     Cloud Run liveness probe
  components/
    site/                    One file per page section
    ui/                      Button, Card, Badge, Slider, Section, ...
  lib/
    economics.ts             Money-multiplier maths (mirrors the app)
    curriculum.ts            Roadmap data + the sample lesson JSON
    github.ts                Cached repo stats
    site.ts                  Links and shared copy
```

Two things are worth knowing before editing:

**The simulator's maths is a mirror.** `src/lib/economics.ts` reimplements the
formulas the app registers in `../src/content/formulas.ts` so the site can be
deployed on its own. The numbers a visitor sees here must match the numbers a
learner sees in the app — change both together.

**Colours live in one place.** `globals.css` defines every colour as a
Tailwind v4 `@theme` token. Components reference tokens (`text-mint-bright`,
`bg-surface`), never raw hex.

## The waitlist

`POST /api/waitlist` validates the address, drops obvious bots via a honeypot,
rate-limits per IP, and then writes the signup to stdout as structured JSON —
which Cloud Run forwards to Cloud Logging. Set `WAITLIST_WEBHOOK_URL` to also
forward each signup to a mailing provider.

Signups are personal data and some come from parents signing up for a child.
Keep retention short and honour deletion requests — see `/privacy`.

## Deploying

Everything is in `deploy/`. Settings live in `deploy/config.sh` and every value
can be overridden from the environment.

```bash
./deploy/bootstrap.sh        # once per project: APIs, registry, service account
./deploy/deploy.sh           # build with Cloud Build + roll out to Cloud Run
./deploy/setup-domain.sh     # map openmacro.org and www, with managed SSL
```

`deploy/deploy.sh --local` builds with a local Docker daemon instead of Cloud
Build. `deploy/setup-load-balancer.sh` is the alternative path when you want a
single anycast IP, Cloud CDN or Cloud Armor in front of the service.

### Binding the domain, step by step

1. **Verify ownership once.** Google refuses to map an unverified domain.

   ```bash
   gcloud domains verify openmacro.org
   ```

   This opens Search Console. Publish the TXT record it gives you at your
   registrar and confirm. Verifying the apex covers `www` too.

2. **Create the mappings.**

   ```bash
   ./deploy/setup-domain.sh
   ```

   which runs, for each name:

   ```bash
   gcloud beta run domain-mappings create \
     --service openmacro-web \
     --domain openmacro.org \
     --region us-central1 \
     --project deep-atlas-484612-m0
   ```

3. **Publish the DNS records it prints.** The apex needs four `A` records and
   four `AAAA` records; `www` needs one `CNAME` to `ghs.googlehosted.com`.

4. **Wait for the certificate.** Google provisions and renews it automatically
   once DNS resolves — usually 15–60 minutes, occasionally up to 24 hours.

   ```bash
   gcloud beta run domain-mappings describe --domain openmacro.org \
     --region us-central1 --project deep-atlas-484612-m0 \
     --format='value(status.conditions[].type, status.conditions[].status)'
   ```

5. **Confirm.**

   ```bash
   curl -sSI https://openmacro.org | head -1
   curl -sSI https://www.openmacro.org | head -1
   ```

### Operating

```bash
# Logs (waitlist signups appear here as structured JSON)
gcloud run services logs read openmacro-web --region us-central1 \
  --project deep-atlas-484612-m0

# Roll back to the previous revision
gcloud run services update-traffic openmacro-web --region us-central1 \
  --project deep-atlas-484612-m0 --to-revisions PREVIOUS_REVISION=100
```

The service scales to zero by default (`MIN_INSTANCES=0`), which costs nothing
at idle in exchange for an occasional cold start. Set `MIN_INSTANCES=1` in
`deploy/config.sh` to keep one warm.

## Licence

MIT, same as the rest of OpenMacro.
