import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ExplainSection from "@/components/sections/ExplainSection";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Showcase from "@/components/sections/Showcase";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#050912] via-[#0a1424] to-[#050912] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="grid-pattern absolute inset-0" />
      </div>
      <div className="pointer-events-none absolute -left-24 top-32 h-96 w-96 rounded-full bg-primary/20 blur-[180px]" />
      <div className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-blue-600/25 blur-[150px]" />
      <Navbar />
      <main className="relative flex flex-col">
        <Hero />
        <ExplainSection />
        <Features />
        <Showcase />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
