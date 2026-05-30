"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft } from "lucide-react";

function TerminalUI() {
  const router = useRouter();
  const [stage, setStage] = useState<"loading" | "printing" | "ready">("loading");
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Fetching ecosystem metadata...");
  const [logs, setLogs] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [username, setUsername] = useState("guest");
  
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs, progress, typedText, stage]);

  // Listen for Enter key to trigger handleRun
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === "ready" && e.key === "Enter" && typedText.trim() === "Register Now") {
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, typedText]);

  // Read username from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authUser = localStorage.getItem("devlinkhub_auth_user");
      if (authUser) {
        try {
          const parsed = JSON.parse(authUser);
          if (parsed.username) {
            setUsername(parsed.username);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Simulating npm downloading packages
  useEffect(() => {
    if (stage !== "loading") return;

    const loadingTexts = [
      "Connecting to npm registry.devlinkhub.org...",
      "Resolving dependency tree...",
      "Downloading devlinkhub-hackathon-utils v1.4.2...",
      "Extracting tarballs...",
      "Installing peer dependencies...",
      "Compiling native packages...",
      "Finalizing registry nodes..."
    ];

    let textIdx = 0;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          setStage("printing");
          return 100;
        }
        
        // Randomly update text
        if (next > (textIdx + 1) * 14 && textIdx < loadingTexts.length - 1) {
          textIdx++;
          setLoadingText(loadingTexts[textIdx]);
        }
        return next;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [stage]);

  // Log printing stage
  useEffect(() => {
    if (stage !== "printing") return;

    const systemLogs = [
      "✔ Installed devlinkhub-hackathon-workshop-suite successfully.",
      "✔ Linked library node configuration files.",
      "✔ Security audit passed: 0 vulnerabilities found.",
      "✔ Connected to DevLinkHub Core nodes on cluster devlinkhub-mainnet-4.",
      "Initializing hackathon registry environment...",
      "Starting DevLinkHub interactive console..."
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < systemLogs.length) {
        setLogs((prev) => [...prev, systemLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
        // Short delay before showing main terminal content
        setTimeout(() => {
          setStage("ready");
        }, 400);
      }
    }, 300);

    return () => clearInterval(logInterval);
  }, [stage]);

  // Typing animation for "Register Now"
  useEffect(() => {
    if (stage !== "ready") return;

    setTypedText("");

    const command = "Register Now";
    let charIdx = 0;
    let currentText = "";
    let typeInterval: NodeJS.Timeout;
    
    // Slight delay before typing starts
    const startTimeout = setTimeout(() => {
      typeInterval = setInterval(() => {
        if (charIdx < command.length) {
          currentText += command.charAt(charIdx);
          setTypedText(currentText);
          charIdx++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);
    }, 500);

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, [stage]);

  const handleRun = () => {
    if (stage !== "ready" || typedText.trim() !== "Register Now") return;
    router.push("/hackathon");
  };

  return (
    <div className="w-[85%] h-[75vh] border border-white/10 rounded-2xl bg-[#09090D] flex flex-col justify-between text-zinc-300 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
      {/* Glow highlight */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#FF1CF7]/5 via-transparent to-[#00F0FF]/5" />
      
      {/* ─── TERMINAL HEADER ─── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0D0D15] border-b border-white/10 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-xs text-zinc-500 select-none">
          bash - {username}@devlinkhub-core: ~/events
        </div>
        <div className="w-12" /> {/* spacer */}
      </div>

      {/* ─── TERMINAL BODY ─── */}
      <div ref={terminalBodyRef} className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none">
        {/* Stage 1: Loading npm packages */}
        {stage === "loading" && (
          <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 text-pink-500 text-xs md:text-sm">
              <span>$</span>
              <span>npm install --global devlinkhub-hackathon-workshop-suite</span>
            </div>
            
            <div className="space-y-2 text-zinc-400 text-xs md:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-t-pink-500 border-white/10 animate-spin" />
                <span className="text-zinc-300 font-bold">{loadingText}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>[</span>
                <span className="text-[#FF1CF7]">
                  {"#".repeat(Math.floor(progress / 5))}
                  {".".repeat(20 - Math.floor(progress / 5))}
                </span>
                <span>] {progress}%</span>
              </div>
            </div>
            <div className="text-zinc-600 text-[10px]">
              npm WARN deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
            </div>
          </div>
        )}

        {/* Stage 2: Print system initialization logs */}
        {stage === "printing" && (
          <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 text-pink-500 text-xs md:text-sm">
              <span>$</span>
              <span>npm install --global devlinkhub-hackathon-workshop-suite</span>
            </div>
            <div className="text-zinc-500 text-xs md:text-sm">
              ✔ Installed devlinkhub-hackathon-workshop-suite v1.4.2.
            </div>

            <div className="space-y-1 text-zinc-400 text-xs md:text-sm">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#00F0FF]">[-]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 3: Ready state - Centered big heading & paragraph */}
        {stage === "ready" && (
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#FFFF00] drop-shadow-[0_0_20px_rgba(0,255,255,0.9)] uppercase select-none animate-pulse">
              DEVLINKHUB HACKATHON & WORKSHOP
            </h2>
            
            <p className="text-zinc-300 font-light leading-relaxed max-w-3xl text-sm md:text-base px-4">
              DevLinkHub Hackathon & Workshop is the premier 48-hour global sprint for builders and creators.
              Collaborate on cutting-edge MVPs, attend technical masterclasses, and pitch directly to top venture partners.
            </p>
          </div>
        )}
      </div>

      {/* ─── TERMINAL PROMPT FOOTER ─── */}
      <div className="px-4 py-3 bg-[#0D0D15] border-t border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-4">
          <span className="text-[#00F0FF] shrink-0">{username}@devlinkhub-terminal:~$</span>
          {stage === "ready" ? (
            <div className="flex items-center text-white font-bold select-none truncate">
              <span>{typedText}</span>
              {showCursor && (
                <span className="ml-1 inline-block w-2 h-4 bg-[#00F0FF] animate-pulse" />
              )}
            </div>
          ) : (
            <span className="text-zinc-600 italic text-xs select-none">Executing tasks...</span>
          )}
        </div>

        <div>
          {stage === "ready" ? (
            <button
              onClick={handleRun}
              disabled={typedText.trim() !== "Register Now"}
              className="px-4 py-1.5 rounded bg-[#00F0FF] hover:bg-[#00D0EE] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CornerDownLeft size={12} className="stroke-[2.5]" />
              Run
            </button>
          ) : (
            <div className="w-5 h-5 rounded-full border border-t-white/80 border-white/10 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-300 font-sans selection:bg-[#FF1CF7]/30 overflow-hidden flex flex-col justify-center items-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[100vw] sm:w-[80vw] h-[500px] bg-[#FF1CF7]/[0.05] blur-[150px] rounded-full pointer-events-none" />
      </div>

      <main className="flex-1 relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-32 flex justify-center items-center">
        <TerminalUI />
      </main>
    </div>
  );
}