"use client";

import dynamic from "next/dynamic";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Props = {
  code?: string | null;
  language?: string | null;
  height?: number | string;
};

export default function CodeViewer({ code = "", language = "plaintext", height = 380 }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-inner shadow-primary/10">
      <Monaco
        height={height}
        language={language || "plaintext"}
        value={code || ""}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: "on",
        }}
      />
    </div>
  );
}
