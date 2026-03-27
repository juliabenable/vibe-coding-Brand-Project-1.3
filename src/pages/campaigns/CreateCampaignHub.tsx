import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight, Sparkles, Layout } from "lucide-react";


const VERSIONS = [
  {
    id: "v1",
    title: "Document",
    subtitle: "Google Doc style",
    description: "All fields visible at once with a guidance sidebar. Like filling out a form with a helpful assistant watching.",
    icon: FileText,
    path: "/campaigns/create/v1",
  },
  {
    id: "v2",
    title: "Focused",
    subtitle: "Typeform style",
    description: "One question at a time, full screen. Press Enter to advance. Distraction-free and keyboard-driven.",
    icon: Sparkles,
    path: "/campaigns/create/v2",
  },
  {
    id: "v3",
    title: "Guided",
    subtitle: "Wizard popup",
    description: "Step-by-step popup with auto-generated content for your brand. Select, edit, or write your own.",
    icon: Layout,
    path: "/campaigns/create/v3",
  },
];

export default function CreateCampaignHub() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--neutral-800)]">Create Campaign</h1>
        <p className="text-sm text-[var(--neutral-500)] mt-1">Choose how you'd like to set up your campaign brief.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {VERSIONS.map((v) => (
          <button
            key={v.id}
            onClick={() => navigate(v.path)}
            className="group flex items-start gap-5 rounded-2xl border border-[var(--neutral-200)] bg-white p-6 text-left transition-all hover:border-[var(--brand-400)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.08)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-0)]">
              <v.icon className="size-5 text-[var(--brand-700)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="text-[15px] font-semibold text-[var(--neutral-800)]">{v.title}</h3>
                <span className="text-xs text-[var(--neutral-400)]">{v.subtitle}</span>
              </div>
              <p className="text-sm text-[var(--neutral-500)] mt-1 leading-relaxed">{v.description}</p>
            </div>
            <ArrowRight className="size-4 text-[var(--neutral-300)] mt-1 shrink-0 transition-colors group-hover:text-[var(--brand-600)]" />
          </button>
        ))}
      </div>
    </div>
  );
}
