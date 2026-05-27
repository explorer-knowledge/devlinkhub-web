import Sidebar from "@/components/layout/Sidebar";
import { Bell, Search, Settings, HelpCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Header */}
        <header className="h-16 shrink-0 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input 
                type="text" 
                placeholder="Search projects, members, tasks..." 
                className="w-full bg-black/20 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all">
              <HelpCircle size={20} />
            </button>
            <button className="p-2 rounded-lg text-[var(--muted)] hover:text-white hover:bg-white/5 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--surface)]" />
            </button>
            <div className="divider-v h-6 w-px bg-[var(--border)] mx-2" />
            <button className="flex items-center gap-2 pl-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3ABEFF] to-[#60A5FA] flex items-center justify-center text-black font-bold text-xs">
                A
              </div>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg)] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
