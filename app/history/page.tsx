// eslint-disable-next-line @next/next/no-document-import-in-page
"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

type HistoryItem = {
  _id: string;
  language?: string;
  code?: string;
  summary?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  bugs?: string[];
  logicBreakdown?: string[];
  edgeCases?: string[];
  beginnerExplanation?: string;
  recommendation?: string;
  optimizedVersion?: string;
  keyConcepts?: string[];
  createdAt?: string;
  complexity?: string;
};

type TutorialItem = {
  _id: string;
  topic?: string;
  level?: string;
  category?: string;
  language?: string;
  tutorial?: {
    title?: string;
    theory?: string;
    complexity?: { time?: string; space?: string };
    useCases?: string[];
    relatedConcepts?: string[];
  };
  createdAt?: string;
};

const tagToneClasses: Record<string, string> = {
  optimized: "bg-green-500/10 text-green-300",
  bug: "bg-red-500/10 text-red-300",
  slow: "bg-yellow-500/10 text-yellow-200",
  default: "bg-primary/15 text-primary",
};

const accentBg: Record<string, string> = {
  python: "bg-blue-500/15 text-blue-100",
  javascript: "bg-yellow-500/15 text-yellow-100",
  "c++": "bg-indigo-500/15 text-indigo-100",
  java: "bg-orange-500/15 text-orange-100",
  typescript: "bg-blue-600/15 text-blue-100",
  default: "bg-primary/15 text-primary/90",
};

const HistoryCard = ({ item }: { item: HistoryItem }) => {
  const languageKey = item.language?.toLowerCase() || "default";
  const badgeTone =
    item.bugs && item.bugs.length
      ? "bug"
      : item.timeComplexity?.toLowerCase().includes("n^2") ||
        item.timeComplexity?.toLowerCase().includes("o(n^2)")
      ? "slow"
      : "optimized";

  return (
  <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-primary/10 backdrop-blur transition-colors hover:border-primary/40">
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentBg[languageKey] || accentBg.default}`}>
            <span className="text-xs font-bold uppercase text-white">
              {item.language?.slice(0, 3) || "AI"}
            </span>
          </div>
          <div>
            <h3 className="leading-none font-bold text-white">
              {item.summary || "Code explanation"}
            </h3>
            <span className="text-xs text-slate-400">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${tagToneClasses[badgeTone] || tagToneClasses.default}`}>
          {badgeTone === "bug" ? "Bug Found" : badgeTone === "slow" ? "Slow" : "Optimized"}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <pre className="code-snippet custom-scrollbar line-clamp-4 overflow-hidden text-xs text-slate-200">
          <code>{item.code}</code>
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="material-icons mt-0.5 text-sm text-primary">psychology</span>
          <p className="line-clamp-2 text-sm text-slate-200">
            {item.summary || "Explanation summary unavailable."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
            {item.timeComplexity || item.complexity || "—"}
          </span>
          <span>Time Complexity</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 transition-colors group-hover:bg-primary/10 bg-white/5">
      <Link
        href={`/history/${item._id}`}
        className="flex items-center gap-1 text-sm font-semibold text-primary"
      >
        View Full Analysis
        <span className="material-icons text-xs">arrow_forward</span>
      </Link>
      <button className="text-slate-400 transition-colors hover:text-red-500">
        <span className="material-icons text-sm">delete_outline</span>
      </button>
    </div>
  </div>
  );
};

const TutorialCard = ({ item, onDelete }: { item: TutorialItem; onDelete: (id: string) => void }) => {
  const t = item.tutorial || {};
  return (
    <div className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-primary/10 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40">
      <div className="p-5 space-y-3 text-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              {item.category || "concept"}
            </span>
            <span className="rounded bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
              {item.level || "level"}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-white">
            {t.title || item.topic || "Tutorial"}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-slate-200">
            {t.theory || "Saved tutorial details available on Learn page."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded bg-white/5 px-2 py-1">
            Time {t.complexity?.time || "—"}
          </span>
          <span className="rounded bg-white/5 px-2 py-1">
            Space {t.complexity?.space || "—"}
          </span>
          <span className="rounded bg-white/5 px-2 py-1">
            Lang {item.language || "—"}
          </span>
        </div>
        {t.useCases?.length ? (
          <div className="flex flex-wrap gap-2">
            {t.useCases.slice(0, 3).map((u, i) => (
              <span
                key={i}
                className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"
              >
                {u}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 transition-colors group-hover:bg-primary/10 bg-white/5">
        <Link href={`/history/${item._id}`} className="flex items-center gap-1 text-sm font-semibold text-primary">
          View Tutorial
          <span className="material-icons text-xs">arrow_forward</span>
        </Link>
        <button
          onClick={() => onDelete(item._id)}
          className="text-slate-400 transition-colors hover:text-red-400"
          title="Delete tutorial"
        >
          <span className="material-icons text-sm">delete_outline</span>
        </button>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [loading, setLoading] = useState(false);

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
    []
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const url = `${apiBase}/api/explanations/user?uid=${user.uid}`;
        const tutUrl = `${apiBase}/api/explanations/learn/user?uid=${user.uid}`;

        const [expRes, tutRes] = await Promise.all([fetch(url), fetch(tutUrl)]);

        if (expRes.status === 404) {
          setItems([]);
        } else if (expRes.ok) {
          const data = await expRes.json();
          setItems(Array.isArray(data) ? data : []);
        }

        if (tutRes.status === 404) {
          setTutorials([]);
        } else if (tutRes.ok) {
          const data = await tutRes.json();
          setTutorials(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        setItems([]);
        setTutorials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, apiBase]);

  const handleDeleteTutorial = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/api/explanations/learn/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Could not delete tutorial right now.");
        return;
      }
      setTutorials((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not delete tutorial right now.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#050912] via-[#0a1424] to-[#050912] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="grid-pattern absolute inset-0" />
      </div>
      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Learning History</h1>
            <p className="text-sm text-slate-300">
              {user ? "Your saved explanations and optimizations." : "Sign in to see your saved explanations."}
            </p>
          </div>
          <button
            onClick={() => window.location.assign("/#explain")}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            <span className="material-icons text-sm">add</span>
            New Analysis
          </button>
        </div>

        {!user ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            Please sign in to view your history.
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200 flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/30 border-t-primary" />
            <p className="text-sm text-slate-300">Loading your history...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            No explanations saved yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <HistoryCard key={item._id} item={item} />
              ))}
            </div>

            {tutorials.length > 0 && (
              <div className="mt-10 space-y-4">
                <h2 className="text-xl font-bold text-white">Saved Tutorials</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {tutorials.map((t) => (
                    <TutorialCard key={t._id} item={t} onDelete={handleDeleteTutorial} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <div className="fixed bottom-8 right-8">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110">
          <span className="material-icons text-2xl">chat_bubble</span>
        </button>
      </div>
      <Footer />
    </div>
  );
}
