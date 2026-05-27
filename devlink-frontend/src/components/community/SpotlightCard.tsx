"use client";

import React from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}

export default function SpotlightCard({ children, className = "", accent = "#00F0FF" }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`relative group overflow-hidden bg-[#050505] border border-white/5 rounded-[2rem] transition-colors duration-500 hover:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, ${accent}15, transparent 40%)` }}
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
