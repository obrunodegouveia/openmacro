#!/usr/bin/env bash
# ============================================================================
# Alternative to domain mappings: global external HTTPS load balancer
# ============================================================================
# Use this instead of deploy/setup-domain.sh when you want a single anycast IP,
# Cloud CDN, or Cloud Armor in front of the site — or when Cloud Run domain
# mappings are unavailable in your region.
#
#   ./deploy/setup-load-balancer.sh
#
# Trade-off: a load balancer has a standing cost (roughly $18-25/month) even at
# zero traffic, where domain mappings are free. For a marketing site starting
# out, prefer setup-domain.sh and come back here when traffic justifies it.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=deploy/config.sh
source "${SCRIPT_DIR}/config.sh"

require_gcloud

NEG_NAME="${SERVICE_NAME}-neg"
BACKEND_NAME="${SERVICE_NAME}-backend"
URL_MAP_NAME="${SERVICE_NAME}-urlmap"
HTTPS_PROXY_NAME="${SERVICE_NAME}-https-proxy"
HTTP_PROXY_NAME="${SERVICE_NAME}-http-proxy"
REDIRECT_MAP_NAME="${SERVICE_NAME}-http-redirect"
CERT_NAME="${SERVICE_NAME}-cert"
IP_NAME="${SERVICE_NAME}-ip"

step "Enabling compute API"
gcloud services enable compute.googleapis.com --project "${PROJECT_ID}"

step "Reserving a global static IP"
gcloud compute addresses create "${IP_NAME}" --global --project "${PROJECT_ID}" 2>/dev/null \
  || echo "Address already exists — reusing."
IP_ADDRESS="$(gcloud compute addresses describe "${IP_NAME}" --global \
  --project "${PROJECT_ID}" --format 'value(address)')"

step "Creating the serverless network endpoint group"
gcloud compute network-endpoint-groups create "${NEG_NAME}" \
  --region "${REGION}" \
  --network-endpoint-type serverless \
  --cloud-run-service "${SERVICE_NAME}" \
  --project "${PROJECT_ID}" 2>/dev/null || echo "NEG already exists — reusing."

step "Creating the backend service (Cloud CDN enabled)"
gcloud compute backend-services create "${BACKEND_NAME}" \
  --global \
  --load-balancing-scheme EXTERNAL_MANAGED \
  --enable-cdn \
  --project "${PROJECT_ID}" 2>/dev/null || echo "Backend already exists — reusing."

gcloud compute backend-services add-backend "${BACKEND_NAME}" \
  --global \
  --network-endpoint-group "${NEG_NAME}" \
  --network-endpoint-group-region "${REGION}" \
  --project "${PROJECT_ID}" 2>/dev/null || echo "Backend already attached."

step "Creating the URL map and Google-managed certificate"
gcloud compute url-maps create "${URL_MAP_NAME}" \
  --default-service "${BACKEND_NAME}" \
  --global --project "${PROJECT_ID}" 2>/dev/null || echo "URL map already exists."

gcloud compute ssl-certificates create "${CERT_NAME}" \
  --domains "${DOMAIN},${WWW_DOMAIN}" \
  --global --project "${PROJECT_ID}" 2>/dev/null || echo "Certificate already exists."

gcloud compute target-https-proxies create "${HTTPS_PROXY_NAME}" \
  --url-map "${URL_MAP_NAME}" \
  --ssl-certificates "${CERT_NAME}" \
  --global --project "${PROJECT_ID}" 2>/dev/null || echo "HTTPS proxy already exists."

gcloud compute forwarding-rules create "${SERVICE_NAME}-https-rule" \
  --load-balancing-scheme EXTERNAL_MANAGED \
  --address "${IP_NAME}" \
  --target-https-proxy "${HTTPS_PROXY_NAME}" \
  --ports 443 --global --project "${PROJECT_ID}" 2>/dev/null || echo "HTTPS rule already exists."

step "Adding an HTTP -> HTTPS redirect"
REDIRECT_YAML="$(mktemp)"
cat > "${REDIRECT_YAML}" <<YAML
kind: compute#urlMap
name: ${REDIRECT_MAP_NAME}
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
YAML
gcloud compute url-maps import "${REDIRECT_MAP_NAME}" \
  --source "${REDIRECT_YAML}" --global --quiet --project "${PROJECT_ID}"
rm -f "${REDIRECT_YAML}"

gcloud compute target-http-proxies create "${HTTP_PROXY_NAME}" \
  --url-map "${REDIRECT_MAP_NAME}" \
  --global --project "${PROJECT_ID}" 2>/dev/null || echo "HTTP proxy already exists."

gcloud compute forwarding-rules create "${SERVICE_NAME}-http-rule" \
  --load-balancing-scheme EXTERNAL_MANAGED \
  --address "${IP_NAME}" \
  --target-http-proxy "${HTTP_PROXY_NAME}" \
  --ports 80 --global --project "${PROJECT_ID}" 2>/dev/null || echo "HTTP rule already exists."

cat <<SUMMARY

Load balancer ready. Point DNS at it:

  ${DOMAIN}       A     ${IP_ADDRESS}
  ${WWW_DOMAIN}   A     ${IP_ADDRESS}

The managed certificate stays PROVISIONING until both names resolve to that IP.
Check with:

  gcloud compute ssl-certificates describe ${CERT_NAME} --global \\
    --project ${PROJECT_ID} --format 'value(managed.status, managed.domainStatus)'
SUMMARY
