import { useState, useCallback } from "react";
import PDFUpload from "./PDFUpload";
import ChatInterface from "./ChatInterface";

const ChatWithLLM = () => {
  const [collectionName, setCollectionName] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // mobile tab state

  const handleIndexed = useCallback((name) => {
    setCollectionName(name);
    setActiveTab("chat"); // auto-switch to chat after upload on mobile
  }, []);

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden font-sans"
      style={{ background: "#f7f5f2" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Mobile tab bar — hidden on md+ */}
      <div className="flex md:hidden border-b-4 border-black bg-[#fffdf8] shrink-0">
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-wide transition-colors
            ${activeTab === "upload"
              ? "bg-[#4d61ff] text-white"
              : "bg-white text-black"
            } border-r-4 border-black`}
        >
          Upload PDF
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-wide transition-colors
            ${activeTab === "chat"
              ? "bg-[#ff5e36] text-white"
              : "bg-white text-black"
            }`}
        >
          Chat
          {collectionName && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-400 border border-black" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* PDF Upload panel */}
        <div
          className={`
            h-full border-black
            /* Desktop: always visible, side by side */
            md:flex md:flex-1 md:border-r-4
            /* Mobile: full width, toggled */
            ${activeTab === "upload" ? "flex flex-1" : "hidden"}
          `}
        >
          <div className="flex-1 min-w-0">
            <PDFUpload onIndexed={handleIndexed} />
          </div>
        </div>

        {/* Chat panel */}
        <div
          className={`
            h-full
            /* Desktop: always visible, side by side */
            md:flex md:flex-1
            /* Mobile: full width, toggled */
            ${activeTab === "chat" ? "flex flex-1" : "hidden"}
          `}
        >
          <div className="flex-1 min-w-0">
            <ChatInterface collectionName={collectionName} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatWithLLM;