#!/usr/bin/env bash
# ============================================================================
# Shared deployment settings for openmacro.org
# ============================================================================
# Sourced by every script in this directory. Override any value from the
# environment, e.g. `REGION=europe-west1 ./deploy/deploy.sh`.

# --- Google Cloud -----------------------------------------------------------
export PROJECT_ID="${PROJECT_ID:-deep-atlas-484612-m0}"

# Cloud Run domain mappings are only available in a subset of regions.
# us-central1 is one of them, and is the cheapest for a low-traffic site.
export REGION="${REGION:-us-central1}"

export SERVICE_NAME="${SERVICE_NAME:-openmacro-web}"

# Artifact Registry (Container Registry is deprecated).
export REPOSITORY="${REPOSITORY:-openmacro}"
export IMAGE_NAME="${IMAGE_NAME:-web}"
export IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}"

# --- Domains ----------------------------------------------------------------
export DOMAIN="${DOMAIN:-openmacro.org}"
export WWW_DOMAIN="${WWW_DOMAIN:-www.openmacro.org}"

# --- Runtime ----------------------------------------------------------------
# Dedicated service account, so the site never runs as the default Compute SA
# (which is over-privileged: it holds project Editor by default).
export SERVICE_ACCOUNT_NAME="${SERVICE_ACCOUNT_NAME:-openmacro-web-run}"
export SERVICE_ACCOUNT="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

export MIN_INSTANCES="${MIN_INSTANCES:-0}"
export MAX_INSTANCES="${MAX_INSTANCES:-10}"
export MEMORY="${MEMORY:-512Mi}"
export CPU="${CPU:-1}"
export CONCURRENCY="${CONCURRENCY:-80}"

# --- Build-time public config ----------------------------------------------
# Inlined into the client bundle by Next.js, so these are set at build time.
export NEXT_PUBLIC_GITHUB_REPO="${NEXT_PUBLIC_GITHUB_REPO:-obrunodegouveia/openmacro}"
export NEXT_PUBLIC_DISCORD_URL="${NEXT_PUBLIC_DISCORD_URL:-https://discord.gg/openmacro}"

# Google OAuth client for openmacro.org. Public by design: a client id names
# the application, and every check that matters is the authorised origin list
# held by Google. A fork should set its own, or leave it empty and get the
# redirect fallback.
export NEXT_PUBLIC_GOOGLE_CLIENT_ID="${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-308779065866-9ri4v6221r7umloq22mnr2nevn41asfj.apps.googleusercontent.com}"

# Supabase project for openmacro.org. Both values are public by design and are
# already served in the client bundle to every visitor: the publishable key
# grants only what row-level security allows, which is "your own rows".
#
# They live here rather than in the deploying shell because they are inlined at
# BUILD time, and a build that cannot see them produces a site with no sign-in
# button, no dashboard and no saved progress — a silent, total loss of the
# account feature that still passes every smoke test. A fork sets its own, or
# clears them and gets a site where lessons play and nothing is stored.
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://wvbgylwducipwpxzcgzh.supabase.co}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-sb_publishable_79IMEg597PKTlukVnPDhhQ_dDG_EHAF}"

# --- Guard rails ------------------------------------------------------------
# Every script runs with these; a failed command must never be ignored.
set -euo pipefail

require_gcloud() {
  if ! command -v gcloud >/dev/null 2>&1; then
    echo "error: gcloud CLI not found. Install it: https://cloud.google.com/sdk/docs/install" >&2
    exit 1
  fi
}

# Refuses to ship a build with no account backend.
#
# `cloudSyncConfigured` in the app is `url && anonKey`, and when it is false
# every piece of account UI is compiled out. Nothing else notices: the pages
# render, the health check passes, and the only symptom is that the sign-in
# button is gone. Deploying that by omission has happened, so it is now an
# error. `ALLOW_NO_ACCOUNTS=1` is the deliberate opt-out for a fork.
require_account_backend() {
  if [[ "${ALLOW_NO_ACCOUNTS:-}" == "1" ]]; then
    echo "note: building with no Supabase project — the site will have no account UI."
    return 0
  fi
  if [[ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" || -z "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" ]]; then
    cat >&2 <<'ERR'
error: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are empty.

This build would ship without sign-in, the dashboard, or saved progress, and
would still pass the smoke test. Set both (deploy/config.sh holds the defaults
for openmacro.org), or pass ALLOW_NO_ACCOUNTS=1 if that is what you want.
ERR
    exit 1
  fi
}

# Prints a section header so long deploys stay readable.
step() {
  printf '\n\033[1;32m==>\033[0m \033[1m%s\033[0m\n' "$1"
}
