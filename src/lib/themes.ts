/**
 * Theme Definitions — Benable Brand Portal
 * Simplified to Benable-only for rapid iteration.
 */

export type ThemeId = "original";

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  subtitle: string;
  inspiration: string;
  animationSpeed: number;
  springStiffness: number;
  springDamping: number;
  hoverLiftPx: number;
  hoverShadowColor: string;
  dark: boolean;
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  original: {
    id: "original",
    label: "Benable",
    subtitle: "The original",
    inspiration: "Current brand",
    animationSpeed: 1,
    springStiffness: 500,
    springDamping: 25,
    hoverLiftPx: 4,
    hoverShadowColor: "rgba(124,58,237,0.12)",
    dark: false,
  },
};

export const themeOrder: ThemeId[] = ["original"];
