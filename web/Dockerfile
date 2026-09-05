# syntax=docker/dockerfile:1
###############################################################################
# OpenMacro web — production image for Google Cloud Run
#
# Multi-stage: dependencies and the Next.js build stay in throwaway stages, and
# only the `standalone` server output is copied into the runtime image. That
# keeps the deployed image around ~200MB instead of shipping node_modules.
###############################################################################

# --- 1. Dependencies ---------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Copied on their own so this layer is only rebuilt when the lockfile changes.
COPY package.json package-lock.json* ./
RUN npm ci

# --- 2. Build ----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public (NEXT_PUBLIC_*) values are inlined into the client bundle at build
# time, so they must be present here rather than at deploy time.
ARG NEXT_PUBLIC_GITHUB_REPO
ARG NEXT_PUBLIC_DISCORD_URL
ENV NEXT_PUBLIC_GITHUB_REPO=$NEXT_PUBLIC_GITHUB_REPO
ENV NEXT_PUBLIC_DISCORD_URL=$NEXT_PUBLIC_DISCORD_URL

ENV NEXT_TELEMETRY_DISABLED=1
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

COPY --from=builder /app/public ./public
# `standalone` already contains a minimal node_modules and server.js.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]
