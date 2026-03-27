import { useState } from "react";
import CreateCampaignV2a from "./CreateCampaignV2a";
import CreateCampaignV2b from "./CreateCampaignV2b";

export default function CreateCampaignV2() {
  const [version, setVersion] = useState<"a" | "b">("a");

  return (
    <div className="relative">
      {version === "a" ? <CreateCampaignV2a /> : <CreateCampaignV2b />}

      {/* Version switcher */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full p-1"
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={() => setVersion("a")}
          className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all"
          style={{
            backgroundColor: version === "a" ? "var(--brand-700)" : "transparent",
            color: version === "a" ? "white" : "var(--neutral-500)",
          }}
        >
          Version A
        </button>
        <button
          type="button"
          onClick={() => setVersion("b")}
          className="px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all"
          style={{
            backgroundColor: version === "b" ? "var(--brand-700)" : "transparent",
            color: version === "b" ? "white" : "var(--neutral-500)",
          }}
        >
          Version B
        </button>
      </div>
    </div>
  );
}
