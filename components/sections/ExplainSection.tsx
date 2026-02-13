"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import CodeEditor from "../editor/CodeEditor";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const ExplainSection = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("cpp");
  const [explanation, setExplanation] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
    []
  );

  function Card({
    title,
    children,
    className = "",
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={`rounded-xl border border-white/5 bg-white/5 p-6 shadow-lg shadow-primary/10 backdrop-blur ${className}`}
      >
        <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
        <div className="text-sm leading-relaxed text-slate-200">{children}</div>
      </div>
    );
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleGenerate = async () => {
    if (!code.trim()) {
      setExplanation(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/explanations/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      let parsed = data;
      if (typeof data === "string") {
        parsed = JSON.parse(data);
      }
      setExplanation(parsed);
    } catch (error) {
      console.error(error);
      setExplanation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return alert("Login required to save explanations");

    try {
      const idToken = await user.getIdToken?.();
      // Ensure user exists in backend
      await fetch(`${apiBase}/api/auth/sync-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      await fetch(`${apiBase}/api/explanations/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          code,
          language,
          explanation: JSON.stringify(explanation),
          complexity: explanation?.timeComplexity,
          summary: explanation?.summary,
          timeComplexity: explanation?.timeComplexity,
          spaceComplexity: explanation?.spaceComplexity,
          logicBreakdown: explanation?.logicBreakdown,
          edgeCases: explanation?.edgeCases,
          bugs: explanation?.bugs,
          beginnerExplanation: explanation?.beginnerExplanation,
          recommendation: explanation?.recommendation,
          optimizedVersion: explanation?.optimizedVersion,
          keyConcepts: explanation?.keyConcepts,
          idToken,
        }),
      });
      alert("Saved!");
    } catch (error) {
      console.error(error);
      alert("Could not save right now.");
    }
  };

  return (
    <section id="explain" className="mx-auto mt-24 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-3xl font-semibold text-white">Explain your code</h2>
        <p className="text-sm text-slate-300">
          Paste a snippet, choose the language, then generate a quick explanation. Saving will require login later.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-2xl shadow-primary/20 backdrop-blur-xl transition-all duration-200 hover:border-primary/40">
        <div className="flex flex-col gap-4">
          <CodeEditor value={code} onChange={setCode} language={language} />

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-200" htmlFor="language">
            Language
          </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-sm text-slate-100 shadow-inner focus:border-primary focus:outline-none"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>

            <div className="ml-auto flex items-center gap-3">
              {user && (
                <span className="text-xs text-slate-400">Signed in as {user.email}</span>
              )}
              <button
                type="button"
                onClick={() => {
                  setCode("");
                  setExplanation(null);
                }}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:border-primary/60 hover:bg-white/5"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-lg bg-gradient-to-r from-primary to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Generating..." : "Generate Explanation"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:border-primary/60 hover:bg-white/5"
              >
                Save
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm leading-relaxed text-slate-200">
            {loading ? (
              <div className="rounded-xl border border-blue-500/20 bg-white/5 p-5">
                <p className="text-gray-300">Generating your explanation...</p>
              </div>
            ) : explanation ? (
              <>
                <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
                    <div className="mb-4 flex items-center gap-2 text-primary">
                      <span className="material-icons text-sm">auto_awesome</span>
                      <span className="text-sm font-bold tracking-wide">AI EXPLANATION</span>
                    </div>
                    <p className="text-base leading-relaxed text-slate-100">
                      {explanation?.summary}
                    </p>

                    <div className="mt-6 rounded border border-white/10 bg-slate-900/60 p-4">
                      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                        COMPLEXITY
                      </div>
                      <div className="text-primary">
                        Time: {explanation?.timeComplexity || "—"}
                      </div>
                      <div className="text-emerald-500">
                        Space: {explanation?.spaceComplexity || "—"}
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4 shadow-inner shadow-primary/20">
                      <div className="mb-2 flex items-center gap-2 text-primary">
                        <span className="material-icons text-sm">list_alt</span>
                        <span className="text-sm font-semibold">Logic breakdown</span>
                      </div>
                      {explanation?.logicBreakdown?.length ? (
                        <ol className="space-y-2 text-sm text-slate-100">
                          {explanation.logicBreakdown.map((step: string, i: number) => (
                            <li key={i}>
                              <span className="mr-2 rounded-full bg-primary/20 px-2 py-1 text-xs font-semibold text-primary">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-slate-300">
                          No detailed breakdown returned for this snippet.
                        </p>
                      )}
                      {explanation?.recommendation && (
                        <p className="mt-3 text-xs italic text-orange-300">
                          Recommendation: {explanation.recommendation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card
                      title="Possible Bugs"
                      className="border-red-200 bg-red-50/80 dark:border-red-500/30 dark:bg-red-500/10"
                    >
                      {explanation?.bugs?.length ? (
                        <ul className="space-y-2">
                          {explanation.bugs.map((bug: string, i: number) => (
                            <li className="flex items-start gap-2" key={i}>
                              <span className="material-icons text-sm text-red-500">warning</span>
                              <span>{bug}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-700 dark:text-slate-200">No issues detected.</p>
                      )}
                    </Card>

                  <Card title="Beginner Explanation" className="border-white/10 bg-white/5">
                    {explanation?.beginnerExplanation || "A beginner-friendly summary will appear here."}
                  </Card>

                  <Card title="Edge Cases" className="border-white/10 bg-white/5">
                    {explanation?.edgeCases?.length ? (
                      <ul className="space-y-2">
                        {explanation.edgeCases.map((edge: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="material-icons text-sm text-primary">adjust</span>
                            <span>{edge}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-300">No edge cases were identified for this snippet.</p>
                    )}
                  </Card>

                  <Card title="Key Concepts" className="border-white/10 bg-white/5">
                    <div className="flex flex-wrap gap-2">
                      {explanation?.keyConcepts?.length ? (
                        explanation.keyConcepts.map((k: string, i: number) => (
                          <span
                              key={i}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            >
                              {k}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-300">No key concepts returned.</span>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>

                {explanation?.optimizedVersion && (
                  <div className="mt-8 max-w-full">
                    <h3 className="mb-3 text-lg font-semibold text-blue-500">Optimized Version</h3>
                    <div className="max-w-full overflow-hidden rounded-xl border border-white/10 bg-black/60">
                      <div className="overflow-x-auto w-full">
                        <Editor
                          height="250px"
                          language={language}
                          value={explanation?.optimizedVersion?.split("\n")?.[0] || ""}
                          theme="vs-dark"
                          options={{ readOnly: true }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-blue-500/20 bg-slate-100 p-5 dark:bg-black/40">
                <p className="text-gray-500 dark:text-gray-400">Your explanation will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainSection;
