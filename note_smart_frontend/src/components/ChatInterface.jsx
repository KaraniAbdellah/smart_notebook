import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiSend,
  FiZap,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL;

const CHIPS = [
  "Summarize",
  "Key points",
  "To markdown",
  "Translate",
];

const INIT_MESSAGES = [
  {
    id: 1,
    text: "Upload a PDF and ask me anything.",
    isBot: true,
  },
];

export default function ChatInterface({ collectionName }) {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const addMessage = useCallback((text, isBot, isError = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        isBot,
        isError,
      },
    ]);
  }, []);

  const handleSend = useCallback(
    async (overrideText) => {
      const question = (overrideText ?? input).trim();

      if (!question || loading) return;

      if (!collectionName) {
        addMessage(
          "Please upload a PDF first.",
          true,
          true
        );
        return;
      }

      addMessage(question, false);

      setInput("");
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            collection_name: collectionName,
            top_k: 5,
            rerank_top_k: 3,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Query failed");
        }

        addMessage(data.answer, true);
      } catch (err) {
        addMessage(err.message, true, true);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, collectionName, addMessage]
  );

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height =
      Math.min(el.scrollHeight, 140) + "px";
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden border-4 border-black bg-[#fffdf8] shadow-[10px_10px_0_#000]">

      {/* GRID */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* DOTS */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center border-b-4 border-black bg-[#ff5e36] px-6 py-5">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-black bg-[#fff] shadow-[4px_4px_0_#000]">
          <FiZap className="text-[22px]" />
        </div>

        <div className="ml-4">
          <h2 className="text-lg font-black uppercase tracking-wide">
            AI Assistant
          </h2>

          <p className="text-xs font-semibold text-black/70">
            {collectionName
              ? collectionName
              : "Ask your documents"}
          </p>
        </div>

        <div className="ml-auto rotate-2 rounded-xl border-4 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full border-2 border-black ${
                collectionName
                  ? "bg-green-500"
                  : "bg-yellow-400"
              }`}
            />
            {collectionName ? "READY" : "WAITING"}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="relative z-10 flex-1 space-y-5 overflow-y-auto p-6">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.isBot
                ? "justify-start"
                : "justify-end"
            }`}
          >
            {msg.isBot && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-black bg-white shadow-[3px_3px_0_#000]">
                {msg.isError ? (
                  <FiAlertCircle className="text-red-500" />
                ) : (
                  <FiZap />
                )}
              </div>
            )}

            <div
              className={`
                max-w-[78%]
                rounded-2xl
                border-4
                border-black
                px-4
                py-3
                text-sm
                font-medium
                leading-relaxed
                shadow-[5px_5px_0_#000]
                transition-all
              ${
                msg.isBot
                  ? msg.isError
                    ? "bg-red-200"
                    : "bg-white"
                  : "bg-[#4d61ff] text-white"
              }
              `}
            >
              {msg.text}
            </div>

            {!msg.isBot && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-black bg-[#4d61ff] text-white shadow-[3px_3px_0_#000]">
                <FiUser />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-black bg-white shadow-[3px_3px_0_#000]">
              <FiZap />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border-4 border-black bg-white px-4 py-3 shadow-[5px_5px_0_#000]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 animate-bounce rounded-full bg-black"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* CHIPS */}
      <div className="relative z-10 flex flex-wrap gap-3 px-6 pb-4">

        {CHIPS.map((chip) => (
          <button
            key={chip}
            disabled={loading}
            onClick={() => handleSend(chip)}
            className="
              rounded-xl
              border-4
              border-black
              bg-[#00e0b0]
              px-4
              py-2
              text-xs
              font-black
              uppercase
              tracking-wide
              shadow-[4px_4px_0_#000]
              transition-all
              hover:-translate-y-1
              hover:translate-x-[-2px]
              hover:shadow-[6px_6px_0_#000]
              active:translate-y-1
              active:shadow-[2px_2px_0_#000]
            "
          >
            {chip}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="relative z-10 border-t-4 border-black bg-[#fff8e8] p-5">

        <div className="flex items-end gap-4">

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={loading}
            onKeyDown={handleKey}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize(e.target);
            }}
            placeholder="Ask something..."
            className="
              min-h-[58px]
              flex-1
              resize-none
              rounded-2xl
              border-4
              border-black
              bg-white
              px-4
              py-3
              text-sm
              font-medium
              outline-none
              shadow-[5px_5px_0_#000]
              placeholder:text-black/40
            "
          />

          <button
            disabled={!input.trim() || loading}
            onClick={() => handleSend()}
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border-4
              border-black
              bg-[#ff3e00]
              text-white
              shadow-[5px_5px_0_#000]
              transition-all
              hover:-translate-y-1
              hover:shadow-[7px_7px_0_#000]
              active:translate-y-1
              active:shadow-[2px_2px_0_#000]
              disabled:opacity-40
            "
          >
            <FiSend className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}