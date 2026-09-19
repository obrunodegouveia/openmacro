# OpenMacro — Satin jade

The approved interlocking OM, with soft jade gradients, fine ceramic texture,
shallow relief, and restrained light along its edges. Light mode uses deep
pine on pale celadon. Dark mode lifts the broad faces into sage so the mark
remains legible at Home Screen size. The lowercase wordmark stays flat.

[Interactive proof](preview.html) · [Presentation image](brand-proof.png)

## Production assets

- `openmacro-lockup-light.png` and `openmacro-lockup-dark.png`: native OM icon
  with the outlined lowercase wordmark, for app headers and web branding.
- `openmacro-icon-light.png`: 1024 × 1024 opaque default / App Store image.
- `openmacro-icon-dark.png`: 1024 × 1024 opaque sage-on-pine dark appearance.
- `openmacro-icon-tinted.png`: 1024 × 1024 grayscale material source for tinting.
- `openmacro-splash.png`: 1024 × 1024 transparent material logo with clear space.
- `openmacro-mark.png`: transparent material logo with tighter framing.
- `openmacro-android-foreground.png`: 1024 × 1024 padded adaptive foreground.
- `openmacro-android-monochrome.png`: approved flat silhouette for themed icons.
- `openmacro-favicon.png`: 64 × 64 Expo favicon.

`app.json` selects `OpenMacro.icon` for iOS and the PNGs for splash, Android,
and web. The PNG icon trio remains available as static brand/fallback artwork.
The mobile header, website navigation and footers, social cards, and repository
README use the material icon with the outlined lowercase wordmark. Earlier
iterations and the original vector master remain available as design history.

Run `npm run brand:export` from the repository root to reproduce the header
lockups, website assets, Apple touch icon, PWA icons, vector favicon, and legacy
Expo asset filenames. The website's shared `BrandLogo` component and social-card
helper consume these exports; structured data points to the same current icon.

The iOS icon and native splash ship with the next native build. The website
branding ships with the next web deployment. Existing App Store screenshots in
`assets/store/ios/` are captures of the previous build: regenerate them from the
updated Release app using `npm run shots:ios` before submitting store metadata.

## Native Apple icon

`OpenMacro.icon` is the production Icon Composer bundle, wired into `ios.icon`.
It contains the exact two approved OM vector paths with directional jade fills.
The background is an automatic celadon gradient. Specular lighting is enabled,
shadow opacity is 28%, and blur and translucency are disabled for a solid jade
finish. A lighter sage gradient is specified for Dark; near-white fills in Mono
preserve contrast when the system applies a tint.

`native-layers/` retains the editable SVG inputs and alternate dark SVGs.
The bundle stores the actual Dark and Mono overrides in `icon.json`.
Highlights, shadows, and depth are applied by Apple's renderer, following its
[layered icon workflow](https://developer.apple.com/documentation/xcode/creating-your-app-icon-using-icon-composer).
The static splash and Android artwork retain their fine ceramic texture.

`native-icon-default.png`, `native-icon-Dark.png`,
`native-icon-ClearLight.png`, and `native-icon-TintedDark.png` are 1024 px
preview exports from Apple's bundled `ictool`. They include the rendered system
mask and must not replace the `.icon` production source. The tint preview uses
the renderer's example purple tint; it is not a new brand color.
`native-dark-preview.png` records the document open in Icon Composer.

Apple’s `actool` successfully compiled the bundle for iPhone and iPad, including
fallback PNGs and `Assets.car`. Default, Dark, Clear Light, and Tinted Dark exports
were inspected, with the Mono fill corrected after the first tint check.

## Provenance and verification

The static material artwork was created with the built-in imagegen tool using
the approved v2 icon as reference. [Complete prompts](prompts.md) record the
material render, background extraction, dark rendition, and contrast correction.
Original generated outputs are retained as `material-*-source.png`.

Platform preparation resizes and encodes the images, removes alpha from iOS
icons, exports a grayscale tint source, and normalizes the transparent mark's
clear space. Native gradient layers derive directly from the v2 vector paths.

The native bundle contains unmasked square canvases; Apple applies the mask.
Static fallback icon PNGs also remain square. Launcher icons and native splash screens
require a new native build; they cannot be replaced by an OTA update. Native
device appearance remains to be verified before release.

## Current platform references

- [Apple app icon guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Apple Icon Composer](https://developer.apple.com/icon-composer/)
- [Expo SDK 57 icon configuration](https://docs.expo.dev/versions/v57.0.0/config/app/)
- [Expo SDK 57 splash screens](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/)
