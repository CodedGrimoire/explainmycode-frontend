"use client";

import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
};

const CodeEditor = ({ value, onChange, language = "cpp" }: CodeEditorProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 text-xs uppercase tracking-wide text-gray-400">
        <span className="font-semibold text-gray-200">Language: {language}</span>
        <span className="flex items-center gap-2 text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Ready
        </span>
      </div>
      <Editor
        height="400px"
        defaultLanguage="cpp"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
