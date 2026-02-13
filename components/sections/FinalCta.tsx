const FinalCta = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 p-12 text-center text-white shadow-2xl shadow-primary/40">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-icons text-[200px]">code</span>
          </div>
          <h2 className="relative z-10 mb-6 text-4xl font-extrabold">Ready to stop guessing?</h2>
          <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg text-blue-100">
            Join 50,000+ students and developers who use ExplainMyCode to master their craft.
          </p>
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-slate-100">
              Create Free Account
            </button>
            <button className="rounded-xl border border-white/20 bg-primary-dark/20 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10">
              Talk to Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
