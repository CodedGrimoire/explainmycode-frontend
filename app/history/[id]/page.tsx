"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type Explanation = {
  _id: string;
  code?: string;
  language?: string;
  summary?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  logicBreakdown?: string[];
  edgeCases?: string[];
  bugs?: string[];
  beginnerExplanation?: string;
  recommendation?: string;
  optimizedVersion?: string;
  keyConcepts?: string[];
  createdAt?: string;
};

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
    []
  );
  const [item, setItem] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthed(!!u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${apiBase}/api/explanations/${id}`);
        if (res.status === 404) {
          setItem(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load analysis");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, apiBase]);

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-primary/10">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-slate-200">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050912] via-[#0a1424] to-[#050912] text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 hover:border-primary/60 hover:bg-white/5"
        >
          <span className="material-icons text-sm">arrow_back</span>
          Back
        </button>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            Loading analysis...
          </div>
        ) : !authed ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            Please sign in to view this analysis.
          </div>
        ) : !item ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            Analysis not found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-primary/20">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary">Analysis</p>
                  <h1 className="text-2xl font-bold text-white">
                    {item.summary || "Explanation"}
                  </h1>
                  <p className="text-xs text-slate-400">
                    {item.language || "Unknown language"} •{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
                <div className="flex gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">
                    {item.timeComplexity || "Time N/A"}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">
                    {item.spaceComplexity || "Space N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
                <pre className="code-snippet whitespace-pre-wrap">{item.code}</pre>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Section title="Logic Breakdown">
                {item.logicBreakdown?.length ? (
                  <ol className="space-y-2">
                    {item.logicBreakdown.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-slate-300">No breakdown provided.</p>
                )}
              </Section>

              <Section title="Edge Cases">
                {item.edgeCases?.length ? (
                  <ul className="space-y-2">
                    {item.edgeCases.map((edge, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-icons text-sm text-primary">adjust</span>
                        <span>{edge}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-300">No edge cases captured.</p>
                )}
              </Section>

              <Section title="Bugs">
                {item.bugs?.length ? (
                  <ul className="space-y-2">
                    {item.bugs.map((bug, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="material-icons text-sm text-red-400">bug_report</span>
                        <span>{bug}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-300">No bugs identified.</p>
                )}
              </Section>

              <Section title="Beginner Explanation">
                <p>{item.beginnerExplanation || "Not provided."}</p>
              </Section>

              <Section title="Recommendation">
                <p>{item.recommendation || "No recommendation provided."}</p>
              </Section>

              <Section title="Key Concepts">
                {item.keyConcepts?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {item.keyConcepts.map((k, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300">No key concepts captured.</p>
                )}
              </Section>
            </div>

            <Section title="Optimized Version">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200">
                <pre className="code-snippet whitespace-pre-wrap">
                  {item.optimizedVersion || "No optimized version provided."}
                </pre>
              </div>
            </Section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
