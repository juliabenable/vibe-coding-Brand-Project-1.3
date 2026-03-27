import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Brain,
  Users,
  Heart,
  DollarSign,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  ThumbsUp,
  Shield,
  Gift,
  CreditCard,
  Tag,
  TrendingUp,
  ExternalLink,
  Bell,
  MessageSquare,
  Home,
  ChevronDown,
  MoreVertical,
  Star,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ease,
  slideInFromRight,
  successBurst,
  starBounce,
} from "@/lib/animations";
import { useThemedAnimations } from "@/lib/use-themed-animations";
import { formatFollowers } from "@/lib/format";

/* ================================================================== */
/*  STEP INDICATOR — matches CreateCampaign style                     */
/* ================================================================== */
const FIND_TALENT_STEPS = [
  "Find Creators",
  "Select Creators",
  "Invite Creators",
  "Campaign Management",
  "Post Gallery",
];

function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  const { checkPop } = useThemedAnimations();
  return (
    <div className="mb-6 flex items-center justify-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isComplete = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isPast = stepNum <= currentStep;
        return (
          <div key={i} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (isPast) onStepClick(stepNum);
              }}
              disabled={!isPast}
              className="flex items-center gap-2 px-2 py-1 rounded-full transition-all"
              style={{ cursor: isPast ? "pointer" : "default" }}
            >
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                initial={false}
                animate={{
                  backgroundColor: isComplete || isCurrent
                    ? "var(--brand-700)"
                    : "var(--neutral-200)",
                  color: isComplete || isCurrent ? "#fff" : "var(--neutral-500)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.35, ease: ease.out }}
              >
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <motion.div key="check" {...checkPop}>
                      <Check className="size-4" />
                    </motion.div>
                  ) : (
                    <motion.span key={`num-${stepNum}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {stepNum}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span
                className="text-xs font-medium hidden sm:inline"
                style={{
                  color: isCurrent
                    ? "var(--brand-700)"
                    : isComplete
                      ? "var(--brand-700)"
                      : "var(--neutral-400)",
                  fontWeight: isCurrent ? 700 : 500,
                }}
              >
                {FIND_TALENT_STEPS[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <div className="mx-1 h-0.5 w-10 rounded-full bg-[var(--neutral-200)] overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--brand-400)", transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isComplete ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: ease.out }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  MOCK DATA — expanded creator pool for discovery                   */
/* ================================================================== */
interface DiscoverableCreator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  followerCount: number;
  engagementRate: number;
  avgLikes: number;
  avgViews: number;
  platforms: string[];
  categories: string[];
  bio: string;
  location: string;
  audienceTopAge: string;
  audienceTopGender: string;
  audienceTopLocation: string;
  matchScore: number;
  matchReasons: string[];
  recentPosts: { thumbnail: string; type: "reel" | "post" | "video"; views: number; likes: number }[];
  isExclusive: boolean;
  avgResponseTime: string;
  completionRate: number;
}

const MOCK_DISCOVERABLE_CREATORS: DiscoverableCreator[] = [
  {
    id: "dc-001",
    name: "Jessica Morales",
    handle: "@jessicabeauty",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop&crop=face",
    followerCount: 820,
    engagementRate: 6.8,
    avgLikes: 56,
    avgViews: 340,
    platforms: ["instagram", "benable"],
    categories: ["Beauty", "Skincare"],
    bio: "Clean beauty obsessed. Skincare minimalist sharing what actually works.",
    location: "Los Angeles, CA",
    audienceTopAge: "18-24",
    audienceTopGender: "82% Female",
    audienceTopLocation: "US (71%)",
    matchScore: 96,
    matchReasons: [
      "Already recommends 3 clean beauty products",
      "High engagement in your niche",
      "Benable exclusive creator",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
        type: "reel",
        views: 1200,
        likes: 89,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop",
        type: "post",
        views: 890,
        likes: 67,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop",
        type: "reel",
        views: 2100,
        likes: 145,
      },
    ],
    isExclusive: true,
    avgResponseTime: "< 2 hours",
    completionRate: 100,
  },
  {
    id: "dc-002",
    name: "Chelsea Park",
    handle: "@chelseaglow",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop&crop=face",
    followerCount: 2400,
    engagementRate: 4.2,
    avgLikes: 101,
    avgViews: 780,
    platforms: ["instagram", "tiktok", "benable"],
    categories: ["Beauty", "Lifestyle"],
    bio: "Everyday beauty & lifestyle. Making the every-day feel luxe without the price tag.",
    location: "New York, NY",
    audienceTopAge: "25-34",
    audienceTopGender: "76% Female",
    audienceTopLocation: "US (58%)",
    matchScore: 91,
    matchReasons: [
      "Strong engagement in Beauty + Lifestyle",
      "Multi-platform reach",
      "Previous brand collab experience",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop",
        type: "video",
        views: 3400,
        likes: 212,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop",
        type: "reel",
        views: 1800,
        likes: 134,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=200&h=200&fit=crop",
        type: "post",
        views: 920,
        likes: 78,
      },
    ],
    isExclusive: false,
    avgResponseTime: "< 6 hours",
    completionRate: 95,
  },
  {
    id: "dc-003",
    name: "Cassidy Nguyen",
    handle: "@cassidywellness",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=750&fit=crop&crop=face",
    followerCount: 340,
    engagementRate: 9.1,
    avgLikes: 31,
    avgViews: 210,
    platforms: ["benable"],
    categories: ["Wellness", "Skincare"],
    bio: "Wellness from the inside out. Sharing my clean living journey.",
    location: "Austin, TX",
    audienceTopAge: "18-24",
    audienceTopGender: "88% Female",
    audienceTopLocation: "US (83%)",
    matchScore: 88,
    matchReasons: [
      "Ultra-high engagement rate",
      "Benable exclusive — not on other platforms",
      "Perfect audience demographic match",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop",
        type: "post",
        views: 310,
        likes: 28,
      },
    ],
    isExclusive: true,
    avgResponseTime: "< 1 hour",
    completionRate: 100,
  },
  {
    id: "dc-004",
    name: "Amara Johnson",
    handle: "@amarabeautyco",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=750&fit=crop&crop=face",
    followerCount: 5200,
    engagementRate: 3.8,
    avgLikes: 198,
    avgViews: 1500,
    platforms: ["instagram", "tiktok", "benable"],
    categories: ["Beauty", "Fashion"],
    bio: "Beauty & fashion creator. Discovering and sharing new favorites every week.",
    location: "Chicago, IL",
    audienceTopAge: "25-34",
    audienceTopGender: "74% Female",
    audienceTopLocation: "US (52%)",
    matchScore: 85,
    matchReasons: [
      "Growing creator with strong momentum",
      "Multi-platform content creator",
      "Proven brand collaboration track record",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop",
        type: "reel",
        views: 4200,
        likes: 289,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop",
        type: "video",
        views: 2800,
        likes: 178,
      },
    ],
    isExclusive: false,
    avgResponseTime: "< 4 hours",
    completionRate: 92,
  },
  {
    id: "dc-005",
    name: "Taylor Kim",
    handle: "@taylorkbeauty",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=750&fit=crop&crop=face",
    followerCount: 1800,
    engagementRate: 5.4,
    avgLikes: 97,
    avgViews: 620,
    platforms: ["instagram", "benable"],
    categories: ["Beauty", "Skincare"],
    bio: "Skincare science nerd. Honest reviews on what's worth the hype.",
    location: "San Francisco, CA",
    audienceTopAge: "18-24",
    audienceTopGender: "85% Female",
    audienceTopLocation: "US (68%)",
    matchScore: 93,
    matchReasons: [
      "Skincare niche expert — perfect category alignment",
      "Benable exclusive creator",
      "Science-based content builds trust",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=200&h=200&fit=crop",
        type: "reel",
        views: 1900,
        likes: 134,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop",
        type: "post",
        views: 780,
        likes: 56,
      },
    ],
    isExclusive: true,
    avgResponseTime: "< 3 hours",
    completionRate: 98,
  },
  {
    id: "dc-006",
    name: "Maya Rodriguez",
    handle: "@mayaglows",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=750&fit=crop&crop=face",
    followerCount: 670,
    engagementRate: 7.3,
    avgLikes: 49,
    avgViews: 380,
    platforms: ["instagram", "benable"],
    categories: ["Beauty", "Wellness", "Lifestyle"],
    bio: "Glowing skin advocate. Sharing my journey to finding products that truly work.",
    location: "Miami, FL",
    audienceTopAge: "18-24",
    audienceTopGender: "80% Female",
    audienceTopLocation: "US (65%)",
    matchScore: 82,
    matchReasons: [
      "Very high engagement rate",
      "Content style aligns with brand aesthetic",
      "Growing rapidly in Beauty niche",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop",
        type: "reel",
        views: 890,
        likes: 67,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
        type: "post",
        views: 450,
        likes: 34,
      },
    ],
    isExclusive: false,
    avgResponseTime: "< 8 hours",
    completionRate: 90,
  },
  {
    id: "dc-007",
    name: "Lily Chen",
    handle: "@lilyskintips",
    avatar: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=600&h=750&fit=crop&crop=face",
    followerCount: 1100,
    engagementRate: 5.9,
    avgLikes: 65,
    avgViews: 490,
    platforms: ["instagram", "tiktok", "benable"],
    categories: ["Skincare", "Beauty"],
    bio: "Your skincare bestie. Affordable picks that deliver results.",
    location: "Seattle, WA",
    audienceTopAge: "18-24",
    audienceTopGender: "79% Female",
    audienceTopLocation: "US (72%)",
    matchScore: 87,
    matchReasons: [
      "Affordable beauty niche — authentic recommendations",
      "Strong TikTok presence for video content",
      "Audience loves product discovery content",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=200&h=200&fit=crop",
        type: "video",
        views: 1600,
        likes: 98,
      },
      {
        thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop",
        type: "reel",
        views: 1200,
        likes: 76,
      },
    ],
    isExclusive: false,
    avgResponseTime: "< 5 hours",
    completionRate: 94,
  },
  {
    id: "dc-008",
    name: "Nina Patel",
    handle: "@ninabeautybox",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=600&h=750&fit=crop&crop=face",
    followerCount: 450,
    engagementRate: 8.2,
    avgLikes: 37,
    avgViews: 290,
    platforms: ["benable"],
    categories: ["Beauty", "Skincare", "Wellness"],
    bio: "Curating my favorite beauty finds. Real reviews, real results.",
    location: "Portland, OR",
    audienceTopAge: "25-34",
    audienceTopGender: "86% Female",
    audienceTopLocation: "US (77%)",
    matchScore: 79,
    matchReasons: [
      "Benable exclusive with loyal following",
      "High trust factor — audience engages deeply",
      "Perfect demographic overlap",
    ],
    recentPosts: [
      {
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
        type: "post",
        views: 380,
        likes: 31,
      },
    ],
    isExclusive: true,
    avgResponseTime: "< 2 hours",
    completionRate: 100,
  },
];

/* ================================================================== */
/*  AI MATCHING LOADING SCREEN                                        */
/* ================================================================== */
function AIMatchingScreen({ onComplete }: { onComplete: () => void }) {
  const { pageVariants, pulseRing } = useThemedAnimations();
  const [activeStage, setActiveStage] = useState(0);
  const [alertReady, setAlertReady] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStage(1), 1500),
      setTimeout(() => setActiveStage(2), 3000),
      setTimeout(() => {
        setActiveStage(2);
        setAlertReady(true);
      }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const stages = [
    {
      label: "Requirement Analysis",
      desc: "Reviewing campaign brief and targeting criteria",
    },
    {
      label: "Expert Talent Sourcing",
      desc: "Our team is hand-selecting creators for your brand",
    },
    {
      label: "Compliance & Brand Fit Audit",
      desc: "Verifying creator alignment with brand values",
    },
    {
      label: "Final List Generation",
      desc: "Compiling your personalized creator shortlist",
    },
  ];

  return (
    <motion.div
      className="min-h-[60vh] flex flex-col items-center justify-center"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          {/* Animated pulse ring behind badge */}
          <div className="relative inline-block mb-4">
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--brand-300)]"
              variants={pulseRing}
              animate="animate"
              style={{ filter: "blur(8px)" }}
            />
            <motion.div
              className="relative inline-flex items-center gap-2 rounded-full bg-[var(--brand-0)] border border-[var(--brand-200)] px-4 py-1.5 text-xs font-medium text-[var(--brand-700)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: ease.spring }}
            >
              <Shield className="size-3.5" />
              HUMAN-VETTED PROCESS
            </motion.div>
          </div>
          <motion.h2
            className="text-2xl font-bold text-[var(--neutral-800)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Quality takes time
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-[var(--neutral-500)] max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            We're hand-picking creators who are the perfect fit for your campaign.
          </motion.p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <Card className="border-[var(--neutral-200)]">
              <div className="px-5 py-3 border-b border-[var(--neutral-100)]">
                <h3 className="text-sm font-bold text-[var(--neutral-800)]">
                  Campaign Status
                </h3>
              </div>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {stages.map((stage, i) => {
                    const isComplete = i < activeStage;
                    const isCurrent = i === activeStage;
                    return (
                      <div key={stage.label} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isComplete ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--green-500)]">
                              <Check className="size-3.5 text-white" />
                            </div>
                          ) : isCurrent ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--brand-600)]">
                              <div className="h-2.5 w-2.5 rounded-full bg-[var(--brand-600)] animate-pulse" />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--neutral-200)]">
                              <div className="h-2 w-2 rounded-full bg-[var(--neutral-300)]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              isComplete
                                ? "text-[var(--green-700)]"
                                : isCurrent
                                  ? "text-[var(--neutral-800)]"
                                  : "text-[var(--neutral-400)]"
                            }`}
                          >
                            {stage.label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              isComplete || isCurrent
                                ? "text-[var(--neutral-500)]"
                                : "text-[var(--neutral-300)]"
                            }`}
                          >
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                {
                  icon: Heart,
                  title: "Human Nuance",
                  desc: "Real people review every match",
                },
                {
                  icon: Shield,
                  title: "Rigorous Vetting",
                  desc: "Brand safety & compliance checks",
                },
                {
                  icon: MessageSquare,
                  title: "Personalized Pitch",
                  desc: "Tailored outreach for each creator",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-xl border border-[var(--neutral-200)] p-4 text-center"
                >
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-100)]">
                    <feat.icon className="size-4 text-[var(--brand-700)]" />
                  </div>
                  <p className="text-xs font-semibold text-[var(--neutral-800)]">
                    {feat.title}
                  </p>
                  <p className="text-[10px] text-[var(--neutral-500)] mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <Card className="border-[var(--neutral-200)]">
              <div className="px-5 py-3 border-b border-[var(--neutral-100)]">
                <h3 className="text-sm font-bold text-[var(--neutral-800)]">
                  Ready Alert
                </h3>
              </div>
              <CardContent className="p-5">
                <p className="text-xs text-[var(--neutral-500)] mb-4">
                  We'll notify you when your creator matches are ready for review.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)] p-3">
                    <div className="flex items-center gap-2">
                      <Bell className="size-4 text-[var(--brand-700)]" />
                      <span className="text-sm text-[var(--neutral-800)]">
                        Email notification
                      </span>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-[var(--brand-600)] relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)] p-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-4 text-[var(--brand-700)]" />
                      <span className="text-sm text-[var(--neutral-800)]">
                        SMS notification
                      </span>
                    </div>
                    <div className="h-5 w-9 rounded-full bg-[var(--neutral-300)] relative cursor-pointer">
                      <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                {alertReady && (
                  <motion.div
                    className="mt-4 p-3 rounded-lg bg-[var(--green-100)] border border-[var(--green-300)]"
                    variants={slideInFromRight}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div {...successBurst}>
                        <CheckCircle2 className="size-4 text-[var(--green-600)]" />
                      </motion.div>
                      <p className="text-sm font-semibold text-[var(--green-700)]">
                        Matches Ready!
                      </p>
                    </div>
                    <p className="text-xs text-[var(--green-600)]">
                      Your creator shortlist is ready for review.
                    </p>
                  </motion.div>
                )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <div className="mt-4 space-y-2">
              <Button
                onClick={onComplete}
                className="w-full gap-2 rounded-xl bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)]"
                disabled={!alertReady}
              >
                View Creator Matches
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="w-full gap-2 text-[var(--neutral-500)] hover:text-[var(--brand-700)]"
                onClick={() => (window.location.hash = "/")}
              >
                <Home className="size-4" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  CREATOR DETAIL POPUP                                              */
/* ================================================================== */
function CreatorDetailDialog({
  creator,
  open,
  onClose,
  isSelected,
  onToggleSelect,
}: {
  creator: DiscoverableCreator | null;
  open: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  if (!creator) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={creator.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-14 w-14 rounded-full border-3 border-white object-cover shadow-lg"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{creator.name}</h3>
              <p className="text-sm text-white/80">{creator.handle}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 shadow">
            <Sparkles className="size-3.5 text-[var(--brand-700)]" />
            <span className="text-sm font-bold text-[var(--brand-700)]">
              {creator.matchScore}% match
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-[var(--brand-0)] border border-[var(--brand-300)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="size-4 text-[var(--brand-700)]" />
              <span className="text-sm font-semibold text-[var(--brand-700)]">
                Why Benable AI chose this creator
              </span>
            </div>
            <div className="space-y-1.5">
              {creator.matchReasons.map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[var(--neutral-700)]">
                  <Check className="size-3 text-[var(--green-500)] shrink-0" />
                  {reason}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Followers",
                value: formatFollowers(creator.followerCount),
                icon: Users,
              },
              {
                label: "Engagement",
                value: `${creator.engagementRate}%`,
                icon: Heart,
              },
              {
                label: "Avg. Views",
                value: formatFollowers(creator.avgViews),
                icon: Eye,
              },
              {
                label: "Avg. Likes",
                value: formatFollowers(creator.avgLikes),
                icon: ThumbsUp,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[var(--neutral-200)] p-3 text-center"
              >
                <stat.icon className="size-4 mx-auto mb-1 text-[var(--neutral-500)]" />
                <p className="text-lg font-bold text-[var(--neutral-800)]">
                  {stat.value}
                </p>
                <p className="text-[10px] text-[var(--neutral-500)]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm text-[var(--neutral-600)] leading-relaxed">
              {creator.bio}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {creator.categories.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="text-[10px] border-[var(--neutral-200)]"
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-[var(--neutral-100)] p-3">
              <p className="text-[10px] text-[var(--neutral-500)] mb-1">Top Age</p>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">
                {creator.audienceTopAge}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--neutral-100)] p-3">
              <p className="text-[10px] text-[var(--neutral-500)] mb-1">
                Gender Split
              </p>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">
                {creator.audienceTopGender}
              </p>
            </div>
            <div className="rounded-lg bg-[var(--neutral-100)] p-3">
              <p className="text-[10px] text-[var(--neutral-500)] mb-1">
                Location
              </p>
              <p className="text-sm font-semibold text-[var(--neutral-800)]">
                {creator.audienceTopLocation}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--neutral-800)] mb-3">
              Recent Content
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {creator.recentPosts.map((post, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                  <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-xs text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Eye className="size-3" /> {formatFollowers(post.views)}
                        <Heart className="size-3" /> {formatFollowers(post.likes)}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1.5 right-1.5">
                    <Badge className="text-[9px] px-1.5 py-0 bg-black/60 border-0 text-white">
                      {post.type === "reel" ? "Reel" : post.type === "video" ? "Video" : "Post"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 border-t border-[var(--neutral-200)] pt-4">
            <div className="flex items-center gap-2 text-xs text-[var(--neutral-600)]">
              <Clock className="size-3.5" /> Avg. response: {creator.avgResponseTime}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--neutral-600)]">
              <CheckCircle2 className="size-3.5 text-[var(--green-500)]" />{" "}
              {creator.completionRate}% completion rate
            </div>
            {creator.isExclusive && (
              <div className="flex items-center gap-2 text-xs text-[var(--brand-700)]">
                <Shield className="size-3.5" /> Benable Exclusive
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              onToggleSelect();
              if (!isSelected) onClose();
            }}
            className={`w-full gap-2 ${
              isSelected
                ? "bg-[var(--neutral-200)] text-[var(--neutral-700)] hover:bg-[var(--neutral-300)]"
                : "bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            }`}
          >
            {isSelected ? (
              <>
                <X className="size-4" /> Remove from Campaign
              </>
            ) : (
              <>
                <UserPlus className="size-4" /> Add to Campaign
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/*  CREATOR SELECTION GRID                                            */
/* ================================================================== */
function StepCreatorSelection({
  creators,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onViewDetail,
  onNext,
}: {
  creators: DiscoverableCreator[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewDetail: (creator: DiscoverableCreator) => void;
  onNext: () => void;
}) {
  const { pageVariants, staggerContainerSlow, staggerItem, cardHover, checkPop, buttonTap } = useThemedAnimations();
  const sortedCreators = [...creators].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-700)]"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Sparkles className="size-4 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-[var(--neutral-800)]">
              Creator Selection
            </h2>
          </div>
          <p className="text-sm text-[var(--neutral-500)]">
            {sortedCreators.length} creators matched to your campaign — ranked by fit score
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 h-12">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selected.size === sortedCreators.length && sortedCreators.length > 0}
            onCheckedChange={(c) => (c ? onSelectAll() : onDeselectAll())}
            className="data-[state=checked]:bg-[var(--brand-700)] data-[state=checked]:border-[var(--brand-700)]"
          />
          <span className="text-sm text-[var(--neutral-600)] min-w-[200px]">
            {selected.size > 0 ? (
              <>
                <span className="font-semibold text-[var(--brand-700)]">{selected.size}</span> creator
                {selected.size !== 1 ? "s" : ""} selected
              </>
            ) : (
              "Select creators to add to your campaign"
            )}
          </span>
        </div>
        {selected.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[var(--neutral-500)]"
            onClick={onDeselectAll}
          >
            Clear selection
          </Button>
        )}
      </div>

      <motion.div
        className="grid grid-cols-4 gap-4"
        variants={staggerContainerSlow}
        initial="initial"
        animate="animate"
      >
        {sortedCreators.map((creator) => {
          const isSelected = selected.has(creator.id);
          return (
            <motion.div
              key={creator.id}
              className="group relative overflow-hidden rounded-xl border-2 cursor-pointer"
              style={{
                borderColor: isSelected ? "var(--brand-600)" : "transparent",
              }}
              variants={isSelected ? staggerItem : { ...staggerItem, ...cardHover }}
              initial="initial"
              whileHover="hover"
              animate="animate"
            >
              <div
                className="absolute top-3 left-3 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(creator.id);
                }}
              >
                <motion.div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  animate={{
                    backgroundColor: isSelected ? "var(--green-500)" : "rgba(255,255,255,0.85)",
                    scale: isSelected ? 1.1 : 1,
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                    backdropFilter: isSelected ? "none" : "blur(4px)",
                    border: isSelected ? "none" : "1.5px solid var(--neutral-300)",
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div {...checkPop}>
                        <Check className="size-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 shadow-sm">
                  <Sparkles className="size-3 text-[var(--brand-700)]" />
                  <span className="text-[11px] font-bold text-[var(--brand-700)]">
                    {creator.matchScore}%
                  </span>
                </div>
              </div>

              <div className="aspect-[4/5] overflow-hidden" onClick={() => onViewDetail(creator)}>
                <img
                  src={creator.coverImage}
                  alt={creator.name}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-95"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              </div>

              <div className="p-3" onClick={() => onViewDetail(creator)}>
                <div className="flex items-center gap-2">
                  <img
                    src={creator.avatar}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover border border-white shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--neutral-800)] truncate">
                      {creator.name}
                    </p>
                    <p className="text-[11px] text-[var(--neutral-500)] truncate">
                      {creator.handle}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--neutral-500)]">
                  <span className="font-medium text-[var(--neutral-700)]">
                    {formatFollowers(creator.followerCount)} followers
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Heart className="size-3 text-[var(--brand-400)]" /> {creator.engagementRate}%
                  </span>
                  {creator.isExclusive && (
                    <Badge className="text-[9px] px-1.5 py-0 bg-[var(--brand-100)] text-[var(--brand-700)] border-0">
                      Exclusive
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <div />
        <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTap}>
          <Button
            className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={onNext}
            disabled={selected.size === 0}
          >
            Continue with {selected.size} Creator{selected.size !== 1 ? "s" : ""}{" "}
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  COMPENSATION DROPDOWN OPTIONS                                     */
/* ================================================================== */
const COMP_OPTIONS = [
  { value: "gifted", label: "Gifted Product", icon: Gift, color: "var(--brand-700)" },
  { value: "gift_card", label: "Gift Card", icon: CreditCard, color: "var(--blue-700)" },
  { value: "discount", label: "Discount Code", icon: Tag, color: "var(--green-700)" },
  { value: "paid", label: "Paid Fee", icon: DollarSign, color: "var(--orange-700)" },
  {
    value: "commission_boost",
    label: "Commission Boost",
    icon: TrendingUp,
    color: "#7B61C2",
  },
];

/* ================================================================== */
/*  INVITE STATUS CONFIG — updated for V3                             */
/* ================================================================== */
type InviteStatus =
  | "pending"
  | "invited"
  | "interested"
  | "accepted"
  | "code_sent"
  | "placed_order"
  | "received"
  | "creating_content"
  | "in_review"
  | "ready_to_post"
  | "posted";

interface ManagedCreator {
  creator: DiscoverableCreator;
  inviteStatus: InviteStatus;
  compensationType: string;
  compensationDetail: string;
  contentDueDate: string;
  productCode?: string;
  orderStatus?: "pending" | "placed" | "received";
  contentSubmission?: {
    thumbnail: string;
    type: string;
    caption: string;
    submittedAt: string;
    aiReviewScore: number;
    aiReviewNotes: string[];
    aiIssues: string[];
    brandReviewStatus: "pending" | "approved" | "revision_requested";
    brandComments: { text: string; from: "brand" | "creator"; at: string }[];
  };
  isFavorite?: boolean;
}

const INVITE_STATUS_CONFIG: Record<InviteStatus, { label: string; color: string; bg: string }> =
  {
    pending: { label: "Pending", color: "var(--neutral-600)", bg: "var(--neutral-100)" },
    invited: { label: "Invited", color: "var(--brand-700)", bg: "var(--brand-100)" },
    interested: { label: "Interested", color: "var(--blue-700)", bg: "var(--blue-100)" },
    accepted: { label: "Accepted", color: "var(--green-700)", bg: "var(--green-100)" },
    code_sent: { label: "Code Sent", color: "var(--brand-700)", bg: "var(--brand-100)" },
    placed_order: { label: "Placed Order", color: "var(--orange-700)", bg: "var(--orange-100)" },
    received: { label: "Received", color: "var(--green-700)", bg: "var(--green-100)" },
    creating_content: { label: "Creating Content", color: "var(--brand-700)", bg: "var(--brand-100)" },
    in_review: { label: "In Review", color: "var(--blue-700)", bg: "var(--blue-100)" },
    ready_to_post: { label: "Ready to Post", color: "var(--blue-700)", bg: "var(--blue-100)" },
    posted: { label: "Posted", color: "var(--green-700)", bg: "var(--green-100)" },
  };

const STATUS_FLOW: InviteStatus[] = [
  "pending",
  "invited",
  "interested",
  "accepted",
  "code_sent",
  "placed_order",
  "received",
  "creating_content",
  "in_review",
  "ready_to_post",
  "posted",
];

/* ================================================================== */
/*  STEP 3: INVITE CREATORS                                           */
/* ================================================================== */
function StepInviteCreators({
  managedCreators,
  onBack,
  onNext,
}: {
  managedCreators: ManagedCreator[];
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-700)]">
            <UserPlus className="size-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[var(--neutral-800)]">Invite Creators</h2>
        </div>
        <p className="text-sm text-[var(--neutral-500)]">
          Review selected creators and send invitations
        </p>
      </div>

      {/* Creator recap cards */}
      <div className="grid grid-cols-2 gap-4">
        {managedCreators.map((mc) => (
          <Card key={mc.creator.id} className="border-[var(--neutral-200)]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img
                  src={mc.creator.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[var(--neutral-800)]">{mc.creator.name}</p>
                    <Badge className="text-[10px] bg-[var(--brand-100)] text-[var(--brand-700)] border-0">
                      {mc.creator.matchScore}%
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--neutral-500)]">{mc.creator.handle}</p>
                  <div className="mt-2 text-xs text-[var(--neutral-600)]">
                    <span className="font-medium">{COMP_OPTIONS.find((c) => c.value === mc.compensationType)?.label}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contract/Brief preview */}
      <Card className="border-[var(--neutral-200)]">
        <div className="px-5 py-3 border-b border-[var(--neutral-100)]">
          <h3 className="text-sm font-bold text-[var(--neutral-800)]">Campaign Brief</h3>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Campaign
            </p>
            <p className="text-sm font-medium text-[var(--neutral-800)]">
              Melted Balm Spring Launch
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Total Creators
            </p>
            <p className="text-sm font-medium text-[var(--neutral-800)]">{managedCreators.length}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wide">
              Content Due
            </p>
            <p className="text-sm font-medium text-[var(--neutral-800)]">
              {managedCreators[0]?.contentDueDate || "TBD"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <Button
          variant="outline"
          className="gap-2 border-[var(--neutral-200)]"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" /> Back to Selection
        </Button>
        <Button
          className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
          onClick={onNext}
        >
          Invite All Selected Creators <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 4: CAMPAIGN MANAGEMENT — V3 with Code Mgmt                   */
/* ================================================================== */
function StepCreatorManagement({
  managedCreators,
  setManagedCreators,
  onBack,
  onComplete,
}: {
  managedCreators: ManagedCreator[];
  setManagedCreators: React.Dispatch<React.SetStateAction<ManagedCreator[]>>;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [reviewCreator, setReviewCreator] = useState<ManagedCreator | null>(null);
  const [kudosCreatorId, setKudosCreatorId] = useState<string | null>(null);
  const [kudosText, setKudosText] = useState(
    "Thank you so much for the amazing content! We loved working with you."
  );
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);

  const changeStatus = (id: string, newStatus: InviteStatus) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, inviteStatus: newStatus } : mc
      )
    );
    setStatusDropdownId(null);
  };

  const updateCompType = (id: string, type: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, compensationType: type } : mc
      )
    );
  };

  const updateProductCode = (id: string, code: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, productCode: code } : mc
      )
    );
  };

  const sendCode = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, inviteStatus: "code_sent" } : mc
      )
    );
  };

  const removeCreator = (id: string) => {
    setManagedCreators((prev) => prev.filter((mc) => mc.creator.id !== id));
  };

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mc of managedCreators) {
      const key = mc.inviteStatus;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [managedCreators]);

  const CreatorRow = ({ mc }: { mc: ManagedCreator }) => {
    const statusStyle = INVITE_STATUS_CONFIG[mc.inviteStatus];
    return (
      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--neutral-50)] transition-colors">
        {/* Creator info */}
        <div className="flex items-center gap-3 w-44 shrink-0">
          <img
            src={mc.creator.avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--neutral-800)] truncate">
              {mc.creator.name}
            </p>
            <p className="text-xs text-[var(--neutral-500)] truncate">{mc.creator.handle}</p>
          </div>
        </div>

        {/* Status */}
        <div className="w-36 shrink-0 relative">
          <button
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            onClick={() =>
              setStatusDropdownId(statusDropdownId === mc.creator.id ? null : mc.creator.id)
            }
          >
            {statusStyle.label}
            <ChevronDown className="size-3" />
          </button>
          {statusDropdownId === mc.creator.id && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setStatusDropdownId(null)} />
              <div className="absolute top-8 left-0 z-30 w-48 rounded-lg border border-[var(--neutral-200)] bg-white shadow-lg py-1 max-h-60 overflow-y-auto">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-[var(--neutral-50)] text-left"
                    style={{ color: INVITE_STATUS_CONFIG[s].color }}
                    onClick={() => changeStatus(mc.creator.id, s)}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: INVITE_STATUS_CONFIG[s].color }}
                    />
                    {INVITE_STATUS_CONFIG[s].label}
                    {mc.inviteStatus === s && <Check className="size-3 ml-auto" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Compensation */}
        <div className="w-40 shrink-0">
          <Select value={mc.compensationType} onValueChange={(v) => updateCompType(mc.creator.id, v)}>
            <SelectTrigger className="h-8 text-xs border-[var(--neutral-200)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMP_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-1.5">
                    <opt.icon className="size-3" style={{ color: opt.color }} />
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        <div className="w-24 shrink-0">
          {mc.contentSubmission && ["in_review", "ready_to_post"].includes(mc.inviteStatus) ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 border-[var(--brand-400)] text-[var(--brand-700)]"
              onClick={() => setReviewCreator(mc)}
            >
              <Eye className="size-3" /> Review
            </Button>
          ) : mc.contentSubmission && ["posted"].includes(mc.inviteStatus) ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 border-[var(--neutral-300)] text-[var(--neutral-600)]"
              onClick={() => setReviewCreator(mc)}
            >
              <Eye className="size-3" /> View
            </Button>
          ) : (
            <span className="text-xs text-[var(--neutral-400)]">—</span>
          )}
        </div>

        {/* Action */}
        <div className="flex-1 flex justify-end gap-2 items-center">
          {mc.inviteStatus === "accepted" && !mc.productCode && (
            <span className="text-xs text-[var(--neutral-400)] italic">Waiting for code...</span>
          )}
          {mc.inviteStatus === "ready_to_post" && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1 border-[var(--green-300)] text-[var(--green-700)]"
              onClick={() => changeStatus(mc.creator.id, "posted")}
            >
              <ExternalLink className="size-3" /> Mark Posted
            </Button>
          )}
          {mc.inviteStatus === "posted" && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1 border-[var(--brand-300)] text-[var(--brand-700)]"
                onClick={() => {
                  setKudosCreatorId(mc.creator.id);
                }}
              >
                <ThumbsUp className="size-3" /> Send Kudos
              </Button>
              <Badge className="text-[11px] bg-[var(--green-100)] text-[var(--green-700)] border-0 gap-1">
                <CheckCircle2 className="size-3" /> Live
              </Badge>
            </div>
          )}

          {/* Three-dot menu */}
          <div className="relative">
            <button
              type="button"
              className="p-1 hover:bg-[var(--neutral-100)] rounded transition-colors"
              onClick={() => setMoreMenuId(moreMenuId === mc.creator.id ? null : mc.creator.id)}
            >
              <MoreVertical className="size-4 text-[var(--neutral-400)]" />
            </button>
            {moreMenuId === mc.creator.id && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMoreMenuId(null)} />
                <div className="absolute top-8 right-0 z-30 w-48 rounded-lg border border-[var(--neutral-200)] bg-white shadow-lg py-1">
                  <button
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-[var(--neutral-50)] text-left text-[var(--red-700)]"
                    onClick={() => {
                      removeCreator(mc.creator.id);
                      setMoreMenuId(null);
                    }}
                  >
                    <X className="size-3" />
                    Remove from Campaign
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const allPosted = managedCreators.length > 0 && managedCreators.every((mc) => mc.inviteStatus === "posted");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--neutral-800)]">Campaign Management</h2>
          <p className="text-sm text-[var(--neutral-500)]">
            Manage codes, track orders, and review content
          </p>
        </div>
      </div>

      {/* Stage tracker */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FLOW.filter((s) => stageCounts[s]).map((s) => (
          <div
            key={s}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium"
            style={{
              backgroundColor: INVITE_STATUS_CONFIG[s].bg,
              color: INVITE_STATUS_CONFIG[s].color,
            }}
          >
            {INVITE_STATUS_CONFIG[s].label}
            <span className="font-bold">{stageCounts[s]}</span>
          </div>
        ))}
      </div>

      {/* Code Management Section */}
      <Card className="border-[var(--neutral-200)]">
        <div className="px-5 py-3 border-b border-[var(--neutral-100)]">
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-[var(--brand-700)]" />
            <h3 className="text-sm font-bold text-[var(--neutral-800)]">Code Management</h3>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Yellow notice */}
            <div className="rounded-lg bg-[var(--yellow-50)] border border-[var(--yellow-200)] p-3 flex gap-2">
              <AlertCircle className="size-4 text-[var(--yellow-700)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--yellow-700)]">
                Night-hour sends (after 9PM) will deliver at 7AM
              </p>
            </div>

            {/* Code table */}
            <div className="space-y-2">
              {managedCreators.map((mc) => (
                <div key={mc.creator.id} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--neutral-200)]">
                  <img
                    src={mc.creator.avatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--neutral-800)]">
                      {mc.creator.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code..."
                      value={mc.productCode || ""}
                      onChange={(e) => updateProductCode(mc.creator.id, e.target.value)}
                      className="h-8 text-xs border-[var(--neutral-200)] w-32"
                    />
                    <Button
                      size="sm"
                      className="text-xs gap-1 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                      onClick={() => sendCode(mc.creator.id)}
                      disabled={!mc.productCode}
                    >
                      <Send className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* CSV upload */}
            <Button
              variant="outline"
              className="w-full gap-2 text-[var(--brand-700)] border-[var(--brand-300)]"
            >
              <Upload className="size-4" />
              Bulk Upload CSV
            </Button>

            <p className="text-xs text-[var(--neutral-500)]">
              Codes will be sent via email from collabs@benable.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Creators table */}
      <Card className="overflow-visible border-[var(--neutral-200)]">
        <div className="px-5 py-3 border-b border-[var(--neutral-100)]">
          <h3 className="text-sm font-bold text-[var(--neutral-800)]">
            Creators ({managedCreators.length})
          </h3>
        </div>
        <div className="divide-y divide-[var(--neutral-100)]">
          {managedCreators.map((mc) => (
            <CreatorRow key={mc.creator.id} mc={mc} />
          ))}
        </div>
      </Card>

      {/* Content Review Dialog */}
      {reviewCreator && reviewCreator.contentSubmission && (
        <Dialog open={!!reviewCreator} onOpenChange={() => setReviewCreator(null)}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-3">
                <img
                  src={reviewCreator.creator.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <span>{reviewCreator.creator.name}</span>
                  <p className="text-xs font-normal text-[var(--neutral-500)]">
                    {reviewCreator.inviteStatus === "posted"
                      ? "Content Preview"
                      : "Content Review"}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-5">
              {/* Content preview */}
              <div className="rounded-lg overflow-hidden border border-[var(--neutral-200)]">
                <img
                  src={reviewCreator.contentSubmission.thumbnail}
                  alt=""
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-[var(--neutral-800)]">
                    {reviewCreator.contentSubmission.caption}
                  </p>
                  <p className="text-xs text-[var(--neutral-400)] mt-2">
                    Submitted {reviewCreator.contentSubmission.submittedAt} ·{" "}
                    {reviewCreator.contentSubmission.type}
                  </p>
                </div>
              </div>

              {/* Compliance Check — info only for brand */}
              <div className="rounded-xl border border-[var(--brand-300)] bg-[var(--brand-0)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-[var(--brand-700)]" />
                    <span className="text-sm font-semibold text-[var(--brand-700)]">
                      Compliance Check (by Benable team)
                    </span>
                  </div>
                  <Badge
                    className="text-[11px] border-0"
                    style={{
                      backgroundColor:
                        reviewCreator.contentSubmission.aiReviewScore >= 80
                          ? "var(--green-100)"
                          : "var(--orange-100)",
                      color:
                        reviewCreator.contentSubmission.aiReviewScore >= 80
                          ? "var(--green-700)"
                          : "var(--orange-700)",
                    }}
                  >
                    {reviewCreator.contentSubmission.aiReviewScore}% compliant
                  </Badge>
                </div>
                <div className="space-y-1.5 mb-3">
                  {reviewCreator.contentSubmission.aiReviewNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--neutral-700)]">
                      <CheckCircle2 className="size-3.5 text-[var(--green-500)] mt-0.5 shrink-0" />
                      {note}
                    </div>
                  ))}
                  {reviewCreator.contentSubmission.aiIssues.map((issue, i) => (
                    <div
                      key={`issue-${i}`}
                      className="flex items-start gap-2 text-xs text-[var(--orange-700)]"
                    >
                      <AlertCircle className="size-3.5 text-[var(--orange-500)] mt-0.5 shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--neutral-600)]">
                  Content review is handled by our team. You'll be notified when content is
                  ready to post.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Kudos Dialog */}
      {kudosCreatorId && (
        <Dialog open={!!kudosCreatorId} onOpenChange={() => setKudosCreatorId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ThumbsUp className="size-5 text-[var(--brand-700)]" />
                Send Thank You
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-[var(--neutral-600)]">
                Send a thank you message to{" "}
                {managedCreators.find((mc) => mc.creator.id === kudosCreatorId)?.creator.name} for
                their great work.
              </p>
              <textarea
                className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
                rows={3}
                value={kudosText}
                onChange={(e) => setKudosText(e.target.value)}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setKudosCreatorId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                  onClick={() => setKudosCreatorId(null)}
                >
                  <Send className="size-4" /> Send Thank You
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <Button variant="outline" className="gap-2 border-[var(--neutral-200)]" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        {allPosted ? (
          <Button
            className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={onComplete}
          >
            Continue to Gallery <ArrowRight className="size-4" />
          </Button>
        ) : (
          <p className="text-xs text-[var(--neutral-400)]">
            Track progress as creators submit and post content.
          </p>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 5: POST GALLERY & COMPLETE                                   */
/* ================================================================== */
function StepPostGallery({
  managedCreators,
  setManagedCreators,
}: {
  managedCreators: ManagedCreator[];
  setManagedCreators: React.Dispatch<React.SetStateAction<ManagedCreator[]>>;
}) {
  const { pageVariants, staggerContainerSlow, staggerItem, cardHover, buttonTap } = useThemedAnimations();
  const navigate = useNavigate();
  const [kudosCreatorId, setKudosCreatorId] = useState<string | null>(null);
  const [kudosText, setKudosText] = useState(
    "Thank you so much for the amazing content! We loved working with you."
  );

  const toggleFavorite = (id: string) => {
    setManagedCreators((prev) =>
      prev.map((mc) =>
        mc.creator.id === id ? { ...mc, isFavorite: !mc.isFavorite } : mc
      )
    );
  };

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--green-500)]"
            {...successBurst}
          >
            <CheckCircle2 className="size-4 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-[var(--neutral-800)]">Campaign Complete</h2>
        </div>
        <p className="text-sm text-[var(--neutral-500)]">
          All creators have posted. Review gallery and mark favorites.
        </p>
      </div>

      {/* Success banner */}
      <motion.div
        className="rounded-lg bg-[var(--green-50)] border border-[var(--green-300)] p-4 flex items-center gap-3"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: ease.spring }}
      >
        <CheckCircle2 className="size-5 text-[var(--green-600)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--green-700)]">Campaign Complete</p>
          <p className="text-xs text-[var(--green-600)]">
            All creators have successfully posted their content!
          </p>
        </div>
      </motion.div>

      {/* Post Gallery Grid */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={staggerContainerSlow}
        initial="initial"
        animate="animate"
      >
        {managedCreators.map((mc) => (
          <motion.div key={mc.creator.id} variants={staggerItem}>
          <motion.div
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
          <Card className="border-[var(--neutral-200)] overflow-hidden">
            <div className="aspect-square overflow-hidden bg-[var(--neutral-100)]">
              {mc.contentSubmission?.thumbnail && (
                <motion.img
                  src={mc.contentSubmission.thumbnail}
                  alt={mc.creator.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: ease.out }}
                />
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-[var(--neutral-800)]">
                  {mc.creator.name}
                </p>
                <p className="text-xs text-[var(--neutral-500)]">{mc.creator.handle}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs gap-1"
                  onClick={() => window.open("#", "_blank")}
                >
                  <ExternalLink className="size-3" />
                  View Live
                </Button>
                <motion.div whileTap={mc.isFavorite ? {} : starBounce.animate}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(mc.creator.id)}
                    className={mc.isFavorite ? "border-[var(--yellow-400)]" : ""}
                  >
                    <motion.div
                      animate={mc.isFavorite ? starBounce.animate : {}}
                      key={mc.isFavorite ? "fav" : "unfav"}
                    >
                      <Star
                        className="size-4"
                        fill={mc.isFavorite ? "var(--yellow-400)" : "none"}
                        color={mc.isFavorite ? "var(--yellow-500)" : "var(--neutral-400)"}
                      />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1 border-[var(--brand-300)] text-[var(--brand-700)]"
                onClick={() => setKudosCreatorId(mc.creator.id)}
              >
                <ThumbsUp className="size-3" />
                Send Thank You
              </Button>
            </CardContent>
          </Card>
          </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Kudos Dialog */}
      {kudosCreatorId && (
        <Dialog open={!!kudosCreatorId} onOpenChange={() => setKudosCreatorId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ThumbsUp className="size-5 text-[var(--brand-700)]" />
                Send Thank You
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-[var(--neutral-600)]">
                Send a thank you message to{" "}
                {managedCreators.find((mc) => mc.creator.id === kudosCreatorId)?.creator.name} for
                their great work.
              </p>
              <textarea
                className="w-full rounded-lg border border-[var(--neutral-200)] px-3 py-2 text-sm placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)]"
                rows={3}
                value={kudosText}
                onChange={(e) => setKudosText(e.target.value)}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setKudosCreatorId(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gap-2 bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
                  onClick={() => setKudosCreatorId(null)}
                >
                  <Send className="size-4" /> Send Thank You
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--neutral-200)]">
        <Button
          variant="outline"
          className="gap-2 border-[var(--neutral-200)]"
          onClick={() => navigate("/")}
        >
          <Home className="size-4" /> Back to Dashboard
        </Button>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTap}>
          <Button
            className="gap-2 rounded-xl bg-[var(--brand-700)] hover:bg-[var(--brand-800)]"
            onClick={() => {
              alert("Starting new campaign...");
              navigate("/");
            }}
          >
            <Sparkles className="size-4" />
            Start New Campaign
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN PAGE — ORCHESTRATOR                                          */
/* ================================================================== */
export default function CampaignFindTalent() {
  const [flowStep, setFlowStep] = useState<
    "ai_matching" | "select_creators" | "invite_creators" | "manage" | "gallery"
  >("ai_matching");

  // Creator selection
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<Set<string>>(new Set());
  const [detailCreator, setDetailCreator] = useState<DiscoverableCreator | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const toggleCreator = (creatorId: string) => {
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  };

  // Management
  const [managedCreators, setManagedCreators] = useState<ManagedCreator[]>([]);

  const goToInvite = () => {
    const managed: ManagedCreator[] = Array.from(selectedCreatorIds).map((cid, i) => {
      const creator = MOCK_DISCOVERABLE_CREATORS.find((c) => c.id === cid)!;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const hasCompliantContent = i === 0;
      const hasNonCompliantContent = i === 1;

      return {
        creator,
        inviteStatus: "pending" as InviteStatus,
        compensationType: "gifted",
        compensationDetail: "",
        contentDueDate: dueDate.toISOString().split("T")[0],
        orderStatus: "pending" as const,
        contentSubmission: hasCompliantContent
          ? {
              thumbnail: creator.recentPosts[0]?.thumbnail || creator.coverImage,
              type: "Instagram Reel",
              caption: `Loving this product from the campaign! Honest thoughts in the full video. #sponsored #collab @28litsea`,
              submittedAt: "Feb 18, 2026",
              aiReviewScore: 94,
              aiReviewNotes: [
                "Product shown in use — meets requirement",
                "Brand handle tagged in caption",
                "Required hashtags included",
                "Disclosure compliant (#sponsored)",
              ],
              aiIssues: [],
              brandReviewStatus: "pending" as const,
              brandComments: [],
            }
          : hasNonCompliantContent
            ? {
                thumbnail: creator.recentPosts[0]?.thumbnail || creator.coverImage,
                type: "Instagram Story",
                caption: `Check out this cool product! Link in bio #beauty`,
                submittedAt: "Feb 19, 2026",
                aiReviewScore: 52,
                aiReviewNotes: ["Product visible in content"],
                aiIssues: [
                  "Missing brand tag — @28litsea not found",
                  "Missing campaign hashtag #MeltedBalm",
                  "No #sponsored or #ad disclosure detected",
                  "Link sticker not included in story",
                ],
                brandReviewStatus: "pending" as const,
                brandComments: [],
              }
            : undefined,
      };
    });
    setManagedCreators(managed);
    setFlowStep("invite_creators");
  };

  const goToManage = () => {
    setFlowStep("manage");
  };

  const goToGallery = () => {
    setFlowStep("gallery");
  };

  const stepNum =
    flowStep === "ai_matching"
      ? 1
      : flowStep === "select_creators"
        ? 2
        : flowStep === "invite_creators"
          ? 3
          : flowStep === "manage"
            ? 4
            : 5;

  const handleStepClick = (step: number) => {
    if (step === 2 && stepNum >= 2) {
      setFlowStep("select_creators");
    }
  };

  return (
    <div className="space-y-4">
      <motion.h1
        className="text-xl font-bold text-[var(--neutral-800)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Melted Balm Spring Launch
      </motion.h1>

      <StepIndicator
        currentStep={stepNum}
        totalSteps={5}
        onStepClick={handleStepClick}
      />

      <AnimatePresence mode="wait">
      {flowStep === "ai_matching" && (
        <AIMatchingScreen onComplete={() => setFlowStep("select_creators")} />
      )}

      {flowStep === "select_creators" && (
        <>
          <StepCreatorSelection
            creators={MOCK_DISCOVERABLE_CREATORS}
            selected={selectedCreatorIds}
            onToggle={toggleCreator}
            onSelectAll={() =>
              setSelectedCreatorIds(
                new Set(MOCK_DISCOVERABLE_CREATORS.map((c) => c.id))
              )
            }
            onDeselectAll={() => setSelectedCreatorIds(new Set())}
            onViewDetail={(c) => {
              setDetailCreator(c);
              setDetailOpen(true);
            }}
            onNext={goToInvite}
          />
          <CreatorDetailDialog
            creator={detailCreator}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            isSelected={detailCreator ? selectedCreatorIds.has(detailCreator.id) : false}
            onToggleSelect={() => {
              if (detailCreator) toggleCreator(detailCreator.id);
            }}
          />
        </>
      )}

      {flowStep === "invite_creators" && (
        <StepInviteCreators
          managedCreators={managedCreators}
          onBack={() => setFlowStep("select_creators")}
          onNext={goToManage}
        />
      )}

      {flowStep === "manage" && (
        <StepCreatorManagement
          managedCreators={managedCreators}
          setManagedCreators={setManagedCreators}
          onBack={() => setFlowStep("invite_creators")}
          onComplete={goToGallery}
        />
      )}

      {flowStep === "gallery" && (
        <StepPostGallery
          managedCreators={managedCreators}
          setManagedCreators={setManagedCreators}
        />
      )}
      </AnimatePresence>
    </div>
  );
}
