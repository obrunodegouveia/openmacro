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
# shellcheck source=deploy/config.sh
source "${SCRIPT_DIR}/config.sh"

require_gcloud

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
cd "${APP_DIR}"

if [[ "${BUILD_LOCALLY}" == "true" ]]; then
  # --platform matters on Apple Silicon: Cloud Run runs linux/amd64.
  docker build \
    --platform linux/amd64 \
    --build-arg "NEXT_PUBLIC_GITHUB_REPO=${NEXT_PUBLIC_GITHUB_REPO}" \
    --build-arg "NEXT_PUBLIC_DISCORD_URL=${NEXT_PUBLIC_DISCORD_URL}" \
    -t "${IMAGE_TAGGED}" -t "${IMAGE}:latest" .
  docker push "${IMAGE_TAGGED}"
  docker push "${IMAGE}:latest"
else
  gcloud builds submit \
    --project "${PROJECT_ID}" \
    --region "${REGION}" \
    --config "${SCRIPT_DIR}/cloudbuild.yaml" \
    --substitutions "_IMAGE=${IMAGE},_TAG=${TAG},_GITHUB_REPO=${NEXT_PUBLIC_GITHUB_REPO},_DISCORD_URL=${NEXT_PUBLIC_DISCORD_URL}" \
    .
fi

step "Deploying to Cloud Run service '${SERVICE_NAME}'"

# Runtime env vars. Only set what is actually present so a redeploy never
# clears a value that was configured out of band.
RUNTIME_ENV="NEXT_PUBLIC_GITHUB_REPO=${NEXT_PUBLIC_GITHUB_REPO},NEXT_PUBLIC_DISCORD_URL=${NEXT_PUBLIC_DISCORD_URL}"
[[ -n "${WAITLIST_WEBHOOK_URL:-}" ]] && RUNTIME_ENV="${RUNTIME_ENV},WAITLIST_WEBHOOK_URL=${WAITLIST_WEBHOOK_URL}"

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
  --set-env-vars "${RUNTIME_ENV}" \
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

Secrets: to store the GitHub token (raises the API stats rate limit) properly:

  printf 'ghp_xxx' | gcloud secrets create github-token --data-file=- --project ${PROJECT_ID}
  gcloud secrets add-iam-policy-binding github-token \\
    --member "serviceAccount:${SERVICE_ACCOUNT}" \\
    --role roles/secretmanager.secretAccessor --project ${PROJECT_ID}
  gcloud run services update ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} \\
    --set-secrets GITHUB_TOKEN=github-token:latest
SUMMARY
