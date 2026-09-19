import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Read locally so social cards work during builds and before a deployment exists.
const lockup = readFile(join(process.cwd(), "public/brand/openmacro-lockup-dark.png"))
  .then((bytes) => `data:image/png;base64,${bytes.toString("base64")}`);

export function getBrandImage() {
  return lockup;
}
