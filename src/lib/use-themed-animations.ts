/**
 * Hook that returns all themed animation variants for the current theme.
 * Use this to get theme-aware animations in any component.
 */
import { useMemo } from "react";
import { useTheme } from "./theme-context";
import {
  themedPageVariants,
  themedStaggerContainer,
  themedStaggerItem,
  themedCardHover,
  themedButtonTap,
  themedCheckPop,
  themedBlobFloat,
  themedPulseRing,
} from "./animations";

export function useThemedAnimations() {
  const { theme } = useTheme();

  return useMemo(
    () => ({
      pageVariants: themedPageVariants(theme),
      staggerContainer: themedStaggerContainer(theme),
      staggerContainerSlow: {
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1 * theme.animationSpeed,
            delayChildren: 0.15 * theme.animationSpeed,
          },
        },
      },
      staggerItem: themedStaggerItem(theme),
      cardHover: themedCardHover(theme),
      buttonTap: themedButtonTap(theme),
      checkPop: themedCheckPop(theme),
      pulseRing: themedPulseRing(theme),
      blobFloat: (delay: number = 0) => themedBlobFloat(theme, delay),
      theme,
    }),
    [theme]
  );
}
