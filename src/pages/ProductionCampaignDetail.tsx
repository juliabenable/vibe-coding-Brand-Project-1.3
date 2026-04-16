import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ContentGrid from "@/components/ContentGrid";
import { ArrowLeft, Eye, MoreVertical, CheckCircle2 } from "lucide-react";

/* ────────────────────────────── mock creators ────────────────────────────── */

const INVITED_CREATORS = [
  {
    id: "c1",
    name: "Julia Brandy2",
    handle: "@skrjxv",
    verified: true,
    status: "Invited",
    note: "Waiting on admin...",
  },
];

/* ────────────────────────────── tab trigger style ────────────────────────────── */

const tabTriggerClass = [
  // Reset all defaults from the shared component
  "!flex-none !rounded-none !border-0 !bg-transparent !shadow-none !ring-0 !outline-none",
  // Base styling
  "relative px-1 pb-2.5 pt-1 text-[14px] font-medium text-[var(--neutral-400)]",
  // Active state
  "data-[state=active]:text-[var(--neutral-800)]",
  // Active underline via pseudo-element
  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-transparent",
  "data-[state=active]:after:bg-[var(--neutral-800)]",
].join(" ");

/* ────────────────────────────── page ────────────────────────────── */

export default function ProductionCampaignDetail() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-8 py-5">
      {/* Breadcrumb */}
      <button
        type="button"
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-[var(--neutral-500)] transition-colors hover:text-[var(--neutral-700)]"
      >
        <ArrowLeft className="size-3.5" />
        Campaigns
      </button>

      {/* Campaign header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-[var(--neutral-800)]">
            Pikora Instant Bone Broth Collection
          </h1>
          {/* Active badge — matches production close-up */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DBEAFE] px-3 py-1 text-[13px] font-medium text-[#2563EB]">
            <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
            Active
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--neutral-200)] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[var(--neutral-600)] transition-colors hover:bg-[var(--neutral-50)]"
        >
          <Eye className="size-3.5" />
          Campaign Details
        </button>
      </div>

      {/* Tabs — compact, left-aligned, underline style */}
      <Tabs defaultValue="content" className="!gap-0">
        <div className="border-b border-[var(--neutral-200)]">
          <TabsList className="!h-auto !w-auto !gap-5 !rounded-none !border-0 !bg-transparent !p-0">
            <TabsTrigger value="dashboard" className={tabTriggerClass}>
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="content" className={tabTriggerClass}>
              Content
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard tab */}
        <TabsContent value="dashboard" className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--neutral-800)]">
                  Invited Creators
                </h2>
                <p className="mt-0.5 text-sm text-[var(--neutral-500)]">
                  Track outreach and creator responses. Benable admin continues
                  direct follow-up with creators.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--neutral-200)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--neutral-600)] transition-colors hover:bg-[var(--neutral-50)]"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                Filter
              </button>
            </div>

            <div className="rounded-xl border border-[var(--neutral-200)] bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[var(--neutral-200)]">
                    <TableHead className="text-xs font-semibold text-[var(--neutral-500)]">
                      Creator
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[var(--neutral-500)]">
                      Creator status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-[var(--neutral-500)]">
                      Note
                    </TableHead>
                    <TableHead className="w-[60px] text-right text-xs font-semibold text-[var(--neutral-500)]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVITED_CREATORS.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--neutral-100)] text-xs font-medium text-[var(--neutral-400)]">
                            {c.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-[var(--neutral-800)]">
                                {c.name}
                              </span>
                              {c.verified && (
                                <CheckCircle2 className="size-3.5 text-[var(--blue-500)]" />
                              )}
                            </div>
                            <span className="text-xs text-[var(--neutral-400)]">
                              {c.handle}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border border-[var(--neutral-200)] bg-[var(--neutral-50)] px-2.5 py-0.5 text-xs font-medium text-[var(--neutral-600)]">
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm italic text-[var(--neutral-400)]">
                          {c.note}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-400)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--neutral-600)]"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Content tab */}
        <TabsContent value="content" className="pt-6">
          <ContentGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
}
