"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Paths where Navbar and Footer should NOT be shown
  const isAuthPage = pathname === "/join" || pathname === "/signin" || pathname === "/community/signin";
  const isDashboardOrWorkspace = pathname?.startsWith("/dashboard") || pathname?.startsWith("/workspace");

  const hideLayout = isAuthPage || isDashboardOrWorkspace;

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}
