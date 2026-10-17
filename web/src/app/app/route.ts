import type { NextRequest } from "next/server";

import { APP_STORE_URL, PLAY_STORE_LIVE, PLAY_STORE_URL } from "@/lib/site";
import { LOCALE_HEADER } from "@/middleware";

/**
 * `/app` — one link that opens the right store.
 *
 * It is what the QR code on the home page encodes, and the link to share when
 * you do not know which phone the other person has. An iPhone or iPad goes to
 * the App Store and an Android phone to Google Play; everyone else, and Android
 * until the Play listing is live, lands on the home page's "Get the app"
 * section, in their language.
 *
 * A 302, not a 301: where Android goes changes the day `PLAY_STORE_LIVE` flips,
 * and a permanent redirect would be cached past that day.
 */
export function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const portuguese = request.headers.get(LOCALE_HEADER) === "pt-PT";
  const fallback = new URL(portuguese ? "/pt#app" : "/#app", request.nextUrl.origin);

  const target = /iPhone|iPad|iPod/i.test(userAgent)
    ? APP_STORE_URL
    : /Android/i.test(userAgent) && PLAY_STORE_LIVE
      ? PLAY_STORE_URL
      : fallback.toString();

  return Response.redirect(target, 302);
}
