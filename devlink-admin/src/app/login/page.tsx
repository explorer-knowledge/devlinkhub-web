"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Zap, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@devlink.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (email === "admin@devlink.com" && password === "admin123") {
        localStorage.setItem("admin-logged-in", "true");
        setIsLoading(false);
        router.replace("/");
      } else {
        setIsLoading(false);
        setError("Invalid administrator credentials. Access Denied.");
      }
    }, 850);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow meshes */}
      <div className="absolute top-1/4 left-1/4 w-[35%] h-[35%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35%] h-[35%] rounded-full bg-secondary/10 blur-[130px] pointer-events-none" />
      
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-8 border border-border/80 shadow-2xl relative z-10 bg-surface/30 backdrop-blur-md rounded-2xl"
      >
        {/* Header Logo & Subtitle */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 neon-glow mb-3">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="font-bold text-2xl text-text-primary tracking-tight">DevLink</h1>
          <p className="text-[10px] text-primary mt-1 font-mono uppercase tracking-widest font-bold">
            Admin Console Node
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 rounded-xl bg-error/10 border border-error/25 text-error text-xs font-semibold flex items-center gap-2.5"
          >
            <Shield size={15} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Credentials Form */}
        <form className="space-y-4.5" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 font-mono uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background/40 text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                placeholder="admin@devlink.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-secondary font-mono uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background/40 text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none shadow-lg shadow-primary/30 neon-glow transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating Node...
              </span>
            ) : (
              <>
                Access Admin Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Audit footer warning */}
        <div className="flex items-center justify-center gap-1.5 mt-8 text-[9px] text-text-muted font-mono uppercase tracking-wider">
          <AlertTriangle size={11} className="text-warning animate-pulse" />
          <span>Authorized Admin Access Only</span>
        </div>
      </motion.div>
    </div>
  );
}
