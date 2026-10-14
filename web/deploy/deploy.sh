#!/usr/bin/env bash
# ============================================================================
# Build and deploy openmacro.org to Cloud Run
# ============================================================================
# Builds the container with Cloud Build (so no local Docker daemon is needed)
# and rolls it out to Cloud Run.
#
#   ./deploy/deploy.sh              # build + deploy
#   ./deploy/deploy.sh --local      # build locally with Docker, then deploy
#
# Set WAITLIST_WEBHOOK_URL / GITHUB_TOKEN in the environment to pass them to
# the service as runtime env vars. Anything genuinely secret belongs in Secret
# Manager — see the note at the bottom of this file.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
# The image is built from the workspace root: the site depends on the
# `packages/core` workspace, which npm cannot install from inside web/.
REPO_ROOT="$(cd "${APP_DIR}/.." && pwd)"
# shellcheck source=deploy/config.sh
source "${SCRIPT_DIR}/config.sh"

require_gcloud
require_account_backend

BUILD_LOCALLY=false
[[ "${1:-}" == "--local" ]] && BUILD_LOCALLY=true

# Tag with the git SHA so a revision can be traced back to a commit. A dirty
# working tree gets a timestamp suffix: without it, two different builds would
# share one tag and the registry would silently lose the earlier image.
TAG="$(git -C "${APP_DIR}" rev-parse --short HEAD 2>/dev/null || echo nogit)"
if [[ -n "$(git -C "${APP_DIR}" status --porcelain 2>/dev/null)" ]]; then
  TAG="${TAG}-dirty-$(date +%Y%m%d-%H%M%S)"
  echo "note: working tree has uncommitted changes — tagging ${TAG}"
fi
IMAGE_TAGGED="${IMAGE}:${TAG}"

step "Building ${IMAGE_TAGGED}"
cd "${REPO_ROOT}"

if [[ "${BUILD_LOCALLY}" == "true" ]]; then
  # --platform matters on Apple Silicon: Cloud Run runs linux/amd64.
  docker build \
    --platform linux/amd64 \
    -f web/Dockerfile \
    --build-arg "NEXT_PUBLIC_GITHUB_REPO=${NEXT_PUBLIC_GITHUB_REPO}" \
    --build-arg "NEXT_PUBLIC_DISCORD_URL=${NEXT_PUBLIC_DISCORD_URL}" \
    --build-arg "NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-}" \
    --build-arg "NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" \
    --build-arg "NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-}" \
    -t "${IMAGE_TAGGED}" -t "${IMAGE}:latest" .
  docker push "${IMAGE_TAGGED}"
  docker push "${IMAGE}:latest"
else
  gcloud builds submit \
    --project "${PROJECT_ID}" \
    --region "${REGION}" \
    --config "web/deploy/cloudbuild.yaml" \
    --substitutions "^|^_IMAGE=${IMAGE}|_TAG=${TAG}|_GITHUB_REPO=${NEXT_PUBLIC_GITHUB_REPO}|_DISCORD_URL=${NEXT_PUBLIC_DISCORD_URL}|_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-}|_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}|_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID:-}" \
    .
fi

step "Deploying to Cloud Run service '${SERVICE_NAME}'"

# Runtime env vars. Only set what is actually present, and merge rather than
# replace (--update-env-vars, not --set-env-vars), so a redeploy never clears a
# value that was configured out of band.
RUNTIME_ENV="NEXT_PUBLIC_GITHUB_REPO=${NEXT_PUBLIC_GITHUB_REPO},NEXT_PUBLIC_DISCORD_URL=${NEXT_PUBLIC_DISCORD_URL}"
[[ -n "${WAITLIST_WEBHOOK_URL:-}" ]] && RUNTIME_ENV="${RUNTIME_ENV},WAITLIST_WEBHOOK_URL=${WAITLIST_WEBHOOK_URL}"

# Rewards (docs/rewards.md). The non-secret settings travel as plain env vars;
# REWARDS_ADMIN_EMAILS is a comma-separated list, so this one value uses a
# custom delimiter (^|^) to keep gcloud from splitting it.
[[ -n "${BASE_RPC_URL:-}" ]] && RUNTIME_ENV="${RUNTIME_ENV},BASE_RPC_URL=${BASE_RPC_URL}"
[[ -n "${REWARD_AMOUNT_DEFAULT:-}" ]] && RUNTIME_ENV="${RUNTIME_ENV},REWARD_AMOUNT_DEFAULT=${REWARD_AMOUNT_DEFAULT}"
[[ -n "${REWARDS_ADMIN_EMAILS:-}" ]] && RUNTIME_ENV="^|^${RUNTIME_ENV//,/|}|REWARDS_ADMIN_EMAILS=${REWARDS_ADMIN_EMAILS}"

# The treasury key and the service-role key are mounted from Secret Manager and
# never passed as plain env vars, which anyone with run.services.get can read.
# Each is wired only if its secret exists, so a fork without rewards deploys
# exactly as before.
RUNTIME_SECRETS=""
for pair in GAME_TREASURY_PRIVATE_KEY:game-treasury-private-key SUPABASE_SERVICE_ROLE_KEY:supabase-service-role-key; do
  name="${pair%%:*}"; secret="${pair#*:}"
  if gcloud secrets describe "${secret}" --project "${PROJECT_ID}" >/dev/null 2>&1; then
    RUNTIME_SECRETS="${RUNTIME_SECRETS:+${RUNTIME_SECRETS},}${name}=${secret}:latest"
    echo "rewards: mounting ${name} from secret '${secret}'"
  else
    # Not fatal — a fork has no treasury — but never silent: without these the
    # site deploys fine and every claim fails at payout time.
    echo "note: secret '${secret}' not found or not readable; ${name} is not mounted and rewards cannot pay." >&2
  fi
done
SECRET_FLAGS=()
[[ -n "${RUNTIME_SECRETS}" ]] && SECRET_FLAGS=(--update-secrets "${RUNTIME_SECRETS}")

gcloud run deploy "${SERVICE_NAME}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --image "${IMAGE_TAGGED}" \
  --platform managed \
  --service-account "${SERVICE_ACCOUNT}" \
  --allow-unauthenticated \
  --port 8080 \
  --cpu "${CPU}" \
  --memory "${MEMORY}" \
  --concurrency "${CONCURRENCY}" \
  --min-instances "${MIN_INSTANCES}" \
  --max-instances "${MAX_INSTANCES}" \
  --timeout 60 \
  --update-env-vars "${RUNTIME_ENV}" \
  ${SECRET_FLAGS[@]+"${SECRET_FLAGS[@]}"} \
  --labels "app=openmacro,component=web"

URL="$(gcloud run services describe "${SERVICE_NAME}" \
  --project "${PROJECT_ID}" --region "${REGION}" \
  --format 'value(status.url)')"

step "Smoke test"
if curl -fsS "${URL}/api/healthz" >/dev/null; then
  echo "Health check passed."
else
  echo "warning: health check did not return 200 — check the logs:" >&2
  echo "  gcloud run services logs read ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID}" >&2
fi

cat <<SUMMARY

Deployed.

  Revision image  ${IMAGE_TAGGED}
  Service URL     ${URL}

Next: ./deploy/setup-domain.sh to bind ${DOMAIN} and ${WWW_DOMAIN}.

Rewards: store the two reward secrets once, then redeploy (see docs/rewards.md):

  printf '%s' "\$GAME_TREASURY_PRIVATE_KEY" | gcloud secrets create game-treasury-private-key --data-file=- --project ${PROJECT_ID}
  printf '%s' "\$SUPABASE_SERVICE_ROLE_KEY" | gcloud secrets create supabase-service-role-key --data-file=- --project ${PROJECT_ID}
  # then, for each: gcloud secrets add-iam-policy-binding <name> \\
  #   --member "serviceAccount:${SERVICE_ACCOUNT}" --role roles/secretmanager.secretAccessor

Secrets: to store the GitHub token (raises the API stats rate limit) properly:

  printf 'ghp_xxx' | gcloud secrets create github-token --data-file=- --project ${PROJECT_ID}
  gcloud secrets add-iam-policy-binding github-token \\
    --member "serviceAccount:${SERVICE_ACCOUNT}" \\
    --role roles/secretmanager.secretAccessor --project ${PROJECT_ID}
  gcloud run services update ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} \\
    --set-secrets GITHUB_TOKEN=github-token:latest
SUMMARY
