const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-pattern absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[140px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow shadow-primary/20">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span>v2.0 is live</span>
        </div>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter text-white md:text-7xl">
          Decode the <span className="text-primary">Complexity</span>
        </h1>
        <p className="mb-10 mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
          Instantly transform obscure code into clear, logical explanations. Detect complexity, uncover bugs, and learn faster with AI built for developers and CS students.
        </p>
        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#explain"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/40 transition-all hover:scale-105 sm:w-auto"
          >
            Get Started for Free <span className="material-icons">arrow_forward</span>
          </a>
          <button className="w-full rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all hover:border-primary/40 hover:bg-white/10 sm:w-auto">
            View Documentation
          </button>
        </div>

        <div className="group relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 blur opacity-30 transition duration-700 group-hover:opacity-60" />
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117]/90 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#161b22] px-4 py-3">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-xs font-mono text-slate-400">fibonacci.js — ExplainMyCode</div>
              <div className="w-12" />
            </div>
            <div className="grid h-[420px] text-left font-mono text-sm leading-relaxed md:grid-cols-2">
              <div className="custom-scrollbar overflow-y-auto border-r border-slate-800 p-6">
                <div className="mb-4 select-none text-slate-500">// Your messy code here</div>
                <div className="text-blue-400">
                  function <span className="text-yellow-400">fib</span>(n) {"{"}
                </div>
                <div className="pl-4 text-slate-300">
                  <span className="text-purple-400">if</span> (n &lt;= <span className="text-orange-400">1</span>){" "}
                  <span className="text-purple-400">return</span> n;
                </div>
                <div className="pl-4 text-slate-300">
                  <span className="text-purple-400">return</span>{" "}
                  <span className="text-yellow-400">fib</span>(n - <span className="text-orange-400">1</span>) +{" "}
                  <span className="text-yellow-400">fib</span>(n - <span className="text-orange-400">2</span>);
                </div>
                <div className="text-blue-400">{"}"}</div>
                <div className="mt-4 flex items-center gap-2 text-red-400">
                  <span className="material-icons text-sm">warning</span>
                  <span className="bg-red-400/10 px-1">Recursion depth issue detected</span>
                </div>
              </div>
              <div className="custom-scrollbar overflow-y-auto bg-primary/5 p-6">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <span className="material-icons text-sm">auto_awesome</span>
                  <span className="font-bold">AI EXPLANATION</span>
                </div>
                <div className="space-y-4 text-slate-200">
                  <p>
                    This function calculates the <span className="border-b border-primary/40 text-white">n-th Fibonacci number</span>{" "}
                    using a recursive approach.
                  </p>
                  <div className="rounded border border-slate-800 bg-slate-900/70 p-3">
                    <div className="mb-1 text-xs font-bold text-slate-400">COMPLEXITY</div>
                    <div className="text-primary">Time: O(2^n) — Exponential</div>
                    <div className="text-green-400">Space: O(n) — Linear</div>
                  </div>
                  <p className="text-xs leading-normal">
                    <span className="mb-1 block font-bold text-white">Logic breakdown:</span>
                    1. Checks if n is 0 or 1.
                    <br />
                    2. If not, it calls itself twice.
                    <br />
                    <span className="text-orange-300 italic">Recommendation: Use memoization to improve performance to O(n).</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
