/**
 * ============================================================================
 * App Store Connect API client
 * ============================================================================
 *
 * The minimum needed to read and write the parts of a submission that live
 * only on Apple's servers. Everything in `store.config.json` is pushed by
 * `eas metadata:push` and needs none of this — but three things a submission
 * cannot go without are not in that file at all:
 *
 *   - screenshots, which are binaries uploaded in three steps
 *   - the App Privacy questionnaire, which `eas metadata` does not model
 *   - whether any of it actually landed
 *
 * Credentials are read from the `submit.production.ios` block of `eas.json`,
 * so there is one place that knows which key and which app this is, and it is
 * the same place `eas submit` reads.
 *
 * ---------------------------------------------------------------------------
 * WHY THE JWT IS SIGNED HERE RATHER THAN WITH A LIBRARY
 * ---------------------------------------------------------------------------
 *
 * Apple wants ES256, and the only awkward part is that `crypto.sign` defaults
 * to DER-encoded ECDSA signatures while JWS requires the raw r‖s pair. Node
 * does the conversion itself given `dsaEncoding: 'ieee-p1363'`, which turns
 * the whole thing into fifteen lines and removes a dependency that would have
 * to be audited for something holding a key to the App Store account.
 */

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://api.appstoreconnect.apple.com';

/** The `submit.production.ios` block, which names the key and the app. */
export function credentials() {
  const eas = JSON.parse(readFileSync(join(ROOT, 'eas.json'), 'utf8'));
  const ios = eas.submit?.production?.ios;
  if (!ios) throw new Error('eas.json has no submit.production.ios block.');
  for (const key of ['ascApiKeyPath', 'ascApiKeyId', 'ascApiKeyIssuerId', 'ascAppId']) {
    if (!ios[key]) throw new Error(`eas.json submit.production.ios.${key} is missing.`);
  }
  return {
    appId: ios.ascAppId,
    keyId: ios.ascApiKeyId,
    issuerId: ios.ascApiKeyIssuerId,
    keyPath: join(ROOT, ios.ascApiKeyPath),
  };
}

const base64url = (input) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/**
 * A bearer token for the App Store Connect API.
 *
 * Twenty minutes, which is Apple's ceiling for a token scoped to all of
 * `appstoreconnect-v1`. A longer `exp` is rejected outright rather than
 * clamped, which is a confusing 401 to debug.
 */
export function token({ keyId, issuerId, keyPath } = credentials()) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'ES256', kid: keyId, typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({ iss: issuerId, iat: now, exp: now + 20 * 60, aud: 'appstoreconnect-v1' }),
  );
  const signer = createSign('SHA256');
  signer.update(`${header}.${payload}`);
  const signature = signer.sign(
    { key: readFileSync(keyPath, 'utf8'), dsaEncoding: 'ieee-p1363' },
    'base64url',
  );
  return `${header}.${payload}.${signature}`;
}

/**
 * One API call. Returns the parsed body; throws with Apple's own error detail,
 * which is far more useful than the status code on its own.
 *
 * `path` may be a full URL — paginated responses hand back absolute `next`
 * links, and following them should not need string surgery.
 */
export async function api(path, { method = 'GET', body, bearer } = {}) {
  const auth = bearer ?? token();
  const response = await fetch(path.startsWith('http') ? path : `${BASE}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${auth}`,
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204 || response.headers.get('content-length') === '0') return null;

  const text = await response.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    /* Apple occasionally answers with HTML; the raw text is the better error. */
  }

  if (!response.ok) {
    const detail =
      parsed?.errors?.map((e) => `${e.title}: ${e.detail}`).join('; ') || text.slice(0, 400);
    throw new Error(`${method} ${path} → ${response.status}\n  ${detail}`);
  }
  return parsed;
}

/** Every page of a collection, flattened. */
export async function all(path, bearer) {
  const out = [];
  let next = path;
  while (next) {
    const page = await api(next, { bearer });
    out.push(...(page?.data ?? []));
    next = page?.links?.next ?? null;
  }
  return out;
}

/**
 * The version currently being prepared, or the most recent one.
 *
 * Metadata attaches to a version rather than to the app, so nearly every read
 * below needs this first.
 */
export async function editableVersion(appId, bearer) {
  const versions = await all(
    `/v1/apps/${appId}/appStoreVersions?limit=10&fields[appStoreVersions]=versionString,appStoreState,platform`,
    bearer,
  );
  const editable = versions.find((v) =>
    ['PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'].includes(
      v.attributes.appStoreState,
    ),
  );
  return editable ?? versions[0] ?? null;
}
