# OpenMacro — An open system

> This is the approved core identity. The app's icons and splash now use the
> [satin-jade material version](../v3/README.md); its header still uses this wordmark.

The second identity uses two interlocking forms, a circular O, and an m-like
inner counterform. The drawing works in a single ink. Its character comes
from the opposing curves and open cuts, with no gradients or material effects.

The lowercase wordmark is set in Futura Medium with close spacing and exported
as outlines. No font installation is required to use the finished SVG or PNG.

[View the brand proof](preview.html) · [Presentation image](brand-proof.png)

## Palette

| Color | Value | Use |
| --- | --- | --- |
| Pine | `#183D35` | Primary symbol and wordmark |
| Celadon | `#E3EDE5` | Default icon field; reversed mark |
| Night | `#14261F` | Dark icon field |
| White | `#FFFFFF` | Brand canvas and monochrome mark |

## Master artwork

- `openmacro-mark.svg`: scalable symbol with app-icon clear space.
- `openmacro-wordmark.svg`: outlined lowercase wordmark.
- `openmacro-lockup.svg`: horizontal symbol and wordmark together.
- `source.png`: original image-generated drawing, retained as provenance.
- `prompts.md`: the complete built-in imagegen prompt sequence.

The flat symbol was converted to vector paths with Potrace. All production
appearances are rendered from that same vector, keeping the geometry identical.

## Production exports

| File | Use |
| --- | --- |
| `openmacro-icon-light.png` | 1024 × 1024 opaque default iOS / App Store icon |
| `openmacro-icon-dark.png` | 1024 × 1024 opaque dark icon |
| `openmacro-icon-tinted.png` | 1024 × 1024 opaque white-on-black tint source |
| `openmacro-splash.png` | Transparent pine mark, with clear space |
| `openmacro-splash-dark.png` | Transparent celadon mark for future dark surfaces |
| `openmacro-mark.png` | Tightly cropped transparent symbol |
| `openmacro-lockup.png` | 1284 × 208 transparent horizontal logo |
| `openmacro-android-foreground.png` | 1024 × 1024 adaptive foreground |
| `openmacro-android-monochrome.png` | 1024 × 1024 white adaptive mask |
| `openmacro-favicon.png` | 64 × 64 Expo favicon |

Regenerate these exports with `node assets/brand/v2/export.mjs` after installing
the repository dependencies. The script uses the existing Sharp installation.

`app.json` uses this set for the native icons, splash screen, and Expo favicon.
The learning-path header uses the outlined horizontal logo with an accessible
OpenMacro label. The splash remains on the app's existing `#F7F9FB` light canvas
at image width 180. The app currently forces a light interface, so the dark
splash asset is provided but not enabled.

Production icon PNGs are square and opaque. Rounded corners in the proof are
preview masks only; iOS applies the final mask. These assets are static artwork,
not a native `.icon` bundle with animated Liquid Glass effects.

The first identity remains in the parent directory. This update does not
change the course's feedback colors, publish a release, or update store listings.
Native launcher and splash changes require a new build and device verification.

## References

- [Apple app icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Expo SDK 57 icon configuration](https://docs.expo.dev/versions/v57.0.0/config/app/)
- [Expo SDK 57 splash screens](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/)
