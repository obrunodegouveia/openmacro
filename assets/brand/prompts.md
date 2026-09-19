# OpenMacro image-generation prompts

Created with the built-in image_gen tool on 2026-09-19. The final artwork is in this directory. Each edit used the final light icon as its reference, except the light icon itself, which used the initial concept. Production exports were resized to platform dimensions; iOS icons have no alpha, and the tinted export is grayscale. Android uses the logo alpha for its monochrome mask.

## Initial concept

```text
Use case: logo-brand
Asset type: production iOS app icon, one square full-bleed image, 1024 x 1024.
Primary request: Design an exceptional contemporary Apple-friendly app icon for OpenMacro, an open-source app that makes macroeconomics and monetary systems understandable through short lessons. Premium, friendly, intelligent, memorable at tiny sizes.
Design concept: "Open horizon". Create one bespoke bold sculptural emerald mark: a substantial open circular O, its upper-right opening transitioning into three elegantly rising rounded folds / columns. The continuous broad curved left and lower stroke embraces a clean open central counter; the three ascending rounded forms grow naturally out of the lower right arc, subtly evoking an open book and economic flow. The result must read as ONE simple distinctive silhouette, not a collection of icons. Asymmetric visual motion balanced inside the square. Smooth carefully proportioned curves, ample interior negative space.
Palette: rich deep emerald #087F5B through brand mint #2FBF71, with quiet pale mint edge highlights. Background is a nearly white cool porcelain #F7F9FB, opaque and filling the entire square to every edge.
Style: current Apple material sensibility, softly sculpted colored glass with restrained depth, satin translucency, incredibly clean surfaces. Slightly luminous top edge, rich green sides. Front-facing, essentially planar logo with subtle material presence. Editorial precision. Must remain readable as a one-color mark.
Composition: symbol centered, approximately 640 x 640 pixels on the 1024 square, generous clear space, optical balance. Edge-to-edge square background with NO baked rounded-square container, NO frame and NO outside mockup.
Constraints: one final icon only, not a contact sheet or presentation. No typography, no text, no letters beyond the abstract O silhouette, no arrows, no money signs, no coins, no globe, no gradients with purple or blue, no thin details, no sparkle, no lens flare, no ground plane, no heavy cast shadow, no perspective rotation. Crisp professional logo geometry, low complexity.
```

## Final light icon

```text
Use case: precise-object-edit
Asset type: FINAL opaque Apple iOS app icon export.
Use the supplied OpenMacro logo as exact shape reference. Preserve its distinctive open O and three rising curved fingers. Preserve the subtle jade green satin-glass material from this image.
Change the surrounding background to a SOLID OPAQUE porcelain white #F7F9FB. This is a white background image, NOT a transparent cutout. Every pixel outside the green symbol, inside its central hole, and between its rising fingers must be filled with #F7F9FB. Remove the ragged bright green noise and fringe around the symbol by drawing smooth crisp precise green contours against that white.
Recompose onto a 1024 x 1024 full bleed WHITE SQUARE. The symbol is centered and fills exactly the central 660 x 660 region, leaving approximately 182px of whitespace on every side. NO rounded corners, no squircle, no border, no enclosing container, no surrounding mockup. A clean icon image on a continuous flat light background. No cast shadow. No texture. No lettering or words. Low contrast material highlights inside the green, elegant flat front view. Single image only.
```

## Transparent logo

```text
Use case: background-extraction. Production transparent PNG logo for OpenMacro splash screens and in-app branding. Remove ONLY the porcelain white background from the reference image, including the white inside the O and the two white curved channels between the three rising fingers. Preserve the exact green symbol, silhouette, color, surface shading, proportions, position, scale and 1:1 square canvas. Truly transparent background with clean accurate antialiased alpha edges. No green fringe, no stray pixels, no shadows, no checkerboard baked into the pixels. Do not redesign or redraw.
```

## Dark icon

```text
Use case: precise-object-edit. Production DARK iOS icon for OpenMacro. Change ONLY the flat porcelain background in the supplied reference to solid deep forest charcoal #10241E. This includes the central hole and the two channels between the three rising fingers. Keep the green logo's exact geometry, scale, position, proportions, crisp edges and subtle satin glass material. Keep the logo visible and rich emerald with its quiet mint highlights on the dark field. Opaque background filling the entire square, 1024x1024, with no baked rounded corners, no frame, no extra shadows, no text, no textures or additions.
```

## Tinted icon

```text
Use case: precise-object-edit. Asset type: iOS tinted app icon, grayscale PNG.
Input is the FINAL OpenMacro light app icon. Preserve every contour, overall size, position, spacing, and negative space of the exact symbol. Change only colors: render the symbol in a luminous neutral white-to-light-gray material on a solid opaque pure black #000000 full-bleed background. No hue, zero saturation. Maintain subtle interior dimensional shading, with bright clear symbol edges. The result is an Apple tinted icon source which the OS will tint. Full square without rounded corners, no frame, no added shapes, no text. Same exact geometry as reference.
```
