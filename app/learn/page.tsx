"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "react-hot-toast";

type Tutorial = {
  title: string;
  level: string;
  category: string;
  theory: string;
  implementationSteps: string[];
  pseudocode: string;
  codeExample: { language: string; code: string };
  useCases: string[];
  complexity: { time: string; space: string };
  tips: string[];
  relatedConcepts: string[];
};

const LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const CATEGORIES = [
  { label: "Algorithm", value: "algorithm" },
  { label: "Data Structure", value: "data structure" },
];

const ALGO_TOPICS = [
  { name: "Dijkstra's Algorithm", level: "medium", blurb: "Shortest path in weighted graphs with non-negative edges." },
  { name: "Breadth-First Search", level: "beginner", blurb: "Layer-by-layer traversal; finds shortest path in unweighted graphs." },
  { name: "Depth-First Search", level: "beginner", blurb: "Explores deeply first; basis for cycle detection and traversals." },
  { name: "Topological Sort", level: "medium", blurb: "Order DAG nodes to respect dependencies." },
  { name: "Union-Find (DSU)", level: "medium", blurb: "Efficiently merges sets and checks connectivity with path compression." },
  { name: "Kruskal's MST", level: "medium", blurb: "Greedy algorithm for minimum spanning tree using sorting and DSU." },
  { name: "Kadane's Algorithm", level: "beginner", blurb: "Linear-time maximum subarray sum." },
  { name: "Sliding Window", level: "beginner", blurb: "Maintain a moving window to handle subarray/substring problems." },
  { name: "Quick Sort", level: "medium", blurb: "Divide-and-conquer sort using partitioning." },
  { name: "Merge Sort", level: "beginner", blurb: "Stable divide-and-conquer sort with O(n log n)." },
  { name: "KMP String Matching", level: "hard", blurb: "Linear-time pattern search using prefix function." },
  { name: "Binary Search", level: "beginner", blurb: "Logarithmic search on sorted data." },
];

const DS_TOPICS = [
  { name: "Array", level: "beginner", blurb: "Contiguous storage with O(1) indexing." },
  { name: "Linked List", level: "beginner", blurb: "Nodes linked by pointers; flexible inserts/deletes." },
  { name: "Stack", level: "beginner", blurb: "LIFO structure; great for undo, parsing, DFS." },
  { name: "Queue", level: "beginner", blurb: "FIFO structure; scheduling, BFS." },
  { name: "Hash Map", level: "medium", blurb: "Key-value with expected O(1) ops via hashing." },
  { name: "Heap / Priority Queue", level: "medium", blurb: "Retrieve min/max in O(log n)." },
  { name: "Binary Search Tree", level: "medium", blurb: "Ordered tree enabling sorted ops; rotations keep balance." },
  { name: "Trie", level: "medium", blurb: "Prefix tree for fast string queries." },
  { name: "Segment Tree", level: "hard", blurb: "Range queries and updates in O(log n)." },
  { name: "Fenwick Tree (BIT)", level: "hard", blurb: "Compact structure for prefix sums in O(log n)." },
  { name: "LRU Cache", level: "medium", blurb: "Evicts least-recently-used via hashmap + list." },
  { name: "Graph Adjacency List", level: "beginner", blurb: "Space-efficient graph representation." },
];

export default function LearnPage() {
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
    []
  );

  const [topic, setTopic] = useState("Dijkstra's algorithm");
  const [level, setLevel] = useState("beginner");
  const [category, setCategory] = useState("algorithm");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const fetchTutorial = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to learn.");
      toast.error("Please enter a topic to learn.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/explanations/learn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, category, language }),
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          throw new Error(parsed?.message || text || "Failed to load tutorial");
        } catch {
          throw new Error(text || "Failed to load tutorial");
        }
      }

      const data = await res.json();
      setTutorial(data);
      setShowFilters(false);
      toast.success("Tutorial generated");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
      toast.error("Could not generate tutorial");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTutorial(null);
    setShowFilters(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!tutorial) return;
    if (!user) {
      const params = new URLSearchParams({ auth: "1", redirect: "/learn" });
      window.location.href = `/learn?${params.toString()}`;
      return;
    }

    try {
      const idToken = await user.getIdToken?.();
      await fetch(`${apiBase}/api/auth/sync-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      const res = await fetch(`${apiBase}/api/explanations/learn/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          topic,
          level,
          category,
          language,
          tutorial,
          idToken,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save tutorial");
      }

      toast.success("Tutorial saved");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Could not save tutorial right now.");
    }
  };

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );

  const TopicGrid = ({
    title,
    items,
    categoryValue,
  }: {
    title: string;
    items: { name: string; level: string; blurb: string }[];
    categoryValue: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <span className="text-xs text-slate-400">Tap a card to load</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setTopic(item.name);
              setLevel(item.level);
              setCategory(categoryValue);
              setTutorial(null);
            }}
            className="group rounded-xl border border-white/10 bg-white/5 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-primary/20"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{item.name}</span>
              <Badge>{item.level}</Badge>
            </div>
            <p className="text-xs text-slate-300 group-hover:text-slate-100">{item.blurb}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const TutorialView = () => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
      {!tutorial ? (
        <div className="flex h-full items-center justify-center text-slate-300">
          Generated tutorial will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{tutorial.category}</Badge>
              <Badge>{tutorial.level}</Badge>
              <Badge>{tutorial.codeExample?.language || language}</Badge>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-primary/60 hover:bg-white/5"
              >
                New / Clear
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-gradient-to-r from-primary to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30 transition hover:scale-105"
              >
                Save Tutorial
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">{tutorial.title}</h2>
          <p className="text-sm leading-relaxed text-slate-200">{tutorial.theory}</p>

          <div className="rounded-lg border border-white/10 bg-black/40 p-4">
            <h3 className="text-sm font-semibold text-primary">Implementation Steps</h3>
            <ol className="mt-2 space-y-2 text-sm text-slate-100">
              {tutorial.implementationSteps?.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
            <h3 className="text-sm font-semibold text-primary">Pseudocode</h3>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-100">
              {tutorial.pseudocode}
            </pre>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/60 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Code Example ({tutorial.codeExample?.language || language})</span>
              <span className="text-primary">
                Time {tutorial.complexity?.time} · Space {tutorial.complexity?.space}
              </span>
            </div>
            <pre className="custom-scrollbar max-h-80 overflow-auto whitespace-pre text-xs text-slate-100">
{tutorial.codeExample?.code}
            </pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold text-primary">Use Cases</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-100">
                {tutorial.useCases?.map((u, i) => (
                  <li key={i}>• {u}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold text-primary">Tips & Pitfalls</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-100">
                {tutorial.tips?.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-primary">Related Concepts</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-100">
              {tutorial.relatedConcepts?.map((c, i) => (
                <span key={i} className="rounded-full bg-primary/15 px-3 py-1 text-primary">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050912] via-[#0a1424] to-[#050912] text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-white">Learn Algorithms & Data Structures</h1>
          <p className="text-sm text-slate-300">
            Choose a concept, difficulty, and language. We generate a concise tutorial card with theory, steps, code, and use cases.
          </p>
        </div>

        {showFilters ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl shadow-primary/20 backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Topic
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Binary Search Tree"
                    className="rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Code Language
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-white focus:border-primary focus:outline-none"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Difficulty
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        onClick={() => setLevel(lvl.value)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                          level === lvl.value
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-white/15 bg-black/40 text-slate-200 hover:border-primary/40"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Category
                  <div className="flex gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                          category === cat.value
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-white/15 bg-black/40 text-slate-200 hover:border-primary/40"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={fetchTutorial}
                  disabled={loading}
                  className="rounded-lg bg-gradient-to-r from-primary to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Generating..." : "Generate Tutorial"}
                </button>
                {error && <span className="text-sm text-red-400">{error}</span>}
              </div>

              <div className="mt-8 space-y-6">
                <TopicGrid title="Algorithms" items={ALGO_TOPICS.slice(0, 10)} categoryValue="algorithm" />
                <TopicGrid title="Data Structures" items={DS_TOPICS.slice(0, 10)} categoryValue="data structure" />
              </div>
            </div>

            <TutorialView />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 shadow-lg shadow-primary/20 backdrop-blur">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                <Badge>{category}</Badge>
                <Badge>{level}</Badge>
                <Badge>{language}</Badge>
                <span className="text-slate-400">Topic: {topic}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-primary/60 hover:bg-white/5"
                >
                  Edit Filters
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-primary/60 hover:bg-white/5"
                >
                  New / Clear
                </button>
              </div>
            </div>
            <TutorialView />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
