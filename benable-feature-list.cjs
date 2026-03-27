const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// --- Colors ---
const BRAND = "6D28D9";
const BRAND_LIGHT = "EDE9FE";
const NEUTRAL_700 = "374151";
const NEUTRAL_500 = "6B7280";
const GREEN = "059669";
const BORDER_LIGHT = "E5E7EB";
const WHITE = "FFFFFF";

// --- Reusable helpers ---
const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_LIGHT };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}

function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: NEUTRAL_700, ...opts })]
  });
}

function bulletItem(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: NEUTRAL_700 })]
  });
}

function subBulletItem(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 1 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: NEUTRAL_500 })]
  });
}

function spacer(pts = 200) {
  return new Paragraph({ spacing: { after: pts }, children: [] });
}

function featureRow(feature, description) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 3200, type: WidthType.DXA },
        margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ text: feature, size: 21, font: "Arial", bold: true, color: NEUTRAL_700 })] })]
      }),
      new TableCell({
        borders,
        width: { size: 6160, type: WidthType.DXA },
        margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ text: description, size: 21, font: "Arial", color: NEUTRAL_500 })] })]
      }),
    ]
  });
}

function featureTableHeader(col1, col2) {
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 3200, type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: col1, size: 21, font: "Arial", bold: true, color: BRAND })] })]
      }),
      new TableCell({
        borders,
        width: { size: 6160, type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: col2, size: 21, font: "Arial", bold: true, color: BRAND })] })]
      }),
    ]
  });
}

function featureTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3200, 6160],
    rows: [
      featureTableHeader("Feature", "Details"),
      ...rows.map(([f, d]) => featureRow(f, d))
    ]
  });
}

// --- Build document ---
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BRAND },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: NEUTRAL_700 },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ]
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ]
      },
    ]
  },
  sections: [
    // --- TITLE PAGE ---
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        spacer(3000),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benable Brand Portal", size: 56, bold: true, font: "Arial", color: BRAND })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "Prototype Feature List", size: 36, font: "Arial", color: NEUTRAL_700 })]
        }),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "Prepared for Team Discussion", size: 24, font: "Arial", color: NEUTRAL_500 })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: "February 2026", size: 24, font: "Arial", color: NEUTRAL_500 })]
        }),
        spacer(2000),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "CONFIDENTIAL", size: 20, font: "Arial", color: NEUTRAL_500, italics: true })]
        }),
      ]
    },
    // --- OVERVIEW ---
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ text: "Benable Brand Portal", size: 18, font: "Arial", color: NEUTRAL_500 }),
              new TextRun({ text: "  |  Feature List", size: 18, font: "Arial", color: NEUTRAL_500 }),
            ]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", size: 18, font: "Arial", color: NEUTRAL_500 }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: NEUTRAL_500 }),
            ]
          })]
        })
      },
      children: [
        heading1("Overview"),
        bodyText("The Benable Brand Portal is a self-serve platform that enables brands to create and manage creator collaboration campaigns. This document outlines every feature currently built into the interactive prototype."),
        spacer(100),
        bodyText("Tech stack: React 19, TypeScript, Vite 6, Tailwind CSS v4, shadcn/ui component library."),
        spacer(100),

        heading2("Design System"),
        featureTable([
          ["Brand Colors", "Custom purple palette (primary #6D28D9) with 10 shades, plus semantic color sets for green, blue, orange, pink, red, and yellow"],
          ["Typography", "Inter font family with consistent sizing scale from 10px to 32px"],
          ["Gradients", "6 gradient presets: brand, warm, cool, success, hero, sidebar"],
          ["Shadows & Animations", "Brand glow shadow, float animation, shimmer effect, pulse animation"],
          ["CSS Variables", "60+ custom properties for colors, spacing, and theming"],
          ["Component Library", "50+ shadcn/ui components including cards, badges, buttons, forms, dialogs, tabs, and more"],
        ]),
        spacer(200),

        heading2("Application Shell"),
        featureTable([
          ["Sidebar Navigation", "Fixed 220px sidebar with 3 main nav items: Home, Create Campaign, Active Campaigns. Brand Settings at bottom. Active state with purple highlight bar and background."],
          ["Upgrade Plan Card", "Gradient card in sidebar linking to 3-tier pricing page"],
          ["Plan Usage Footer", "Shows current plan name, campaign usage progress bar (3/10), and company name"],
          ["Top Bar", "Sticky header with View Page button (live status dot), notification bell (badge count), and user avatar"],
          ["Routing", "9 routes via HashRouter: Home, Campaigns, Create, Detail, Find Talent, Creators, Messages, Settings, Upgrade"],
        ]),

        // --- DASHBOARD ---
        spacer(100),
        heading1("Dashboard (Home)"),
        featureTable([
          ["Hero CTA", "Gradient card with decorative background blobs, Sparkles icon, headline, and Create Campaign button"],
          ["Campaign Table", "Table-style layout showing all active campaigns with columns for name, creators, delivered count, timeline, and status"],
          ["Status Badges", "Color-coded status system derived from creator data: Created, Pending Creators, Recruiting, In Creation, In Review, Finished"],
          ["Action Buttons", "Context-aware action button appears on Pending Creators status (Select Creators) linking to talent selection"],
          ["Creator Avatars", "Stacked avatar display showing up to 4 creator photos with +N overflow indicator"],
          ["Delivered Counter", "Shows content delivery progress as delivered/total (e.g., 2/5)"],
          ["Timeline Display", "Date range formatted as Month Day for start and end dates"],
          ["Recent Activity Feed", "Right-side panel with emoji-coded activity items, timestamps, and Review action buttons"],
          ["Expandable Activity", "Load More button to reveal additional activity items beyond initial 4"],
          ["Empty State", "Illustrated empty state when no campaigns exist with guidance text"],
        ]),

        // --- CAMPAIGNS LIST ---
        spacer(100),
        heading1("Active Campaigns Page"),
        featureTable([
          ["Campaign Table", "Full-page table matching Dashboard layout with all status columns"],
          ["Create Campaign CTA", "Header button to launch new campaign creation wizard"],
          ["Clickable Rows", "Each campaign row links directly to its management view"],
          ["Empty State", "Dashed border card with Megaphone icon when no campaigns exist"],
        ]),

        // --- CREATE CAMPAIGN ---
        new Paragraph({ children: [new PageBreak()] }),
        heading1("Create Campaign Wizard"),
        bodyText("A 4-step guided wizard for setting up new creator collaboration campaigns."),
        spacer(100),

        heading2("Step 1: Campaign Goals & Settings"),
        featureTable([
          ["Campaign Mode", "Three options: Open (any creator), Targeted (specific creators), Debut (new product launch)"],
          ["Title Input", "Free-text campaign name field"],
          ["Goal Selection", "Multi-select from 6 goals: Brand Awareness, Drive Sales, Product Launch, UGC Creation, Word of Mouth, Community Building"],
          ["Platform Selection", "Multi-select platforms: Benable, Instagram, TikTok"],
          ["Content Format Tiles", "Color-coded clickable tiles for each format: Benable Post, Instagram Post/Reel/Story, TikTok Video"],
          ["Budget Configuration", "Dropdown for budget type (Spend Cap, Product Inventory, Flexible, Combined) with conditional amount input"],
          ["Creator Count Target", "Dropdown selector: 5-15, 15-30, 30+ creators"],
          ["Creator Types", "Multi-select: Any, Pico, Nano, Micro influencer tiers"],
          ["Creator Categories", "Tag-style input for niche categories"],
        ]),
        spacer(100),

        heading2("Step 2: Campaign Details"),
        featureTable([
          ["Description", "Rich textarea for campaign description"],
          ["Brief Upload", "File input with drag-and-drop preview for campaign brief documents"],
          ["Content Requirements", "Multi-select checkboxes: show product, include name, tag brand, use hashtags, show labels"],
          ["Hashtag Input", "Comma-separated hashtag entry field"],
          ["Flight Dates", "Date picker range for campaign start and end dates"],
          ["UGC Rights", "Toggle + duration dropdown (30/60/90 days, perpetual)"],
          ["UGC Exclusivity", "Toggle + days input for exclusive content period"],
          ["Content Review Toggle", "Enable/disable content approval workflow"],
        ]),
        spacer(100),

        heading2("Compensation Configuration"),
        featureTable([
          ["Multi-Type Selection", "5 toggleable compensation tiles that can be combined"],
          ["Gifted Product", "Product name and value input fields"],
          ["Gift Card", "Value, brand name, and delivery method fields"],
          ["Discount Code", "Code, amount, and type (percent/dollar) fields"],
          ["Paid Fee", "Min and max fee range inputs"],
          ["Commission Boost", "Percentage rate input for enhanced commission"],
        ]),
        spacer(100),

        heading2("Step 3: Brief & Obligations"),
        featureTable([
          ["Pre-built Templates", "8 creator obligation templates with emoji icons and toggle switches"],
          ["Obligation Types", "Instagram Stories, Tag Brand, Use Hashtags, Link Sticker, Benable Recommendations, Show Product, Mention Discount, TikTok Videos"],
          ["Custom Obligations", "Free-text input for additional creator requirements"],
          ["Content Niches", "Tag-based multi-select for content niche categorization"],
        ]),
        spacer(100),

        heading2("Step 4: Review & Launch"),
        featureTable([
          ["2-Column Summary", "Grid layout with Campaign Overview + Influencer Criteria (left) and Goals + Payout (right)"],
          ["Edit Actions", "Per-section edit buttons to jump back to specific wizard steps"],
          ["Launch Button", "Final action to publish the campaign"],
        ]),
        spacer(100),

        heading2("Wizard Navigation"),
        featureTable([
          ["Step Indicator", "4-step progress with clickable circles, checkmarks for completed steps, purple highlight for current"],
          ["Back/Next Buttons", "Step navigation with previous/next controls"],
          ["Step Jumping", "Click any completed step circle to return to that step"],
        ]),

        // --- AI MATCHING ---
        new Paragraph({ children: [new PageBreak()] }),
        heading1("AI Creator Matching"),
        bodyText("After launching a campaign, the platform shows an AI matching progress screen while creators are being sourced."),
        spacer(100),
        featureTable([
          ["4-Stage Pipeline", "Animated progression: Requirement Analysis, Expert Talent Sourcing, Compliance & Brand Fit Audit, Final List Generation"],
          ["Stage Animation", "Auto-advancing stages with checkmark completion indicators"],
          ["Campaign Status Card", "Left panel showing current matching stage with progress"],
          ["Feature Cards", "3 info cards: AI-Powered Matching, Quality Assurance, Smart Notifications"],
          ["Ready Alert", "Right panel notification card when matches are complete"],
          ["Notification Toggles", "Email and SMS notification preferences for match alerts"],
          ["Match Alert Banner", "Highlighted alert when creator matches are ready for review"],
        ]),

        // --- FIND TALENT ---
        spacer(100),
        heading1("Creator Discovery & Selection"),
        bodyText("A 3-step flow for finding, selecting, and managing creators for campaigns."),
        spacer(100),

        heading2("Step 1: Creator Discovery"),
        featureTable([
          ["Search", "Text search filtering by creator name or handle"],
          ["Platform Filters", "Multi-select: Instagram, TikTok, Benable"],
          ["Engagement Filter", "Range slider for engagement rate filtering"],
          ["Follower Filter", "Range slider for follower count filtering"],
          ["Category Filters", "Multi-select for content categories"],
          ["Audience Filters", "Age, gender, and location filtering"],
          ["Creator Cards", "Rich cards with cover image, avatar, stats, match score, AI reasons, platforms, categories, recent posts"],
          ["Match Score", "0-100% AI match score with color-coded progress bar"],
          ["Quick Actions", "Add to Campaign, Pass, and View Profile buttons per creator"],
        ]),
        spacer(100),

        heading2("Step 2: Creator Selection"),
        featureTable([
          ["Selected List", "Review all creators added to the campaign"],
          ["Per-Creator Compensation", "Dropdown + amount to customize compensation per creator"],
          ["Remove Creators", "Remove individual creators from selection"],
          ["Bulk Invite", "Send invitations to all selected creators at once"],
        ]),
        spacer(100),

        heading2("Step 3: Campaign Management"),
        featureTable([
          ["Creator Roster", "Full list of assigned creators with status tracking"],
          ["Status Badges", "12 creator statuses: Recommended, Invited, Applied, Accepted, Negotiating, Product Shipped, Gift Card Sent, Content Submitted, Content Approved, Posted, Complete, Declined"],
          ["Expandable Cards", "Click to expand creator details: bio, AI match reason, stats, audience demographics, recent posts"],
          ["3-Column Detail View", "Left: bio + stats, Center: audience demographics (age/gender/location), Right: recent post thumbnails"],
          ["Review Button Logic", "Review for Submitted/In Review/Revision Sent, Preview for Approved/Posted, hidden for Waiting states"],
          ["Accept/Skip Actions", "Quick action buttons for recommended creators"],
        ]),

        // --- CAMPAIGN DETAIL ---
        new Paragraph({ children: [new PageBreak()] }),
        heading1("Campaign Detail View"),
        featureTable([
          ["Budget Tracker", "Visual progress bar with color transitions: green (safe), orange (80%+), red (100%+)"],
          ["Auto-Cutoff Banner", "Warning banner when budget is fully allocated"],
          ["Creator Stats", "Assigned, accepted, and posted creator counts"],
          ["Reopen Button", "Reopen campaign for more creators when filled"],
          ["Tab Navigation", "Tabs: All, Recommended, Accepted, Content, Posted"],
          ["Content Gallery", "Grid of all creator content submissions with lightbox view"],
          ["Lightbox Modal", "Full-size preview with creator info, caption, platform badge, content type, review status, live URL"],
          ["Campaign Info Tabs", "Overview, Creators, Content, Analytics sections"],
        ]),

        // --- OTHER PAGES ---
        spacer(100),
        heading1("Additional Pages"),

        heading2("Creators Directory"),
        featureTable([
          ["Search & Filter", "Real-time search by name/handle with filter controls"],
          ["Creator Cards", "2-column grid with avatar, name, handle, bio, stats, audience, platforms, categories, recent posts"],
          ["Color-Coded Stats", "Followers (purple), Engagement (green), Avg Likes (pink)"],
          ["Exclusive Badge", "Visual indicator for exclusive creator partnerships"],
          ["Quick Actions", "View Profile and Invite to Campaign buttons"],
        ]),
        spacer(100),

        heading2("Brand Settings"),
        featureTable([
          ["Brand Profile Form", "Editable fields: Brand Name, Website, Description, Category, Instagram Handle"],
          ["Subscription Info", "Current plan display with Free Plan badge"],
          ["Upgrade CTA", "Button linking to upgrade page"],
        ]),
        spacer(100),

        heading2("Upgrade Plan"),
        featureTable([
          ["3-Tier Pricing", "Starter (Free), Growth ($79/mo, Most Popular), Enterprise ($249/mo)"],
          ["Feature Comparison", "Detailed feature list per plan with checkmarks"],
          ["Plan Highlights", "Starter: 3 campaigns, 10 invites; Growth: unlimited campaigns, AI matching, 100 invites; Enterprise: dedicated manager, API, white-label"],
          ["Visual Hierarchy", "Most Popular badge, ring highlight, and shadow on Growth plan"],
        ]),
        spacer(100),

        heading2("Messages"),
        featureTable([
          ["Coming Soon State", "Placeholder page with MessageSquare icon and Coming Soon badge"],
          ["Future Ready", "Prepared for messaging integration with creator communication"],
        ]),

        // --- MOCK DATA ---
        new Paragraph({ children: [new PageBreak()] }),
        heading1("Prototype Data"),
        bodyText("The prototype includes realistic mock data for demonstration purposes."),
        spacer(100),
        featureTable([
          ["Campaigns", "2 fully populated campaigns with 3-5 creators each"],
          ["Creator Profiles", "10+ creator profiles with avatars, bios, engagement stats, audience demographics"],
          ["Content Submissions", "Sample content with captions, platform tags, and review statuses"],
          ["Activity Feed", "6 activity items spanning campaign and creator events"],
          ["Creator Obligations", "8 pre-built obligation templates with emoji indicators"],
          ["Compensation Types", "5 compensation methods with realistic default values"],
        ]),

        // --- DISCUSSION TOPICS ---
        spacer(200),
        heading1("Discussion Topics"),
        bodyText("Key areas to address with the team during review:"),
        spacer(100),
        bulletItem("Which features are highest priority for the MVP launch?"),
        bulletItem("Are there any missing features that need to be added to the prototype?"),
        bulletItem("Backend integration requirements and API design for each feature"),
        bulletItem("Real-time messaging implementation approach"),
        bulletItem("AI creator matching algorithm and data requirements"),
        bulletItem("Payment processing and compensation distribution flow"),
        bulletItem("Analytics dashboard design and key metrics to track"),
        bulletItem("Mobile responsiveness requirements and timeline"),
        bulletItem("User authentication and role-based access control"),
        bulletItem("Content moderation and approval workflow details"),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = "/sessions/nice-awesome-heisenberg/mnt/vibe coding Brand Project 1/Benable Brand Portal - Feature List.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Created:", outPath);
});
