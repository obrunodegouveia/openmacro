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
export NEXT_PUBLIC_GITHUB_REPO="${NEXT_PUBLIC_GITHUB_REPO:-openmacro/openmacro}"
export NEXT_PUBLIC_DISCORD_URL="${NEXT_PUBLIC_DISCORD_URL:-https://discord.gg/openmacro}"

# --- Guard rails ------------------------------------------------------------
# Every script runs with these; a failed command must never be ignored.
set -euo pipefail

require_gcloud() {
  if ! command -v gcloud >/dev/null 2>&1; then
    echo "error: gcloud CLI not found. Install it: https://cloud.google.com/sdk/docs/install" >&2
    exit 1
  fi
}

# Prints a section header so long deploys stay readable.
step() {
  printf '\n\033[1;32m==>\033[0m \033[1m%s\033[0m\n' "$1"
}
