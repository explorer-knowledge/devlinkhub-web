"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, FolderKanban, CheckSquare,
  Trophy, Bell, Settings, Code2, ChevronRight, LogOut,
  Zap, GitBranch, Users
} from "lucide-react";

const navItems = [
  { label: "Overview",      href: "/dashboard",              icon: LayoutDashboard },
  { label: "My Projects",   href: "/dashboard/projects",     icon: FolderKanban },
  { label: "Tasks",         href: "/dashboard/tasks",        icon: CheckSquare },
  { label: "Leaderboard",   href: "/dashboard/leaderboard",  icon: Trophy },
  { label: "Notifications", href: "/dashboard/notifications",icon: Bell },
];
const bottomItems = [
  { label: "Settings",      href: "/dashboard/settings",     icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--surface)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--border)]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3ABEFF] to-[#60A5FA] flex items-center justify-center shadow-[0_0_12px_rgba(58,190,255,0.4)]">
          <Code2 size={14} className="text-black" />
        </div>
        <span className="font-bold text-base tracking-tight text-white">
          Dev<span className="gradient-text">Link</span>
        </span>
      </div>

      {/* User quick card */}
      <Link href="/dashboard/profile" className="mx-3 mt-4 mb-[10px] p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center gap-3 hover:bg-white/5 transition-colors group cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3ABEFF] to-[#60A5FA] flex items-center justify-center text-black font-bold text-sm">
          A
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate group-hover:text-[#3ABEFF] transition-colors">Alex Chen</p>
          <p className="text-xs text-[var(--muted)] truncate">Full-Stack Dev</p>
        </div>
        <ChevronRight size={14} className="text-[var(--muted)] ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === href 
                ? "bg-white text-black shadow-sm" 
                : "text-zinc-400 hover:bg-white hover:text-black"
            }`}
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}

        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] px-3 py-[5px] my-[4px]">
          Explore
        </p>
        <Link href="/projects" className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/projects' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white hover:text-black'}`}>
          <GitBranch size={18} className="shrink-0" /> <span className="truncate">Projects</span>
        </Link>
        <Link href="/guilds" className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/guilds' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white hover:text-black'}`}>
          <Users size={18} className="shrink-0" /> <span className="truncate">Guilds</span>
        </Link>
        <Link href="/hackathons" className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/hackathons' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:bg-white hover:text-black'}`}>
          <Zap size={18} className="shrink-0" /> <span className="truncate">Hackathons</span>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-[var(--border)] pt-3 flex flex-col gap-0.5">
        {bottomItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === href 
                ? "bg-white text-black shadow-sm" 
                : "text-zinc-400 hover:bg-white hover:text-black"
            }`}
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-[rgba(248,113,113,0.08)]">
          <LogOut size={18} className="shrink-0" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
