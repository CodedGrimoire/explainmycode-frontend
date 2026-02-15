const Showcase = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0b1220]">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
        <div className="grid-pattern absolute inset-0" />
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-blue-600/25 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="lg:w-1/2">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Designed for the modern student developer
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Multi-language support",
                  copy: "Python, JavaScript, Java, C++, and 20+ other languages supported natively.",
                },
                {
                  title: "IDE Extensions",
                  copy: "Available as a VS Code extension and JetBrains plugin for seamless workflow.",
                },
                {
                  title: "Collaborative Learning",
                  copy: "Share explanations with teammates or classmates with a single permalink.",
                },
              ].map((item) => (
                <div className="flex gap-4" key={item.title}>
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <span className="material-icons text-primary text-sm">check</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-300">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:w-1/2">
            <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMycThB_rlTMIoio_4i0u4giRqlnoxDJMq1kDmjuw81nYi1-xvvS8QVfYWmFA44ccUK_0UPE_emxfWQPAtEZUd6xTXbAE-0NYmDc9K557Upu9u3Usl99VZaUgAVHymn-jf0VrTLdXShb27sLf5-_QV9SNWgQ7TWrcoQDpKKuUgi2-Lqx5K0lkrwXslDIBeM4MG09VBhznXG19JEYpty4vaj9OoQjYQLeqzJc-DiRtPmzIh06HXlKXMXn5pRa2xlgMCXRkOeims8fc"
              alt="Developer Workspace"
              className="relative z-10 rounded-2xl border border-white/10 shadow-2xl shadow-primary/30"
            />
            <div className="absolute -bottom-6 -right-6 z-20 hidden rounded-xl bg-white/5 p-6 text-white shadow-xl shadow-primary/40 backdrop-blur md:block">
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-xs font-medium text-blue-100">ACCURACY RATE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
