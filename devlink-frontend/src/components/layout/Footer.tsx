"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram, Youtube, ArrowRight, Zap, MapPin, Mail, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";

const FOOTER_LINKS = [
  {
    title: "Ecosystem",
    links: [
      { label: "Explore Projects", href: "/projects" },
      { label: "Active Guilds", href: "/guilds" },
      { label: "Hackathons", href: "/hackathons" },
      { label: "Events & Meetups", href: "/events" },
      { label: "Community Hub", href: "/community" },
      { label: "Builder Resources", href: "/resources" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { label: "Manage Projects", href: "/projects" },
      { label: "Active Sprints", href: "/sprints" },
      { label: "Task Tracking", href: "/tasks" },
      { label: "Manage Teams", href: "/teams" },
      { label: "User Onboarding", href: "/onboarding" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/mission" },
      { label: "Leadership", href: "/leadership" },
      { label: "The Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "DevLinkHub Blog", href: "/blog" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Join DevLinkHub", href: "/join" },
      { label: "Apply for Access", href: "/apply" },
      { label: "Join Waitlist", href: "/waitlist" },
      { label: "Partners", href: "/partners" },
      { label: "Sponsors", href: "/sponsors" },
      { label: "Referral Program", href: "/referral" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  { icon: Github, label: "GitHub", href: "https://github.com", hoverColor: "hover:text-white hover:border-white hover:bg-white/10" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com", hoverColor: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", hoverColor: "hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com", hoverColor: "hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com", hoverColor: "hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10" },
];

const STATUS_ITEMS = [
  { label: "API", status: "Operational" },
  { label: "WebSockets", status: "Operational" },
  { label: "CDN", status: "Operational" },
];

export default function HomeFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full relative overflow-hidden bg-[#030303] pt-12 sm:pt-20">
      {/* Top border gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent" />

      {/* Ambient Background Orbs */}
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-[#7B61FF]/[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-[-5%] w-[400px] h-[400px] bg-[#00F0FF]/[0.05] blur-[120px] rounded-full pointer-events-none" />

      {/* Cinematic Watermark */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none flex justify-center z-0 select-none opacity-80">
        <span className="text-[16vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.04] to-transparent">
          DEVLINKHUB
        </span>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {/* ── Elevated Newsletter CTA Card ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-[0_0_80px_rgba(0,240,255,0.03)] backdrop-blur-md relative overflow-hidden"
        >
          {/* Card internal glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20">
                <Zap size={14} className="text-[#00F0FF]" fill="#00F0FF" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#00F0FF] uppercase">
                  Weekly Drops
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Get the DevLinkHub digest.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#7B61FF]">
                  Top projects, events & builders.
                </span>
              </h3>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
            >
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-6 py-4 rounded-xl border border-[#00FFA3]/30 bg-[#00FFA3]/10 text-[#00FFA3] font-bold text-sm"
                >
                  ✔ You're in! Welcome to the network.
                </motion.div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:w-80 px-5 py-4 rounded-xl bg-black/50 border border-white/10 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all shadow-inner"
                    suppressHydrationWarning
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] whitespace-nowrap group"
                    suppressHydrationWarning
                  >
                    Subscribe
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>

        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-16 mb-16">
          
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3 flex flex-col space-y-8 lg:pr-12">
            <Link href="/" className="inline-flex items-center group">
              <img
                src="/logos/DevLink_Text_Logo-white.png"
                alt="DevLink"
                className="h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.2)] group-hover:drop-shadow-[0_0_24px_rgba(0,240,255,0.5)] transition-all duration-300"
                onError={(e) => { 
                  e.currentTarget.style.display = "none"; 
                  e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-2xl font-black text-white tracking-tighter">DEVLINK</span>')
                }}
              />
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              The premium developer network for real-world project building, open-source collaboration, and industry integration. Rooted in Central India, scaling globally.
            </p>

            <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
              <MapPin size={14} className="text-[#00F0FF]" />
              <span>Bhopal, India — Global Network</span>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 transition-all duration-300 ${social.hoverColor} group`}
                >
                  <social.icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="col-span-1 space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-[#00F0FF] transition-all duration-200 group flex items-center"
                    >
                      <span className="transform group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── System Status & Bottom Bar ── */}
        <div className="border-t border-white/10 pt-8 pb-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full lg:w-auto">
            <p className="text-sm text-zinc-500 text-center md:text-left">
              © {new Date().getFullYear()} DevLinkHub Community. All rights reserved.
            </p>
            
            {/* Legal Links Moved to Bottom Bar */}
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <Link href="/conduct" className="hover:text-zinc-300 transition-colors">Conduct</Link>
            </div>

            <a
              href="mailto:hello@devlinkhub.community"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              <Mail size={14} className="group-hover:text-[#00F0FF] transition-colors" />
              <span>hello@devlinkhub.community</span>
            </a>
          </div>

          {/* Terminal-style System Status */}
          <div className="w-full md:w-64 rounded-xl border border-white/5 bg-black/40 p-4 shadow-inner shrink-0">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
              <TerminalSquare size={12} className="text-zinc-500" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">System Status</p>
            </div>
            <div className="space-y-2">
              {STATUS_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.6)] group-hover:animate-pulse" />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#00FFA3]/80 group-hover:text-[#00FFA3] transition-colors">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}