import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ArrowLeft,
  Eye,
  Sparkles,
  FileText,
  ListChecks,
  ShieldCheck,
  Package,
  Settings2,
  Users,
  ClipboardList,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PIKORA_PRODUCTS,
  type PikoraProduct,
  PIKORA_BRAND_DESCRIPTION,
  PIKORA_TERMS,
  PIKORA_GIFTING_INSTRUCTIONS,
  PIKORA_DELIVERABLES,
  PIKORA_INSTRUCTIONS,
  PIKORA_TARGET_CREATORS,
  GUIDANCE_SECTIONS,
  type GuidanceSection,
} from "@/data/pikora-mock-data";

// ────────────────────────────────────────────────────────────────────────────
// State
// ────────────────────────────────────────────────────────────────────────────

interface V1State {
  brandDescription: string;
  campaignDescription: string;
  deliverables: string;
  otherRequirements: string;
  terms: string;
  selectedProductIds: Set<string>;
  productConditions: string;
  giftingInstructions: string;
  creatorNiche: string;
  creatorFollowerRange: string;
  creatorGeography: string;
  creatorDemographics: string;
  creatorPlatforms: string;
  creatorStyle: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Defaults
// ────────────────────────────────────────────────────────────────────────────

const DEFAULT_DELIVERABLES = PIKORA_DELIVERABLES.map((d) => d.text).join("\n");

const DEFAULT_OTHER_REQUIREMENTS = PIKORA_INSTRUCTIONS.filter(
  (i) => i.defaultSelected
)
  .map((i) => i.text)
  .join("\n");

function buildInitialState(): V1State {
  return {
    brandDescription: PIKORA_BRAND_DESCRIPTION,
    campaignDescription: "",
    deliverables: DEFAULT_DELIVERABLES,
    otherRequirements: DEFAULT_OTHER_REQUIREMENTS,
    terms: PIKORA_TERMS,
    selectedProductIds: new Set(PIKORA_PRODUCTS.map((p) => p.id)),
    productConditions: PIKORA_GIFTING_INSTRUCTIONS,
    giftingInstructions: PIKORA_GIFTING_INSTRUCTIONS,
    creatorNiche: PIKORA_TARGET_CREATORS.niches.join(", "),
    creatorFollowerRange: PIKORA_TARGET_CREATORS.followerRange,
    creatorGeography: PIKORA_TARGET_CREATORS.geography,
    creatorDemographics: PIKORA_TARGET_CREATORS.demographics,
    creatorPlatforms: PIKORA_TARGET_CREATORS.platforms.join(", "),
    creatorStyle: PIKORA_TARGET_CREATORS.style,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Section definitions (for TOC + numbering)
// ────────────────────────────────────────────────────────────────────────────

interface SectionDef {
  id: string;
  label: string;
  focusKey: string;
  icon: React.ElementType;
}

const SECTIONS: SectionDef[] = [
  { id: "brand", label: "Brand", focusKey: "brand", icon: Sparkles },
  { id: "campaign", label: "Campaign", focusKey: "campaign", icon: FileText },
  { id: "deliverables", label: "Deliverables", focusKey: "deliverables", icon: ListChecks },
  { id: "requirements", label: "Requirements", focusKey: "requirements", icon: ClipboardList },
  { id: "terms", label: "Terms", focusKey: "terms", icon: ShieldCheck },
  { id: "products", label: "Products", focusKey: "products", icon: Package },
  { id: "conditions", label: "Conditions", focusKey: "conditions", icon: Settings2 },
  { id: "creators", label: "Creators", focusKey: "creators", icon: Users },
];

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

/** Section header with numbered badge and accent line */
function SectionHeader({
  number,
  title,
  subtitle,
  icon: Icon,
}: {
  number: number;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Numbered badge */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{
          backgroundColor: "var(--brand-100, #e0edff)",
          color: "var(--brand-700)",
        }}
      >
        {number}
      </div>
      <div className="flex-1 space-y-0.5 pt-0.5">
        <div className="flex items-center gap-2">
          <Icon
            className="h-4 w-4"
            style={{ color: "var(--brand-600, var(--brand-700))" }}
          />
          <h3
            className="font-semibold text-base"
            style={{ color: "var(--neutral-800)" }}
          >
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--neutral-400)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/** Auto-resizing textarea with clean styling and character count */
function FormTextarea({
  value,
  onChange,
  onFocus,
  placeholder,
  minRows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
  minRows?: number;
}) {
  const charCount = value.length;
  const lineCount = value.split("\n").length;

  return (
    <div className="space-y-1.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        rows={minRows}
        className="w-full resize-y rounded-xl border px-4 py-3 text-base leading-relaxed outline-none transition-all duration-200"
        style={{
          borderColor: "var(--neutral-200)",
          backgroundColor: "#ffffff",
          color: "var(--neutral-800)",
        }}
        onFocusCapture={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--brand-300, var(--brand-700))";
          el.style.boxShadow =
            "0 0 0 3px color-mix(in srgb, var(--brand-700) 12%, transparent)";
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--neutral-200)";
          el.style.boxShadow = "none";
        }}
      />
      <div
        className="flex items-center justify-end gap-3 text-xs"
        style={{ color: "var(--neutral-300)" }}
      >
        <span>{charCount} chars</span>
        <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
      </div>
    </div>
  );
}

/** Simple text input with matching styling */
function FormInput({
  value,
  onChange,
  onFocus,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      className="w-full rounded-xl border px-4 py-2.5 text-base outline-none transition-all duration-200"
      style={{
        borderColor: "var(--neutral-200)",
        backgroundColor: "#ffffff",
        color: "var(--neutral-800)",
      }}
      onFocusCapture={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--brand-300, var(--brand-700))";
        el.style.boxShadow =
          "0 0 0 3px color-mix(in srgb, var(--brand-700) 12%, transparent)";
      }}
      onBlurCapture={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--neutral-200)";
        el.style.boxShadow = "none";
      }}
    />
  );
}

/** Product row with image, price, and checkbox */
function ProductRow({
  product,
  selected,
  onToggle,
  onFocus,
}: {
  product: PikoraProduct;
  selected: boolean;
  onToggle: () => void;
  onFocus: () => void;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="flex items-center gap-3.5 rounded-xl px-3 py-3 cursor-pointer transition-all duration-150 border"
      style={{
        backgroundColor: selected ? "var(--brand-50, #f0f7ff)" : "#ffffff",
        borderColor: selected
          ? "var(--brand-200, var(--brand-100))"
          : "var(--neutral-100, #f5f5f5)",
      }}
    >
      {/* Checkbox indicator */}
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors"
        style={{
          borderColor: selected ? "var(--brand-700)" : "var(--neutral-300)",
          backgroundColor: selected ? "var(--brand-700)" : "transparent",
        }}
      >
        {selected && <Check className="h-3.5 w-3.5 text-white" />}
      </div>

      {/* Product image */}
      <img
        src={product.image}
        alt={product.title}
        className="h-10 w-10 shrink-0 rounded-lg object-cover"
        style={{
          border: "1px solid var(--neutral-100)",
        }}
      />

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <span
          className="text-sm font-medium block truncate"
          style={{ color: "var(--neutral-800)" }}
        >
          {product.title}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--neutral-400)" }}
        >
          {product.variant} &middot; {product.inventory} in stock
        </span>
      </div>

      {/* Price */}
      <span
        className="text-sm font-semibold shrink-0"
        style={{ color: "var(--brand-700)" }}
      >
        {product.price}
      </span>
    </div>
  );
}

/** Icon map for guidance panel */
const GUIDANCE_ICONS: Record<string, React.ElementType> = {
  brand: Sparkles,
  campaign: FileText,
  deliverables: ListChecks,
  requirements: ClipboardList,
  terms: ShieldCheck,
  products: Package,
  conditions: Settings2,
  creators: Users,
};

/** Right-column guidance panel — card style with icon and tip badge */
function GuidancePanel({
  focusedSection,
}: {
  focusedSection: string | null;
}) {
  const section: GuidanceSection | undefined = GUIDANCE_SECTIONS.find(
    (s) => s.key === focusedSection
  );
  const prevSectionRef = useRef<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (focusedSection !== prevSectionRef.current) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
        prevSectionRef.current = focusedSection;
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [focusedSection]);

  const Icon = focusedSection ? (GUIDANCE_ICONS[focusedSection] || Lightbulb) : Lightbulb;

  return (
    <div
      className="rounded-2xl p-6 space-y-5 transition-opacity duration-200"
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
        border: "1px solid var(--neutral-100, #f5f5f5)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {section ? (
        <>
          {/* Icon header */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              backgroundColor: "var(--brand-50, #f0f7ff)",
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: "var(--brand-700)" }}
            />
          </div>

          {/* Tip badge */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--brand-100, #e0edff)",
              color: "var(--brand-700)",
            }}
          >
            <Lightbulb className="h-3 w-3" />
            Tip
          </div>

          <h4
            className="font-semibold text-base"
            style={{ color: "var(--neutral-800)" }}
          >
            {section.title}
          </h4>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--neutral-500)" }}
          >
            {section.subtitle}
          </p>

          {/* Example cards */}
          <div className="space-y-2.5 pt-1">
            {section.examples.map((example, idx) => (
              <div
                key={idx}
                className="rounded-lg px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  backgroundColor: "var(--neutral-50, #fafafa)",
                  color: "var(--neutral-600)",
                  borderLeft: "2px solid var(--brand-200, var(--brand-100))",
                }}
              >
                {example}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-10 text-center space-y-3">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "var(--neutral-50, #fafafa)",
            }}
          >
            <Lightbulb
              className="h-6 w-6"
              style={{ color: "var(--neutral-300)" }}
            />
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--neutral-400)" }}
          >
            Click on any field to see<br />guidance and examples.
          </p>
        </div>
      )}
    </div>
  );
}

/** Sidebar table of contents */
function TableOfContents({
  activeSection,
  completedSections,
  onClickSection,
}: {
  activeSection: string | null;
  completedSections: Set<string>;
  onClickSection: (sectionId: string) => void;
}) {
  return (
    <nav className="space-y-1">
      {SECTIONS.map((sec, idx) => {
        const isActive = activeSection === sec.focusKey;
        const isCompleted = completedSections.has(sec.id);

        return (
          <button
            key={sec.id}
            onClick={() => onClickSection(sec.id)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150"
            style={{
              backgroundColor: isActive
                ? "var(--brand-50, #f0f7ff)"
                : "transparent",
              color: isActive
                ? "var(--brand-700)"
                : "var(--neutral-500)",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {/* Step number / check */}
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{
                backgroundColor: isCompleted
                  ? "var(--brand-700)"
                  : isActive
                  ? "var(--brand-100, #e0edff)"
                  : "var(--neutral-100, #f5f5f5)",
                color: isCompleted
                  ? "#ffffff"
                  : isActive
                  ? "var(--brand-700)"
                  : "var(--neutral-400)",
              }}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                idx + 1
              )}
            </span>
            <span className="truncate">{sec.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page Component
// ────────────────────────────────────────────────────────────────────────────

export default function CreateCampaignV1() {
  const navigate = useNavigate();
  const [state, setState] = useState<V1State>(buildInitialState);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const update = useCallback(
    <K extends keyof V1State>(key: K, value: V1State[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleProduct = useCallback((productId: string) => {
    setState((prev) => {
      const next = new Set(prev.selectedProductIds);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return { ...prev, selectedProductIds: next };
    });
  }, []);

  const focusOn = useCallback(
    (key: string) => () => setFocusedSection(key),
    []
  );

  const handleSaveDraft = useCallback(() => {
    navigate("/campaigns");
  }, [navigate]);

  const handlePreviewLaunch = useCallback(() => {
    navigate("/campaigns");
  }, [navigate]);

  // ── Completion tracking ────────────────────────────────────────────────

  const completedSections = useMemo(() => {
    const filled = new Set<string>();
    if (state.brandDescription.trim()) filled.add("brand");
    if (state.campaignDescription.trim()) filled.add("campaign");
    if (state.deliverables.trim()) filled.add("deliverables");
    if (state.otherRequirements.trim()) filled.add("requirements");
    if (state.terms.trim()) filled.add("terms");
    if (state.selectedProductIds.size > 0) filled.add("products");
    if (state.productConditions.trim()) filled.add("conditions");
    if (
      state.creatorNiche.trim() ||
      state.creatorFollowerRange.trim() ||
      state.creatorGeography.trim()
    )
      filled.add("creators");
    return filled;
  }, [state]);

  const completedCount = completedSections.size;
  const totalSections = SECTIONS.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  const handleScrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--neutral-50, #fafafa)" }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 border-b px-6 py-3"
        style={{
          borderColor: "var(--neutral-200)",
          backgroundColor: "var(--white, #fff)",
        }}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--neutral-900)" }}
        >
          Create Campaign
        </h1>
        <div className="flex-1" />
        {/* Compact progress in header */}
        <span
          className="text-xs font-medium"
          style={{ color: "var(--neutral-400)" }}
        >
          {completedCount}/{totalSections} sections
        </span>
        <div
          className="h-1.5 w-24 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--neutral-100, #f5f5f5)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "var(--brand-700)",
            }}
          />
        </div>
      </header>

      {/* ── Three-column body ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar: Table of contents ──────────────────────────── */}
        <aside
          className="hidden w-52 shrink-0 border-r xl:block"
          style={{
            borderColor: "var(--neutral-200)",
            backgroundColor: "var(--white, #fff)",
          }}
        >
          <div className="sticky top-[3.5rem] p-4 pt-6">
            <p
              className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--neutral-400)" }}
            >
              Sections
            </p>
            <TableOfContents
              activeSection={focusedSection}
              completedSections={completedSections}
              onClickSection={handleScrollToSection}
            />
          </div>
        </aside>

        {/* ── Center column: scrollable form ─────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-2xl space-y-10">
            {/* 1. About Your Brand */}
            <section
              id="section-brand"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={1}
                icon={Sparkles}
                title="About Your Brand"
                subtitle="Describe your brand in a few sentences so creators know who you are."
              />
              <FormTextarea
                value={state.brandDescription}
                onChange={(v) => update("brandDescription", v)}
                onFocus={focusOn("brand")}
                placeholder="Tell creators about your brand..."
                minRows={4}
              />
            </section>

            {/* 2. About This Campaign */}
            <section
              id="section-campaign"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={2}
                icon={FileText}
                title="About This Campaign"
                subtitle="What is this campaign about? Describe the creative direction."
              />
              <FormTextarea
                value={state.campaignDescription}
                onChange={(v) => update("campaignDescription", v)}
                onFocus={focusOn("campaign")}
                placeholder="Describe the campaign concept, goals, and vibe..."
                minRows={5}
              />
            </section>

            {/* 3. Content Deliverables */}
            <section
              id="section-deliverables"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={3}
                icon={ListChecks}
                title="Content Deliverables"
                subtitle="List each deliverable on its own line."
              />
              <FormTextarea
                value={state.deliverables}
                onChange={(v) => update("deliverables", v)}
                onFocus={focusOn("deliverables")}
                placeholder="One deliverable per line..."
                minRows={5}
              />
            </section>

            {/* 4. Other Requirements */}
            <section
              id="section-requirements"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={4}
                icon={ClipboardList}
                title="Other Requirements"
                subtitle="Hashtags, tagging, timing, dos and don'ts -- one per line."
              />
              <FormTextarea
                value={state.otherRequirements}
                onChange={(v) => update("otherRequirements", v)}
                onFocus={focusOn("requirements")}
                placeholder="Add requirements, one per line..."
                minRows={5}
              />
            </section>

            {/* 5. Terms & Commitments */}
            <section
              id="section-terms"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={5}
                icon={ShieldCheck}
                title="Terms & Commitments"
                subtitle="Shown to creators before they accept the brief."
              />
              <FormTextarea
                value={state.terms}
                onChange={(v) => update("terms", v)}
                onFocus={focusOn("terms")}
                placeholder="Enter campaign terms..."
                minRows={4}
              />
            </section>

            {/* 6. Product Selection */}
            <section
              id="section-products"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <div className="flex items-start justify-between">
                <SectionHeader
                  number={6}
                  icon={Package}
                  title="Product Selection"
                  subtitle="Select the products creators can choose from for this campaign."
                />
                {/* Selected counter badge */}
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor:
                      state.selectedProductIds.size > 0
                        ? "var(--brand-100, #e0edff)"
                        : "var(--neutral-100, #f5f5f5)",
                    color:
                      state.selectedProductIds.size > 0
                        ? "var(--brand-700)"
                        : "var(--neutral-400)",
                  }}
                >
                  {state.selectedProductIds.size} selected
                </span>
              </div>
              <div className="space-y-2">
                {PIKORA_PRODUCTS.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={state.selectedProductIds.has(product.id)}
                    onToggle={() => toggleProduct(product.id)}
                    onFocus={focusOn("products")}
                  />
                ))}
              </div>
            </section>

            {/* 7. Product Conditions */}
            <section
              id="section-conditions"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={7}
                icon={Settings2}
                title="Product Conditions"
                subtitle="Tell creators how many products they receive and any selection rules."
              />
              <FormTextarea
                value={state.productConditions}
                onChange={(v) => update("productConditions", v)}
                onFocus={focusOn("conditions")}
                placeholder="e.g. Choose 1 flavor from the options above..."
                minRows={3}
              />
            </section>

            {/* 8. Target Creators */}
            <section
              id="section-creators"
              className="rounded-2xl border p-6 space-y-4"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "var(--neutral-100, #f5f5f5)",
                borderLeft: "3px solid var(--brand-200, var(--brand-100))",
              }}
            >
              <SectionHeader
                number={8}
                icon={Users}
                title="Target Creators"
                subtitle="Describe your ideal creator profile across these dimensions."
              />
              <div className="space-y-4 pt-1">
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    Niche
                  </label>
                  <FormInput
                    value={state.creatorNiche}
                    onChange={(v) => update("creatorNiche", v)}
                    onFocus={focusOn("creators")}
                    placeholder="e.g. Wellness, Fitness, Food & Cooking"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    Follower Range
                  </label>
                  <FormInput
                    value={state.creatorFollowerRange}
                    onChange={(v) => update("creatorFollowerRange", v)}
                    onFocus={focusOn("creators")}
                    placeholder="e.g. 1K - 50K"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    Geography
                  </label>
                  <FormInput
                    value={state.creatorGeography}
                    onChange={(v) => update("creatorGeography", v)}
                    onFocus={focusOn("creators")}
                    placeholder="e.g. US-based"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    Demographics
                  </label>
                  <FormInput
                    value={state.creatorDemographics}
                    onChange={(v) => update("creatorDemographics", v)}
                    onFocus={focusOn("creators")}
                    placeholder="e.g. Women & men 22-40"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    Platforms
                  </label>
                  <FormInput
                    value={state.creatorPlatforms}
                    onChange={(v) => update("creatorPlatforms", v)}
                    onFocus={focusOn("creators")}
                    placeholder="e.g. TikTok, Instagram, Benable"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--neutral-700)" }}
                  >
                    Content Style
                  </label>
                  <FormTextarea
                    value={state.creatorStyle}
                    onChange={(v) => update("creatorStyle", v)}
                    onFocus={focusOn("creators")}
                    placeholder="Describe the content style you're looking for..."
                    minRows={3}
                  />
                </div>
              </div>
            </section>

            {/* Bottom spacer so content isn't hidden behind footer */}
            <div className="h-28" />
          </div>
        </main>

        {/* ── Right column: sticky guidance ──────────────────────────── */}
        <aside
          className="hidden w-80 shrink-0 border-l lg:block"
          style={{ borderColor: "var(--neutral-200)" }}
        >
          <div className="sticky top-[3.5rem] p-5 pt-8">
            <GuidancePanel focusedSection={focusedSection} />
          </div>
        </aside>
      </div>

      {/* ── Sticky footer ───────────────────────────────────────────────── */}
      <footer
        className="sticky bottom-0 z-20 border-t"
        style={{
          borderColor: "var(--neutral-200)",
          backgroundColor: "var(--white, #fff)",
        }}
      >
        {/* Progress bar */}
        <div
          className="h-1 w-full"
          style={{ backgroundColor: "var(--neutral-100, #f5f5f5)" }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: "var(--brand-700)",
            }}
          />
        </div>
        <div className="flex items-center justify-between px-6 py-3">
          <span
            className="text-sm"
            style={{ color: "var(--neutral-400)" }}
          >
            {completedCount} of {totalSections} sections completed
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="rounded-lg px-5"
            >
              Save Draft
            </Button>
            <Button
              onClick={handlePreviewLaunch}
              className="rounded-lg px-5 text-white"
              style={{ backgroundColor: "var(--brand-700)" }}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              Preview & Launch
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
