"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TerminalSquare, Home, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  const router = useRouter();

  // Framer motion variants for the glitch effect
  const glitchVariants = {
    animate: {
      x: [-2, 2, -1, 1, -2, 0],
      y: [1, -1, 2, -2, 1, 0],
      opacity: [0.5, 0.8, 0.4, 0.9, 0.5, 0.7],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "linear" as const,
        repeatDelay: 2, // Pauses between glitches
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#00F0FF]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden pt-24 pb-12">
        
        {/* --- Background Ambient Layers --- */}
        {/* Subtle Grid / "Matrix" Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }} 
        />
        
        {/* Core Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] sm:w-[800px] h-[500px] bg-[#FF1CF7]/[0.04] blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[100vw] sm:w-[400px] h-[400px] bg-[#00F0FF]/[0.06] blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        
        {/* Floating Orbital Rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 150, ease: "linear" }} className="w-[120vw] h-[120vw] sm:w-[80vw] sm:h-[80vw] max-w-[800px] max-h-[800px] border border-white/[0.03] rounded-full border-dashed" />
           <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 100, ease: "linear" }} className="absolute w-[90vw] h-[90vw] sm:w-[60vw] sm:h-[60vw] max-w-[600px] max-h-[600px] border border-white/[0.04] rounded-full" />
        </div>

        {/* --- Main Content --- */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-3xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 relative"
          >
            {/* Base 404 Text */}
            <h1 className="text-[150px] sm:text-[200px] md:text-[240px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800 relative z-10 select-none drop-shadow-2xl">
              404
            </h1>
            
            {/* Cyan Glitch Layer */}
            <motion.h1 
              variants={glitchVariants}
              animate="animate"
              className="absolute top-0 left-[-4px] text-[150px] sm:text-[200px] md:text-[240px] font-black leading-none tracking-tighter text-[#00F0FF] mix-blend-screen blur-[2px] select-none"
            >
              404
            </motion.h1>
            
            {/* Magenta Glitch Layer */}
            <motion.h1 
              variants={glitchVariants}
              animate="animate"
              style={{ animationDelay: '0.1s' }}
              className="absolute top-0 left-[4px] text-[150px] sm:text-[200px] md:text-[240px] font-black leading-none tracking-tighter text-[#FF1CF7] mix-blend-screen blur-[2px] select-none"
            >
              404
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            {/* Terminal Error Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <TerminalSquare size={14} className="text-red-400" />
              <span className="text-[11px] font-mono font-bold tracking-[0.15em] text-red-400 uppercase">
                ERR: Sector Not Found
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Lost in the Matrix.
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto font-light leading-relaxed mb-10 text-sm sm:text-base">
              The node you are trying to reach has either been archived, deleted, or never existed in this branch. Return to the global core to recalibrate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {/* Primary Sweep CTA */}
              <Link 
                href="/"
                className="group relative w-full sm:w-auto inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-8 font-bold text-black transition-all hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)]"
              >
                {/* Sweep Element */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)] z-0">
                  <div className="relative h-full w-12 bg-black/[0.15]" />
                </div>
                
                <span className="relative z-10 flex items-center gap-2">
                  <Home size={16} className="text-black" />
                  Return to Core
                </span>
              </Link>
              
              {/* Secondary CTA */}
              <button 
                onClick={() => router.back()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white font-medium text-sm hover:bg-white/[0.08] transition-all active:scale-[0.98] group"
              >
                <ArrowLeft size={16} className="text-zinc-400 group-hover:-translate-x-1 transition-transform" />
                Step Back
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}