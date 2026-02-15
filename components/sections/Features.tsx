const features = [
  {
    icon: "psychology",
    title: "AI Explanations",
    desc: "Get step-by-step natural language breakdowns of complex logic and legacy code snippets.",
  },
  {
    icon: "speed",
    title: "Time Complexity",
    desc: "Automatically detect Big O notation and identify potential performance bottlenecks in your algorithms.",
  },
  {
    icon: "bug_report",
    title: "Bug Identification",
    desc: "Find logic errors and security vulnerabilities before they hit production with AI-driven linting.",
  },
  {
    icon: "school",
    title: "Beginner Mode",
    desc: "Toggle simplified jargon-free mode that explains concepts as if you're 5 years old.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative py-24 bg-[#0b1220]/90"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="grid-pattern absolute inset-0" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Everything you need to learn faster
          </h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            Focus on logic, not syntax errors. Our AI tools are built specifically for the learning journey of a developer.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/20 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-icons">{feature.icon}</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-200">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
