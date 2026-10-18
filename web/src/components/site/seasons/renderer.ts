"use client";

/**
 * The season renderer and its stylesheet, as one lazily loaded chunk: every
 * `dynamic()` import of a decoration goes through here, so the package's CSS
 * arrives with the code that uses it, and a visitor with the seasons off
 * downloads neither.
 */

import "@openmacro/seasons/web/styles.css";

export * from "@openmacro/seasons/web";
