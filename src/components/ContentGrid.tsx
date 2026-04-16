import { useMemo, useState } from "react";
import {
  CREATOR_POSTS,
  type ContentType,
  type CreatorPost,
} from "@/data/creator-content";
import { Instagram, Music2 } from "lucide-react";

type FilterKey = "all" | ContentType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram_post", label: "Instagram Post" },
  { key: "instagram_reel", label: "Instagram Reel" },
  { key: "instagram_story", label: "Instagram Story" },
];

/* ────────────────────────────── helpers ────────────────────────────── */

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, Date.now() - then);
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

/* ────────────────────────────── platform badge ────────────────────────────── */

function PlatformBadge({ type }: { type: ContentType }) {
  if (type === "tiktok") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
        <Music2 className="size-3" />
        TikTok
      </span>
    );
  }
  const label =
    type === "instagram_post"
      ? "Post"
      : type === "instagram_reel"
        ? "Reel"
        : "Story";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
      }}
    >
      <Instagram className="size-3" />
      {label}
    </span>
  );
}

/* ────────────────────────────── content card ────────────────────────────── */

function ContentCard({ post }: { post: CreatorPost }) {
  return (
    <a
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer flex-col rounded-lg border border-[var(--neutral-200)] bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--neutral-300)] hover:shadow-md"
    >
      {/* Thumbnail — isolate + containment prevents corner escape during scale */}
      <div className="relative isolate w-full overflow-hidden rounded-t-lg bg-[var(--neutral-100)] aspect-[4/5]">
        <img
          src={post.thumbnailUrl}
          alt={post.caption}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
        />
        <div className="absolute left-2 top-2">
          <PlatformBadge type={post.type} />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 px-3 py-3">
        <div className="flex items-center gap-2">
          <img
            src={post.creator.avatarUrl}
            alt={post.creator.name}
            className="shrink-0 rounded-full object-cover"
            style={{ width: 28, height: 28 }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight text-[var(--neutral-800)]">
              {post.creator.name}
            </p>
            <p className="truncate text-[12px] leading-tight text-[var(--neutral-400)]">
              {post.creator.handle}
            </p>
          </div>
          <span className="shrink-0 text-[12px] text-[var(--neutral-400)]">
            {formatRelativeTime(post.postedAt)}
          </span>
        </div>
        <p
          className="text-[12.5px] leading-relaxed text-[var(--neutral-600)]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.caption}
        </p>
      </div>
    </a>
  );
}

/* ────────────────────────────── filter bar ────────────────────────────── */

function FilterBar({
  active,
  counts,
  onChange,
}: {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
}) {
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
                ? "border-[var(--neutral-800)] bg-[var(--neutral-800)] text-white"
                : "border-[var(--neutral-200)] bg-white text-[var(--neutral-500)] hover:border-[var(--neutral-300)] hover:text-[var(--neutral-700)]"
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-[var(--neutral-50)] text-[var(--neutral-400)]"
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

/* ────────────────────────────── main grid ────────────────────────────── */

export default function ContentGrid() {
  const [filter, setFilter] = useState<FilterKey>("all");

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

  const sortedPosts = useMemo(() => {
    return [...CREATOR_POSTS].sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }, []);

  const visiblePosts = useMemo(() => {
    if (filter === "all") return sortedPosts;
    return sortedPosts.filter((p) => p.type === filter);
  }, [filter, sortedPosts]);

  return (
    <div className="space-y-5">
      <FilterBar active={filter} counts={counts} onChange={setFilter} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <ContentCard key={post.id} post={post} />
        ))}
      </div>

      {visiblePosts.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--neutral-200)] bg-white py-16 text-center">
          <p className="text-sm text-[var(--neutral-500)]">
            No content to show for this filter yet.
          </p>
        </div>
      )}
    </div>
  );
}
