import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, X, Sparkles, Plus, Package, Users, Hash, MapPin, BarChart3, Palette, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PIKORA_PRODUCTS,
  PIKORA_BRAND_DESCRIPTION,
  PIKORA_CAMPAIGN_IDEAS,
  PIKORA_DELIVERABLES,
  PIKORA_INSTRUCTIONS,
  PIKORA_TARGET_CREATORS,
} from "@/data/pikora-mock-data";

/* ─── Campaign idea gradient themes ─── */
const IDEA_GRADIENTS: Record<string, { gradient: string; emoji: string }> = {
  "idea-1": {
    gradient: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #EA580C 100%)",
    emoji: "\u2600\uFE0F",
  },
  "idea-2": {
    gradient: "linear-gradient(135deg, #C084FC 0%, #818CF8 50%, #38BDF8 100%)",
    emoji: "\uD83C\uDFAF",
  },
  "idea-3": {
    gradient: "linear-gradient(135deg, #6EE7B7 0%, #34D399 50%, #059669 100%)",
    emoji: "\u2728",
  },
};

const STEP_TITLES = [
  "About This Brand",
  "About This Campaign",
  "Content Deliverables",
  "Other Instructions",
  "Product Selection",
  "Target Creators",
];

const STEP_LABELS = [
  "BRAND",
  "CAMPAIGN",
  "DELIVERABLES",
  "INSTRUCTIONS",
  "PRODUCTS",
  "CREATORS",
];

export default function CreateCampaignV3() {
  const navigate = useNavigate();

  // ─── Step state ───
  const [step, setStep] = useState(0);

  // ─── Step 1: Brand ───
  const [brandDescription, setBrandDescription] = useState(PIKORA_BRAND_DESCRIPTION);

  // ─── Step 2: Campaign Ideas ───
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [ideaTexts, setIdeaTexts] = useState<Record<string, string>>(
    Object.fromEntries(PIKORA_CAMPAIGN_IDEAS.map((i) => [i.id, i.description]))
  );
  const [customCampaignDesc, setCustomCampaignDesc] = useState("");
  const [useCustomCampaign, setUseCustomCampaign] = useState(false);

  // ─── Step 3: Deliverables ───
  const [selectedDeliverableIds, setSelectedDeliverableIds] = useState<Set<string>>(
    new Set(PIKORA_DELIVERABLES.map((d) => d.id))
  );
  const [deliverableTexts, setDeliverableTexts] = useState<Record<string, string>>(
    Object.fromEntries(PIKORA_DELIVERABLES.map((d) => [d.id, d.text]))
  );
  const [customDeliverables, setCustomDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");

  // ─── Step 4: Instructions ───
  const [selectedInstructionIds, setSelectedInstructionIds] = useState<Set<string>>(
    new Set(PIKORA_INSTRUCTIONS.filter((i) => i.defaultSelected).map((i) => i.id))
  );
  const [instructionTexts, setInstructionTexts] = useState<Record<string, string>>(
    Object.fromEntries(PIKORA_INSTRUCTIONS.map((i) => [i.id, i.text]))
  );
  const [customInstructions, setCustomInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState("");

  // ─── Step 5: Products ───
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [creatorPickCount, setCreatorPickCount] = useState(1);
  const [productConditions, setProductConditions] = useState("");

  // ─── Step 6: Target Creators ───
  const [targetNiches, setTargetNiches] = useState<Set<string>>(
    new Set(PIKORA_TARGET_CREATORS.niches)
  );
  const [targetFollowerRange, setTargetFollowerRange] = useState(
    PIKORA_TARGET_CREATORS.followerRange
  );
  const [targetGeography, setTargetGeography] = useState(PIKORA_TARGET_CREATORS.geography);
  const [targetDemographics, setTargetDemographics] = useState(
    PIKORA_TARGET_CREATORS.demographics
  );
  const [targetPlatforms, setTargetPlatforms] = useState<Set<string>>(
    new Set(PIKORA_TARGET_CREATORS.platforms)
  );
  const [targetStyle, setTargetStyle] = useState(PIKORA_TARGET_CREATORS.style);

  // ─── Helpers ───

  const toggleDeliverable = (id: string) => {
    setSelectedDeliverableIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateDeliverableText = (id: string, value: string) => {
    setDeliverableTexts((prev) => ({ ...prev, [id]: value }));
  };

  const addDeliverable = () => {
    const trimmed = newDeliverable.trim();
    if (!trimmed) return;
    setCustomDeliverables((prev) => [...prev, trimmed]);
    setNewDeliverable("");
  };

  const removeCustomDeliverable = (index: number) => {
    setCustomDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleInstruction = (id: string) => {
    setSelectedInstructionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateInstructionText = (id: string, value: string) => {
    setInstructionTexts((prev) => ({ ...prev, [id]: value }));
  };

  const addInstruction = () => {
    const trimmed = newInstruction.trim();
    if (!trimmed) return;
    setCustomInstructions((prev) => [...prev, trimmed]);
    setNewInstruction("");
  };

  const removeCustomInstruction = (index: number) => {
    setCustomInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleNiche = (niche: string) => {
    setTargetNiches((prev) => {
      const next = new Set(prev);
      if (next.has(niche)) next.delete(niche);
      else next.add(niche);
      return next;
    });
  };

  const togglePlatform = (platform: string) => {
    setTargetPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  // ─── Navigation ───

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else navigate("/campaigns");
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // ─── Deduplicate pick count options ───
  const getPickOptions = (): number[] => {
    const size = selectedProductIds.size;
    const options: number[] = [];
    const seen = new Set<number>();
    for (const n of [1, 2, 3]) {
      if (n <= size && !seen.has(n)) {
        seen.add(n);
        options.push(n);
      }
    }
    if (size > 1 && !seen.has(size)) options.push(size);
    return options;
  };

  /* ─── Shared input style ─── */
  const inputBase =
    "w-full rounded-xl border border-[var(--neutral-200)] bg-white px-4 py-3 text-sm text-[var(--neutral-700)] outline-none placeholder:text-[var(--neutral-400)] focus:border-[var(--brand-400)] focus:ring-2 focus:ring-[var(--brand-100)] transition-all";

  // ─── Render Steps ───

  const renderStep1 = () => (
    <div className="space-y-5">
      {/* Brand logo placeholder */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-lg"
          style={{ background: "var(--brand-700)" }}
        >
          P
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--neutral-800)]">PIKORA</p>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide"
            style={{
              background: "var(--brand-50, #f0fdf4)",
              color: "var(--brand-700)",
            }}
          >
            <Sparkles className="size-3" />
            Auto-generated
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--neutral-500)] leading-relaxed">
        We drafted this based on your brand profile. Feel free to edit.
      </p>

      <textarea
        className={`${inputBase} min-h-[160px] leading-relaxed resize-y`}
        value={brandDescription}
        onChange={(e) => setBrandDescription(e.target.value)}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-sm text-[var(--neutral-500)] mb-1">
        Pick a campaign direction, or write your own.
      </p>

      {PIKORA_CAMPAIGN_IDEAS.map((idea) => {
        const isSelected = selectedIdeaId === idea.id && !useCustomCampaign;
        const theme = IDEA_GRADIENTS[idea.id] || {
          gradient: "linear-gradient(135deg, #e5e7eb, #d1d5db)",
          emoji: "\uD83D\uDCA1",
        };
        /* Show a truncated teaser when not selected */
        const teaser =
          idea.description.length > 90
            ? idea.description.slice(0, 90).trimEnd() + "\u2026"
            : idea.description;

        return (
          <button
            key={idea.id}
            onClick={() => {
              setSelectedIdeaId(idea.id);
              setUseCustomCampaign(false);
            }}
            className="w-full text-left transition-all duration-200"
            style={{
              borderRadius: "16px",
              border: isSelected
                ? "2px solid var(--brand-600)"
                : "1px solid var(--neutral-200)",
              background: isSelected ? "var(--brand-0, #fefffe)" : "#fff",
              boxShadow: isSelected
                ? "0 4px 24px rgba(0,0,0,0.08)"
                : "0 1px 3px rgba(0,0,0,0.04)",
              padding: isSelected ? "23px" : "24px",
            }}
          >
            <div className="flex items-start gap-5">
              {/* Gradient circle illustration */}
              <div
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 64,
                  height: 64,
                  background: theme.gradient,
                  boxShadow: isSelected
                    ? "0 4px 16px rgba(0,0,0,0.12)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <span className="text-2xl leading-none">{theme.emoji}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[15px] font-semibold text-[var(--neutral-800)]">
                    {idea.title}
                  </p>
                  {isSelected && (
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: "var(--brand-600)" }}
                    >
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>

                {isSelected ? (
                  <textarea
                    className={`${inputBase} mt-2 min-h-[72px] leading-relaxed resize-y`}
                    value={ideaTexts[idea.id]}
                    onChange={(e) =>
                      setIdeaTexts((prev) => ({ ...prev, [idea.id]: e.target.value }))
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-sm text-[var(--neutral-500)] leading-relaxed">
                    {teaser}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}

      {/* Custom option */}
      <button
        onClick={() => {
          setUseCustomCampaign(true);
          setSelectedIdeaId(null);
        }}
        className="w-full text-left transition-all duration-200"
        style={{
          borderRadius: "16px",
          border: useCustomCampaign
            ? "2px solid var(--brand-600)"
            : "1px dashed var(--neutral-300)",
          background: useCustomCampaign ? "var(--brand-0, #fefffe)" : "#fafafa",
          boxShadow: useCustomCampaign
            ? "0 4px 24px rgba(0,0,0,0.08)"
            : "none",
          padding: useCustomCampaign ? "23px" : "24px",
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="shrink-0 flex items-center justify-center rounded-full border-2 border-dashed"
            style={{
              width: 64,
              height: 64,
              borderColor: useCustomCampaign
                ? "var(--brand-400)"
                : "var(--neutral-300)",
              background: useCustomCampaign
                ? "var(--brand-50, #f0fdf4)"
                : "var(--neutral-100)",
            }}
          >
            <Plus
              className="size-6"
              style={{
                color: useCustomCampaign
                  ? "var(--brand-600)"
                  : "var(--neutral-400)",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <p
                className="text-[15px] font-semibold"
                style={{
                  color: useCustomCampaign
                    ? "var(--neutral-800)"
                    : "var(--neutral-600)",
                }}
              >
                Write your own
              </p>
              {useCustomCampaign && (
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: "var(--brand-600)" }}
                >
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
              )}
            </div>
            {useCustomCampaign ? (
              <textarea
                className={`${inputBase} mt-2 min-h-[72px] leading-relaxed resize-y`}
                value={customCampaignDesc}
                onChange={(e) => setCustomCampaignDesc(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Describe your campaign idea..."
                autoFocus
              />
            ) : (
              <p className="text-sm text-[var(--neutral-400)]">
                Have something else in mind? Describe it here.
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  );

  /* ─── Checklist row (shared by steps 3 & 4) ─── */
  const ChecklistRow = ({
    isSelected,
    onToggle,
    value,
    onChange,
    index,
  }: {
    isSelected: boolean;
    onToggle: () => void;
    value: string;
    onChange: (v: string) => void;
    index: number;
  }) => (
    <div
      className="flex items-start gap-3 rounded-xl px-5 py-4 transition-colors"
      style={{
        background: index % 2 === 0 ? "#fff" : "var(--neutral-50, #fafafa)",
        border: "1px solid var(--neutral-150, var(--neutral-200))",
      }}
    >
      <button
        onClick={onToggle}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors"
        style={{
          borderColor: isSelected ? "var(--brand-600)" : "var(--neutral-300)",
          background: isSelected ? "var(--brand-600)" : "transparent",
        }}
      >
        {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
      </button>
      <input
        className="flex-1 text-sm text-[var(--neutral-700)] bg-transparent outline-none focus:text-[var(--neutral-900)] leading-relaxed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-2">
      {PIKORA_DELIVERABLES.map((del, i) => (
        <ChecklistRow
          key={del.id}
          isSelected={selectedDeliverableIds.has(del.id)}
          onToggle={() => toggleDeliverable(del.id)}
          value={deliverableTexts[del.id]}
          onChange={(v) => updateDeliverableText(del.id, v)}
          index={i}
        />
      ))}

      {/* Custom deliverables */}
      {customDeliverables.map((text, i) => (
        <div
          key={`custom-del-${i}`}
          className="flex items-start gap-3 rounded-xl px-5 py-4"
          style={{
            background: "var(--brand-0, #fefffe)",
            border: "1px solid var(--brand-200)",
          }}
        >
          <div
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
            style={{
              border: "2px solid var(--brand-600)",
              background: "var(--brand-600)",
            }}
          >
            <Check className="size-3 text-white" strokeWidth={3} />
          </div>
          <p className="flex-1 text-sm text-[var(--neutral-700)] leading-relaxed">{text}</p>
          <button
            onClick={() => removeCustomDeliverable(i)}
            className="rounded-lg p-1 hover:bg-[var(--neutral-100)] transition-colors"
          >
            <X className="size-3.5 text-[var(--neutral-400)]" />
          </button>
        </div>
      ))}

      {/* Add custom card */}
      <div
        className="mt-4 rounded-2xl p-5"
        style={{
          background: "var(--neutral-50, #fafafa)",
          border: "1px dashed var(--neutral-300)",
        }}
      >
        <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider mb-3">
          Add Custom
        </p>
        <div className="flex items-center gap-3">
          <input
            placeholder="Add a custom deliverable..."
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addDeliverable();
              }
            }}
            className={inputBase}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={addDeliverable}
            disabled={!newDeliverable.trim()}
            className="shrink-0 h-[42px] px-5"
          >
            <Plus className="size-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-2">
      {PIKORA_INSTRUCTIONS.map((inst, i) => (
        <ChecklistRow
          key={inst.id}
          isSelected={selectedInstructionIds.has(inst.id)}
          onToggle={() => toggleInstruction(inst.id)}
          value={instructionTexts[inst.id]}
          onChange={(v) => updateInstructionText(inst.id, v)}
          index={i}
        />
      ))}

      {/* Custom instructions */}
      {customInstructions.map((text, i) => (
        <div
          key={`custom-inst-${i}`}
          className="flex items-start gap-3 rounded-xl px-5 py-4"
          style={{
            background: "var(--brand-0, #fefffe)",
            border: "1px solid var(--brand-200)",
          }}
        >
          <div
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
            style={{
              border: "2px solid var(--brand-600)",
              background: "var(--brand-600)",
            }}
          >
            <Check className="size-3 text-white" strokeWidth={3} />
          </div>
          <p className="flex-1 text-sm text-[var(--neutral-700)] leading-relaxed">{text}</p>
          <button
            onClick={() => removeCustomInstruction(i)}
            className="rounded-lg p-1 hover:bg-[var(--neutral-100)] transition-colors"
          >
            <X className="size-3.5 text-[var(--neutral-400)]" />
          </button>
        </div>
      ))}

      {/* Add custom card */}
      <div
        className="mt-4 rounded-2xl p-5"
        style={{
          background: "var(--neutral-50, #fafafa)",
          border: "1px dashed var(--neutral-300)",
        }}
      >
        <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider mb-3">
          Add Custom
        </p>
        <div className="flex items-center gap-3">
          <input
            placeholder="Add a custom instruction..."
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInstruction();
              }
            }}
            className={inputBase}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={addInstruction}
            disabled={!newInstruction.trim()}
            className="shrink-0 h-[42px] px-5"
          >
            <Plus className="size-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div>
      {/* Product count summary */}
      <div
        className="flex items-center gap-2 mb-5 rounded-xl px-4 py-3"
        style={{ background: "var(--neutral-50, #fafafa)" }}
      >
        <Package className="size-4 text-[var(--neutral-400)]" />
        <p className="text-sm text-[var(--neutral-600)]">
          <span className="font-semibold text-[var(--neutral-800)]">
            {selectedProductIds.size}
          </span>{" "}
          of {PIKORA_PRODUCTS.length} products selected
        </p>
      </div>

      <div className="space-y-3">
        {PIKORA_PRODUCTS.map((product) => {
          const isSelected = selectedProductIds.has(product.id);
          return (
            <button
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className="w-full flex items-center gap-4 text-left transition-all duration-200"
              style={{
                borderRadius: "16px",
                border: isSelected
                  ? "2px solid var(--brand-600)"
                  : "1px solid var(--neutral-200)",
                background: isSelected ? "var(--brand-0, #fefffe)" : "#fff",
                boxShadow: isSelected
                  ? "0 4px 20px rgba(0,0,0,0.07)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
                padding: isSelected ? "15px" : "16px",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-16 w-16 rounded-xl object-cover"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--neutral-800)] truncate">
                  {product.title}
                </p>
                <p className="text-xs text-[var(--neutral-500)] mt-0.5">
                  {product.variant} &middot; {product.inventory} in stock
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--neutral-800)]">{product.price}</p>
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full shrink-0 transition-colors"
                style={{
                  background: isSelected ? "var(--brand-600)" : "transparent",
                  border: isSelected ? "none" : "2px solid var(--neutral-300)",
                }}
              >
                {isSelected && <Check className="size-3.5 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Creator choice section — own card */}
      {selectedProductIds.size > 0 && (
        <div
          className="mt-6 rounded-2xl p-6"
          style={{
            background: "#fff",
            border: "1px solid var(--neutral-200)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <p className="text-xs font-medium text-[var(--neutral-500)] uppercase tracking-wider mb-4">
            Creator Choice
          </p>
          <p className="text-sm font-medium text-[var(--neutral-700)] mb-3">
            How many can each creator choose?
          </p>
          <div className="flex gap-2 mb-4">
            {getPickOptions().map((n) => (
              <button
                key={n}
                onClick={() => setCreatorPickCount(n)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
                style={{
                  background:
                    creatorPickCount === n ? "var(--brand-700)" : "#fff",
                  color:
                    creatorPickCount === n ? "#fff" : "var(--neutral-700)",
                  border:
                    creatorPickCount === n
                      ? "1px solid var(--brand-700)"
                      : "1px solid var(--neutral-200)",
                }}
              >
                {n === selectedProductIds.size && n > 1 ? "All" : n}
              </button>
            ))}
          </div>
          <textarea
            className={`${inputBase} min-h-[64px] resize-y`}
            placeholder="Any additional conditions? (optional)"
            value={productConditions}
            onChange={(e) => setProductConditions(e.target.value)}
          />
          <p className="text-xs text-[var(--neutral-500)] mt-3">
            {selectedProductIds.size} product
            {selectedProductIds.size !== 1 ? "s" : ""} offered — creator picks{" "}
            {creatorPickCount === selectedProductIds.size && creatorPickCount > 1
              ? "all"
              : creatorPickCount}
          </p>
        </div>
      )}
    </div>
  );

  /* ─── Section label for step 6 ─── */
  const SectionLabel = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="size-3.5 text-[var(--neutral-400)]" />
      <p className="text-[11px] font-semibold text-[var(--neutral-500)] uppercase tracking-wider">
        {label}
      </p>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-7">
      {/* Niches */}
      <div>
        <SectionLabel icon={Hash} label="Niches" />
        <div className="flex flex-wrap gap-2">
          {PIKORA_TARGET_CREATORS.niches.map((niche) => {
            const isActive = targetNiches.has(niche);
            return (
              <button
                key={niche}
                onClick={() => toggleNiche(niche)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all"
                style={{
                  background: isActive ? "var(--brand-700)" : "var(--neutral-100)",
                  color: isActive ? "#fff" : "var(--neutral-600)",
                }}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>

      {/* Follower Range */}
      <div>
        <SectionLabel icon={BarChart3} label="Follower Range" />
        <input
          className={inputBase}
          value={targetFollowerRange}
          onChange={(e) => setTargetFollowerRange(e.target.value)}
        />
      </div>

      {/* Geography */}
      <div>
        <SectionLabel icon={MapPin} label="Geography" />
        <input
          className={inputBase}
          value={targetGeography}
          onChange={(e) => setTargetGeography(e.target.value)}
        />
      </div>

      {/* Demographics */}
      <div>
        <SectionLabel icon={Users} label="Audience Demographics" />
        <input
          className={inputBase}
          value={targetDemographics}
          onChange={(e) => setTargetDemographics(e.target.value)}
        />
      </div>

      {/* Platforms */}
      <div>
        <SectionLabel icon={Monitor} label="Platforms" />
        <div className="flex gap-2">
          {["TikTok", "Instagram", "Benable", "YouTube"].map((platform) => {
            const isActive = targetPlatforms.has(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: isActive ? "var(--brand-700)" : "#fff",
                  color: isActive ? "#fff" : "var(--neutral-600)",
                  border: isActive
                    ? "1px solid var(--brand-700)"
                    : "1px solid var(--neutral-200)",
                }}
              >
                {platform}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Style */}
      <div>
        <SectionLabel icon={Palette} label="Content Style" />
        <textarea
          className={`${inputBase} min-h-[88px] leading-relaxed resize-y`}
          value={targetStyle}
          onChange={(e) => setTargetStyle(e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      case 5:
        return renderStep6();
      default:
        return null;
    }
  };

  // ─── Progress bar fraction ───
  const progress = ((step + 1) / 6) * 100;

  // ─── Render ───

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="flex w-full max-w-3xl mx-4 flex-col bg-white shadow-sm"
        style={{
          maxHeight: "90vh",
          borderRadius: "24px",
          fontFeatureSettings: "'ss01'",
        }}
      >
        {/* Header */}
        <div className="px-8 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "var(--brand-600)" }}
              >
                {STEP_LABELS[step]} &middot; Step {step + 1} of 6
              </p>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--neutral-800)" }}
              >
                {STEP_TITLES[step]}
              </h2>
            </div>
            <button
              onClick={() => navigate("/campaigns")}
              className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-[var(--neutral-100)] transition-colors"
            >
              <X className="size-4 text-[var(--neutral-500)]" />
            </button>
          </div>

          {/* Thin progress bar */}
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: 3,
              background: "var(--neutral-150, var(--neutral-200))",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "var(--brand-600)",
              }}
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto px-8 py-7"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--neutral-200) transparent",
          }}
        >
          <div
            className="transition-opacity duration-200 ease-in-out"
            style={{ opacity: 1 }}
          >
            {renderStep()}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-8 py-5"
          style={{
            borderTop: "1px solid var(--neutral-150, var(--neutral-200))",
          }}
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="h-11 px-6 rounded-xl text-sm"
          >
            <ArrowLeft className="size-4 mr-1.5" /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="h-11 px-7 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "var(--brand-700)", color: "white" }}
          >
            {step === 5 ? "Launch Campaign" : "Continue"}
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
