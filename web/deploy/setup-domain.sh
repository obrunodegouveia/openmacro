#!/usr/bin/env bash
# ============================================================================
# Bind openmacro.org and www.openmacro.org to the Cloud Run service
# ============================================================================
# Creates Cloud Run domain mappings, which provision and renew a Google-managed
# SSL certificate automatically. Prints the exact DNS records to publish.
#
#   ./deploy/setup-domain.sh
#
# PREREQUISITE — domain verification. Google will not map a domain you have not
# proven you own. Verify once, interactively:
#
#   gcloud domains verify openmacro.org
#
# That opens Search Console; add the TXT record it gives you at your registrar,
# confirm, and then re-run this script. Verifying the apex also covers www.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/config.sh
source "${SCRIPT_DIR}/config.sh"

require_gcloud

# Domain mappings live in `gcloud beta run` and are supported in a subset of
# regions. If this errors with "not supported in region", either move the
# service to a supported region or use deploy/setup-load-balancer.sh instead.
map_domain() {
  local domain="$1"

  step "Mapping ${domain} -> ${SERVICE_NAME}"

  if gcloud beta run domain-mappings describe \
       --domain "${domain}" \
       --region "${REGION}" \
       --project "${PROJECT_ID}" >/dev/null 2>&1; then
    echo "Mapping already exists — leaving it alone."
  else
    gcloud beta run domain-mappings create \
      --service "${SERVICE_NAME}" \
      --domain "${domain}" \
      --region "${REGION}" \
      --project "${PROJECT_ID}"
  fi

  echo
  echo "DNS records required for ${domain}:"
  # `--flatten` turns the repeated resourceRecords field into one row per
  # record; without it gcloud prints all values as three parallel lists.
  gcloud beta run domain-mappings describe \
    --domain "${domain}" \
    --region "${REGION}" \
    --project "${PROJECT_ID}" \
    --flatten 'status.resourceRecords[]' \
    --format 'table(status.resourceRecords.name:label=NAME,
                    status.resourceRecords.type:label=TYPE,
                    status.resourceRecords.rrdata:label=VALUE)'
}

step "Checking the service exists"
gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" --project "${PROJECT_ID}" \
  --format 'value(status.url)'

map_domain "${DOMAIN}"
map_domain "${WWW_DOMAIN}"

cat <<'SUMMARY'

Publish the records above at your DNS provider, then wait.

  * The apex (openmacro.org) needs four A records and four AAAA records.
  * www needs a single CNAME to ghs.googlehosted.com.
  * Certificate issuance starts once the records resolve, and usually finishes
    within 15-60 minutes. It can take up to 24 hours.

Watch progress:

  gcloud beta run domain-mappings describe --domain openmacro.org \
    --region "$REGION" --project "$PROJECT_ID" \
    --format='value(status.conditions[].type, status.conditions[].status)'

Then confirm the certificate and redirect:

  curl -sSI https://openmacro.org | head -1
  curl -sSI https://www.openmacro.org | head -1
SUMMARY
