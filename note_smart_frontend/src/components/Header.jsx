import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiZap } from "react-icons/fi";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header
      className="
        sticky
        top-0
        z-50
        overflow-hidden
        border-b-4
        border-black
        bg-[#fffdf8]
      "
    >
      {/* GRID PATTERN */}
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* DOTS */}
      <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* DECORATIVE SHAPE */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rotate-45 border-4 border-black bg-[#00e0b0]" />

      <div className="relative z-10 flex items-center justify-between px-6 py-5">

        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="
            group
            relative
            flex
            items-center
            gap-4
          "
        >
          {/* LOGO BOX */}
          <div
            className="
              relative
              flex
              h-14
              w-14
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border-4
              border-black
              bg-[#ff5e36]
              shadow-[5px_5px_0_#000]
              transition-all
              duration-200
              group-hover:-translate-y-1
              group-hover:shadow-[7px_7px_0_#000]
            "
          >
            {/* SPINNING RING */}
            <div className="absolute h-6 w-6 rounded-full border-[3px] border-black border-t-transparent animate-[spin_5s_linear_infinite]" />

            <FiZap className="text-xl font-black" />
          </div>

          {/* TITLE */}
          <div className="flex flex-col items-start">
            <span className="text-xl font-black uppercase tracking-tight text-black">
              Smart Notebook
            </span>

            <span className="rotate-[-2deg] rounded-md border-2 border-black bg-[#ffe680] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_#000]">
              AI Powered
            </span>
          </div>

          {/* MINI STICKER */}
          <div className="absolute -right-6 -top-2 rotate-12 rounded-lg border-2 border-black bg-[#4d61ff] px-2 py-1 text-[9px] font-black uppercase text-white shadow-[2px_2px_0_#000]">
            BETA
          </div>
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-5 md:flex">

          {/* SOCIALS */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border-4
              border-black
              bg-white
              px-3
              py-2
              shadow-[4px_4px_0_#000]
            "
          >
            <button
              aria-label="GitHub"
              onClick={() =>
                window.open(
                  "https://github.com/KaraniAbdellah",
                  "_blank"
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border-2
                border-black
                bg-[#f3f3f3]
                transition-all
                hover:-translate-y-1
                hover:bg-[#ff5e36]
                hover:text-white
              "
            >
              <FaGithub size={18} />
            </button>

            <button
              aria-label="LinkedIn"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/abdellah-karani-965928294/",
                  "_blank"
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border-2
                border-black
                bg-[#f3f3f3]
                transition-all
                hover:-translate-y-1
                hover:bg-[#4d61ff]
                hover:text-white
              "
            >
              <FaLinkedin size={18} />
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/notebook")}
            className="
              group
              relative
              inline-flex
              items-center
              gap-3
              overflow-hidden
              rounded-2xl
              border-4
              border-black
              bg-[#4d61ff]
              px-6
              py-3
              text-sm
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-[5px_5px_0_#000]
              transition-all
              duration-200
              hover:-translate-y-1
              hover:shadow-[8px_8px_0_#000]
              active:translate-y-1
              active:shadow-[2px_2px_0_#000]
            "
          >
            {/* BUTTON PATTERN */}
            <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(45deg,black_0px,black_2px,transparent_2px,transparent_10px)]" />

            <span className="relative z-10">
              Get Started
            </span>

            <HiArrowUpRight
              size={18}
              className="
                relative
                z-10
                transition-transform
                duration-300
                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />
          </button>
        </div>

        {/* MOBILE */}
        <button
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border-4
            border-black
            bg-[#ffe680]
            shadow-[5px_5px_0_#000]
            transition-all
            hover:-translate-y-1
            hover:shadow-[7px_7px_0_#000]
            md:hidden
          "
        >
          <RxHamburgerMenu size={24} />
        </button>
      </div>

      {/* BOTTOM DECOR LINE */}
      <div className="relative z-10 h-3 border-t-4 border-black bg-[#ff5e36]" />
    </header>
  );
};

export default Header;