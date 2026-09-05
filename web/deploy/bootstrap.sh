#!/usr/bin/env bash
# ============================================================================
# One-time project bootstrap
# ============================================================================
# Enables the APIs the deployment needs, creates the Artifact Registry
# repository and the runtime service account. Safe to re-run: every step is
# idempotent and existing resources are left alone.
#
#   ./deploy/bootstrap.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/config.sh
source "${SCRIPT_DIR}/config.sh"

require_gcloud

step "Targeting project ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}" --quiet

step "Enabling required APIs (this can take a couple of minutes)"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  --project "${PROJECT_ID}"

step "Ensuring Artifact Registry repository '${REPOSITORY}' exists in ${REGION}"
if gcloud artifacts repositories describe "${REPOSITORY}" \
     --location "${REGION}" --project "${PROJECT_ID}" >/dev/null 2>&1; then
  echo "Repository already exists — skipping."
else
  gcloud artifacts repositories create "${REPOSITORY}" \
    --repository-format=docker \
    --location "${REGION}" \
    --description "Container images for openmacro.org" \
    --project "${PROJECT_ID}"
fi

step "Ensuring runtime service account '${SERVICE_ACCOUNT_NAME}' exists"
if gcloud iam service-accounts describe "${SERVICE_ACCOUNT}" \
     --project "${PROJECT_ID}" >/dev/null 2>&1; then
  echo "Service account already exists — skipping."
else
  gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" \
    --display-name "OpenMacro web (Cloud Run runtime)" \
    --project "${PROJECT_ID}"
fi

# The site serves public marketing pages and needs no Google Cloud APIs, so it
# gets no project roles at all. Logging and monitoring are granted to the
# revision by Cloud Run itself. Add roles here only when a feature needs one.

step "Configuring Docker auth for ${REGION}-docker.pkg.dev"
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

cat <<SUMMARY

Bootstrap complete.

  Project          ${PROJECT_ID}
  Region           ${REGION}
  Image repo       ${IMAGE}
  Service account  ${SERVICE_ACCOUNT}

Next: ./deploy/deploy.sh
SUMMARY
