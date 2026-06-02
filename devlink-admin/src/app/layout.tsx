import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevLink Admin Dashboard",
  description: "Premium Developer Community Management Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-background text-text-primary">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
