/**
 * Shared animation variants for Framer Motion — THEME AWARE
 * Inspired by: Airbnb (smooth reveals), Duolingo (playful bounces),
 * mymind (elegant stagger), Linear (precision easing)
 *
 * Base presets remain exported for backward-compat; themed overrides via useThemedAnimations()
 */
import type { Variants, Transition } from "framer-motion";
import type { ThemeDefinition } from "./themes";

type Easing4 = [number, number, number, number];

// ─── Easing curves ───
export const ease = {
  out: [0.22, 1, 0.36, 1] as Easing4,
  spring: [0.34, 1.56, 0.64, 1] as Easing4,
  precision: [0.4, 0, 0.2, 1] as Easing4,
  enter: [0, 0, 0.2, 1] as Easing4,
};

// ─── Page / Step transitions ───
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: ease.precision } },
};

// ─── Staggered container (cards, lists) ───
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

// ─── Individual stagger items ───
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: ease.out } as Transition,
  },
};

export const staggerItemFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: ease.out } as Transition,
  },
};

// ─── Fade-in scale (for badges, tooltips, popovers) ───
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: ease.spring } as Transition,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15 } as Transition,
  },
};

// ─── Hover card lift (creator cards, campaign rows) ───
export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    transition: { duration: 0.25, ease: ease.precision } as Transition,
  },
  hover: {
    y: -4,
    boxShadow: "0 12px 32px rgba(124,58,237,0.12), 0 4px 12px rgba(0,0,0,0.06)",
    transition: { duration: 0.25, ease: ease.precision } as Transition,
  },
};

// ─── Button press ───
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 } as Transition,
};

// ─── Checkmark pop (select/deselect) ───
export const checkPop = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 25 },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ─── Progress bar fill ───
export const progressFill = (widthPercent: number) => ({
  initial: { width: "0%" },
  animate: {
    width: `${widthPercent}%`,
    transition: { duration: 0.8, ease: ease.out, delay: 0.2 } as Transition,
  },
});

// ─── Notification / alert slide-in ───
export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: ease.out } as Transition,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 } as Transition,
  },
};

// ─── Hero blob floating (enhanced) ───
export const blobFloat = (delay: number = 0) => ({
  animate: {
    y: [0, -12, 0],
    x: [0, 6, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: [0.45, 0.05, 0.55, 0.95] as Easing4,
      delay,
    } as Transition,
  },
});

// ─── Counter / number animation helper ───
export const numberRoll: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.out } as Transition,
  },
};

// ─── Step indicator line fill ───
export const stepLineFill: Variants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 0.5, ease: ease.out } as Transition,
  },
};

// ─── AI matching pulse ring ───
export const pulseRing = {
  animate: {
    scale: [1, 1.8, 2.5],
    opacity: [0.6, 0.3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.0, 0.0, 0.58, 1.0] as Easing4,
    } as Transition,
  },
};

// ─── Favorite star bounce ───
export const starBounce = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.4, 0.9, 1.1, 1],
    rotate: [0, -15, 10, -5, 0],
    transition: { duration: 0.5, ease: ease.spring } as Transition,
  },
};

// ─── Success confetti-like burst (for completion) ───
export const successBurst = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.6, ease: ease.spring } as Transition,
  },
};

/* ═══════════════════════════════════════════════════════════
   THEME-AWARE ANIMATION FACTORY
   Each theme gets unique animation timing, springs, and motion style
   ═══════════════════════════════════════════════════════════ */

export function themedPageVariants(t: ThemeDefinition): Variants {
  const s = t.animationSpeed;
  return {
    initial: { opacity: 0, y: 12, scale: 1 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45 * s, ease: ease.out },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 1,
      transition: { duration: 0.25 * s, ease: ease.precision },
    },
  };
}

export function themedStaggerContainer(t: ThemeDefinition): Variants {
  const s = t.animationSpeed;
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.06 * s,
        delayChildren: 0.1 * s,
      },
    },
  };
}

export function themedStaggerItem(t: ThemeDefinition): Variants {
  const s = t.animationSpeed;
  return {
    initial: { opacity: 0, y: 16, scale: 0.97 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.4 * s, ease: ease.out } as Transition,
    },
  };
}

export function themedCardHover(t: ThemeDefinition): Variants {
  const liftPx = t.hoverLiftPx;
  const shadowColor = t.hoverShadowColor;

  return {
    rest: {
      y: 0,
      rotate: 0,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      transition: { duration: 0.25 * t.animationSpeed, ease: ease.precision } as Transition,
    },
    hover: {
      y: -liftPx,
      rotate: 0,
      boxShadow: `0 ${liftPx * 3}px ${liftPx * 8}px ${shadowColor}, 0 4px 12px rgba(0,0,0,0.06)`,
      transition: { duration: 0.25 * t.animationSpeed, ease: ease.precision } as Transition,
    },
  };
}

export function themedCheckPop(t: ThemeDefinition) {
  return {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: t.springStiffness,
        damping: t.springDamping,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.15 * t.animationSpeed },
    },
  };
}

export function themedBlobFloat(_t: ThemeDefinition, delay: number = 0) {
  const amplitude = 12;
  const duration = 6;
  return {
    animate: {
      y: [0, -amplitude, 0],
      x: [0, amplitude * 0.5, 0],
      scale: [1, 1 + amplitude * 0.004, 1],
      transition: {
        duration,
        repeat: Infinity,
        ease: [0.45, 0.05, 0.55, 0.95] as Easing4,
        delay,
      } as Transition,
    },
  };
}

export function themedButtonTap(t: ThemeDefinition) {
  return {
    scale: 0.97,
    rotate: 0,
    transition: { duration: 0.1 * t.animationSpeed } as Transition,
  };
}

export function themedPulseRing(_t: ThemeDefinition) {
  return {
    animate: {
      scale: [1, 1.8, 2.5],
      opacity: [0.6, 0.3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: [0.0, 0.0, 0.58, 1.0] as Easing4,
      } as Transition,
    },
  };
}
