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

const tagToneClasses: Record<string, string> = {
  optimized: "bg-green-500/10 text-green-500",
  bug: "bg-red-500/10 text-red-500",
  slow: "bg-yellow-500/10 text-yellow-500",
  default: "bg-blue-500/10 text-blue-500",
};

const accentBg: Record<string, string> = {
  python: "bg-blue-500/10",
  javascript: "bg-yellow-500/10",
  "c++": "bg-indigo-500/10",
  java: "bg-orange-500/10",
  typescript: "bg-blue-600/10",
  default: "bg-primary/10",
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
  <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-primary/50 dark:border-slate-800 dark:bg-[#1a1d23]">
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentBg[languageKey] || accentBg.default}`}>
            <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200">
              {item.language?.slice(0, 3) || "AI"}
            </span>
          </div>
          <div>
            <h3 className="leading-none font-bold text-slate-900 dark:text-white">
              {item.summary || "Code explanation"}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
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

      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/50 dark:bg-slate-900/50">
        <pre className="code-snippet custom-scrollbar line-clamp-4 overflow-hidden text-xs text-slate-600 dark:text-slate-300">
          <code>{item.code}</code>
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="material-icons mt-0.5 text-sm text-primary">psychology</span>
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
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
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 transition-colors group-hover:bg-primary/5 dark:border-slate-800 dark:bg-white/5">
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

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<HistoryItem[]>([]);
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
        const res = await fetch(url);
        if (res.status === 404) {
          setItems([]);
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to load history: ${res.status} ${text}`);
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, apiBase]);

  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learning History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            Loading your history...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-200">
            No explanations saved yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <HistoryCard key={item._id} item={item} />
            ))}
          </div>
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
