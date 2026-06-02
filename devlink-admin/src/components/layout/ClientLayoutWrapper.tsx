"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardLayout } from "./DashboardLayout";
import { ThemeProvider } from "@/lib/ThemeContext";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-logged-in") === "true";
    setIsAuthenticated(isLoggedIn);
    setLoading(false);

    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    } else if (isLoggedIn && pathname === "/login") {
      router.replace("/");
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated and trying to access a protected dashboard route, prevent render
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pathname === "/login") {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ThemeProvider>
  );
}
