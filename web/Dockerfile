# syntax=docker/dockerfile:1
###############################################################################
# OpenMacro web — production image for Google Cloud Run
#
# Built from the REPOSITORY ROOT, not from web/: the site imports lesson
# content and the grading engine from the `packages/core` workspace, and npm
# has to see the workspace root to install a workspace dependency.
#
# Multi-stage: dependencies and the Next.js build stay in throwaway stages, and
# only the `standalone` server output is copied into the runtime image.
###############################################################################

# --- 1. Dependencies ---------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /repo

# Manifests only, so this layer is rebuilt just when a dependency changes.
# Every workspace's package.json is needed: npm resolves the whole tree even
# when installing one of them.
COPY package.json package-lock.json ./
COPY packages/core/package.json ./packages/core/
COPY web/package.json ./web/

# Scoped to the website. Without --workspace this would also install React
# Native and the rest of the mobile app's tree, which the site never imports.
RUN npm ci --workspace web --include-workspace-root

# --- 2. Build ----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY packages/core ./packages/core
COPY web ./web

# Public (NEXT_PUBLIC_*) values are inlined into the client bundle at build
# time, so they must be present here rather than at deploy time.
ARG NEXT_PUBLIC_GITHUB_REPO
ARG NEXT_PUBLIC_DISCORD_URL
# Supabase: both are public by design — the publishable key grants only what
# row-level security allows. Leave them unset and the site builds without any
# account UI, which is the correct default for a fork.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
# The Google OAuth client id, needed in the browser for in-page sign-in. A
# client id names the app; it authorises nothing on its own.
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GITHUB_REPO=$NEXT_PUBLIC_GITHUB_REPO
ENV NEXT_PUBLIC_DISCORD_URL=$NEXT_PUBLIC_DISCORD_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /repo/web
RUN npm run build

# --- 3. Runtime --------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Cloud Run injects PORT; this default keeps `docker run` working locally.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Never run the server as root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# `outputFileTracingRoot` is the repo root, so the standalone bundle mirrors the
# repository layout: the server lands at web/server.js with node_modules and the
# traced workspace packages beside it.
COPY --from=builder --chown=nextjs:nodejs /repo/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/web/.next/static ./web/.next/static
COPY --from=builder /repo/web/public ./web/public

USER nextjs
EXPOSE 8080

CMD ["node", "web/server.js"]
