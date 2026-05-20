import { useNavigate } from "react-router";

const features = [
  { icon: "📄", label: "Upload any source" },
  { icon: "🧠", label: "AI-powered synthesis" },
  { icon: "🛡️", label: "Cited & grounded" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fffdf8] px-6 py-24 text-center">

      {/* GRID */}
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* DOTS */}
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* FLOATING SHAPES */}
      <div className="absolute -left-10 top-20 h-40 w-40 rotate-12 border-4 border-black bg-[#ff5e36] opacity-20" />
      <div className="absolute -bottom-10 right-10 h-52 w-52 -rotate-12 border-4 border-black bg-[#4d61ff] opacity-20" />
      <div className="absolute left-1/2 top-1/3 h-28 w-28 rotate-45 border-4 border-black bg-[#00e0b0] opacity-20" />

      {/* HERO CARD STACK */}
      <div className="relative z-10">

        <div className="absolute -left-2 -top-2 h-full w-full border-4 border-black bg-[#ffe680]" />
        <div className="absolute -left-4 -top-4 h-full w-full border-4 border-black bg-[#ff5e36]" />

        <div className="relative border-4 border-black bg-white px-6 py-4 shadow-[10px_10px_0_#000]">

          <span className="inline-block -rotate-2 border-2 border-black bg-[#00e0b0] px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_#000]">
            AI Research System
          </span>

        </div>
      </div>

      {/* TITLE */}
      <h1 className="relative z-10 mb-6 max-w-4xl text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.95] tracking-tight text-black">

        Understand
        <br />

        <span
          className="
            inline-block
            rotate-[-1deg]
            border-4
            border-black
            bg-[#4d61ff]
            px-6
            text-white
            shadow-[10px_10px_0_#000]
          "
        >
          Anything
        </span>
      </h1>

      {/* SUBTITLE */}
      <p className="relative z-10 mb-12 max-w-xl text-base font-semibold leading-relaxed text-black/70">
        Your research partner built on structured AI reasoning, grounded answers,
        and document intelligence.
      </p>

      {/* CTA ROW */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">

        {/* PRIMARY CTA */}
        <button
          onClick={() => navigate("/notebook")}
          className="
            group
            relative
            overflow-hidden
            border-4
            border-black
            bg-[#ff3e00]
            px-8
            py-4
            text-sm
            font-black
            uppercase
            text-white
            shadow-[8px_8px_0_#000]
            transition-all
            hover:-translate-y-1
            hover:shadow-[12px_12px_0_#000]
            active:translate-y-1
            active:shadow-[4px_4px_0_#000]
          "
        >
          {/* STRIPE EFFECT */}
          <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(45deg,black_0px,black_2px,transparent_2px,transparent_8px)]" />

          <span className="relative z-10">
            Try Smart Notebook
          </span>
        </button>

        {/* SECONDARY CTA */}
        <a
          href="#How_it_works"
          className="
            group
            inline-flex
            items-center
            gap-2
            border-4
            border-black
            bg-white
            px-8
            py-4
            text-sm
            font-black
            uppercase
            text-black
            shadow-[6px_6px_0_#000]
            transition-all
            hover:-translate-y-1
            hover:bg-[#ffe680]
            hover:shadow-[10px_10px_0_#000]
          "
        >
          See how it works
          <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </div>

      {/* FEATURE STRIP */}
      <div className="relative z-10 mt-14 flex flex-wrap items-center justify-center gap-4">

        {features.map((f, i) => (
          <div key={f.label} className="flex items-center gap-2">

            <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase shadow-[3px_3px_0_#000]">
              <span>{f.icon}</span>
              {f.label}
            </div>

            {i < features.length - 1 && (
              <div className="h-2 w-2 rotate-45 border-2 border-black bg-[#4d61ff]" />
            )}

          </div>
        ))}

      </div>
    </section>
  );
}