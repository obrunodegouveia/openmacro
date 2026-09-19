# OpenMacro — Open Horizon

> Archived first iteration. Production now uses [Satin jade OM](v3/README.md).
> The files and notes below are retained for comparison.

An open O with three ascending folds: open knowledge, economic flows, and
progress through learning. Emerald and mint connect the mark to the app's
existing green palette. Soft material shading gives the icon depth while the
large central opening keeps the silhouette readable at small sizes.

## Assets

| File | Use |
| --- | --- |
| `openmacro-icon-light.png` | 1024 × 1024 opaque sRGB iOS / App Store icon |
| `openmacro-icon-dark.png` | 1024 × 1024 opaque dark iOS appearance |
| `openmacro-icon-tinted.png` | 1024 × 1024 opaque grayscale iOS tinted source |
| `openmacro-mark.png` | 1024 × 1024 transparent logo for splash screens and in-app use |
| `openmacro-android-foreground.png` | 1024 × 1024 transparent adaptive icon with extra safe space |
| `openmacro-android-monochrome.png` | 1024 × 1024 white alpha mask for themed Android icons |
| `openmacro-favicon.png` | 64 × 64 Expo web favicon |

`app.json` selects the iOS appearances and Android adaptive layers. The splash
uses the transparent mark at an image width of 180 on the app's existing
`#F7F9FB` canvas. The mobile learning-path header uses the same mark beside
the live-text product name. Existing legacy asset files are retained but are
no longer referenced by the Expo configuration.

## Usage

- Preserve the square canvas and its built-in breathing room for app icons.
- Do not add rounded corners to production icon PNGs; the operating system
  applies its own mask.
- Keep the mark proportional. Use the product name as separate live text.
- Use the transparent logo for splash screens, rather than a square icon tile.
- The app currently forces a light interface, so its launch background remains
  light. Dark and tinted Home Screen icons are independent of the app theme.

These are static PNG assets with a material-inspired finish, not a native
Icon Composer `.icon` bundle with dynamic Liquid Glass effects.

Icon and native splash changes require a new native build. An OTA update can
update the in-app logo but cannot replace an installed launcher icon or launch
screen. Expo Go and development builds do not fully reproduce release splash
screens; confirm the splash on a release build before publishing.

## Design references and provenance

- [Apple app icon guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Apple Icon Composer](https://developer.apple.com/icon-composer/)
- [Expo SDK 57 icon configuration](https://docs.expo.dev/versions/v57.0.0/config/app/#icon-1)
- [Expo SDK 57 splash screens](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/)

Artwork was created with the built-in image-generation tool. See
[the complete prompts](prompts.md). Production preparation only resizes and
encodes the artwork, ensures the tinted file is grayscale, and exports the
Android alpha mask. No new runtime dependency is needed.
