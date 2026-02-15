import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import CodeViewer from "./CodeViewer";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

async function fetchExplanation(id: string) {
  const res = await fetch(`${apiBase}/api/explanations/${id}`, { cache: "no-store" });
  if (res.ok) return { type: "explanation" as const, data: await res.json() };
  return null;
}

async function fetchTutorial(id: string) {
  const res = await fetch(`${apiBase}/api/explanations/learn/${id}`, { cache: "no-store" });
  if (res.ok) return { type: "tutorial" as const, data: await res.json() };
  return null;
}

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const explanation = await fetchExplanation(id);
  const tutorial = explanation ? null : await fetchTutorial(id);

  const payload = explanation || tutorial;
  if (!payload) return notFound();

  const { type, data } = payload;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050912] via-[#0a1424] to-[#050912] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="grid-pattern absolute inset-0" />
      </div>
      <Navbar />
      <main className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-primary">
          <a href="/history" className="flex items-center gap-1 hover:underline">
            <span className="material-icons text-xs">arrow_back</span>
            Back to History
          </a>
          <span className="text-slate-500">/</span>
          <span className="uppercase tracking-wide text-xs text-slate-300">{type}</span>
        </div>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {type === "explanation" ? data.summary || "Code Explanation" : data.tutorial?.title || data.topic}
            </h1>
            <p className="text-sm text-slate-400">
              {type === "explanation"
                ? `Language: ${data.language || "n/a"}`
                : `${data.category || ""} • ${data.level || ""} • ${data.language || ""}`}
            </p>
          </div>
          <div className="rounded-full bg-primary/15 px-4 py-2 text-xs font-semibold text-primary">
            {new Date(data.createdAt || Date.now()).toLocaleString()}
          </div>
        </div>

        {type === "explanation" ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/20 backdrop-blur">
              <h2 className="mb-3 text-sm font-semibold text-primary">Summary</h2>
              <p className="text-slate-100 leading-relaxed">{data.summary || "No summary."}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary">Code</h3>
              <CodeViewer code={data.code} language={data.language || "plaintext"} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-primary">Time Complexity</div>
                <div className="text-sm text-slate-100">{data.timeComplexity || data.complexity || "—"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-primary">Space Complexity</div>
                <div className="text-sm text-slate-100">{data.spaceComplexity || "—"}</div>
              </div>
            </div>

            {data.logicBreakdown?.length ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="text-sm font-semibold text-primary mb-3">Logic Breakdown</h3>
                <ol className="space-y-2 text-sm text-slate-100">
                  {data.logicBreakdown.map((step: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-bold text-primary">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {data.bugs?.length ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6">
                <h3 className="text-sm font-semibold text-red-300 mb-2">Possible Bugs</h3>
                <ul className="list-disc space-y-1 pl-4 text-sm text-slate-100">
                  {data.bugs.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/20 backdrop-blur">
              <h2 className="mb-3 text-sm font-semibold text-primary">Theory</h2>
              <p className="text-slate-100 leading-relaxed">{data.tutorial?.theory}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                Code Example ({data.tutorial?.codeExample?.language || data.language})
              </h3>
              <CodeViewer
                code={data.tutorial?.codeExample?.code}
                language={data.tutorial?.codeExample?.language || data.language || "plaintext"}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-primary">Time Complexity</div>
                <div className="text-sm text-slate-100">{data.tutorial?.complexity?.time || "—"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-primary">Space Complexity</div>
                <div className="text-sm text-slate-100">{data.tutorial?.complexity?.space || "—"}</div>
              </div>
            </div>

            {data.tutorial?.implementationSteps?.length ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="text-sm font-semibold text-primary mb-3">Implementation Steps</h3>
                <ol className="space-y-2 text-sm text-slate-100">
                  {data.tutorial.implementationSteps.map((step: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/20 text-center text-xs font-bold text-primary">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {data.tutorial?.useCases?.length ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-primary mb-3">Use Cases</h3>
                <ul className="list-disc space-y-1 pl-4 text-sm text-slate-100">
                  {data.tutorial.useCases.map((u: string, i: number) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
