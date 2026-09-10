#!/usr/bin/env node
/**
 * ============================================================================
 * Generate a treasury wallet — `npm run treasury:new-key`
 * ============================================================================
 *
 * Creates the hot wallet that pays game rewards, writes the private key into
 * `.env.local`, and prints only the address.
 *
 * The key is never printed, never returned, and never passed through an
 * argument. That matters more than it sounds: a key echoed to a terminal ends
 * up in scrollback, in shell history, in a screen recording, and — if an agent
 * ran the command — in a conversation transcript. The only copy should be the
 * one on disk that you deliberately move into a secret manager.
 *
 * Refuses to overwrite an existing key. Replacing a funded wallet's key means
 * losing whatever is in it, so that has to be a deliberate act: clear the line
 * yourself and run this again.
 */

import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { privateKeyToAccount } from "viem/accounts";

const WEB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(WEB_ROOT, ".env.local");

const existing = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
if (/^GAME_TREASURY_PRIVATE_KEY=.+$/m.test(existing)) {
  const account = privateKeyToAccount(
    /^GAME_TREASURY_PRIVATE_KEY=(.+)$/m.exec(existing)[1].trim(),
  );
  console.error(
    `\n\x1b[31m✗ A treasury key already exists in .env.local.\x1b[0m\n\n` +
      `  Its address is ${account.address}\n\n` +
      `  Replacing it abandons anything that wallet holds. If you really mean to,\n` +
      `  move the funds out first, then delete the line and run this again.\n`,
  );
  process.exit(1);
}

const key = `0x${randomBytes(32).toString("hex")}`;
const account = privateKeyToAccount(key);

appendFileSync(
  ENV_PATH,
  `${existing && !existing.endsWith("\n") ? "\n" : ""}` +
    `# Game reward treasury. Generated ${new Date().toISOString()}.\n` +
    `# Hot wallet: fund it like petty cash. Anyone who reads this line can\n` +
    `# move the entire balance. In production this belongs in Secret Manager.\n` +
    `GAME_TREASURY_PRIVATE_KEY=${key}\n`,
);

console.log(`
\x1b[32m✓ Treasury wallet created.\x1b[0m

  Address   ${account.address}

  The private key is in web/.env.local, which is gitignored. It was not
  printed here on purpose — that file is the only copy.

  Next:
    1. Send ETH on Base to that address (about €2 buys thousands of payouts).
    2. Send EURC on Base to the same address.
    3. Back the key up somewhere you would trust with the balance, then put it
       in Secret Manager for production.

  \x1b[33mBase network only.\x1b[0m The same address on Ethereum mainnet will not
  arrive and cannot be recovered.
`);
