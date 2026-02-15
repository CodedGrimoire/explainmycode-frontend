import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import CodeViewer from "./CodeViewer";
import { gunzipSync } from "node:zlib";

const apiBaseCandidates = [
  process.env.NEXT_PUBLIC_API_BASE,
  process.env.API_BASE,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  "", // relative to same host
  "https://explainmycode-backend-y6b2.onrender.com",
].filter(Boolean) as string[];

async function fetchFirst<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const errors: string[] = [];
  for (const base of apiBaseCandidates) {
    try {
      const url = `${base}${path}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return { ok: true, data: (await res.json()) as T };
      }
      errors.push(`${url}: ${res.status}`);
    } catch (e: any) {
      errors.push(`${base}${path}: ${e?.message || "fetch failed"}`);
    }
  }
  return { ok: false, error: errors.join(" | ") };
}

async function fetchExplanation(id: string) {
  const res = await fetchFirst(`/api/explanations/${id}`);
  if (res.ok) return { type: "explanation" as const, data: res.data };
  return { error: res.error };
}

async function fetchTutorial(id: string) {
  const res = await fetchFirst(`/api/explanations/learn/${id}`);
  if (res.ok) return { type: "tutorial" as const, data: res.data };
  return { error: res.error };
}

function sanitizeCode(raw?: string | null) {
  if (!raw || typeof raw !== "string") return "";
  // If already readable ASCII/UTF-8 with mostly printable chars, return as is
  const printableRatio =
    raw.split("").filter((c) => {
      const code = c.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126);
    }).length / raw.length;
  if (printableRatio > 0.9) return raw;

  // Try gunzip if data looks gzipped (starts with gzip magic bytes)
  if (raw.charCodeAt(0) === 0x1f && raw.charCodeAt(1) === 0x8b) {
    try {
      const buffer = Buffer.from(raw, "binary");
      return gunzipSync(buffer).toString("utf8");
    } catch {
      // fall through
    }
  }

  // As a fallback, try base64 decode then gunzip or plain utf8
  try {
    const b64 = Buffer.from(raw, "base64");
    if (b64.length > 0) {
      if (b64[0] === 0x1f && b64[1] === 0x8b) {
        return gunzipSync(b64).toString("utf8");
      }
      return b64.toString("utf8");
    }
  } catch {
    // ignore
  }

  return raw;
}

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const explanation = await fetchExplanation(id);
  const tutorial = !("type" in explanation) ? await fetchTutorial(id) : null;

  const payload = "type" in explanation ? explanation : tutorial && "type" in tutorial ? tutorial : null;
  const error = !payload ? (("error" in explanation && explanation.error) || (tutorial as any)?.error) : null;

  if (!payload && !error) return notFound();

  if (!payload && error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050912] via-[#0a1424] to-[#050912] text-slate-100">
        <Navbar />
        <main className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
            <p className="font-semibold">Could not load this history item.</p>
            <p className="text-sm opacity-80 break-words">{error}</p>
          </div>
          <a href="/history" className="mt-4 inline-flex items-center gap-1 text-primary hover:underline">
            <span className="material-icons text-xs">arrow_back</span>
            Back to History
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const { type, data } = payload as any;

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

            {data.tutorial?.codeExample?.code && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">
                  Code Example ({data.tutorial?.codeExample?.language || data.language})
                </h3>
                <CodeViewer
                  code={sanitizeCode(data.tutorial?.codeExample?.code)}
                  language={data.tutorial?.codeExample?.language || data.language || "plaintext"}
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-primary">Time Complexity</div>
                <div className="text-sm text-slate-100">
                  {data.tutorial?.complexity?.time || data.complexity || "—"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-primary">Space Complexity</div>
                <div className="text-sm text-slate-100">
                  {data.tutorial?.complexity?.space || data.spaceComplexity || "—"}
                </div>
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
