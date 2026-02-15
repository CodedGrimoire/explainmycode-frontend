"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Link from "next/link";
import AuthModal from "@/components/auth/AuthModal";
import { auth } from "@/lib/firebase";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<User | null>(null);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  const pathname = usePathname();
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001",
    []
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;
      try {
        await fetch(`${apiBase}/api/auth/sync-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email }),
        });
      } catch (err) {
        console.warn("User sync failed", err);
      }
    };
    syncUser();
  }, [user, apiBase]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authTrigger = params.get("auth");
    const redirect = params.get("redirect");
    if (authTrigger === "1") {
      requestAnimationFrame(() => {
        setModalOpen(true);
        setModalMode("signin");
        if (redirect) setRedirectAfterAuth(redirect);
      });
    }
  }, []);

  useEffect(() => {
    if (!modalOpen && redirectAfterAuth && user) {
      window.location.href = redirectAfterAuth;
    }
  }, [modalOpen, redirectAfterAuth, user]);

  const NavLink = ({
    href,
    label,
    active,
  }: {
    href: string;
    label: string;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={`transition-colors ${
        active
          ? "text-primary underline decoration-2 underline-offset-8"
          : "text-slate-100 hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-b-2xl border-b border-white/10 bg-[#0B1220]/80 shadow-lg shadow-black/40 ring-1 ring-primary/20 backdrop-blur-md">
            <div className="mx-auto flex h-18 items-center justify-between px-4 py-5 sm:px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-white shadow-md shadow-primary/30">
                  <span className="material-icons text-base">code</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  ExplainMyCode
                </span>
              </Link>
              <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
                <NavLink href="/" label="Home" active={pathname === "/"} />
                <NavLink href="/#explain" label="Explain" active={pathname === "/#explain"} />
                <NavLink href="/learn" label="Learn" active={pathname?.startsWith("/learn") || false} />
                <NavLink href="/history" label="History" active={pathname?.startsWith("/history") || false} />
                {user ? (
                  <>
                    <span className="text-slate-200">{user.email ?? "Account"}</span>
                    <button
                      onClick={() => signOut(auth)}
                      className="rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold text-white transition-all hover:border-primary/60 hover:bg-white/10"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="rounded-lg border border-white/30 px-4 py-2 font-semibold text-white transition-all hover:border-primary/60 hover:bg-white/10"
                      onClick={() => {
                        setModalMode("signin");
                        setModalOpen(true);
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className="rounded-lg bg-gradient-to-r from-primary to-blue-500 px-4 py-2 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105"
                      onClick={() => {
                        setModalMode("signup");
                        setModalOpen(true);
                      }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
              <div className="md:hidden flex items-center">
                <span className="material-icons text-white">menu</span>
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </div>
      </header>
      <AuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
      />
    </>
  );
};

export default Navbar;
