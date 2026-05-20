import { useState } from "react";
import {
  PiFilePdf,
  PiMicrophone,
  PiChatTeardropText,
  PiArrowRight,
} from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { useNavigate } from "react-router";

const steps = [
  {
    id: 1,
    icon: PiFilePdf,
    label: "Upload your sources",
    description:
      "Drop any PDF, research paper, or lecture note. We parse and index it instantly.",
    detail:
      "Supports multi-file uploads, scanned docs, and academic papers up to 50MB.",
  },
  {
    id: 2,
    icon: HiSparkles,
    label: "AI digests context",
    description:
      "Chunks, embeddings, and indexing into a structured vector store.",
    detail:
      "Every answer is grounded in your documents with retrieval-based generation.",
  },
  {
    id: 3,
    icon: PiChatTeardropText,
    label: "Chat & explore",
    description:
      "Ask questions and get cited answers with direct references.",
    detail: "Each response maps back to exact passages in your PDFs.",
  },
  {
    id: 4,
    icon: PiMicrophone,
    label: "Audio overview",
    description:
      "Turn documents into podcast-style summaries for learning on the go.",
    detail:
      "Two AI voices simulate structured discussion of your material.",
  },
];

const stats = [
  { value: "10x", label: "Faster research" },
  { value: "50MB", label: "Max file size" },
  { value: "100%", label: "Grounded answers" },
  { value: "0", label: "Hallucinations" },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  return (
    <section id="How_it_works" className="relative bg-white py-24 px-6 overflow-hidden">

      {/* subtle grid background */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 border-2 border-black p-6 shadow-[8px_8px_0_#000] bg-white">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3">
            <HiSparkles />
            How it works
          </div>

          <h2 className="text-3xl md:text-5xl font-black leading-tight">
            From PDF to insight <br />
            <span className="underline decoration-black decoration-4">
              in seconds
            </span>
          </h2>

          <p className="mt-4 text-black/70 text-sm md:text-base max-w-xl">
            Four simple steps to transform your documents into structured,
            grounded knowledge.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid md:grid-cols-2 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = active === i;

            return (
              <button
                key={step.id}
                onClick={() => setActive(i)}
                className={`text-left border-2 border-black p-5 transition-all ${
                  isActive
                    ? "bg-black text-white shadow-[6px_6px_0_#000]"
                    : "bg-white hover:translate-x-1 hover:-translate-y-1"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`border-2 border-black p-2 ${
                      isActive ? "bg-white text-black" : "bg-black text-white"
                    }`}
                  >
                    <Icon />
                  </div>

                  <span className="text-xs font-bold opacity-60">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="font-black uppercase text-sm mb-2">
                  {step.label}
                </h3>

                <p className={`text-sm ${isActive ? "text-white/80" : "text-black/70"}`}>
                  {step.description}
                </p>

                {isActive && (
                  <div className="mt-4 border border-white/30 px-3 py-2 text-xs">
                    {step.detail}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* STATS */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-2 border-black">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 text-center border-r-2 last:border-r-0 border-black bg-white"
            >
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-bold uppercase opacity-60 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 border-2 border-black p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[8px_8px_0_#000]">
          <div>
            <h3 className="font-black text-lg">Ready to try it?</h3>
            <p className="text-sm text-black/70">
              Upload your first PDF and get answers instantly.
            </p>
          </div>

          <button
            onClick={() => navigate("/notebook")}
            className="border-2 border-black bg-black text-white px-6 py-3 font-bold uppercase text-xs hover:-translate-x-1 hover:-translate-y-1 transition flex items-center gap-2"
          >
            Get started
            <PiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;