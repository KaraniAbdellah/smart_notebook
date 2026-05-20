import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="relative bg-white border-t-2 border-black overflow-hidden">

      {/* grid background */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* BRAND CARD */}
          <div className="relative border-2 border-black p-6 shadow-[8px_8px_0_#000] max-w-md">

            {/* stamp */}
            <div className="absolute -top-4 -right-4 border-2 border-black bg-white px-3 py-1 text-xs font-black rotate-6">
              AI TOOL
            </div>

            {/* logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 border-2 border-black bg-black text-white flex items-center justify-center rotate-3">
                <div className="w-3 h-3 border border-white rounded-full" />
              </div>

              <span className="font-black tracking-tight">
                Smart Notebook
              </span>
            </div>

            <p className="text-sm text-black/70 leading-relaxed">
              Your AI-powered research system grounded in real documents.
              Built for clarity, speed, and verifiable answers.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-2 mt-5">
              {[
                { icon: FaGithub, url: "https://github.com/KaraniAbdellah" },
                { icon: FaLinkedin, url: "https://www.linkedin.com/in/abdellah-karani-965928294/" },
                { icon: FaTwitter, url: "https://x.com/karani66745" },
              ].map(({ icon: Icon, url }, i) => (
                <button
                  key={i}
                  onClick={() => window.open(url, "_blank")}
                  className="border-2 border-black p-2 hover:bg-black hover:text-white transition"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE MINI CARD */}
          <div className="border-2 border-black p-6 shadow-[8px_8px_0_#000] flex-1">

            <h3 className="font-black uppercase text-sm mb-3">
              Built for research
            </h3>

            <p className="text-black/70 text-sm leading-relaxed">
              Upload PDFs, ask questions, and get grounded answers with
              citations. No hallucinations. No noise. Just structured knowledge.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["PDF Parsing", "RAG Pipeline", "Vector Search", "Citations"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="border border-black px-3 py-1 text-xs font-bold uppercase"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-t-2 border-black" />

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

          <p className="text-xs font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} Smart Notebook
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="border-2 border-black px-4 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white transition flex items-center gap-2"
          >
            Back to top
            <HiArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;