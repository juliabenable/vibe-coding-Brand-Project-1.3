# Content Tab — Behavior Brief

**For:** Dev/Figma handoff
**Page route:** `/#/app` → Content tab
**Source files:**
- Layout: `src/layouts/ProductionLayout.tsx`
- Page wrapper: `src/pages/ProductionCampaignDetail.tsx`
- Content grid: `src/components/ContentGrid.tsx`
- Mock data: `src/data/creator-content.ts`

---

## 1. Page structure

### Sidebar (left, fixed 180px wide, sticky to viewport)
- Benable logo (gradient pill icon + wordmark) at top
- "PLATFORM" section label (uppercase, 9px, tracked)
- Nav items (top to bottom):
  - **Campaigns** — active state: light blue background (`#EFF6FF`), blue text (`#2563EB`), bold
  - **Push Alerts** — gray, "Soon" pill badge
  - **Brand Intelliger** — gray, "Soon" pill badge
  - **UGC Studio** — gray, "Soon" pill badge
- Pikora brand block pinned to bottom of sidebar (logo + name)
- Sidebar links are visual only — non-functional in this prototype

### Main content header
- "← Campaigns" breadcrumb link (13px, neutral-500, hover → neutral-700)
- Campaign title row:
  - "Pikora Instant Bone Broth Collection" (18px, bold)
  - "Active" pill badge: blue dot + "Active" text on light blue background, no border, full pill radius
  - "Campaign Details" button (top-right): outline button, eye icon + label, 13px

### Tab bar
- **Underline-style tabs** (NOT pill style): "Dashboard" | "Content"
- Compact, left-aligned, 20px gap between tabs
- Active tab: dark text (`neutral-800`), 2px underline (`neutral-800`) directly under text
- Inactive tab: gray text (`neutral-400`), no underline
- Bottom border on the tab strip (1px, `neutral-200`) extends full width
- Default tab: **Content**

---

## 2. Content tab — grid behavior

### Filter pills (above grid)
- 5 pills: All / TikTok / Instagram Post / Instagram Reel / Instagram Story
- Each pill shows the count of items in a small inner badge
- **Active state:** dark fill (`neutral-800`), white text, white-translucent count badge
- **Inactive state:** white background, neutral-200 border, neutral-500 text, neutral-50 count badge
- **Hover (inactive):** border darkens to `neutral-300`, text darkens to `neutral-700`
- Click → filters grid to that content type
- "All" returns to full set
- Filter selection is local state (not persisted across sessions)

### Grid layout
- **3 columns** on desktop, 2 on tablet, 1 on mobile
- **16px gap** between cards
- Cards have a uniform **4:5 aspect-ratio thumbnail** at the top
- Sort order: most recent post first (descending by `postedAt`)

### Card anatomy
- **Thumbnail (4:5):**
  - Full-bleed image, `object-cover` cropping
  - Rounded top corners (8px)
  - **Platform badge** (top-left): pill with platform icon + label
    - TikTok → black background, music note icon
    - Instagram Reel → IG gradient (orange→pink→purple), camera icon, "Reel"
    - Instagram Post → IG gradient, camera icon, "Post"
    - Instagram Story → IG gradient, camera icon, "Story"
- **Card body** (12px horizontal, 10px vertical padding):
  - Avatar (28px round) + creator name (semibold, 13px) + handle (12px, neutral-400) + relative time (12px, right-aligned)
  - Caption: 12.5px, neutral-600, relaxed line-height, **clamped to 2 lines** with ellipsis

### Card interactions
- **Cursor:** pointer on hover
- **Hover effect:**
  - Card lifts ~2px (`translate-y`)
  - Border darkens (`neutral-200` → `neutral-300`)
  - Soft drop shadow appears (`shadow-md`)
  - Image scales smoothly to 1.04x over 700ms with eased curve
  - Image stays inside the rounded thumbnail container — no corner-flash
- **Click:** opens the original post URL in a new browser tab (`target="_blank"`)
  - This page is NOT an in-app preview — clicking always leaves the app

### Empty state (when filter has no matches)
- Dashed border card, centered text: "No content to show for this filter yet."

---

## 3. Dashboard tab

- "Invited Creators" heading + subhead: "Track outreach and creator responses. Benable admin continues direct follow-up with creators."
- "Filter" button (top-right of section)
- Table with 4 columns: **Creator | Creator status | Note | Actions**
- Creator cell: avatar circle + name + verified checkmark + handle below
- Status: pill badge (e.g., "Invited" — neutral pill)
- Note: italic placeholder text (e.g., "Waiting on admin...")
- Actions: 3-dot menu button (visual only)

---

## 4. Color & typography reference

### Colors used
- Brand active blue: `#EFF6FF` bg, `#2563EB` text
- Active badge blue: `#DBEAFE` bg, `#3B82F6` dot, `#2563EB` text
- Filter active: `neutral-800` (`#18181B`) bg, white text
- Card border: `neutral-200` default, `neutral-300` hover
- Body text: `neutral-800` headings, `neutral-500` body, `neutral-400` meta

### Typography
- Page title: 18px bold
- Tab labels: 14px medium
- Card creator name: 13px semibold
- Card handle / time: 12px regular
- Card caption: 12.5px regular, line-height relaxed
- Filter pill label: 14px medium
- Filter pill count: 10px semibold
- Sidebar nav items: 13px medium

### Spacing
- Page horizontal padding: 32px
- Section vertical padding: 20-24px
- Grid gap: 16px
- Card padding: 12px horizontal, 10px vertical

---

## 5. Data shape (per post)

```ts
{
  id: string,                 // unique
  type: 'tiktok' | 'instagram_post' | 'instagram_reel' | 'instagram_story',
  thumbnailUrl: string,       // 4:5 image
  caption: string,            // shown on card, clamped 2 lines
  postedAt: string,           // ISO date — drives "Xw ago" label
  postUrl: string,            // opens in new tab on click
  creator: {
    name: string,
    handle: string,           // includes @
    avatarUrl: string,
  },
  campaignName: string,       // not currently shown on card, available for detail view
  rightsExpireAt: string,     // postedAt + 90 days, available for future "rights" UI
  isInitiallyNew?: boolean,   // not currently used (NEW badge removed per spec)
}
```

---

## 6. Out of scope (intentionally NOT in MVP)

Per the Content Tab MVP spec, the following are deliberately excluded:
- In-app detail view / lightbox / preview overlay
- "New since last checked" badges
- Share / download / repost buttons
- Brand approve/reject actions
- Usage rights guidance UI
- Multi-image carousel navigation in cards
- Messaging or commenting on creators
- Filters beyond content type

All moderation flows through Benable admin separately. This page is preview-only for the brand.
