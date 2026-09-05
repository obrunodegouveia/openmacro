"use client";

/**
 * ============================================================================
 * Google Identity Services
 * ============================================================================
 *
 * Signs in without leaving the site.
 *
 * The redirect flow (`signInWithOAuth`) sends the browser to Google with a
 * `redirect_uri` pointing at Supabase, and Google's consent screen shows the
 * host it is redirecting to — so learners were asked to "continue to
 * wvbgylwducipwpxzcgzh.supabase.co", which reads like a phishing page on a
 * site aimed at children.
 *
 * Here the button runs on our own origin and returns an ID token in place,
 * which Supabase verifies. The consent screen names openmacro.org, and three
 * other problems disappear with the redirect:
 *
 *   - no XP handoff needed, because the lesson page never unmounts;
 *   - no PKCE verifier stranded on a different origin when www redirects to
 *     the apex;
 *   - no landing back on whatever page you happened to start from.
 *
 * The redirect flow is kept as a fallback for browsers where this script is
 * blocked.
 */

/**
 * The script URL carries the button's language.
 *
 * `renderButton`'s `locale` option is ignored once a Google account's own
 * language is known, which rendered a Greek button on an English page. `hl` on
 * the script itself is what actually decides it.
 */
function scriptSrc(): string {
  const lang =
    (typeof document !== "undefined" && document.documentElement.lang) || "en";
  return `https://accounts.google.com/gsi/client?hl=${encodeURIComponent(lang)}`;
}

/** Only the fields this module uses. */
interface GoogleIdentity {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        nonce?: string;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }): void;
      renderButton(
        parent: HTMLElement,
        options: {
          type?: "standard" | "icon";
          theme?: "outline" | "filled_blue" | "filled_black";
          size?: "small" | "medium" | "large";
          text?: "signin_with" | "signup_with" | "continue_with";
          shape?: "rectangular" | "pill";
          logo_alignment?: "left" | "center";
          width?: number;
          locale?: string;
        },
      ): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

let loader: Promise<GoogleIdentity> | null = null;

/**
 * Loads the GIS script once per page, whoever asks first.
 *
 * Rejects rather than hanging if the script is blocked — an ad blocker or a
 * strict extension will stop it, and the caller needs to know so it can fall
 * back to the redirect flow instead of showing a button that does nothing.
 */
export function loadGoogleIdentity(): Promise<GoogleIdentity> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Not a browser"));
  }
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (loader) return loader;

  loader = new Promise<GoogleIdentity>((resolve, reject) => {
    const src = scriptSrc();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    const script = existing ?? document.createElement("script");

    const done = () => {
      if (window.google?.accounts?.id) resolve(window.google);
      else reject(new Error("Google Identity Services loaded without the expected API"));
    };

    script.addEventListener("load", done, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Could not load Google Identity Services")),
      { once: true },
    );

    if (!existing) {
      script.src = src;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  // Let a later attempt retry rather than caching the failure forever.
  loader.catch(() => {
    loader = null;
  });

  return loader;
}

/**
 * A nonce pair for the ID token.
 *
 * Google receives the SHA-256 hash and embeds it in the token; Supabase
 * receives the raw value and checks it hashes to what the token carries. That
 * is what stops a token minted for one sign-in being replayed into another.
 */
export async function createNonce(): Promise<{ raw: string; hashed: string }> {
  const raw = crypto.randomUUID();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return { raw, hashed };
}

/** Public by design — a client id identifies the app, it does not authorise it. */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

// ---------------------------------------------------------------------------
// One initialisation per page
// ---------------------------------------------------------------------------

/**
 * `google.accounts.id.initialize` is global, and calling it twice keeps only
 * the last call's configuration — including its nonce. Two sign-in buttons on
 * one page (the hero and the footer, say) therefore produced two nonces, of
 * which one was silently wrong, and the token minted for it would have failed
 * verification.
 *
 * So initialisation happens once, with one nonce, and credentials are
 * broadcast to whoever is listening.
 */

type CredentialListener = (credential: string, nonce: { raw: string; hashed: string }) => void;

const listeners = new Set<CredentialListener>();

/** Subscribe to credentials from any Google button on the page. */
export function onGoogleCredential(listener: CredentialListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let initialised: Promise<GoogleIdentity> | null = null;

export function ensureGoogleInitialized(clientId: string): Promise<GoogleIdentity> {
  if (initialised) return initialised;

  initialised = (async () => {
    const [google, nonce] = await Promise.all([loadGoogleIdentity(), createNonce()]);

    google.accounts.id.initialize({
      client_id: clientId,
      nonce: nonce.hashed,
      // No One Tap: it appears unbidden and is suppressed unpredictably. An
      // explicit button is the honest affordance.
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response) => {
        for (const listener of listeners) listener(response.credential, nonce);
      },
    });

    return google;
  })();

  initialised.catch(() => {
    initialised = null;
  });

  return initialised;
}
