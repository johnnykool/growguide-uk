import type { IconWeight } from "@phosphor-icons/react";

// One weight for every icon on the site, so a download arrow and a back arrow
// never disagree about how heavy a line should be. Phosphor's "bold" sits
// close to the 1.5px strokes the hand-drawn icons used, and holds up at the
// 16-20px sizes this interface asks for.
export const ICON_WEIGHT: IconWeight = "bold";

// Icons sit beside text far more often than they stand alone here, so they are
// sized from the line they share rather than from a scale of their own.
export const ICON_SIZE_INLINE = 18;
