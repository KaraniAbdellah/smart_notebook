import { useState, useRef, useCallback } from "react";

import {
  FiUploadCloud,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PDFUpload({ onIndexed }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState(null);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef(null);

  const uploadFile = useCallback(
    async (f) => {
      setFile(f);
      setStatus("uploading");

      const formData = new FormData();

      formData.append("file", f);

      const collectionName = f.name
        .replace(/\.pdf$/i, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      formData.append(
        "collection_name",
        collectionName
      );

      try {
        const res = await fetch(
          `${API_BASE}/upload-pdf`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail || "Upload failed"
          );
        }

        setStatus("success");
        setMessage(data.message);

        setStats({
          pages: data.pages_extracted,
          chunks: data.chunks_indexed,
        });

        onIndexed?.(collectionName);
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    },
    [onIndexed]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);

      const f = e.dataTransfer.files?.[0];

      if (f?.type === "application/pdf") {
        uploadFile(f);
      }
    },
    [uploadFile]
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden border-4 border-black bg-[#fffdf8] shadow-[10px_10px_0_#000]">

      {/* PATTERN */}
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* HEADER */}
      <div className="relative z-10 border-b-4 border-black bg-[#4d61ff] p-6 text-white">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-black bg-white text-black shadow-[4px_4px_0_#000]">
            <FiUploadCloud className="text-2xl" />
          </div>

          <div>
            <h2 className="text-lg font-black uppercase">
              Upload PDF
            </h2>

            <p className="text-xs font-semibold text-white/70">
              AI indexing enabled
            </p>
          </div>

          <div className="ml-auto rotate-2 rounded-xl border-4 border-black bg-[#00e0b0] px-4 py-2 text-xs font-black text-black shadow-[4px_4px_0_#000]">
            PDF ONLY
          </div>
        </div>
      </div>

      {/* DROPZONE */}
      <div className="relative z-10 flex flex-1 p-6">

        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          className={`
            relative
            flex
            flex-1
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-[24px]
            border-4
            border-dashed
            border-black
            p-10
            text-center
            transition-all
            shadow-[8px_8px_0_#000]
            ${
              dragging
                ? "bg-[#00e0b0]"
                : "bg-white"
            }
          `}
        >

          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
            }}
          />

          {/* DECOR */}
          <div className="absolute right-4 top-4 rotate-12 rounded-lg border-4 border-black bg-[#ff3e00] px-3 py-1 text-xs font-black text-white shadow-[3px_3px_0_#000]">
            DROPZONE
          </div>

          {/* IDLE */}
          {status === "idle" && (
            <>
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[24px] border-4 border-black bg-[#fff3d8] shadow-[6px_6px_0_#000]">
                <FiUploadCloud className="text-5xl" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                Drop your PDF
              </h3>

              <p className="mt-2 max-w-sm text-sm font-semibold text-black/60">
                Drag & drop your document here or click
                to browse files.
              </p>
            </>
          )}

          {/* LOADING */}
          {status === "uploading" && (
            <>
              <div className="mb-6 flex h-24 w-24 animate-spin items-center justify-center rounded-[24px] border-4 border-black bg-[#4d61ff] text-white shadow-[6px_6px_0_#000]">
                <FiLoader className="text-5xl" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                Indexing...
              </h3>

              <p className="mt-2 text-sm font-semibold text-black/60">
                {file?.name}
              </p>
            </>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <>
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[24px] border-4 border-black bg-[#00e0b0] shadow-[6px_6px_0_#000]">
                <FiCheckCircle className="text-5xl" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                Indexed
              </h3>

              <p className="mt-2 text-sm font-semibold">
                {stats?.pages} pages ·{" "}
                {stats?.chunks} chunks
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-xl border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0_#000]">
                <FiFile />
                <span className="text-sm font-bold">
                  {file?.name}
                </span>
              </div>
            </>
          )}

          {/* ERROR */}
          {status === "error" && (
            <>
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[24px] border-4 border-black bg-red-300 shadow-[6px_6px_0_#000]">
                <FiAlertCircle className="text-5xl" />
              </div>

              <h3 className="text-2xl font-black uppercase">
                Upload Failed
              </h3>

              <p className="mt-2 text-sm font-semibold text-black/60">
                {message}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}