"use client";

import * as React from "react";

/**
 * Smooth scrolling for in-page anchors, and only for those.
 *
 * `html { scroll-behavior: smooth }` used to do this, and it also silently
 * broke every route change on the site — see the comment in globals.css. The
 * behaviour is worth keeping for the marketing page's jump links, so it is
 * reinstated here where it can be scoped to what it was meant for: a link to a
 * fragment of the page you are already on.
 *
 * Delegated from the document rather than wired into each link, because these
 * anchors live in the nav, the footer and the hero, and a rule about how the
 * page scrolls does not belong to any one of them.
 */
export function SmoothAnchors() {
  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      // Leave anything the browser would treat specially alone: new tabs,
      // downloads, middle clicks.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      // Same document, and actually pointing at a fragment. A link to
      // `/#demo` from another page is a real navigation and is not ours.
      const href = anchor.getAttribute("href");
      if (!href?.includes("#")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        // Honour the OS setting: the CSS media query that used to cover this
        // cannot reach a scroll asked for in script.
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      // Keep the address bar and the back button truthful.
      window.history.pushState(null, "", url.hash);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
