import { Outlet } from "react-router-dom";
import { LayoutGrid, Bell, Sparkles, CirclePlay } from "lucide-react";

const NAV_ITEMS = [
  { label: "Campaigns", icon: LayoutGrid, active: true },
  { label: "Push Alerts", icon: Bell, soon: true },
  { label: "Brand Intelliger", icon: Sparkles, soon: true },
  { label: "UGC Studio", icon: CirclePlay, soon: true },
];

export default function ProductionLayout() {
  return (
    <div className="flex min-h-svh w-full">
      {/* ───── Sidebar ───── */}
      <aside className="sticky top-0 flex h-svh w-[180px] shrink-0 flex-col border-r border-[var(--neutral-200)] bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 pb-4 pt-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FB923C] via-[#F472B6] to-[#A78BFA]">
            <span className="text-xs font-bold text-white" style={{ fontFamily: "system-ui" }}>b</span>
          </div>
          <span className="text-sm font-bold text-[var(--neutral-800)]">
            Benable
          </span>
        </div>

        {/* Section label */}
        <div className="px-4 pb-1.5 pt-2">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--neutral-400)]">
            Platform
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2">
          <ul className="space-y-px">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <div
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors ${
                    item.active
                      ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                      : "font-medium text-[var(--neutral-500)] hover:bg-[var(--neutral-50)]"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {item.soon && (
                    <span className="rounded bg-[var(--neutral-100)] px-1 py-px text-[9px] font-medium text-[var(--neutral-400)]">
                      Soon
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pikora brand — pinned to bottom */}
        <div className="mt-auto border-t border-[var(--neutral-100)] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FFF7ED]">
              <span className="text-[7px] font-extrabold leading-none text-[#EA580C]" style={{ letterSpacing: "-0.02em" }}>
                PIK
                <br />
                ORA
              </span>
            </div>
            <span className="text-[12px] font-semibold text-[var(--neutral-600)]">
              Pikora
            </span>
          </div>
        </div>
      </aside>

      {/* ───── Main content ───── */}
      <main className="flex-1 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
