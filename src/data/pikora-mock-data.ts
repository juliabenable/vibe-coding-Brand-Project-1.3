/**
 * PIKORA Mock Data — Shared across all 3 Create Campaign versions
 * Brand: PIKORA — Latin-inspired instant powdered bone broth
 */

export interface PikoraProduct {
  id: string;
  title: string;
  image: string;
  price: string;
  variant: string;
  inventory: number;
  handle: string;
}

export const PIKORA_PRODUCTS: PikoraProduct[] = [
  {
    id: "pk-1",
    title: "Cocoa Bone Broth",
    image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=120&h=120&fit=crop",
    price: "$34.99",
    variant: "10-pack sachets",
    inventory: 320,
    handle: "pikora-cocoa-bone-broth",
  },
  {
    id: "pk-2",
    title: "Chicken Bone Broth",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=120&h=120&fit=crop",
    price: "$32.99",
    variant: "10-pack sachets",
    inventory: 415,
    handle: "pikora-chicken-bone-broth",
  },
  {
    id: "pk-3",
    title: "Beef Bone Broth",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=120&h=120&fit=crop",
    price: "$34.99",
    variant: "10-pack sachets",
    inventory: 280,
    handle: "pikora-beef-bone-broth",
  },
  {
    id: "pk-4",
    title: "Discovery 3-Pack (All Flavors)",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=120&fit=crop",
    price: "$44.99",
    variant: "12 sachets (4 each)",
    inventory: 190,
    handle: "pikora-discovery-pack",
  },
  {
    id: "pk-5",
    title: "Cocoa Bone Broth — Bulk Tub",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=120&h=120&fit=crop",
    price: "$59.99",
    variant: "30 servings",
    inventory: 145,
    handle: "pikora-cocoa-bulk",
  },
  {
    id: "pk-6",
    title: "Starter Kit + Shaker Bottle",
    image: "https://images.unsplash.com/photo-1556909172-8c2f3e8f9c3e?w=120&h=120&fit=crop",
    price: "$49.99",
    variant: "6 sachets + bottle",
    inventory: 88,
    handle: "pikora-starter-kit",
  },
];

// ─── Brand ───

export const PIKORA_BRAND_DESCRIPTION =
  "PIKORA makes instant powdered bone broth with a Latin-inspired twist. Every sachet delivers 10–11g of protein and just 45–50 calories — packed with collagen, gluten-free, and keto & paleo friendly. Our mission: make real bone broth effortless, delicious, and sustainable. Available in Cocoa, Chicken, and Beef. Bone broth, but make it powdered.";

// ─── Campaign Ideas (for V3 auto-generation) ───

export interface CampaignIdea {
  id: string;
  title: string;
  description: string;
}

export const PIKORA_CAMPAIGN_IDEAS: CampaignIdea[] = [
  {
    id: "idea-1",
    title: "Morning Ritual Reset",
    description:
      "Show PIKORA as part of your morning routine — a warm, protein-packed start that replaces coffee or complements breakfast. Highlight the ease: tear, stir, sip. Focus on the cozy, ritual feel of starting the day with real bone broth.",
  },
  {
    id: "idea-2",
    title: "Flavor Discovery Challenge",
    description:
      "Try all 3 PIKORA flavors — Cocoa, Chicken, and Beef — and rank your favorites. Create a taste-test moment: first sip reaction, honest thoughts on each. Great for content that feels fun, unscripted, and genuinely helpful to your audience.",
  },
  {
    id: "idea-3",
    title: "Gut Health & Glow Up",
    description:
      "Position PIKORA as your collagen-rich, gut-friendly secret weapon. Share how bone broth fits into your wellness routine alongside workouts, skincare, or meal prep. Highlight the protein count, low calories, and clean ingredients.",
  },
];

// ─── Deliverables ───

export interface Deliverable {
  id: string;
  text: string;
}

export const PIKORA_DELIVERABLES: Deliverable[] = [
  { id: "del-1", text: "Create 1 TikTok video (30–60 seconds) showing you preparing and tasting PIKORA" },
  { id: "del-2", text: "Create 1 Instagram Reel featuring PIKORA in your daily routine" },
  { id: "del-3", text: "Post 1 Instagram Story (3+ slides) with an honest review" },
  { id: "del-4", text: "Create 1 Benable recommendation post about your favorite PIKORA flavor" },
];

// ─── Instructions ───

export interface Instruction {
  id: string;
  text: string;
  defaultSelected: boolean;
}

export const PIKORA_INSTRUCTIONS: Instruction[] = [
  { id: "inst-1", text: "Use campaign hashtag #PIKORA #BoneBrothButPowdered", defaultSelected: true },
  { id: "inst-2", text: "Tag @drinkpikora in all posts", defaultSelected: true },
  { id: "inst-3", text: "Show the product being prepared (stir/mix moment)", defaultSelected: true },
  { id: "inst-4", text: "Mention at least one key benefit: protein, collagen, low-cal, or keto-friendly", defaultSelected: true },
  { id: "inst-5", text: "Show the eco-friendly sachet packaging in at least one shot", defaultSelected: false },
  { id: "inst-6", text: "Post within 7 days of receiving product", defaultSelected: false },
  { id: "inst-7", text: "Include a close-up of the powder texture or mixing moment", defaultSelected: false },
];

// ─── Terms ───

export const PIKORA_TERMS =
  "You agree to deliver the content described above within 14 days of receiving your PIKORA products. All content must be submitted for review before publishing. You agree to keep campaign details confidential until publication. UGC rights granted for 90 days across brand channels. PIKORA may repost or feature your content with credit.";

export const PIKORA_GIFTING_INSTRUCTIONS =
  "Choose your favorite flavor from the selection below. This is the product you'll receive and feature in your content.";

// ─── Target Creators Defaults ───

export const PIKORA_TARGET_CREATORS = {
  niches: ["Wellness", "Fitness", "Food & Cooking", "Health", "Lifestyle", "Keto / Paleo"],
  followerRange: "1K – 50K",
  geography: "US-based",
  demographics: "Women & men 22–40",
  platforms: ["TikTok", "Instagram", "Benable"],
  style: "Authentic, wellness-oriented creators who post food, health, or lifestyle content. Bonus: experience with supplement or CPG brands.",
};

// ─── Guidance Panel Content (for V1) ───

export interface GuidanceSection {
  key: string;
  title: string;
  subtitle: string;
  examples: string[];
}

export const GUIDANCE_SECTIONS: GuidanceSection[] = [
  {
    key: "brand",
    title: "Describe your brand",
    subtitle: "2–3 sentences so creators understand who you are.",
    examples: [
      "\"PIKORA makes instant powdered bone broth with a Latin-inspired twist...\"",
      "\"We believe real bone broth should be effortless, delicious, and sustainable.\"",
      "Mention what makes you different — powdered format, clean ingredients, eco-friendly packaging.",
    ],
  },
  {
    key: "campaign",
    title: "What's this campaign about?",
    subtitle: "Describe the creative direction and what kind of content you're looking for.",
    examples: [
      "\"We're launching our Cocoa flavor and want creators to share their first sip experience.\"",
      "\"Looking for authentic taste-test content across TikTok and Instagram.\"",
      "Include the vibe you're going for — cozy, energetic, educational, fun, etc.",
    ],
  },
  {
    key: "deliverables",
    title: "What should creators deliver?",
    subtitle: "List each piece of content. Include platform, format, and length.",
    examples: [
      "1 TikTok video (30–60s) showing the stir & sip moment",
      "1 Instagram Reel of your morning routine with PIKORA",
      "1 Instagram Story (3+ slides) with honest review",
    ],
  },
  {
    key: "requirements",
    title: "Any additional rules?",
    subtitle: "Hashtags, tagging, timing, content dos and don'ts — one per line.",
    examples: [
      "#PIKORA #BoneBrothButPowdered",
      "Tag @drinkpikora in all posts",
      "Show the product being prepared (stir/mix moment)",
    ],
  },
  {
    key: "terms",
    title: "Standard terms",
    subtitle: "These are shown to creators before they accept the brief.",
    examples: [
      "Content submitted for review before publishing",
      "UGC rights for 90 days across brand channels",
      "Deliver within 14 days of receiving product",
    ],
  },
  {
    key: "products",
    title: "Which products to offer?",
    subtitle: "Select the products creators can choose from.",
    examples: [
      "Check the products you want to include in this campaign.",
      "Creators will pick from these — you'll set conditions below.",
      "Offering more options gives creators flexibility.",
    ],
  },
  {
    key: "conditions",
    title: "How should creators choose?",
    subtitle: "Tell creators how many products they get and any rules.",
    examples: [
      "\"Choose 1 flavor from the options above\"",
      "\"Pick your 2 favorites from the selection\"",
      "\"You'll receive the Discovery 3-Pack\"",
    ],
  },
  {
    key: "creators",
    title: "Who are you looking for?",
    subtitle: "Describe your ideal creator profile.",
    examples: [
      "US-based wellness & food creators, 1K–50K followers",
      "Women & men 22–40 who post about health, fitness, or keto",
      "Authentic content style — not overly polished or salesy",
    ],
  },
];
