import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevLink — Premium Developer Community",
    template: "%s | DevLink",
  },
  description:
    "DevLink is the operating system for developers, startup founders, AI builders, and creators collaborating on real-world products, open-source systems, and next-generation startups.",
  keywords: [
    "developer community",
    "open source",
    "projects",
    "hackathons",
    "guilds",
    "startup",
    "AI builders",
  ],
  authors: [{ name: "DevLink" }],
  openGraph: {
    title: "DevLink — Premium Developer Community",
    description: "Build. Collaborate. Ship. Grow.",
    type: "website",
  },
  other: {
    "darkreader-lock": "true"
  }
};

export const viewport = {
  themeColor: "#030303",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased bg-[#030303] text-white">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}