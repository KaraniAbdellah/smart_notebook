import { useState, useCallback } from "react";
import PDFUpload from "./PDFUpload";
import ChatInterface from "./ChatInterface";

const ChatWithLLM = () => {
  const [collectionName, setCollectionName] = useState(null);

  // useCallback prevents ChatInterface from re-rendering when parent re-renders
  const handleIndexed = useCallback((name) => setCollectionName(name), []);

  return (
    <div className="w-screen h-screen flex overflow-hidden font-sans" style={{ background: "#f7f5f2" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div className="h-full flex-1 border-r" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <PDFUpload onIndexed={handleIndexed} />
      </div>
      <div className="h-full flex-1">
        <ChatInterface collectionName={collectionName} />
      </div>
    </div>
  );
};

export default ChatWithLLM;