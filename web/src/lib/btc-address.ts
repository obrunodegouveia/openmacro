/**
 * Is this a Bitcoin mainnet address, checksum included?
 *
 * Used before a bounty winner's address is saved, so that a typo is caught
 * on their screen rather than by the organiser's wallet days later. The
 * database checks the shape again (migration 0014); the wallet that pays
 * checks it a third time.
 *
 * Accepts native SegWit (bc1q, bech32), Taproot (bc1p, bech32m), and legacy
 * and nested SegWit (1... and 3..., base58check). Rejects testnet.
 */

const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const BECH32_CONST = 1;
const BECH32M_CONST = 0x2bc830a3;

function polymod(values: number[]): number {
  const generator = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const value of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk ^= generator[i]!;
  }
  return chk >>> 0;
}

function hrpExpand(hrp: string): number[] {
  const out: number[] = [];
  for (const c of hrp) out.push(c.charCodeAt(0) >> 5);
  out.push(0);
  for (const c of hrp) out.push(c.charCodeAt(0) & 31);
  return out;
}

function convertBits(data: number[], from: number, to: number): number[] | null {
  let acc = 0;
  let bits = 0;
  const out: number[] = [];
  const max = (1 << to) - 1;
  for (const value of data) {
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >> bits) & max);
    }
  }
  if (bits >= from || ((acc << (to - bits)) & max) !== 0) return null;
  return out;
}

function isSegwitAddress(address: string): boolean {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return false;
  const lower = address.toLowerCase();
  if (lower.length > 90 || !lower.startsWith("bc1")) return false;
  const data: number[] = [];
  for (const c of lower.slice(3)) {
    const index = BECH32_CHARSET.indexOf(c);
    if (index < 0) return false;
    data.push(index);
  }
  if (data.length < 7) return false;
  const version = data[0]!;
  const check = polymod([...hrpExpand("bc"), ...data]);
  if (check !== (version === 0 ? BECH32_CONST : BECH32M_CONST)) return false;
  if (version > 16) return false;
  const program = convertBits(data.slice(1, -6), 5, 8);
  if (!program || program.length < 2 || program.length > 40) return false;
  if (version === 0 && program.length !== 20 && program.length !== 32) return false;
  if (version === 1 && program.length !== 32) return false;
  return true;
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

async function isBase58Address(address: string): Promise<boolean> {
  if (!/^[13][1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) return false;
  let value = 0n;
  for (const c of address) value = value * 58n + BigInt(BASE58.indexOf(c));
  const bytes: number[] = [];
  while (value > 0n) {
    bytes.unshift(Number(value & 0xffn));
    value >>= 8n;
  }
  for (const c of address) {
    if (c !== "1") break;
    bytes.unshift(0);
  }
  if (bytes.length !== 25) return false;
  const version = bytes[0];
  if (version !== 0x00 && version !== 0x05) return false;
  const payload = new Uint8Array(bytes.slice(0, 21));
  const first = await crypto.subtle.digest("SHA-256", payload);
  const second = new Uint8Array(await crypto.subtle.digest("SHA-256", first));
  return bytes.slice(21).every((byte, i) => byte === second[i]);
}

export async function isBitcoinMainnetAddress(input: string): Promise<boolean> {
  const address = input.trim();
  if (/^bc1/i.test(address)) return isSegwitAddress(address);
  return isBase58Address(address);
}
