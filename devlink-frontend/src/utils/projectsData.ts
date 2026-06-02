


export interface ProjectIssue {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  claimedBy?: string;
}

export interface ProjectOpening {
  id: string;
  role: string;
  commitment: string;
  equity: string;
}

export interface Project {
  id: string | number;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  tech: string[];
  stars: string | number;
  forks: string | number;
  contributors: number;
  status: string;
  color: string;
  githubUrl?: string;
  issues?: ProjectIssue[];
  openings?: ProjectOpening[];
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Nexus-AI",
    category: "AI/ML",
    description: "Distributed neural network training framework utilizing idle community compute clusters.",
    longDescription: "Nexus-AI is a decentralized machine learning protocol designed to aggregate spare GPU and TPU computing power from local systems. It uses specialized peer-to-peer verification protocols to ensure gradient descent weights are calculated correctly without trusting any single coordinator node.",
    tech: ["Python", "PyTorch", "Rust"],
    stars: "1.2k",
    forks: "340",
    contributors: 12,
    status: "Active Sprint",
    color: "#00F0FF",
    githubUrl: "https://github.com/devlink-labs/nexus-ai",
    issues: [
      { id: "nexus-issue-1", title: "Implement peer gradient validation algorithm", difficulty: "Hard", tags: ["Rust", "P2P"], claimedBy: "" },
      { id: "nexus-issue-2", title: "Add Docker Compose setup for worker nodes", difficulty: "Easy", tags: ["Docker"], claimedBy: "" }
    ],
    openings: [
      { id: "nexus-op-1", role: "Rust P2P Engineer", commitment: "15 hrs/wk", equity: "3% - 5%" }
    ]
  },
  {
    id: 2,
    name: "ChainForge",
    category: "Web3",
    description: "Zero-knowledge rollup architecture for instantaneous cross-chain asset bridging.",
    longDescription: "ChainForge compiles transaction batches into succinct zk-SNARK cryptographic proofs, enabling trustless cross-chain assets swap and data relays without high gas fees or long finality delays.",
    tech: ["Solidity", "Go", "TypeScript"],
    stars: "850",
    forks: "120",
    contributors: 8,
    status: "Beta Maint",
    color: "#FF1CF7",
    githubUrl: "https://github.com/devlink-labs/chainforge",
    issues: [
      { id: "forge-issue-1", title: "Optimize zk-proof verification gas costs", difficulty: "Hard", tags: ["Solidity", "Cryptography"], claimedBy: "" },
      { id: "forge-issue-2", title: "Refactor bridge widget UI with Tailwind HSL", difficulty: "Medium", tags: ["TypeScript", "Tailwind"], claimedBy: "" }
    ],
    openings: [
      { id: "forge-op-1", role: "Smart Contract Security Auditor", commitment: "10 hrs/wk", equity: "2% - 4%" }
    ]
  },
  {
    id: 3,
    name: "PayStream",
    category: "FinTech",
    description: "Real-time micro-transaction settlement engine for gig-economy platforms.",
    longDescription: "PayStream provides continuous, second-by-second micro-payments stream routing over high-throughput database backends, integrated with Stripe and custom ledger protocols.",
    tech: ["Rust", "PostgreSQL", "Kafka"],
    stars: "2.1k",
    forks: "512",
    contributors: 24,
    status: "Production",
    color: "#00FFA3",
    githubUrl: "https://github.com/devlink-labs/paystream",
    issues: [
      { id: "pay-issue-1", title: "Optimize Kafka consumer lag under spike load", difficulty: "Medium", tags: ["Kafka", "Rust"], claimedBy: "" }
    ],
    openings: [
      { id: "pay-op-1", role: "Database Optimization Lead", commitment: "20 hrs/wk", equity: "4% - 6%" }
    ]
  },
  {
    id: 4,
    name: "AuraUI",
    category: "Open Source",
    description: "Headless, accessible, and motion-first component library for modern React apps.",
    longDescription: "AuraUI provides developers with completely unstyled, keyboard-accessible primitives featuring fluid Framer Motion triggers to simplify creation of customized design systems.",
    tech: ["React", "Framer", "Tailwind"],
    stars: "4.5k",
    forks: "890",
    contributors: 45,
    status: "Active Dev",
    color: "#7B61FF",
    githubUrl: "https://github.com/devlink-labs/auraui",
    issues: [
      { id: "aura-issue-1", title: "Resolve keyboard trap inside dynamic popover", difficulty: "Medium", tags: ["React", "Accessibility"], claimedBy: "" },
      { id: "aura-issue-2", title: "Document telemetry interaction hooks", difficulty: "Easy", tags: ["Markdown"], claimedBy: "" }
    ],
    openings: [
      { id: "aura-op-1", role: "Technical Writer & DX Advocate", commitment: "5 hrs/wk", equity: "1% - 2%" }
    ]
  },
  {
    id: 5,
    name: "EdgeStore",
    category: "Infrastructure",
    description: "Global edge-caching database optimized for edge-function runtimes.",
    longDescription: "EdgeStore replicates key-value lookups globally with sub-millisecond propagation latency by mapping updates directly inside decentralized edge micro-servers.",
    tech: ["C++", "WASM", "Redis"],
    stars: "3.2k",
    forks: "410",
    contributors: 18,
    status: "Looking for Maintainers",
    color: "#FFB000",
    githubUrl: "https://github.com/devlink-labs/edgestore",
    issues: [
      { id: "edge-issue-1", title: "Build WASM builds pipeline using emscripten", difficulty: "Hard", tags: ["C++", "WASM"], claimedBy: "" }
    ],
    openings: [
      { id: "edge-op-1", role: "Systems Architect (C++/WASM)", commitment: "25 hrs/wk", equity: "5% - 8%" }
    ]
  },
  {
    id: 6,
    name: "SynthVoice",
    category: "AI/ML",
    description: "Open-source voice cloning and TTS engine running entirely in the browser.",
    longDescription: "SynthVoice compiles neural speech generation graphs down to browser-executable webassembly and WebAudio interfaces, guaranteeing total client-side privacy.",
    tech: ["JavaScript", "WebAudio", "TensorFlow.js"],
    stars: "920",
    forks: "185",
    contributors: 6,
    status: "Experimental",
    color: "#00F0FF",
    githubUrl: "https://github.com/devlink-labs/synthvoice",
    issues: [
      { id: "synth-issue-1", title: "Reduce model load sizes for mobile browsers", difficulty: "Hard", tags: ["TensorFlow.js", "AI"], claimedBy: "" }
    ],
    openings: [
      { id: "synth-op-1", role: "Speech DSP Engineer", commitment: "12 hrs/wk", equity: "2% - 5%" }
    ]
  }
];

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api`;

export async function getMergedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API projects service unavailable, using mock fallback", e);
  }

  if (typeof window === "undefined") {
    return INITIAL_PROJECTS;
  }
  
  const stored = localStorage.getItem("devlink_custom_projects");
  if (!stored) {
    localStorage.setItem("devlink_custom_projects", JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PROJECTS;
  }
}

export async function saveProjects(projects: Project[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("devlink_custom_projects", JSON.stringify(projects));
  }

  try {
    const lastProj = projects[projects.length - 1];
    if (lastProj && (typeof lastProj.id === "string" && lastProj.id.startsWith("proj-"))) {
      await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lastProj.name,
          category: lastProj.category,
          description: lastProj.description,
          longDescription: lastProj.longDescription,
          tech: lastProj.tech,
          color: lastProj.color,
          githubUrl: lastProj.githubUrl,
          // Auth token must be attached by calling component via Authorization header
        }),
      });
    }
  } catch (e) {
    console.error("Failed to sync project with backend:", e);
  }
}

