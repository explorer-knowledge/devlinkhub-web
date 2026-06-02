"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCheck,
  ShieldCheck,
  Mic2,
  Handshake,
  Award,
  BarChart3,
  Wallet,
  FileText,
  Files,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";

const navSections = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Events", href: "/events", icon: CalendarDays },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Registrations", href: "/registrations", icon: UserCheck, badge: 4 },
      { name: "Team", href: "/team", icon: ShieldCheck },
      { name: "Speakers", href: "/speakers", icon: Mic2 },
      { name: "Partners", href: "/partners", icon: Handshake },
      { name: "Certificates", href: "/certificates", icon: Award },
    ],
  },
  {
    label: "Finance & Content",
    items: [
      { name: "Finance", href: "/finance", icon: Wallet },
      { name: "CMS", href: "/cms", icon: FileText },
      { name: "Resources", href: "/resources", icon: Files },
    ],
  },
  {
    label: "Config",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin-logged-in");
    router.replace("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 border-r border-border bg-surface/50 backdrop-blur-xl flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-text-primary leading-none">DevLink</span>
                <p className="text-[10px] text-text-muted leading-none mt-0.5">Admin Console</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20"
            >
              <Zap size={16} />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors shrink-0",
            collapsed && "absolute -right-3 top-[18px] bg-surface border border-border rounded-full shadow-lg z-50"
          )}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="nav-section-label">{section.label}</p>
            )}
            {collapsed && <div className="mt-3" />}

            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group mb-0.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-7 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon
                    size={18}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"
                    )}
                  />
                  {!collapsed && (
                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden flex-1">
                      {item.name}
                    </span>
                  )}
                  {!collapsed && "badge" in item && item.badge && (
                    <span className="badge-warning min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && "badge" in item && item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center text-[9px] font-bold text-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-border p-3 shrink-0">
        <div
          onClick={collapsed ? handleLogout : undefined}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer group",
            collapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-primary p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-background overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Profile"
                className="w-full h-full"
              />
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary leading-none truncate">Admin</p>
              <p className="text-xs text-text-muted leading-none mt-0.5 truncate">admin@devlink.com</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-text-muted hover:text-error cursor-pointer"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
