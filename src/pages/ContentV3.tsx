import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CREATOR_POSTS,
  CONTENT_TYPE_LABEL,
  type ContentType,
  type CreatorPost,
} from "@/data/creator-content";
import {
  Download,
  Share2,
  Globe,
  Mail,
  FileText,
  Check,
  Instagram,
  Music2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const SEEN_KEY = "pikora_seen_posts";

type FilterKey = "all" | ContentType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram_post", label: "Instagram Post" },
  { key: "instagram_reel", label: "Instagram Reel" },
  { key: "instagram_story", label: "Instagram Story" },
];

/* ────────────────────────────── helpers ────────────────────────────── */

function formatRelativeTime(iso: string, now: Date = new Date("2026-04-09T14:00:00.000Z")): string {
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now.getTime() - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(iso: string, now: Date = new Date("2026-04-09T14:00:00.000Z")): number {
  const then = new Date(iso).getTime();
  return Math.max(0, Math.ceil((then - now.getTime()) / 86400000));
}

function readSeenIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeSeenIds(ids: string[]) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

/* ────────────────────────────── platform badge ────────────────────────────── */

function PlatformBadge({ type }: { type: ContentType }) {
  if (type === "tiktok") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-black/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
        <Music2 className="size-3" />
        TikTok
      </span>
    );
  }
  const label =
    type === "instagram_post" ? "Post" : type === "instagram_reel" ? "Reel" : "Story";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm"
      style={{
        background: "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
      }}
    >
      <Instagram className="size-3" />
      {label}
    </span>
  );
}

/* ────────────────────────────── filter bar ────────────────────────────── */

interface FilterBarProps {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
}

function FilterBar({ active, counts, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? "border-[var(--brand-300)] bg-[var(--brand-100)] text-[var(--brand-700)] shadow-sm"
                : "border-[var(--neutral-200)] bg-white text-[var(--neutral-600)] hover:border-[var(--brand-200)] hover:text-[var(--brand-700)]"
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                isActive
                  ? "bg-white/70 text-[var(--brand-700)]"
                  : "bg-[var(--neutral-100)] text-[var(--neutral-500)]"
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────────── creator group card ────────────────────────────── */

interface CreatorGroupProps {
  creator: CreatorPost["creator"];
  posts: CreatorPost[];
  newCount: number;
  defaultOpen: boolean;
  onOpenPost: (post: CreatorPost) => void;
  liveSeenSet: Set<string>;
}

function CreatorGroup({
  creator,
  posts,
  newCount,
  defaultOpen,
  onOpenPost,
  liveSeenSet,
}: CreatorGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const latestPostedAt = posts[0]?.postedAt;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--neutral-200)] bg-white shadow-sm transition-all">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--neutral-50)]"
      >
        <img
          src={creator.avatarUrl}
          alt={creator.name}
          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white"
          style={{ boxShadow: "0 0 0 1px var(--neutral-200)" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-bold text-[var(--neutral-800)]">
              {creator.name}
            </p>
            {newCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-[var(--brand-600)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {newCount} new
              </span>
            )}
          </div>
          <p className="truncate text-xs text-[var(--neutral-500)]">
            {creator.handle} · {posts.length} post{posts.length !== 1 ? "s" : ""}
            {latestPostedAt && ` · last posted ${formatRelativeTime(latestPostedAt)}`}
          </p>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-[var(--neutral-400)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Posts grid */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--neutral-150)] px-5 py-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {posts.map((post) => {
                  const isNew = !!post.isInitiallyNew && !liveSeenSet.has(post.id);
                  const aspectClass =
                    post.type === "instagram_post" ? "aspect-square" : "aspect-[9/16]";
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => onOpenPost(post)}
                      className={`group relative overflow-hidden rounded-lg border border-[var(--neutral-200)] bg-[var(--neutral-100)] transition-all hover:border-[var(--brand-300)] hover:shadow-md ${aspectClass}`}
                    >
                      <img
                        src={post.thumbnailUrl}
                        alt={post.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute left-1.5 top-1.5">
                        <PlatformBadge type={post.type} />
                      </div>
                      {isNew && (
                        <div className="absolute right-1.5 top-1.5">
                          <span className="inline-flex items-center rounded-full bg-[var(--brand-600)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
                            New
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-2 py-1.5">
                        <p className="text-[10px] font-medium text-white/90">
                          {formatRelativeTime(post.postedAt)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────── detail modal ────────────────────────────── */

interface DetailModalProps {
  post: CreatorPost | null;
  onClose: () => void;
}

function DetailModal({ post, onClose }: DetailModalProps) {
  const [downloadState, setDownloadState] = useState<"idle" | "working" | "done">(
    "idle"
  );

  useEffect(() => {
    if (!post) setDownloadState("idle");
  }, [post]);

  async function handleDownload() {
    if (!post) return;
    setDownloadState("working");
    console.log("[Content] Download requested for", post.id, post.thumbnailUrl);
    try {
      const res = await fetch(post.thumbnailUrl, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pikora-${post.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("[Content] Download fallback — could not fetch blob", err);
    }
    setDownloadState("done");
    window.setTimeout(() => setDownloadState("idle"), 2500);
  }

  const open = post !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90vh] w-[92vw] max-w-[960px] overflow-hidden p-0 sm:max-w-[960px]"
        showCloseButton
      >
        <DialogTitle className="sr-only">
          {post ? `${post.creator.name} — ${CONTENT_TYPE_LABEL[post.type]}` : "Content"}
        </DialogTitle>
        <AnimatePresence mode="wait">
          {post && (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="grid max-h-[90vh] grid-cols-1 md:grid-cols-5"
            >
              <div className="relative flex items-center justify-center bg-[var(--neutral-100)] md:col-span-3">
                <img
                  src={post.thumbnailUrl}
                  alt={post.caption}
                  className="max-h-[90vh] w-full object-cover md:object-contain"
                />
                <div className="absolute left-4 top-4">
                  <PlatformBadge type={post.type} />
                </div>
              </div>

              <div className="flex max-h-[90vh] flex-col overflow-y-auto bg-white md:col-span-2">
                <div className="flex items-center gap-3 border-b border-[var(--neutral-200)] px-5 py-4">
                  <img
                    src={post.creator.avatarUrl}
                    alt={post.creator.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[var(--neutral-800)]">
                      {post.creator.name}
                    </p>
                    <p className="truncate text-xs text-[var(--neutral-500)]">
                      {post.creator.handle} · {formatRelativeTime(post.postedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-4 px-5 py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-400)]">
                      Caption
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[var(--neutral-700)]">
                      {post.caption}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-400)]">
                      Campaign
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--neutral-800)]">
                      {post.campaignName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--brand-200)] bg-[var(--brand-0,#FAF8FF)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-100)]">
                        <ShieldCheck className="size-4 text-[var(--brand-700)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--neutral-800)]">
                          90-day organic usage rights
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--neutral-500)]">
                          Expires {formatLongDate(post.rightsExpireAt)}
                        </p>
                        <p className="mt-2 inline-flex items-center rounded-full bg-[var(--brand-100)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-700)]">
                          {daysUntil(post.rightsExpireAt)} days remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-[var(--neutral-200)] px-5 py-4">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloadState === "working"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-700)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand-800)] disabled:opacity-70"
                  >
                    {downloadState === "done" ? (
                      <>
                        <Check className="size-4" />
                        Downloaded
                      </>
                    ) : downloadState === "working" ? (
                      <>
                        <Download className="size-4 animate-pulse" />
                        Preparing…
                      </>
                    ) : (
                      <>
                        <Download className="size-4" />
                        Download for organic usage
                      </>
                    )}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <ShareButton icon={Share2} label="Share to socials" />
                    <ShareButton icon={Globe} label="Website" />
                    <ShareButton icon={Mail} label="Email" />
                    <ShareButton icon={FileText} label="Blog" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function ShareButton({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 justify-start gap-2 border-[var(--neutral-200)] text-xs font-medium text-[var(--neutral-700)] hover:border-[var(--brand-300)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-700)]"
    >
      <Icon className="size-3.5" />
      {label}
    </Button>
  );
}

/* ────────────────────────────── version switcher ────────────────────────────── */

function VersionSwitcher() {
  const location = useLocation();
  const versions: { path: string; label: string }[] = [
    { path: "/content", label: "Grid" },
    { path: "/content/v2", label: "Masonry" },
    { path: "/content/v3", label: "By Creator" },
  ];
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-[var(--neutral-200)] bg-white p-0.5 shadow-sm">
      {versions.map((v) => {
        const isActive = location.pathname === v.path;
        return (
          <Link
            key={v.path}
            to={v.path}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-[var(--brand-100)] text-[var(--brand-700)]"
                : "text-[var(--neutral-500)] hover:text-[var(--neutral-800)]"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </div>
  );
}

/* ────────────────────────────── page ────────────────────────────── */

export default function ContentV3() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedPost, setSelectedPost] = useState<CreatorPost | null>(null);
  const [initialSeenIds] = useState<string[]>(() => readSeenIds());
  const [liveSeenIds, setLiveSeenIds] = useState<string[]>(() => readSeenIds());

  const counts = useMemo<Record<FilterKey, number>>(() => {
    const c: Record<FilterKey, number> = {
      all: CREATOR_POSTS.length,
      tiktok: 0,
      instagram_post: 0,
      instagram_reel: 0,
      instagram_story: 0,
    };
    CREATOR_POSTS.forEach((p) => {
      c[p.type] += 1;
    });
    return c;
  }, []);

  const liveSeenSet = useMemo(() => new Set(liveSeenIds), [liveSeenIds]);

  // Group posts by creator handle, then sort groups by latest activity / new count
  const creatorGroups = useMemo(() => {
    const initialSeen = new Set(initialSeenIds);
    const filtered =
      filter === "all"
        ? CREATOR_POSTS
        : CREATOR_POSTS.filter((p) => p.type === filter);

    const map = new Map<
      string,
      { creator: CreatorPost["creator"]; posts: CreatorPost[]; newCount: number }
    >();

    filtered.forEach((post) => {
      const key = post.creator.handle;
      if (!map.has(key)) {
        map.set(key, { creator: post.creator, posts: [], newCount: 0 });
      }
      const group = map.get(key)!;
      group.posts.push(post);
      if (post.isInitiallyNew && !initialSeen.has(post.id)) {
        group.newCount += 1;
      }
    });

    // Sort posts within each group by date desc
    map.forEach((group) => {
      group.posts.sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
    });

    // Convert to array and sort: groups with new count first, then by latest post date desc
    return Array.from(map.values()).sort((a, b) => {
      if (a.newCount !== b.newCount) return b.newCount - a.newCount;
      const aLatest = new Date(a.posts[0]?.postedAt ?? 0).getTime();
      const bLatest = new Date(b.posts[0]?.postedAt ?? 0).getTime();
      return bLatest - aLatest;
    });
  }, [filter, initialSeenIds]);

  function handleOpenPost(post: CreatorPost) {
    setSelectedPost(post);
    if (post.isInitiallyNew && !liveSeenSet.has(post.id)) {
      const next = [...liveSeenIds, post.id];
      setLiveSeenIds(next);
      writeSeenIds(next);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--neutral-800)]">
            Content
          </h1>
          <p className="mt-1 text-sm text-[var(--neutral-500)]">
            All content created by your creators for PIKORA campaigns
          </p>
        </div>
        <VersionSwitcher />
      </div>

      {/* Filter bar */}
      <FilterBar active={filter} counts={counts} onChange={setFilter} />

      {/* Creator groups */}
      <div className="space-y-4">
        {creatorGroups.map((group) => (
          <CreatorGroup
            key={group.creator.handle}
            creator={group.creator}
            posts={group.posts}
            newCount={group.newCount}
            defaultOpen={group.newCount > 0}
            onOpenPost={handleOpenPost}
            liveSeenSet={liveSeenSet}
          />
        ))}
      </div>

      {creatorGroups.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--neutral-200)] bg-white py-16 text-center">
          <p className="text-sm text-[var(--neutral-500)]">
            No content to show for this filter yet.
          </p>
        </div>
      )}

      <DetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
