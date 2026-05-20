import { useState } from "react";
import { HiLightningBolt } from "react-icons/hi";
import {
  PiStudent,
  PiQuestion,
  PiChatTeardropText,
  PiFilePdf,
  PiListChecks,
} from "react-icons/pi";

const features = [
  { id: "guide", label: "Guide", icon: PiStudent },
  { id: "faq", label: "FAQ", icon: PiQuestion },
  { id: "chat", label: "Chat", icon: PiChatTeardropText },
];

/* ---------------- PREVIEWS ---------------- */

const previews = {
  guide: (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-4 border-black bg-[#fff] px-4 py-3 shadow-[5px_5px_0_#000]">
        <div className="flex items-center gap-2 font-black uppercase">
          <PiListChecks />
          Study Guide
        </div>

        <span className="text-[10px] font-black uppercase border-2 border-black bg-[#00e0b0] px-2 py-1">
          Grounded
        </span>
      </div>

      <div className="space-y-3">
        <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000]">
          <span className="font-black mr-2">1.</span>
          Core thesis extracted from document embeddings.
        </div>

        <div className="border-2 border-black bg-white p-3 shadow-[3px_3px_0_#000]">
          <span className="font-black mr-2">2.</span>
          Key terms: cosine similarity, vector search.
        </div>
      </div>
    </div>
  ),

  faq: (
    <div className="space-y-4">
      <div className="border-l-4 border-[#4d61ff] bg-white p-4 shadow-[5px_5px_0_#000]">
        <div className="flex items-center gap-2 font-black mb-2">
          <PiQuestion />
          What is this system?
        </div>
        <p className="text-sm text-black/70">
          It indexes documents into embeddings and retrieves grounded answers.
        </p>
      </div>

      <div className="border-l-4 border-black bg-white p-4 opacity-60">
        <div className="flex items-center gap-2 font-medium">
          <PiQuestion />
          What chunk size is used?
        </div>
      </div>
    </div>
  ),

  chat: (
    <div className="space-y-4">

      {/* USER */}
      <div className="flex justify-end">
        <div className="border-4 border-black bg-[#4d61ff] text-white px-4 py-3 shadow-[5px_5px_0_#000] max-w-[90%]">
          Summarize page 4 constraints
        </div>
      </div>

      {/* BOT */}
      <div className="flex gap-3">
        <div className="flex h-10 w-10 items-center justify-center border-4 border-black bg-white shadow-[3px_3px_0_#000]">
          <HiLightningBolt />
        </div>

        <div className="border-4 border-black bg-white p-3 shadow-[5px_5px_0_#000] max-w-[90%]">
          Hardware limits and budget constraints are the primary restrictions.
          <div className="mt-2 text-[10px] font-mono border border-black px-2 py-1 inline-block">
            Source: page 4
          </div>
        </div>
      </div>
    </div>
  ),
};

/* ---------------- COMPONENT ---------------- */

export default function Sections() {
  const [active, setActive] = useState("guide");

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#fffdf8] p-6">

      {/* GRID BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">

        {/* LEFT */}
        <div className="space-y-6">

          <div className="inline-flex items-center gap-2 border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
            <HiLightningBolt />
            Research Tool
          </div>

          <h2 className="text-4xl font-black leading-tight uppercase">
            Instant insights
            <br />
            <span className="bg-[#4d61ff] px-3 text-white shadow-[6px_6px_0_#000]">
              from PDFs
            </span>
          </h2>

          <p className="text-black/70 font-medium leading-relaxed max-w-md">
            Drop documents and get structured, grounded AI answers instantly.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "PDF Parsing",
              "Vector Search",
              "Citations",
              "QA",
            ].map((t) => (
              <span
                key={t}
                className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_#000]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative">

          <div className="border-4 border-black bg-white shadow-[10px_10px_0_#000] p-6">

            {/* TABS */}
            <div className="grid grid-cols-3 gap-2 mb-6">

              {features.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`
                    flex flex-col items-center gap-1 border-2 border-black py-3 text-xs font-black uppercase transition
                    ${
                      active === id
                        ? "bg-[#ff5e36] text-white"
                        : "bg-white hover:bg-[#ffe680]"
                    }
                  `}
                >
                  <Icon className="text-lg" />
                  {label}
                </button>
              ))}
            </div>

            {/* PREVIEW */}
            <div className="border-2 border-black bg-[#f8f8f8] p-4 min-h-[280px]">
              {previews[active]}
            </div>

            {/* FOOTER */}
            <div className="mt-4 flex justify-between text-[10px] font-mono opacity-60">
              <span>LOCAL · GROUNDED</span>
              <span>v1.0</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}