# Campaign Flow Improvements Plan

## Overview
Three areas of work on `CreateCampaign.tsx`:
1. Design polish across all steps
2. Make gifting instructions more prominent above product picker
3. Redesign Step 3 as a faithful creator-facing preview/recap

---

## 1. Design Polish (All Steps)

**Header area:**
- Add subtle gradient or brand tint to the header background
- Improve step indicator with better visual weight and transitions

**Section cards:**
- Softer shadows, slightly more padding
- Subtle hover states on sections
- Better label/hint hierarchy (slightly larger section titles)

**Form inputs:**
- More breathing room in textareas
- Smoother focus transitions

**Footer bar:**
- Slightly taller with better button styling
- Add step label text next to progress dots

---

## 2. Gifting Instructions (Step 2)

The field already exists (lines 571-583) but it's buried inside the product section. Changes:
- Make it a standalone, visually distinct callout above the product picker
- Add a helpful hint/example text
- Style it as a prominent instruction block (not just another textarea)
- Move it above the Shopify connection badge so the flow reads: Instructions → Connected Store → Select Products

---

## 3. Step 3 — Creator Preview Recap

Current Step 3 is already a creator preview card, but should look MORE like the real creator experience. Changes:
- Make it look like a phone/app mockup frame (optional phone bezel)
- Add the brand info section (brand description from Step 1)
- Show all sections in the same layout creators will see:
  - Brand header with logo/name
  - Campaign description
  - Compensation with gifting instructions + product thumbnails
  - Platform requirements as checklist
  - Other requirements
  - Terms (collapsible or abbreviated)
  - Timeline
  - "Accept Campaign" CTA button
- Add a "This is exactly what creators will see" banner
- Perhaps wrap it in a subtle device frame or dashed border to differentiate it as a preview

---

## Files Changed
- `src/pages/campaigns/CreateCampaign.tsx` — all changes in this single file
