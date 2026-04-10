/**
 * Mock creator content for PIKORA brand portal — Content tab.
 * Posts span TikTok, Instagram (post / reel / story) and are attributed to
 * PIKORA campaigns. Dates are relative to 2026-04-09.
 */

export type ContentType =
  | "tiktok"
  | "instagram_post"
  | "instagram_reel"
  | "instagram_story";

export interface CreatorPost {
  id: string;
  type: ContentType;
  thumbnailUrl: string;
  caption: string;
  postedAt: string; // ISO date string
  creator: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  campaignName: string;
  rightsExpireAt: string; // ISO date string (postedAt + 90 days)
  /** Marked on the 3 most recent posts so they light up as NEW on first load. */
  isInitiallyNew?: boolean;
}

// Helper: today is 2026-04-09 — offset days produce realistic postedAt values.
function daysAgo(days: number, hours = 0): string {
  const base = new Date("2026-04-09T14:00:00.000Z");
  base.setUTCDate(base.getUTCDate() - days);
  base.setUTCHours(base.getUTCHours() - hours);
  return base.toISOString();
}

function plus90(iso: string): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + 90);
  return d.toISOString();
}

type Seed = Omit<CreatorPost, "rightsExpireAt">;

const SEED: Seed[] = [
  {
    id: "cp-01",
    type: "instagram_reel",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=1200&fit=crop",
    caption:
      "Two hours into my morning and this Cocoa @drinkpikora has already saved me. Warm, chocolatey, 12g of collagen — this is my new 5am ritual. #PIKORA #bonebrothbabe",
    postedAt: daysAgo(0, 2),
    creator: {
      name: "Maya Chen",
      handle: "@mayaeats",
      avatarUrl: "https://i.pravatar.cc/150?img=47",
    },
    campaignName: "PIKORA Spring Launch — Cocoa",
    isInitiallyNew: true,
  },
  {
    id: "cp-02",
    type: "tiktok",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=1200&fit=crop",
    caption:
      "POV: you found a bone broth that doesn't taste like bone broth. The Chicken flavour @drinkpikora is unreal in soups — 1 sachet, hot water, done. #PIKORA #guthealth",
    postedAt: daysAgo(0, 8),
    creator: {
      name: "Jordan Rivera",
      handle: "@jordanfit",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
    campaignName: "PIKORA Gut Reset Challenge",
    isInitiallyNew: true,
  },
  {
    id: "cp-03",
    type: "instagram_story",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=1200&fit=crop",
    caption:
      "Sunday slow morning essentials. Veggie @drinkpikora in my favourite mug and absolutely nothing else on the calendar. #PIKORA",
    postedAt: daysAgo(1, 3),
    creator: {
      name: "Priya Natarajan",
      handle: "@priyaslowliving",
      avatarUrl: "https://i.pravatar.cc/150?img=32",
    },
    campaignName: "PIKORA Wellness Mornings",
    isInitiallyNew: true,
  },
  {
    id: "cp-04",
    type: "instagram_post",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=800&fit=crop",
    caption:
      "Meal prep Sunday just got easier. I stir a sachet of Chicken @drinkpikora into my grain bowls for a savoury hit + extra protein. Saving this recipe forever. #PIKORA #mealprep",
    postedAt: daysAgo(2),
    creator: {
      name: "Lena Park",
      handle: "@lenacooks",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
    campaignName: "PIKORA Kitchen Staples",
  },
  {
    id: "cp-05",
    type: "tiktok",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517120026326-d87759a7b63b?w=800&h=1200&fit=crop",
    caption:
      "Post-workout protein without the chalky shake. Veggie @drinkpikora + hot water in the sauna = elite recovery. I'm obsessed. #PIKORA #recoveryritual",
    postedAt: daysAgo(3),
    creator: {
      name: "Theo Blackwood",
      handle: "@theomoves",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
    },
    campaignName: "PIKORA Gut Reset Challenge",
  },
  {
    id: "cp-06",
    type: "instagram_reel",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=1200&fit=crop",
    caption:
      "My cozy Sunday reset: candle on, kettle boiling, Cocoa @drinkpikora in hand. 90 seconds and I feel like a person again. #PIKORA #cozyvibes",
    postedAt: daysAgo(5),
    creator: {
      name: "Harper Ellis",
      handle: "@harperhome",
      avatarUrl: "https://i.pravatar.cc/150?img=23",
    },
    campaignName: "PIKORA Spring Launch — Cocoa",
  },
  {
    id: "cp-07",
    type: "instagram_post",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1455853659719-4b521eebc76d?w=800&h=800&fit=crop",
    caption:
      "Tell me you're a bone broth girlie without telling me you're a bone broth girlie. Chicken @drinkpikora is my coffee replacement three days a week now. #PIKORA",
    postedAt: daysAgo(7),
    creator: {
      name: "Sofia Marquez",
      handle: "@sofiawellness",
      avatarUrl: "https://i.pravatar.cc/150?img=48",
    },
    campaignName: "PIKORA Wellness Mornings",
  },
  {
    id: "cp-08",
    type: "tiktok",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=1200&fit=crop",
    caption:
      "Unboxing the Discovery 3-Pack from @drinkpikora and ranking every flavour for you. Spoiler: Cocoa wins but Veggie is the dark horse. #PIKORA #unboxing",
    postedAt: daysAgo(10),
    creator: {
      name: "Amelia Dufresne",
      handle: "@ameliatries",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
    },
    campaignName: "PIKORA Kitchen Staples",
  },
  {
    id: "cp-09",
    type: "instagram_story",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&h=1200&fit=crop",
    caption:
      "Behind the scenes of my wellness shoot — fuelled entirely by Veggie @drinkpikora and iced matcha. The broth is the unsung hero. #PIKORA #bts",
    postedAt: daysAgo(12),
    creator: {
      name: "Noor Al-Rashid",
      handle: "@noorlifestyle",
      avatarUrl: "https://i.pravatar.cc/150?img=36",
    },
    campaignName: "PIKORA Wellness Mornings",
  },
  {
    id: "cp-10",
    type: "instagram_reel",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1200&fit=crop",
    caption:
      "Making a 5-minute risotto using Chicken @drinkpikora as the stock base and it slapped. Chef's kiss. Recipe in comments. #PIKORA #cookingtok",
    postedAt: daysAgo(15),
    creator: {
      name: "Gabriel Tan",
      handle: "@gabecooks",
      avatarUrl: "https://i.pravatar.cc/150?img=60",
    },
    campaignName: "PIKORA Kitchen Staples",
  },
  {
    id: "cp-11",
    type: "instagram_post",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=800&fit=crop",
    caption:
      "Two weeks into the gut reset and my skin is GLOWING. Drinking Veggie @drinkpikora every morning and it is officially a non-negotiable. #PIKORA #guthealth",
    postedAt: daysAgo(18),
    creator: {
      name: "Isabel Moreau",
      handle: "@isabelglow",
      avatarUrl: "https://i.pravatar.cc/150?img=26",
    },
    campaignName: "PIKORA Gut Reset Challenge",
  },
  {
    id: "cp-12",
    type: "tiktok",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=1200&fit=crop",
    caption:
      "Bone broth latte?? Hear me out. Cocoa @drinkpikora + oat milk + a dash of cinnamon = my new afternoon thing. Trust me. #PIKORA #recipehack",
    postedAt: daysAgo(21),
    creator: {
      name: "Quinn Havelock",
      handle: "@quinneats",
      avatarUrl: "https://i.pravatar.cc/150?img=54",
    },
    campaignName: "PIKORA Spring Launch — Cocoa",
  },
];

export const CREATOR_POSTS: CreatorPost[] = SEED.map((s) => ({
  ...s,
  rightsExpireAt: plus90(s.postedAt),
}));

export const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  tiktok: "TikTok",
  instagram_post: "Instagram Post",
  instagram_reel: "Instagram Reel",
  instagram_story: "Instagram Story",
};
