import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HackathonPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#FF1CF7]/30 overflow-hidden flex flex-col">
      <Navbar />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[100vw] sm:w-[80vw] h-[500px] bg-[#00F0FF]/[0.05] blur-[150px] rounded-full pointer-events-none" />
      </div>

      <main className="flex-1 relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-32">
        <div className="text-center space-y-6 mt-16">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#FFFF00] tracking-wider uppercase drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]">
            DevLink Hackathon
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Welcome to the DevLink Ecosystem Sprint. Registration confirmed. Let the coding begin.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
