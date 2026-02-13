const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-b-2xl border-b border-white/10 bg-[#0B1220]/80 shadow-lg shadow-black/40 ring-1 ring-primary/20 backdrop-blur-md">
          <div className="mx-auto flex h-18 items-center justify-between px-4 py-5 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-white shadow-md shadow-primary/30">
                <span className="material-icons text-base">code</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                ExplainMyCode
              </span>
            </div>
            <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
              <a
                href="#features"
                className="text-slate-100 transition-colors hover:text-primary"
              >
                Features
              </a>
              <a
                className="text-slate-100 transition-colors hover:text-primary"
                href="#"
              >
                Documentation
              </a>
              <a
                className="text-slate-100 transition-colors hover:text-primary"
                href="#"
              >
                Pricing
              </a>
              <button className="rounded-lg border border-white/30 px-4 py-2 font-semibold text-white transition-all hover:border-primary/60 hover:bg-white/10">
                Sign In
              </button>
              <button className="rounded-lg bg-gradient-to-r from-primary to-blue-500 px-4 py-2 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105">
                Get Started
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <span className="material-icons text-white">menu</span>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
