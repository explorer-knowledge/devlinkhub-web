export interface StartupJob {
  id: string;
  role: string;
  salary: string;
  equity: string;
  type: string;
}

export interface Startup {
  id: string | number;
  name: string;
  tagline: string;
  description: string;
  sector: "AI" | "Web3" | "SaaS" | "DevTools" | "BioTech";
  stage: "Pre-seed" | "Seed" | "Series A" | "Bootstrapped";
  raised: string;
  teamSize: number;
  tech: string[];
  color: string;
  logoText: string;
  founder: {
    name: string;
    avatar: string;
    handle: string;
  };
  jobs?: StartupJob[];
}

export const INITIAL_STARTUPS: Startup[] = [
  {
    id: 1,
    name: "AetherLabs",
    tagline: "Autonomous neural agent swarms for developer automation.",
    description: "AetherLabs is building a peer-to-peer AI orchestration layer that allows developers to spawn task-specific autonomous agent nodes. These agents safely collaborate on software patches, security audits, and continuous deployments directly within local environments.",
    sector: "AI",
    stage: "Seed",
    raised: "$1.5M",
    teamSize: 6,
    tech: ["PyTorch", "Rust", "TypeScript"],
    color: "#00F0FF",
    logoText: "Æ",
    founder: {
      name: "Alex Rivers",
      avatar: "AR",
      handle: "arivers"
    },
    jobs: [
      { id: "aether-job-1", role: "AI Systems Engineer", salary: "$120k - $140k", equity: "1.0% - 2.5%", type: "Full-Time" },
      { id: "aether-job-2", role: "ML Ops Engineer", salary: "$100k - $120k", equity: "0.8% - 1.5%", type: "Full-Time" }
    ]
  },
  {
    id: 2,
    name: "Krypton",
    tagline: "Ultra-fast zero-knowledge layer 3 rollup consensus.",
    description: "Krypton designs zero-knowledge cryptographic proof relays to settle state transitions off-chain. By batching transaction signatures, it bridges assets across fragmented ecosystems with near-zero gas parameters.",
    sector: "Web3",
    stage: "Pre-seed",
    raised: "$500k",
    teamSize: 4,
    tech: ["Solidity", "Go", "Next.js"],
    color: "#FF1CF7",
    logoText: "Kr",
    founder: {
      name: "Zoey Chen",
      avatar: "ZC",
      handle: "zchen"
    },
    jobs: [
      { id: "krypton-job-1", role: "ZK Cryptographer", salary: "$110k - $130k", equity: "1.5% - 3.0%", type: "Full-Time" },
      { id: "krypton-job-2", role: "Smart Contract Developer", salary: "$90k - $110k", equity: "1.0% - 2.0%", type: "Part-Time" }
    ]
  },
  {
    id: 3,
    name: "CodeFlow",
    tagline: "Headless WASM build pipelines running inside edge runtimes.",
    description: "CodeFlow compiles software packages into standalone WASM binaries deployed globally across edge networks. It drastically cuts cloud cold starts to under 1ms, optimizing serverless endpoints.",
    sector: "DevTools",
    stage: "Bootstrapped",
    raised: "Bootstrapped",
    teamSize: 3,
    tech: ["Rust", "WASM", "React"],
    color: "#00FFA3",
    logoText: "Cf",
    founder: {
      name: "Marcus Vance",
      avatar: "MV",
      handle: "mvance"
    },
    jobs: [
      { id: "codeflow-job-1", role: "WASM Compiler Engineer", salary: "$85k - $105k", equity: "3.0% - 5.0%", type: "Full-Time" }
    ]
  },
  {
    id: 4,
    name: "NexusBio",
    tagline: "Computational genetic sequence simulation using CUDA arrays.",
    description: "NexusBio accelerates genomics research by mapping cellular mutations inside simulated high-performance computing clusters. It leverages custom GPU-accelerated algorithms to forecast drug response models.",
    sector: "BioTech",
    stage: "Series A",
    raised: "$5.2M",
    teamSize: 12,
    tech: ["Python", "CUDA", "PostgreSQL"],
    color: "#FFB000",
    logoText: "Nb",
    founder: {
      name: "Dr. Sarah Vance",
      avatar: "SV",
      handle: "svance"
    },
    jobs: [
      { id: "nexusbio-job-1", role: "Computational Biologist", salary: "$130k - $150k", equity: "0.5% - 1.2%", type: "Full-Time" }
    ]
  },
  {
    id: 5,
    name: "AuraSaaS",
    tagline: "Fluid telemetry metrics dashboards for remote teams.",
    description: "AuraSaaS integrates performance logging, calendar nodes, and async messaging dashboards under a unified collaborative design system. Designed specifically for next-gen developer networks.",
    sector: "SaaS",
    stage: "Seed",
    raised: "$1.2M",
    teamSize: 8,
    tech: ["Next.js", "Tailwind", "Prisma"],
    color: "#7B61FF",
    logoText: "Au",
    founder: {
      name: "Dave K.",
      avatar: "DK",
      handle: "davek"
    },
    jobs: [
      { id: "aurasaas-job-1", role: "Growth Frontend Engineer", salary: "$95k - $115k", equity: "0.5% - 1.0%", type: "Full-Time" },
      { id: "aurasaas-job-2", role: "Prisma Database Admin", salary: "$90k - $105k", equity: "0.4% - 0.8%", type: "Part-Time" }
    ]
  }
];

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api`;

export async function getMergedStartups(): Promise<Startup[]> {
  try {
    const res = await fetch(`${API_BASE}/startups`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API startups service unavailable, using mock fallback", e);
  }

  if (typeof window === "undefined") {
    return INITIAL_STARTUPS;
  }
  
  const stored = localStorage.getItem("devlink_custom_startups");
  if (!stored) {
    localStorage.setItem("devlink_custom_startups", JSON.stringify(INITIAL_STARTUPS));
    return INITIAL_STARTUPS;
  }
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_STARTUPS;
  }
}

export async function saveStartups(startups: Startup[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("devlink_custom_startups", JSON.stringify(startups));
  }

  try {
    const lastStartup = startups[startups.length - 1];
    if (lastStartup && (typeof lastStartup.id === "string" && lastStartup.id.startsWith("startup-"))) {
      await fetch(`${API_BASE}/startups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lastStartup.name,
          tagline: lastStartup.tagline,
          description: lastStartup.description,
          sector: lastStartup.sector,
          stage: lastStartup.stage,
          raised: lastStartup.raised,
          teamSize: lastStartup.teamSize,
          tech: lastStartup.tech,
          color: lastStartup.color,
          logoText: lastStartup.logoText,
          founderName: lastStartup.founder.name,
          founderAvatar: lastStartup.founder.avatar,
          founderHandle: lastStartup.founder.handle,
          jobs: lastStartup.jobs,
        }),
      });
    }
  } catch (e) {
    console.error("Failed to sync startup with backend:", e);
  }
}

