import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Gift,
  FileText,
  Eye,
  Search,
  ShoppingBag,
  Package,
  ExternalLink,
  MessageSquare,
  Shield,
  Sparkles,
  ChevronRight,
  Users,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";

// ─── Tooltip helper ───
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((v) => !v)}
        className="rounded-full p-0.5 text-[var(--neutral-400)] hover:text-[var(--neutral-600)] transition-colors"
      >
        <Info className="size-3.5" />
      </button>
      {show && (
        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50 w-56 rounded-lg border border-[var(--neutral-200)] bg-white px-3 py-2 text-xs text-[var(--neutral-600)] leading-relaxed shadow-lg">
          {text}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-px border-4 border-transparent border-t-white" />
        </div>
      )}
    </span>
  );
}

// ─── Step labels ───
const STEP_LABELS = ["Brief", "Product", "Target Creators", "Preview"];

function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1">
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
                if (stepNum < currentStep) onStepClick(stepNum);
              }}
              className="flex items-center gap-2 rounded-full px-3.5 py-1.5 transition-all duration-200"
              style={{
                backgroundColor: isCurrent
                  ? "var(--brand-100)"
                  : isComplete
                    ? "var(--brand-0)"
                    : "transparent",
                cursor: stepNum < currentStep ? "pointer" : "default",
              }}
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-200"
                style={{
                  backgroundColor: isPast
                    ? "var(--brand-700)"
                    : "var(--neutral-200)",
                  color: isPast ? "white" : "var(--neutral-500)",
                }}
              >
                {isComplete ? <Check className="size-3" /> : stepNum}
              </div>
              <span
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  color: isCurrent
                    ? "var(--brand-700)"
                    : isComplete
                      ? "var(--brand-600)"
                      : "var(--neutral-400)",
                }}
              >
                {STEP_LABELS[i]}
              </span>
            </button>
            {i < totalSteps - 1 && (
              <ChevronRight className="size-3.5 text-[var(--neutral-300)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section wrapper for consistent card styling ───
function Section({
  children,
  className = "",
  icon,
  title,
  subtitle,
  tooltip,
}: {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  tooltip?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--neutral-200)] bg-white p-6 transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] ${className}`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
    >
      {title && (
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-50,var(--brand-0))]">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[15px] font-semibold text-[var(--neutral-800)]">{title}</h3>
              {tooltip && <Tooltip text={tooltip} />}
            </div>
            {subtitle && <p className="text-xs text-[var(--neutral-400)] mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Prefilled content ───

const PREFILLED_BRAND_DESCRIPTION =
  "28 Litsea is a clean beauty brand creating mindful skincare powered by natural botanicals. We believe in transparency, sustainability, and products that actually work — no fillers, no compromises.";

const PREFILLED_CAMPAIGN_DESCRIPTION =
  "Create engaging content showcasing our new Summer Glow Collection. We want authentic, creative content that highlights the product benefits and your personal skincare routine.";

interface PlatformRequirement {
  id: string;
  text: string;
}

const DEFAULT_PLATFORM_REQUIREMENTS: PlatformRequirement[] = [
  { id: "pr-1", text: "Create 1 TikTok video (30–60 seconds) showcasing the product" },
  { id: "pr-2", text: "Create 1 Instagram Reel featuring the product in your skincare routine" },
];

interface OtherRequirement {
  id: string;
  text: string;
}

const DEFAULT_OTHER_REQUIREMENTS: OtherRequirement[] = [
  { id: "or-1", text: "Use campaign hashtag #28Litsea #SummerGlow" },
  { id: "or-2", text: "Tag @28litsea in all posts" },
  { id: "or-3", text: "Show product in use (not just unboxing)" },
  { id: "or-4", text: "Post as soon as possible" },
];

const PREFILLED_TERMS =
  "You agree to deliver the content described above. All content must be submitted for review before publishing. You agree to keep the product and campaign details confidential until publication. UGC rights granted for 90 days across brand channels.";

const DEFAULT_GIFTING_INSTRUCTIONS =
  "Choose 1 product from the selection below. This is the product you'll feature in your content.";

// ─── Mock Shopify products ───
interface ShopifyProduct {
  id: string;
  title: string;
  image: string;
  price: string;
  variant: string;
  inventory: number;
  handle: string;
}

const MOCK_SHOPIFY_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/8012345",
    title: "Summer Glow Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop",
    price: "$42.00",
    variant: "30ml",
    inventory: 145,
    handle: "summer-glow-serum",
  },
  {
    id: "gid://shopify/Product/8012346",
    title: "Melted Balm",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=80&h=80&fit=crop",
    price: "$35.00",
    variant: "15g",
    inventory: 230,
    handle: "melted-balm",
  },
  {
    id: "gid://shopify/Product/8012347",
    title: "Botanical Face Mist",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop",
    price: "$28.00",
    variant: "100ml",
    inventory: 89,
    handle: "botanical-face-mist",
  },
  {
    id: "gid://shopify/Product/8012348",
    title: "Litsea Body Oil",
    image: "https://images.unsplash.com/photo-1600428877878-1a0ff561972c?w=80&h=80&fit=crop",
    price: "$55.00",
    variant: "200ml",
    inventory: 62,
    handle: "litsea-body-oil",
  },
  {
    id: "gid://shopify/Product/8012349",
    title: "Clean Glow SPF 30",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=80&h=80&fit=crop",
    price: "$38.00",
    variant: "50ml",
    inventory: 178,
    handle: "clean-glow-spf-30",
  },
  {
    id: "gid://shopify/Product/8012350",
    title: "Overnight Repair Mask",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop",
    price: "$48.00",
    variant: "50ml",
    inventory: 95,
    handle: "overnight-repair-mask",
  },
];

// ─── Shopify Product Picker Modal ───
function ShopifyProductPicker({
  isOpen,
  onClose,
  onSelect,
  selectedIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: ShopifyProduct[]) => void;
  selectedIds: Set<string>;
}) {
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<Set<string>>(new Set(selectedIds));

  if (!isOpen) return null;

  const filtered = MOCK_SHOPIFY_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    setTempSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = MOCK_SHOPIFY_PRODUCTS.filter((p) => tempSelected.has(p.id));
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-[var(--brand-700)]" />
            <h3 className="text-base font-bold text-[var(--neutral-800)]">Select Products</h3>
            <Badge className="border-0 bg-[var(--green-100)] text-[var(--green-700)] text-[10px] gap-1">
              <ExternalLink className="size-2.5" /> Shopify
            </Badge>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[var(--neutral-100)] transition-colors">
            <X className="size-4 text-[var(--neutral-500)]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--neutral-400)]" />
            <input
              className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] outline-none focus:border-[var(--brand-700)] focus:ring-1 focus:ring-[var(--brand-700)]"
              style={{ borderColor: "var(--border)" }}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Product list */}
        <div className="max-h-[360px] overflow-y-auto px-2 py-2">
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--neutral-400)]">
              No products match your search.
            </div>
          )}
          {filtered.map((product) => {
            const isSelected = tempSelected.has(product.id);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-[var(--neutral-50)]"
                style={{ backgroundColor: isSelected ? "var(--brand-0)" : "transparent" }}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--brand-700)" : "white",
                    border: isSelected ? "none" : "1.5px solid var(--neutral-300)",
                  }}
                >
                  {isSelected && <Check className="size-3 text-white" />}
                </div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-11 w-11 rounded-lg object-cover border"
                  style={{ borderColor: "var(--border)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--neutral-800)] truncate">{product.title}</p>
                  <p className="text-xs text-[var(--neutral-500)]">{product.variant} · {product.inventory} in stock</p>
                </div>
                <span className="text-sm font-semibold text-[var(--neutral-700)] shrink-0">{product.price}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-5 py-3" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs text-[var(--neutral-500)]">
            {tempSelected.size} product{tempSelected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={tempSelected.size === 0}
              style={{ backgroundColor: "var(--brand-700)", color: "white" }}
            >
              Add Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 1 — Campaign Brief
// ═══════════════════════════════════════════════════
interface BriefDraft {
  brandDescription: string;
  campaignDescription: string;
  platformRequirements: PlatformRequirement[];
  otherRequirements: OtherRequirement[];
  terms: string;
}

function StepBrief({
  draft,
  setDraft,
}: {
  draft: BriefDraft;
  setDraft: React.Dispatch<React.SetStateAction<BriefDraft>>;
}) {
  const [newPlatReq, setNewPlatReq] = useState("");
  const [newOtherReq, setNewOtherReq] = useState("");
  const [editingTerms, setEditingTerms] = useState(false);

  const addPlatformReq = () => {
    if (!newPlatReq.trim()) return;
    setDraft((prev) => ({
      ...prev,
      platformRequirements: [...prev.platformRequirements, { id: `pr-${Date.now()}`, text: newPlatReq.trim() }],
    }));
    setNewPlatReq("");
  };

  const removePlatformReq = (id: string) => {
    setDraft((prev) => ({ ...prev, platformRequirements: prev.platformRequirements.filter((r) => r.id !== id) }));
  };

  const addOtherReq = () => {
    if (!newOtherReq.trim()) return;
    setDraft((prev) => ({
      ...prev,
      otherRequirements: [...prev.otherRequirements, { id: `or-${Date.now()}`, text: newOtherReq.trim() }],
    }));
    setNewOtherReq("");
  };

  const removeOtherReq = (id: string) => {
    setDraft((prev) => ({ ...prev, otherRequirements: prev.otherRequirements.filter((r) => r.id !== id) }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Live preview hint */}
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--brand-200)] bg-[var(--brand-0)] px-4 py-3">
        <Eye className="size-4 text-[var(--brand-700)] shrink-0" />
        <p className="text-[13px] text-[var(--brand-700)]">
          This is what creators will see when invited. All fields are pre-filled — edit to customize.
        </p>
      </div>

      {/* About the Brand */}
      <Section
        icon={<Sparkles className="size-4 text-[var(--brand-700)]" />}
        title="About Your Brand"
        subtitle="A short intro so creators understand who you are. 2–3 lines."
        tooltip="This is shown at the top of the creator brief. Keep it concise — creators skim this to decide if your brand is a fit."
      >
        <textarea
          className="flex min-h-[80px] w-full rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:bg-white focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)] transition-colors"
          value={draft.brandDescription}
          onChange={(e) => setDraft((prev) => ({ ...prev, brandDescription: e.target.value }))}
          placeholder="Tell creators about your brand in 2–3 sentences..."
        />
      </Section>

      {/* About This Campaign */}
      <Section
        icon={<FileText className="size-4 text-[var(--brand-700)]" />}
        title="About This Campaign"
        subtitle="What should creators know about this specific campaign? 2–3 lines."
        tooltip="Describe the creative direction, product focus, and what kind of content you're hoping for."
      >
        <textarea
          className="flex min-h-[80px] w-full rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:bg-white focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)] transition-colors"
          value={draft.campaignDescription}
          onChange={(e) => setDraft((prev) => ({ ...prev, campaignDescription: e.target.value }))}
          placeholder="Describe the campaign goal, creative direction, and product..."
        />
      </Section>

      {/* ═══ VARIANT A — Toggle Platform Cards ═══
           Completely different model: pre-defined platform options as toggle switches.
           You turn platforms ON, then describe what you need per platform. */}
      <div className="rounded-2xl border-2 border-[var(--brand-300)] bg-[var(--brand-0)]/30 p-1">
        <div className="mb-1 px-5 pt-4">
          <Badge className="bg-[var(--brand-700)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5">Variant A</Badge>
          <p className="text-xs text-[var(--neutral-500)] mt-1">Toggle cards — pick platforms first, then describe what you need per platform</p>
        </div>
        <Section
          icon={<Check className="size-4 text-[var(--brand-700)]" />}
          title="Platform Requirements"
          subtitle="Select platforms and describe what creators should deliver on each."
          tooltip="Be specific about platform, format, and length. Creators perform best with clear deliverables."
        >
          {/* Platform toggle cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["TikTok", "Instagram", "YouTube"].map((platform) => {
              const isActive = draft.platformRequirements.some((r) => r.text.toLowerCase().includes(platform.toLowerCase()));
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setDraft((prev) => ({ ...prev, platformRequirements: prev.platformRequirements.filter((r) => !r.text.toLowerCase().includes(platform.toLowerCase())) }));
                    } else {
                      setDraft((prev) => ({ ...prev, platformRequirements: [...prev.platformRequirements, { id: `pr-${Date.now()}`, text: `Create 1 ${platform} video showcasing the product` }] }));
                    }
                  }}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-all ${isActive ? "border-[var(--brand-600)] bg-[var(--brand-0)] shadow-[0_0_0_1px_var(--brand-600)]" : "border-[var(--neutral-200)] bg-white hover:border-[var(--neutral-300)]"}`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? "bg-[var(--brand-600)]" : "bg-[var(--neutral-100)]"}`}>
                    {isActive ? <Check className="size-5 text-white" /> : <Plus className="size-5 text-[var(--neutral-400)]" />}
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? "text-[var(--brand-700)]" : "text-[var(--neutral-500)]"}`}>{platform}</span>
                </button>
              );
            })}
          </div>
          {/* Active platform detail rows */}
          {draft.platformRequirements.length > 0 && (
            <div className="space-y-2">
              {draft.platformRequirements.map((req) => (
                <div key={req.id} className="flex items-start gap-3 rounded-xl border border-[var(--brand-200)] bg-[var(--brand-0)] px-4 py-3">
                  <Pencil className="size-3.5 text-[var(--brand-500)] mt-1 shrink-0" />
                  <input
                    className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] outline-none placeholder:text-[var(--neutral-400)]"
                    value={req.text}
                    onChange={(e) => setDraft((prev) => ({ ...prev, platformRequirements: prev.platformRequirements.map((r) => r.id === req.id ? { ...r, text: e.target.value } : r) }))}
                  />
                </div>
              ))}
            </div>
          )}
          {draft.platformRequirements.length === 0 && (
            <p className="text-center text-sm text-[var(--neutral-400)] py-4">Select a platform above to get started</p>
          )}
        </Section>
      </div>

      {/* ═══ VARIANT B — Quick-Pick Templates + Custom ═══
           Pre-built requirement templates you click to add instantly.
           Plus a custom free-text option at the bottom. */}
      <div className="rounded-2xl border-2 border-[var(--brand-300)] bg-[var(--brand-0)]/30 p-1">
        <div className="mb-1 px-5 pt-4">
          <Badge className="bg-[var(--brand-700)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5">Variant B</Badge>
          <p className="text-xs text-[var(--neutral-500)] mt-1">Quick-pick templates — click pre-built options to add, or write your own</p>
        </div>
        <Section
          icon={<Check className="size-4 text-[var(--brand-700)]" />}
          title="Platform Requirements"
          subtitle="Click to add common deliverables, or write a custom one."
          tooltip="Be specific about platform, format, and length. Creators perform best with clear deliverables."
        >
          {/* Active requirements */}
          {draft.platformRequirements.length > 0 && (
            <div className="space-y-2 mb-4">
              {draft.platformRequirements.map((req) => (
                <div key={req.id} className="group flex items-center gap-3 rounded-xl bg-[var(--brand-0)] border border-[var(--brand-200)] px-4 py-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-600)]">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="flex-1 text-sm text-[var(--neutral-700)]">{req.text}</span>
                  <button type="button" onClick={() => removePlatformReq(req.id)} className="shrink-0 text-xs font-medium text-[var(--neutral-400)] hover:text-[var(--red-500)] transition-colors">Remove</button>
                </div>
              ))}
            </div>
          )}
          {/* Template suggestions */}
          <p className="text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider mb-2">Quick add</p>
          <div className="grid grid-cols-1 gap-1.5 mb-4">
            {[
              "Create 1 TikTok video (30–60 seconds)",
              "Create 1 Instagram Reel (15–30 seconds)",
              "Create 1 Instagram Story (3+ slides)",
              "Create 1 YouTube Short (under 60 seconds)",
              "Post 1 Instagram carousel (3–5 images)",
            ].filter((t) => !draft.platformRequirements.some((r) => r.text.toLowerCase().includes(t.toLowerCase().slice(0, 20)))).map((template) => (
              <button
                key={template}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, platformRequirements: [...prev.platformRequirements, { id: `pr-${Date.now()}-${Math.random()}`, text: template }] }))}
                className="flex items-center gap-3 rounded-lg border border-[var(--neutral-200)] bg-white px-4 py-2.5 text-left text-sm text-[var(--neutral-600)] transition-all hover:border-[var(--brand-300)] hover:bg-[var(--brand-0)] hover:text-[var(--brand-700)]"
              >
                <Plus className="size-3.5 text-[var(--neutral-400)]" />
                {template}
              </button>
            ))}
          </div>
          {/* Custom input */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-[var(--neutral-300)] px-4 py-2.5">
              <Pencil className="size-3.5 text-[var(--neutral-400)]" />
              <input
                className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
                placeholder="Or write a custom requirement..."
                value={newPlatReq}
                onChange={(e) => setNewPlatReq(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlatformReq(); } }}
              />
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]" onClick={addPlatformReq} disabled={!newPlatReq.trim()}>Add</Button>
          </div>
        </Section>
      </div>

      {/* ═══ VARIANT C — Inline Editable Table ═══
           Structured table with columns: Platform, Format, Description.
           Each row is editable in-place. */}
      <div className="rounded-2xl border-2 border-[var(--brand-300)] bg-[var(--brand-0)]/30 p-1">
        <div className="mb-1 px-5 pt-4">
          <Badge className="bg-[var(--brand-700)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5">Variant C</Badge>
          <p className="text-xs text-[var(--neutral-500)] mt-1">Structured table — columns for each part, editable in place</p>
        </div>
        <Section
          icon={<Check className="size-4 text-[var(--brand-700)]" />}
          title="Platform Requirements"
          subtitle="Structured deliverable table — edit any cell directly."
          tooltip="Be specific about platform, format, and length. Creators perform best with clear deliverables."
        >
          <div className="rounded-xl border border-[var(--neutral-200)] overflow-hidden mb-3">
            {/* Header */}
            <div className="grid grid-cols-[100px_90px_1fr_40px] bg-[var(--neutral-50)] border-b border-[var(--neutral-200)]">
              <span className="px-3 py-2 text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wider">Platform</span>
              <span className="px-3 py-2 text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wider">Format</span>
              <span className="px-3 py-2 text-[10px] font-bold text-[var(--neutral-500)] uppercase tracking-wider">Description</span>
              <span />
            </div>
            {/* Rows */}
            {draft.platformRequirements.map((req) => {
              const lc = req.text.toLowerCase();
              const platform = lc.includes("tiktok") ? "TikTok" : lc.includes("instagram") ? "Instagram" : lc.includes("youtube") ? "YouTube" : "Other";
              const format = lc.includes("reel") ? "Reel" : lc.includes("video") ? "Video" : lc.includes("story") ? "Story" : lc.includes("carousel") ? "Carousel" : "Content";
              return (
                <div key={req.id} className="group grid grid-cols-[100px_90px_1fr_40px] border-b border-[var(--neutral-200)] last:border-b-0 hover:bg-[var(--neutral-50)] transition-colors">
                  <span className="px-3 py-2.5 text-sm font-medium text-[var(--brand-700)]">{platform}</span>
                  <span className="px-3 py-2.5">
                    <span className="inline-flex items-center rounded-md bg-[var(--brand-100)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-700)]">{format}</span>
                  </span>
                  <input
                    className="px-3 py-2.5 text-sm text-[var(--neutral-700)] bg-transparent outline-none focus:bg-white"
                    value={req.text}
                    onChange={(e) => setDraft((prev) => ({ ...prev, platformRequirements: prev.platformRequirements.map((r) => r.id === req.id ? { ...r, text: e.target.value } : r) }))}
                  />
                  <button type="button" onClick={() => removePlatformReq(req.id)} className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="size-3.5 text-[var(--neutral-400)]" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-[var(--neutral-300)] px-4 py-2.5">
              <Plus className="size-4 text-[var(--neutral-400)]" />
              <input
                className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
                placeholder="Add a row..."
                value={newPlatReq}
                onChange={(e) => setNewPlatReq(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlatformReq(); } }}
              />
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]" onClick={addPlatformReq} disabled={!newPlatReq.trim()}>Add Row</Button>
          </div>
        </Section>
      </div>

      {/* ═══ VARIANT D — Accordion by Platform ═══
           Group requirements under expandable platform headers.
           Click a platform header to expand/collapse its requirements. */}
      <div className="rounded-2xl border-2 border-[var(--brand-300)] bg-[var(--brand-0)]/30 p-1">
        <div className="mb-1 px-5 pt-4">
          <Badge className="bg-[var(--brand-700)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5">Variant D</Badge>
          <p className="text-xs text-[var(--neutral-500)] mt-1">Accordion — grouped by platform, expand/collapse each section</p>
        </div>
        <Section
          icon={<Check className="size-4 text-[var(--brand-700)]" />}
          title="Platform Requirements"
          subtitle="Requirements grouped by platform. Click headers to expand."
          tooltip="Be specific about platform, format, and length. Creators perform best with clear deliverables."
        >
          <div className="space-y-2 mb-3">
            {(() => {
              const grouped: Record<string, typeof draft.platformRequirements> = {};
              draft.platformRequirements.forEach((req) => {
                const lc = req.text.toLowerCase();
                const platform = lc.includes("tiktok") ? "TikTok" : lc.includes("instagram") ? "Instagram" : lc.includes("youtube") ? "YouTube" : "Other";
                if (!grouped[platform]) grouped[platform] = [];
                grouped[platform].push(req);
              });
              return Object.entries(grouped).map(([platform, reqs]) => (
                <div key={platform} className="rounded-xl border border-[var(--neutral-200)] overflow-hidden">
                  {/* Platform header */}
                  <div className="flex items-center gap-3 bg-[var(--neutral-50)] px-4 py-3 border-b border-[var(--neutral-200)]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-700)]">
                      <span className="text-[10px] font-bold text-white">{platform.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--neutral-800)]">{platform}</span>
                    <Badge className="ml-auto bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px] font-bold px-2 py-0">{reqs.length}</Badge>
                  </div>
                  {/* Requirements under this platform */}
                  <div className="divide-y divide-[var(--neutral-100)]">
                    {reqs.map((req) => (
                      <div key={req.id} className="group flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-[var(--neutral-50)] transition-colors">
                        <ChevronRight className="size-3 text-[var(--neutral-300)] shrink-0" />
                        <span className="flex-1 text-sm text-[var(--neutral-700)]">{req.text}</span>
                        <button type="button" onClick={() => removePlatformReq(req.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[var(--neutral-400)] hover:text-[var(--red-500)]">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-[var(--neutral-300)] px-4 py-2.5">
              <Plus className="size-4 text-[var(--neutral-400)]" />
              <input
                className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
                placeholder="Add a requirement (include platform name e.g. 'TikTok')..."
                value={newPlatReq}
                onChange={(e) => setNewPlatReq(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlatformReq(); } }}
              />
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]" onClick={addPlatformReq} disabled={!newPlatReq.trim()}>Add</Button>
          </div>
        </Section>
      </div>

      {/* ═══ VARIANT E — Flat Checklist (Notion-style) ═══ */}
      <div className="rounded-2xl border-2 border-[var(--brand-300)] bg-[var(--brand-0)]/30 p-1">
        <div className="px-5 pt-5 pb-2">
          <Badge className="bg-[var(--brand-700)] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5">Variant E</Badge>
        </div>
        <div className="px-6 pb-6">
          <p className="text-[13px] font-semibold text-[var(--brand-700)] uppercase tracking-wider mb-1">Flat Checklist</p>
          <h3 className="text-lg font-bold text-[var(--neutral-800)] mb-1">Platform Requirements</h3>
          <p className="text-sm text-[var(--neutral-400)] mb-5">Notion-style minimal rows. No card nesting — just clean lines and checkboxes.</p>
          <Separator className="mb-4" />

          <div className="space-y-0">
            {draft.platformRequirements.map((req) => (
              <div key={req.id} className="group flex items-center gap-3.5 py-3 border-b border-[var(--neutral-100)] last:border-b-0">
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-[var(--brand-500)]">
                  <Check className="size-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="flex-1 text-[15px] text-[var(--neutral-400)] leading-relaxed">{req.text}</span>
                <button type="button" onClick={() => removePlatformReq(req.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <X className="size-4 text-[var(--neutral-300)] hover:text-[var(--neutral-500)]" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3.5 pt-3 mt-1">
            <Plus className="size-[22px] text-[var(--neutral-300)] shrink-0" />
            <input
              className="flex-1 text-[15px] text-[var(--neutral-700)] placeholder:text-[var(--neutral-300)] outline-none bg-transparent"
              placeholder="Add a requirement..."
              value={newPlatReq}
              onChange={(e) => setNewPlatReq(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlatformReq(); } }}
            />
          </div>
        </div>
      </div>

      {/* Other Requirements */}
      <Section
        icon={<FileText className="size-4 text-[var(--neutral-500)]" />}
        title="Other Requirements"
        subtitle="Additional rules or guidelines for creators."
        tooltip="Hashtags, tagging, posting timelines, content dos/don'ts — anything else creators need to know."
      >
        <div className="space-y-2 mb-3">
          {draft.otherRequirements.map((req) => (
            <div key={req.id} className="group flex items-start gap-3 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3 transition-all hover:border-[var(--brand-300)]">
              <div className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--neutral-100)]">
                <Check className="size-2.5 text-[var(--neutral-500)]" />
              </div>
              <span className="flex-1 text-sm text-[var(--neutral-700)] leading-relaxed">{req.text}</span>
              <button type="button" onClick={() => removeOtherReq(req.id)} className="shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--neutral-100)]">
                <X className="size-3.5 text-[var(--neutral-400)]" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-[var(--neutral-300)] px-4 py-2.5">
            <Plus className="size-4 text-[var(--neutral-400)]" />
            <input
              className="flex-1 bg-transparent text-sm text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] outline-none"
              placeholder="Add another requirement..."
              value={newOtherReq}
              onChange={(e) => setNewOtherReq(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOtherReq(); } }}
            />
          </div>
          <Button type="button" variant="outline" size="sm" className="shrink-0 border-[var(--brand-400)] text-[var(--brand-700)] hover:bg-[var(--brand-0)]" onClick={addOtherReq} disabled={!newOtherReq.trim()}>Add</Button>
        </div>
      </Section>

      {/* Terms & Commitments */}
      <Section
        icon={<Shield className="size-4 text-[var(--neutral-500)]" />}
        title="Terms & Commitments"
        subtitle="Pre-filled standard terms. Click Edit to customize."
        tooltip="These terms are shown to creators before they accept. They cover content review, confidentiality, and usage rights."
      >
        {editingTerms ? (
          <div>
            <textarea
              className="flex min-h-[90px] w-full rounded-xl border border-[var(--brand-300)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--neutral-700)] placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)] transition-colors"
              value={draft.terms}
              onChange={(e) => setDraft((prev) => ({ ...prev, terms: e.target.value }))}
              placeholder="Enter terms and commitments..."
              autoFocus
            />
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => setEditingTerms(false)}
                style={{ backgroundColor: "var(--brand-700)", color: "white" }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="group relative rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3">
            <p className="text-sm leading-relaxed text-[var(--neutral-700)] pr-16">
              {draft.terms || "No terms specified."}
            </p>
            <button
              type="button"
              onClick={() => setEditingTerms(true)}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-[var(--neutral-200)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--neutral-600)] shadow-sm transition-all hover:border-[var(--brand-300)] hover:text-[var(--brand-700)]"
            >
              <Pencil className="size-3" />
              Edit
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 2 — Gifted Product (Shopify) & Creator Prefs
// ═══════════════════════════════════════════════════
interface CompensationDraft {
  giftingInstructions: string;
  selectedProducts: ShopifyProduct[];
  creatorDescription: string;
}

function StepCompensation({
  draft,
  setDraft,
}: {
  draft: CompensationDraft;
  setDraft: React.Dispatch<React.SetStateAction<CompensationDraft>>;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleProductSelect = (products: ShopifyProduct[]) => {
    setDraft((prev) => ({ ...prev, selectedProducts: products }));
  };

  const removeProduct = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((p) => p.id !== id),
    }));
  };

  const selectedIds = new Set(draft.selectedProducts.map((p) => p.id));

  const totalValue = draft.selectedProducts.reduce((sum, p) => {
    const price = parseFloat(p.price.replace("$", ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Gifted Product Section */}
      <Section
        icon={<Gift className="size-4 text-[var(--brand-700)]" />}
        title="Gifted Product"
        subtitle="Tell creators how to choose their product, then select which products to offer."
      >
        {/* Gifting Instructions */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-[13px] font-medium text-[var(--neutral-700)] mb-2">
            <MessageSquare className="size-3.5 text-[var(--neutral-500)]" />
            Instructions for creators
          </label>
          <textarea
            className="flex min-h-[70px] w-full rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:bg-white focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)] transition-colors"
            value={draft.giftingInstructions}
            onChange={(e) => setDraft((prev) => ({ ...prev, giftingInstructions: e.target.value }))}
            placeholder="e.g., Choose 1 product from the selection below, Pick your two favorites..."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {["Choose 1 product", "Pick your 2 favorites", "Select any product you'd like to feature"].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, giftingInstructions: suggestion + " from the selection below." }))}
                className="rounded-lg border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-3 py-1.5 text-xs text-[var(--neutral-600)] transition-all hover:border-[var(--brand-300)] hover:bg-[var(--brand-0)] hover:text-[var(--brand-700)]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-[var(--neutral-100)] mb-5" />
        {/* Shopify connection status */}
        <div className="flex items-center gap-2 rounded-xl border border-[var(--green-300)] bg-[var(--green-100)] px-4 py-2.5 mb-5">
          <ShoppingBag className="size-4 text-[var(--green-700)]" />
          <span className="text-sm font-medium text-[var(--green-700)]">Connected to Shopify</span>
          <span className="text-xs text-[var(--green-600)]">· 28litsea.myshopify.com</span>
        </div>

        {/* Selected products */}
        {draft.selectedProducts.length > 0 && (
          <div className="space-y-2 mb-4">
            {draft.selectedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex items-center gap-3 rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] p-3 transition-all hover:border-[var(--brand-300)]"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-12 w-12 rounded-lg object-cover border border-[var(--neutral-200)]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--neutral-800)] truncate">{product.title}</p>
                  <p className="text-xs text-[var(--neutral-500)]">{product.variant} · {product.inventory} in stock</p>
                </div>
                <span className="text-sm font-semibold text-[var(--neutral-700)] shrink-0">{product.price}</span>
                <button type="button" onClick={() => removeProduct(product.id)} className="shrink-0 rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--neutral-100)]">
                  <X className="size-3.5 text-[var(--neutral-400)]" />
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-xl bg-[var(--brand-0)] px-4 py-2.5 border border-[var(--brand-200)]">
              <span className="text-xs font-medium text-[var(--brand-700)]">
                <Package className="inline size-3.5 mr-1" />
                {draft.selectedProducts.length} product{draft.selectedProducts.length !== 1 ? "s" : ""} selected
              </span>
              <span className="text-sm font-bold text-[var(--brand-700)]">
                Est. value: ${totalValue.toFixed(2)}/creator
              </span>
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          className="w-full gap-2 border-dashed border-[var(--neutral-300)] text-[var(--neutral-600)] hover:border-[var(--brand-400)] hover:text-[var(--brand-700)] hover:bg-[var(--brand-0)]"
        >
          <Plus className="size-4" />
          {draft.selectedProducts.length > 0 ? "Change Products" : "Select Products from Shopify"}
        </Button>
      </Section>

      <ShopifyProductPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleProductSelect}
        selectedIds={selectedIds}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 3 — Target Creators
// ═══════════════════════════════════════════════════
function StepTargetCreators({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Section
        icon={<Users className="size-4 text-[var(--brand-700)]" />}
        title="Target Creators"
        subtitle="Describe who you're looking for. This helps us match the right creators to your campaign."
        tooltip="Be as specific or broad as you'd like. Include geography, follower range, content style, niche, audience demographics, and platform preferences."
      >
        <textarea
          className="flex min-h-[180px] w-full rounded-xl border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-4 py-3 text-sm leading-relaxed text-[var(--neutral-800)] placeholder:text-[var(--neutral-400)] focus:bg-white focus:border-[var(--brand-700)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-700)] transition-colors"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"Geography preference (e.g., US-based, UK-based)\nFollower range (e.g., 1K–10K nano creators)\nContent style (e.g., aesthetic flat-lays, talking-head reviews)\nNiche (e.g., clean beauty, skincare, wellness)\nAudience demographics (e.g., women 18–34)\nPlatform focus (e.g., primarily TikTok creators)"}
        />
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STEP 4 — Creator-Facing Preview (Recap)
// ═══════════════════════════════════════════════════
function StepPreview({
  brief,
  comp,
}: {
  brief: BriefDraft;
  comp: CompensationDraft;
}) {
  const totalValue = comp.selectedProducts.reduce((sum, p) => {
    const price = parseFloat(p.price.replace("$", ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="mx-auto max-w-xl">
      {/* Preview frame label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Eye className="size-4 text-[var(--brand-700)]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-700)]">
          Creator Preview — This is what they'll see
        </span>
      </div>

      {/* The "card" that simulates what the creator sees */}
      <div
        className="rounded-2xl border-2 border-[var(--neutral-200)] overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
      >
        {/* Brand header */}
        <div className="bg-gradient-to-br from-[var(--brand-700)] to-[var(--brand-600)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm">
              28
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Summer Glow Collection Launch</h2>
              <p className="text-xs text-white/70">by 28 Litsea</p>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-5 space-y-5">
          {/* Campaign description */}
          <div>
            <p className="text-sm text-[var(--neutral-700)] leading-relaxed">
              {brief.campaignDescription || "No campaign description provided."}
            </p>
          </div>

          <Separator className="bg-[var(--neutral-100)]" />

          {/* Compensation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="size-4 text-[var(--brand-700)]" />
              <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--neutral-800)]">Compensation</h4>
            </div>
            <div className="rounded-xl bg-[var(--brand-0)] border border-[var(--brand-200)] p-4">
              <p className="text-sm font-semibold text-[var(--brand-700)] mb-1">
                Free product (valued at ${totalValue > 0 ? totalValue.toFixed(0) : "—"})
              </p>
              {comp.giftingInstructions && (
                <p className="text-xs text-[var(--neutral-600)] leading-relaxed">
                  {comp.giftingInstructions}
                </p>
              )}
              {comp.selectedProducts.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {comp.selectedProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 rounded-lg bg-white border border-[var(--neutral-200)] px-3 py-2 shrink-0">
                      <img src={p.image} alt={p.title} className="h-8 w-8 rounded-md object-cover" />
                      <div>
                        <p className="text-xs font-medium text-[var(--neutral-800)]">{p.title}</p>
                        <p className="text-[10px] text-[var(--neutral-500)]">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-[var(--neutral-100)]" />

          {/* Content Requirements */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-[var(--brand-700)]" />
              <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--neutral-800)]">Content Requirements</h4>
            </div>
            <div className="space-y-2">
              {brief.platformRequirements.map((req) => (
                <div key={req.id} className="flex items-start gap-2.5">
                  <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--brand-100)]">
                    <Check className="size-2.5 text-[var(--brand-700)]" />
                  </div>
                  <span className="text-sm text-[var(--neutral-700)] leading-relaxed">{req.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other Requirements */}
          {brief.otherRequirements.length > 0 && (
            <>
              <Separator className="bg-[var(--neutral-100)]" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="size-4 text-[var(--neutral-500)]" />
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--neutral-800)]">Other Requirements</h4>
                </div>
                <div className="space-y-2">
                  {brief.otherRequirements.map((req) => (
                    <div key={req.id} className="flex items-start gap-2.5">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--neutral-100)]">
                        <Check className="size-2.5 text-[var(--neutral-500)]" />
                      </div>
                      <span className="text-sm text-[var(--neutral-600)] leading-relaxed">{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-[var(--neutral-100)]" />

          {/* Terms */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-4 text-[var(--neutral-500)]" />
              <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--neutral-800)]">Terms & Commitments</h4>
            </div>
            <p className="text-xs text-[var(--neutral-500)] leading-relaxed">
              {brief.terms || "No terms specified."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--neutral-200)] bg-[var(--neutral-50)] px-6 py-3">
          <p className="text-center text-[10px] text-[var(--neutral-400)]">
            Questions? Email collabs@benable.com
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [briefDraft, setBriefDraft] = useState<BriefDraft>({
    brandDescription: PREFILLED_BRAND_DESCRIPTION,
    campaignDescription: PREFILLED_CAMPAIGN_DESCRIPTION,
    platformRequirements: [...DEFAULT_PLATFORM_REQUIREMENTS],
    otherRequirements: [...DEFAULT_OTHER_REQUIREMENTS],
    terms: PREFILLED_TERMS,
  });

  const [compDraft, setCompDraft] = useState<CompensationDraft>({
    giftingInstructions: DEFAULT_GIFTING_INSTRUCTIONS,
    selectedProducts: [],
    creatorDescription: "",
  });

  const totalSteps = 4;

  const handleNext = () => { if (step < totalSteps) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleLaunch = () => { navigate("/campaigns"); };

  const canAdvance =
    step === 1
      ? briefDraft.brandDescription.trim().length > 0 && briefDraft.campaignDescription.trim().length > 0
      : step === 2
        ? compDraft.selectedProducts.length > 0
        : true; // Steps 3 & 4 always ready

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="border-b border-[var(--neutral-200)] bg-white px-8 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-[var(--neutral-800)]">Create Campaign Brief</h1>
              <p className="text-xs text-[var(--neutral-500)]">
                {step === 1
                  ? "Set up what creators will see when they're invited."
                  : step === 2
                    ? "Configure gifting and select products to offer."
                    : step === 3
                      ? "Describe your ideal creators for this campaign."
                      : "Review exactly what creators will see."}
              </p>
            </div>
            <Badge className="border-[var(--neutral-200)] bg-white text-[var(--neutral-600)] text-[10px]">
              <FileText className="size-3 mr-1" />
              Draft
            </Badge>
          </div>
          <StepIndicator currentStep={step} totalSteps={totalSteps} onStepClick={setStep} />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 pb-28" style={{ backgroundColor: "var(--neutral-50)" }}>
        {step === 1 && <StepBrief draft={briefDraft} setDraft={setBriefDraft} />}
        {step === 2 && <StepCompensation draft={compDraft} setDraft={setCompDraft} />}
        {step === 3 && <StepTargetCreators value={compDraft.creatorDescription} onChange={(val) => setCompDraft((prev) => ({ ...prev, creatorDescription: val }))} />}
        {step === 4 && <StepPreview brief={briefDraft} comp={compDraft} />}
      </div>

      {/* Footer navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--neutral-200)] bg-white/95 backdrop-blur-sm px-8 py-3.5 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={step === 1 ? () => navigate("/campaigns") : handleBack}
            className="gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i + 1 === step ? 28 : 8,
                  backgroundColor: i + 1 <= step ? "var(--brand-700)" : "var(--neutral-200)",
                }}
              />
            ))}
          </div>

          {step < totalSteps ? (
            <Button
              size="sm"
              onClick={handleNext}
              disabled={!canAdvance}
              className="gap-1.5"
              style={{ backgroundColor: "var(--brand-700)", color: "white" }}
            >
              {step === 3 ? (
                <>
                  <Eye className="size-3.5" />
                  Preview
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleLaunch}
              className="gap-1.5"
              style={{ backgroundColor: "var(--brand-700)", color: "white" }}
            >
              Launch Campaign
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
