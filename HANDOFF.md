# Benable Brand Portal — Project Handoff Document

## Quick Facts

| Key | Value |
|-----|-------|
| **Project** | Benable Brand Portal (vibe coding Brand Project 1.1) |
| **Path** | `/Users/julia/Documents/Benable Coding/vibe coding Brand Project 1.1` |
| **Stack** | Vite + React 19 + TypeScript + Tailwind CSS v4 |
| **UI Library** | shadcn/ui (Radix primitives, `data-slot` attributes) |
| **Animation** | Framer Motion |
| **Routing** | HashRouter (`/#/route`) |
| **GitHub** | `https://github.com/juliabenable/vibe-coding-Brand-Project-1.1-repo.git` |
| **Live URL** | `https://juliabenable.github.io/vibe-coding-Brand-Project-1.1-repo/` |
| **Deploy cmd** | `npm run build && npx gh-pages -d dist` |
| **Base path** | `/vibe-coding-Brand-Project-1.1-repo/` (in `vite.config.ts`) |
| **Dev server** | `npm run dev` → `localhost:5173` |

---

## Architecture Overview

### Routing (App.tsx)
```
/                    → Dashboard
/campaigns           → CampaignsList (Active Campaigns)
/campaigns/create    → CreateCampaign (4-step wizard)
/campaigns/:id       → CampaignDetail
/campaigns/:id/find-talent → CampaignFindTalent
/creators            → Creators
/messages            → Messages
/settings            → BrandSettings
/upgrade             → UpgradePlan
```

All routes wrapped in `<BrandPortalLayout>` (sidebar + main area) and `<ThemeProvider>`.

### Key Files
- `src/App.tsx` — Routes, ThemeProvider, HashRouter
- `src/layouts/BrandPortalLayout.tsx` — Sidebar nav + content layout
- `src/app/globals.css` — All CSS variables, theme overrides, utility classes (~750 lines)
- `src/lib/themes.ts` — Theme definitions (animation config, spring values)
- `src/lib/theme-context.tsx` — ThemeProvider + useTheme hook
- `src/components/ThemeSwitcher.tsx` — Floating theme toggle (bottom-right corner)
- `src/pages/campaigns/CreateCampaign.tsx` — Campaign creation wizard (~1054 lines, THE main file)

### Page Files
```
src/pages/
  Dashboard.tsx
  BrandSettings.tsx
  Creators.tsx
  Messages.tsx
  UpgradePlan.tsx
  campaigns/
    CampaignsList.tsx
    CreateCampaign.tsx     ← Most complex file
    CampaignDetail.tsx
    CampaignFindTalent.tsx
```

---

## Theme System

**Core principle: Brand purple NEVER changes per-theme. Differentiation comes from design craft.**

5 themes: `original`, `precision`, `warm`, `playful`, `editorial`

| Theme | Inspiration | Personality |
|-------|-------------|-------------|
| **Original** | Benable brand | Default, balanced |
| **Precision** | Apple, Linear, Vercel | Cool grey, no card borders, shadow-only, tight tracking |
| **Warm** | Airbnb, Notion | Cream/beige neutrals, paper shadows, generous rounding |
| **Playful** | Duolingo, Figma, Stripe | Bold 2px borders, colored shadows, bouncy, press-down buttons |
| **Editorial** | Vogue, Medium | Serif headings, hairline borders, zero shadow, dramatic whitespace |

### How it works
1. `ThemeProvider` sets `data-theme="..."` on `<html>`
2. CSS in `globals.css` uses `[data-theme="precision"] { ... }` selectors to override variables
3. Shared variables: `--brand-0` through `--brand-900` (purple), neutrals, semantics
4. Per-theme variables: `--font-heading`, `--card-shadow`, `--radius`, `--heading-weight`, etc.
5. `themes.ts` provides animation config (spring stiffness/damping, hover lift, etc.)
6. Theme persisted in localStorage under key `benable-theme`

### Brand Colors (NEVER change)
```
--brand-600: #7C3AED  (primary purple)
--brand-500: #8B5CF6
--brand-700: #6D28D9
--brand-100: #F0EBFF  (light purple bg)
```

---

## Campaign Creation Flow (CreateCampaign.tsx)

This is the most complex component. It's a **4-step wizard**:

### Step 1: Brief
- Campaign name, description (textarea)
- Content requirements (checkboxes + custom)
- Other requirements (hashtags, tagging, etc.)

### Step 2: Product
- Gifting instructions textarea (instructions to creators like "choose 1 product")
- Shopify product picker (mock modal with product grid)
- Selected products display

### Step 3: Target Creators
- Textarea to describe ideal creators (geography, follower range, niche, etc.)

### Step 4: Preview
- Shows exactly what creators will see
- Campaign card with purple gradient header
- Compensation section, Content Requirements, Other Requirements
- Terms & Commitments (read-only by default, Edit button to unlock)
- "Launch Campaign" button

### Key patterns in CreateCampaign.tsx:
- `Section` component: reusable wrapper with icon, title, subtitle, tooltip
- `Tooltip` component: custom hover/click tooltip using Info icon
- `STEP_LABELS = ["Brief", "Product", "Target Creators", "Preview"]`
- Step validation: Step 2 requires at least 1 selected product
- Terms section: read-only `<div>` with Edit button that switches to `<textarea>`
- Stepper nav at top with check marks for completed steps
- Footer: Back button (left), dot indicators (center), contextual Next button (right)

---

## Fonts (loaded in index.html)
- Inter (body, most headings)
- Space Grotesk (available but not primary)
- Lora (available)
- Nunito (Playful theme headings)
- Playfair Display (Editorial theme headings)

---

## Utility Classes (globals.css)
- `.shadow-light-top`, `.shadow-medium-top`, `.shadow-dark-top`, `.shadow-brand-glow`
- `.bg-gradient-brand`, `.bg-gradient-warm`, `.bg-gradient-cool`, `.bg-gradient-hero`, `.bg-gradient-sidebar`
- `.animate-float`, `.animate-shimmer`, `.animate-pulse-brand`
- `.animate-fade-in-up`, `.animate-scale-in`, `.animate-slide-in-right`
- `.hover-lift`, `.hover-glow`
- All utility classes have per-theme overrides

---

## Figma Files
- **Brand Portal Screens**: `https://www.figma.com/design/LAJHBPtvGjdwQa3de8ZDjL` — Contains captured screens of all 4 campaign creation steps (Brief, Product, Target Creators, Preview) + Homepage
- **Vibe Coding Brand Project 1**: `https://www.figma.com/design/17zs7LjFs05bc7CbPTs8Ey`
- **Creator Portal Screens**: `https://www.figma.com/design/bjyCgtxxIkC1qaa34VfwcO`

---

## Git History (recent, most relevant)
```
5bcdbbc Make terms read-only by default with Edit button to unlock
a29715d Split Target Creators into own step; add tooltips to brief fields
992a821 Remove timeline/accept button from preview; soften Step 1 checkmarks
c6d1695 Restore original creator preview; merge gifting into one section
eba129f Remove Accept Campaign button and timeline; add "post ASAP" requirement
b5e7f6b Polish campaign flow: design uplift, gifting instructions, creator preview
bb5b3a7 Update terms copy, replace compensation with Shopify product picker
e78d32f Redesign campaign creation as 2-step brief flow
fd9942e Rethink themes: same purple, different design craft
```

---

## Important Notes / Gotchas

1. **HashRouter**: The app uses `/#/` routing. This matters for deployment and any tools that manipulate URLs.

2. **Figma capture script**: `index.html` currently has a Figma capture script tag (`mcp.figma.com/mcp/html-to-design/capture.js`). This should be removed before production — it's only for exporting screens to Figma during development.

3. **No real backend**: Everything is mock data. The Shopify product picker is a simulated modal with fake products. Campaign data lives in component state only.

4. **shadcn/ui components**: Located in `src/components/ui/`. They use Radix primitives and `data-slot` attributes for theme-aware styling.

5. **Tailwind v4**: Uses `@tailwindcss/vite` plugin and `@import "tailwindcss"` in CSS. Config is CSS-based (no `tailwind.config.js`).

6. **Deploy process**: `npm run build && npx gh-pages -d dist` pushes the `dist` folder to the `gh-pages` branch.

7. **The user (Julia)** has been actively editing `CreateCampaign.tsx` directly — check for any manual changes before making edits.

8. **Current uncommitted changes**: There are modifications to `index.html` (Figma capture script) and possibly other files. Run `git status` and `git diff` to check.
