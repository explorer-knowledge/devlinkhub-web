"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/pages", label: "Pages Manager", icon: "📄" },
  { href: "/sections", label: "Sections", icon: "🗂️" },
  { href: "/events", label: "Events", icon: "🎫" },
  { href: "/announcements", label: "Announcements", icon: "📢" },
  { href: "/navigation", label: "Navigation", icon: "🔗" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("devlink_admin_auth");
    router.push("/");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF1CF7]/10 border border-[#FF1CF7]/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#FF1CF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-black text-white">DevLink</div>
            <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#FF1CF7]/10 text-[#FF1CF7] border border-[#FF1CF7]/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-white/[0.06] pt-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <span className="text-base w-5 text-center">🚪</span>
          Logout
        </button>
        <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mt-3 px-3">v1.0.0 · DevLink Admin</p>
      </div>
    </aside>
  );
}
