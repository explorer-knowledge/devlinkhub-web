"use client";

import { Search, Bell, Moon, Sun, Settings, ChevronRight, Home, CheckCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const routeMap: Record<string, string> = {
  "/": "Dashboard",
  "/events": "Events",
  "/registrations": "Registrations",
  "/members": "Members",
  "/team": "Team",
  "/speakers": "Speakers",
  "/partners": "Partners",
  "/certificates": "Certificates",
  "/analytics": "Analytics",
  "/finance": "Finance",
  "/cms": "CMS",
  "/resources": "Resources",
  "/settings": "Settings",
};

const notifications = [
  { id: 1, type: "registration", title: "4 new registrations pending", time: "2m ago", read: false },
  { id: 2, type: "member", title: "Sarah joined the community", time: "15m ago", read: false },
  { id: 3, type: "event", title: 'Event "DevFest 2025" is live', time: "1h ago", read: false },
  { id: 4, type: "payment", title: "Payment received from CodeCrafters", time: "3h ago", read: true },
  { id: 5, type: "system", title: "System backup completed", time: "6h ago", read: true },
];

export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  // Build breadcrumb segments
  const segments = pathname === "/" ? [] : pathname.split("/").filter(Boolean);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));

  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-30">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Home size={14} className="text-text-muted" />
        {segments.length === 0 ? (
          <span className="text-text-primary font-medium">Dashboard</span>
        ) : (
          <>
            <ChevronRight size={14} className="text-text-muted" />
            {segments.map((seg, i) => {
              const href = "/" + segments.slice(0, i + 1).join("/");
              const label = routeMap[href] || seg.charAt(0).toUpperCase() + seg.slice(1);
              const isLast = i === segments.length - 1;
              return (
                <span key={href} className="flex items-center gap-1.5">
                  {isLast ? (
                    <span className="font-semibold text-text-primary">{label}</span>
                  ) : (
                    <>
                      <span className="text-text-muted hover:text-text-primary cursor-pointer transition-colors">{label}</span>
                      <ChevronRight size={14} className="text-text-muted" />
                    </>
                  )}
                </span>
              );
            })}
          </>
        )}
      </nav>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-sm mx-6">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            className="block w-full pl-9 pr-10 py-1.5 border border-border rounded-lg text-sm bg-background/50 placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            placeholder="Search... (Cmd+K)"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors relative overflow-hidden"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={18} />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors relative"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface pulse-dot" />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl shadow-black/30 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-text-primary">Notifications</span>
                    {unread > 0 && <span className="badge-primary">{unread}</span>}
                  </div>
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors">
                    <CheckCheck size={12} /> Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border">
                  {notifs.map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer ${!n.read ? "bg-primary/[0.03]" : ""}`}>
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${n.read ? "text-text-muted" : "text-text-primary font-medium"}`}>{n.title}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{n.time}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setNotifs(prev => prev.filter(x => x.id !== n.id)); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-error transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-4 py-2.5">
                  <button className="text-xs text-primary hover:text-primary-dark transition-colors font-medium w-full text-center">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors">
          <Settings size={18} />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Avatar */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary p-[1.5px]">
            <div className="w-full h-full rounded-full bg-background overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Profile" className="w-full h-full rounded-full" />
            </div>
          </div>
          <div className="hidden md:block text-sm text-left">
            <p className="font-semibold text-text-primary leading-none text-xs">Admin</p>
            <p className="text-[10px] text-text-muted leading-none mt-0.5">Founder</p>
          </div>
        </button>
      </div>
    </header>
  );
}
