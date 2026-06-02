"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X, Zap, ArrowRight, TerminalSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Community", href: "/community" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          navScrolled ? "py-4 px-4 sm:px-6" : "py-6 px-4 sm:px-8"
        }`}
      >
        <motion.div
          layout
          className={`max-w-[1280px] mx-auto flex items-center justify-between transition-all duration-500 relative overflow-hidden ${
            navScrolled
              ? "bg-[#050505]/70 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl px-5 sm:px-6 py-3"
              : "bg-transparent px-0 py-0 border-transparent shadow-none"
          }`}
        >
          {/* Subtle top glow when scrolled */}
          <AnimatePresence>
            {navScrolled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 relative z-10">
            <div className="relative h-7 flex items-center">
              <div className="absolute inset-0 bg-[#00F0FF]/0 group-hover:bg-[#00F0FF]/15 blur-xl transition-all duration-500 rounded-full" />
              <img
                src="/logos/DevLink_Text_Logo-white.png"
                alt="DevLink"
                className="relative h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-all duration-500"
                onError={(e) => { 
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-xl font-black text-white tracking-tighter">DEVLINK</span>')
                }}
              />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1.5 relative z-10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                    isActive
                      ? "text-black shadow-sm"
                      : "text-zinc-400 hover:text-black"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>

                  {/* Hover background pill */}
                  <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Active background pill & Underline glow */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-white"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTA & Utils ── */}
          <div className="hidden lg:flex items-center gap-4 relative z-10">
            <a
              href="https://github.com/devlinkhuborg"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200 border border-transparent hover:border-white/10"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>

            <div className="w-px h-5 bg-white/10" />

            <Link
              href="/signin"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all duration-200"
            >
              <TerminalSquare size={14} className="text-zinc-500" />
              Sign In
            </Link>

            {/* Premium Sweep CTA */}
            <Link
              href="/join"
              className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-white px-6 font-bold text-black transition-all hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)]"
            >
              {/* Sweep Element */}
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                <div className="relative h-full w-12 bg-black/[0.15]" />
              </div>
              
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={14} className="text-[#7B61FF]" fill="#7B61FF" />
                Join DevLinkHub
              </span>
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            id="mobile-menu-toggle"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden relative w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white hover:bg-white/[0.08] transition-all duration-200 active:scale-95 z-50"
            suppressHydrationWarning
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Cinematic Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-[#030303]/80 backdrop-blur-md lg:hidden"
            />

            {/* Premium 3D Drawer Entrance */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -20, rotateX: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, rotateX: -10, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              style={{ transformPerspective: 1000 }}
              className="fixed inset-x-4 top-24 z-50 lg:hidden transform-origin-top"
            >
              <div className="rounded-2xl bg-[#08080C] border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
                {/* Top glow line */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />

                <div className="p-4 flex flex-col gap-1.5">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05), duration: 0.3, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 group ${
                          pathname === link.href 
                            ? "bg-white text-black font-bold shadow-md"
                            : "text-zinc-400 hover:text-black hover:bg-white"
                        }`}
                      >
                        <span className="text-[15px]">{link.label}</span>
                        <ArrowRight size={16} className={`transition-all ${pathname === link.href ? "text-black" : "opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 text-black"}`} />
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="h-px bg-white/5 my-3 mx-2" 
                  />

                  {/* Mobile CTAs */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    className="flex flex-col gap-3 px-2 pb-2"
                  >
                    <Link
                      href="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-[15px] font-bold text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all border border-white/[0.05]"
                    >
                      <TerminalSquare size={16} className="text-zinc-400" />
                      Sign In
                    </Link>
                    
                    <Link
                      href="/join"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white text-black font-bold text-[15px] hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                    >
                      <Zap size={16} className="text-[#7B61FF]" fill="#7B61FF" />
                      Join DevLinkHub
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}