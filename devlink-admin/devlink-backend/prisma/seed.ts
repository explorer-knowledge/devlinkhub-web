import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Devlink database...");

  // Create default admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@devlink.com" },
    update: {},
    create: {
      name: "Devlink Admin",
      username: "admin",
      email: "admin@devlink.com",
      passwordHash: adminPasswordHash,
      role: "Administrator",
      bio: "Root administrator for the Devlink platform node.",
      skills: JSON.stringify(["Systems", "Management", "Operations"]),
    },
  });
  console.log("Created admin user:", admin.username);

  // Create standard user "Alex" (mock user from dashboard)
  const alexPasswordHash = await bcrypt.hash("alex123", 10);
  const alexUser = await prisma.user.upsert({
    where: { email: "alex@devlink.com" },
    update: {},
    create: {
      name: "Alex Mercer",
      username: "alex_j",
      email: "alex@devlink.com",
      passwordHash: alexPasswordHash,
      role: "Fullstack Developer",
      bio: "Ex-Stripe engineer building peer-to-peer developer coordination channels.",
      skills: JSON.stringify(["Next.js", "TypeScript", "TailwindCSS", "Node.js", "Rust"]),
      githubUrl: "https://github.com/alex_j",
      avatar: "AM",
    },
  });
  console.log("Created default user Alex:", alexUser.username);

  // Create some other mock users for builders/collaborators
  const usersData = [
    { name: "Sarah Chen", username: "sarah_ux", email: "sarah@devlink.com", role: "Product Designer", skills: ["Figma", "Design Systems", "Tailwind"], avatar: "SC", bio: "Designing rich SaaS tools & interactive dashboards." },
    { name: "Pawan Kumar", username: "0xPawan", email: "pawan@devlink.com", role: "Web3 Developer", skills: ["Solidity", "TypeScript", "Ethers.js"], avatar: "PK", bio: "Solidity explorer auditing consensus mechanisms." },
    { name: "Rohit K.", username: "rohit_codes", email: "rohit@devlink.com", role: "AI Engineer", skills: ["Python", "PyTorch", "LangChain", "FastAPI"], avatar: "RK", bio: "Building autonomous agents for finance nodes." },
    { name: "Aanya S.", username: "aanya_design", email: "aanya@devlink.com", role: "UI/UX Designer", skills: ["Figma", "Design Systems", "Web3"], avatar: "AS", bio: "Designing modern multiplayer spaces." },
    { name: "Nikhil P.", username: "nikhil_dev", email: "nikhil@devlink.com", role: "Fullstack Developer", skills: ["TypeScript", "Next.js", "PostgreSQL"], avatar: "NP", bio: "Hacker building visual pipeline structures." },
    { name: "Meera R.", username: "meera_rust", email: "meera@devlink.com", role: "Systems Engineer", skills: ["Rust", "WASM", "Go"], avatar: "MR", bio: "Rustacean optimizing database queries." },
  ];

  for (const u of usersData) {
    const pHash = await bcrypt.hash("password123", 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        username: u.username,
        email: u.email,
        passwordHash: pHash,
        role: u.role,
        skills: JSON.stringify(u.skills),
        avatar: u.avatar,
        bio: u.bio,
        githubUrl: `https://github.com/${u.username}`,
      },
    });
  }

  // Seed projects
  const projects = [
    {
      name: "Nexus-AI",
      category: "AI/ML",
      description: "Distributed neural network training framework utilizing idle community compute clusters.",
      longDescription: "Nexus-AI is a decentralized machine learning protocol designed to aggregate spare GPU and TPU computing power from local systems. It uses specialized peer-to-peer verification protocols to ensure gradient descent weights are calculated correctly without trusting any single coordinator node.",
      tech: ["Python", "PyTorch", "Rust"],
      stars: 1240,
      forks: 340,
      contributors: 12,
      status: "Active Sprint",
      color: "#00F0FF",
      githubUrl: "https://github.com/devlink-labs/nexus-ai",
      username: "alex_j",
      issues: [
        { title: "Implement peer gradient validation algorithm", difficulty: "Hard", tags: ["Rust", "P2P"] },
        { title: "Add Docker Compose setup for worker nodes", difficulty: "Easy", tags: ["Docker"] }
      ],
      openings: [
        { role: "Rust P2P Engineer", commitment: "15 hrs/wk", equity: "3% - 5%" }
      ]
    },
    {
      name: "ChainForge",
      category: "Web3",
      description: "Zero-knowledge rollup architecture for instantaneous cross-chain asset bridging.",
      longDescription: "ChainForge compiles transaction batches into succinct zk-SNARK cryptographic proofs, enabling trustless cross-chain assets swap and data relays without high gas fees or long finality delays.",
      tech: ["Solidity", "Go", "TypeScript"],
      stars: 850,
      forks: 120,
      contributors: 8,
      status: "Beta Maint",
      color: "#FF1CF7",
      githubUrl: "https://github.com/devlink-labs/chainforge",
      username: "sarah_ux",
      issues: [
        { title: "Optimize zk-proof verification gas costs", difficulty: "Hard", tags: ["Solidity", "Cryptography"] },
        { title: "Refactor bridge widget UI with Tailwind HSL", difficulty: "Medium", tags: ["TypeScript", "Tailwind"] }
      ],
      openings: [
        { role: "Smart Contract Security Auditor", commitment: "10 hrs/wk", equity: "2% - 4%" }
      ]
    },
    {
      name: "PayStream",
      category: "FinTech",
      description: "Real-time micro-transaction settlement engine for gig-economy platforms.",
      longDescription: "PayStream provides continuous, second-by-second micro-payments stream routing over high-throughput database backends, integrated with Stripe and custom ledger protocols.",
      tech: ["Rust", "PostgreSQL", "Kafka"],
      stars: 2100,
      forks: 512,
      contributors: 24,
      status: "Production",
      color: "#00FFA3",
      githubUrl: "https://github.com/devlink-labs/paystream",
      username: "alex_j",
      issues: [
        { title: "Optimize Kafka consumer lag under spike load", difficulty: "Medium", tags: ["Kafka", "Rust"] }
      ],
      openings: [
        { role: "Database Optimization Lead", commitment: "20 hrs/wk", equity: "4% - 6%" }
      ]
    },
    {
      name: "AuraUI",
      category: "Open Source",
      description: "Headless, accessible, and motion-first component library for modern React apps.",
      longDescription: "AuraUI provides developers with completely unstyled, keyboard-accessible primitives featuring fluid Framer Motion triggers to simplify creation of customized design systems.",
      tech: ["React", "Framer", "Tailwind"],
      stars: 4500,
      forks: 890,
      contributors: 45,
      status: "Active Dev",
      color: "#7B61FF",
      githubUrl: "https://github.com/devlink-labs/auraui",
      username: "sarah_ux",
      issues: [
        { title: "Resolve keyboard trap inside dynamic popover", difficulty: "Medium", tags: ["React", "Accessibility"] },
        { title: "Document telemetry interaction hooks", difficulty: "Easy", tags: ["Markdown"] }
      ],
      openings: [
        { role: "Technical Writer & DX Advocate", commitment: "5 hrs/wk", equity: "1% - 2%" }
      ]
    },
    {
      name: "EdgeStore",
      category: "Infrastructure",
      description: "Global edge-caching database optimized for edge-function runtimes.",
      longDescription: "EdgeStore replicates key-value lookups globally with sub-millisecond propagation latency by mapping updates directly inside decentralized edge micro-servers.",
      tech: ["C++", "WASM", "Redis"],
      stars: 3200,
      forks: 410,
      contributors: 18,
      status: "Looking for Maintainers",
      color: "#FFB000",
      githubUrl: "https://github.com/devlink-labs/edgestore",
      username: "alex_j",
      issues: [
        { title: "Build WASM builds pipeline using emscripten", difficulty: "Hard", tags: ["C++", "WASM"] }
      ],
      openings: [
        { role: "Systems Architect (C++/WASM)", commitment: "25 hrs/wk", equity: "5% - 8%" }
      ]
    },
    {
      name: "SynthVoice",
      category: "AI/ML",
      description: "Open-source voice cloning and TTS engine running entirely in the browser.",
      longDescription: "SynthVoice compiles neural speech generation graphs down to browser-executable webassembly and WebAudio interfaces, guaranteeing total client-side privacy.",
      tech: ["JavaScript", "WebAudio", "TensorFlow.js"],
      stars: 920,
      forks: 185,
      contributors: 6,
      status: "Experimental",
      color: "#00F0FF",
      githubUrl: "https://github.com/devlink-labs/synthvoice",
      username: "alex_j",
      issues: [
        { title: "Reduce model load sizes for mobile browsers", difficulty: "Hard", tags: ["TensorFlow.js", "AI"] }
      ],
      openings: [
        { role: "Speech DSP Engineer", commitment: "12 hrs/wk", equity: "2% - 5%" }
      ]
    }
  ];

  for (const p of projects) {
    const dbOwner = await prisma.user.findFirst({ where: { username: p.username } });
    const createdProj = await prisma.project.create({
      data: {
        name: p.name,
        category: p.category,
        description: p.description,
        longDescription: p.longDescription,
        tech: JSON.stringify(p.tech),
        stars: p.stars,
        forks: p.forks,
        contributors: p.contributors,
        status: p.status,
        color: p.color,
        githubUrl: p.githubUrl,
        userId: dbOwner?.id,
      },
    });

    for (const issue of p.issues) {
      await prisma.projectIssue.create({
        data: {
          projectId: createdProj.id,
          title: issue.title,
          difficulty: issue.difficulty,
          tags: JSON.stringify(issue.tags),
        },
      });
    }

    for (const opening of p.openings) {
      await prisma.projectOpening.create({
        data: {
          projectId: createdProj.id,
          role: opening.role,
          commitment: opening.commitment,
          equity: opening.equity,
        },
      });
    }
  }
  console.log("Projects seeded!");

  // Seed startups
  const startups = [
    {
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
      founderName: "Alex Rivers",
      founderAvatar: "AR",
      founderHandle: "arivers",
      jobs: [
        { role: "AI Systems Engineer", salary: "$120k - $140k", equity: "1.0% - 2.5%", type: "Full-Time" },
        { role: "ML Ops Engineer", salary: "$100k - $120k", equity: "0.8% - 1.5%", type: "Full-Time" }
      ]
    },
    {
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
      founderName: "Zoey Chen",
      founderAvatar: "ZC",
      founderHandle: "zchen",
      jobs: [
        { role: "ZK Cryptographer", salary: "$110k - $130k", equity: "1.5% - 3.0%", type: "Full-Time" },
        { role: "Smart Contract Developer", salary: "$90k - $110k", equity: "1.0% - 2.0%", type: "Part-Time" }
      ]
    },
    {
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
      founderName: "Marcus Vance",
      founderAvatar: "MV",
      founderHandle: "mvance",
      jobs: [
        { role: "WASM Compiler Engineer", salary: "$85k - $105k", equity: "3.0% - 5.0%", type: "Full-Time" }
      ]
    },
    {
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
      founderName: "Dr. Sarah Vance",
      founderAvatar: "SV",
      founderHandle: "svance",
      jobs: [
        { role: "Computational Biologist", salary: "$130k - $150k", equity: "0.5% - 1.2%", type: "Full-Time" }
      ]
    },
    {
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
      founderName: "Dave K.",
      founderAvatar: "DK",
      founderHandle: "davek",
      jobs: [
        { role: "Growth Frontend Engineer", salary: "$95k - $115k", equity: "0.5% - 1.0%", type: "Full-Time" },
        { role: "Prisma Database Admin", salary: "$90k - $105k", equity: "0.4% - 0.8%", type: "Part-Time" }
      ]
    }
  ];

  for (const s of startups) {
    const createdStartup = await prisma.startup.create({
      data: {
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        sector: s.sector,
        stage: s.stage,
        raised: s.raised,
        teamSize: s.teamSize,
        tech: JSON.stringify(s.tech),
        color: s.color,
        logoText: s.logoText,
        founderName: s.founderName,
        founderAvatar: s.founderAvatar,
        founderHandle: s.founderHandle,
      },
    });

    for (const job of s.jobs) {
      await prisma.startupJob.create({
        data: {
          startupId: createdStartup.id,
          role: job.role,
          salary: job.salary,
          equity: job.equity,
          type: job.type,
        },
      });
    }
  }
  console.log("Startups seeded!");

  // Seed events
  const featuredEvent = {
    id: "syntax-weavers-inaugural-sprint",
    title: "Syntax Weavers: Inaugural Sprint",
    desc: "Join our very first 48-hour global hackathon. Form teams, build an MVP using the latest AI and Web frameworks, and compete for community bounties.",
    longDesc: "Syntax Weavers is the inaugural global development sprint hosted by DevLink. Over 48 hours, developers, designers, and AI engineers from around the world will form guilds and build production-ready MVPs. The focus is on combining modern Web frameworks (Next.js, Vite) with AI/ML tools (LLMs, Vector databases, edge functions) to build tools that solve developer workflow challenges. Top submissions will be integrated into the DevLink ecosystem, receive dedicated community funding, and earn exclusive Developer Guild credentials.",
    date: "October 22-24, 2026",
    time: "Kickoff at 10:00 AM IST",
    location: "Virtual (Discord & YouTube Live)",
    type: "Global Hackathon",
    color: "#FF1CF7",
    tags: ["AI/ML", "Next.js", "Open Source"],
    status: "open",
    capacity: 250,
    requirements: ["GitHub Account", "Next.js or React familiarity", "Discord verified handle"],
    speakers: [
      { name: "Arjun Mehta", role: "DevLink Tech Lead", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop", bio: "Former staff engineer at Vercel, now driving execution culture at DevLink." },
      { name: "Sarah Chen", role: "AI Developer Advocate", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", bio: "AI researcher specialized in open-weights model fine-tuning and browser-based inference." }
    ],
    agenda: [
      { time: "Day 1 - 10:00 AM IST", title: "Kickoff & Guild Formation", description: "Introduction to the sprint requirements, review of APIs, and live networking to form teams.", speaker: "Arjun Mehta" },
      { time: "Day 1 - 02:00 PM IST", title: "AI Stack Workshop", description: "A fast-paced guide on integrating vector indices, edge runtime cache, and state variables.", speaker: "Sarah Chen" },
      { time: "Day 2 - 12:00 PM IST", title: "Mid-Sprint Checkpoint", description: "Guild progress showcase, live debugging session with mentors, and telemetry check.", speaker: "Arjun Mehta" },
      { time: "Day 3 - 10:00 AM IST", title: "Submission & Demos", description: "DevLink deployment portal freezes. Live 3-minute video pitches play back in Discord.", speaker: "Sarah Chen" }
    ]
  };

  const upcomingEvents = [
    {
      id: "ai-agriculture-summit-2026",
      title: "AI Agriculture Summit",
      date: "Nov 05",
      month: "NOV",
      time: "2:00 PM IST",
      location: "Virtual Audio Stage",
      type: "Workshop",
      color: "#00FFA3",
      desc: "A deep dive into how AI and precision tech are reshaping agriculture, featuring core maintainers.",
      longDesc: "An exploratory virtual summit discussing modern deep learning applications in smart farming. We'll explore precision soil sensors data modeling, automated pest detection using vision transformers, and autonomous harvest route planning. A special workshop will guide participants on using the open-source AgriNet model weights on edge devices.",
      status: "open",
      capacity: 500,
      requirements: ["Python basics", "Curiosity for IoT and environmental modeling"],
      tags: ["AgriTech", "AI/ML", "Hardware"],
      speakers: [
        { name: "Dr. Elena Rostova", role: "AgriTech Researcher", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop", bio: "Associate Professor working on climate-adaptive machine learning models." }
      ],
      agenda: [
        { time: "02:00 PM IST", title: "Opening Keynote: Precision Farms", description: "How satellite imagery and custom autoencoders predict soil hydration and nitrogen levels.", speaker: "Dr. Elena Rostova" },
        { time: "03:30 PM IST", title: "AgriNet Weights Hands-on", description: "Deploying PyTorch models to Raspberry Pi nodes using WebAssembly compilations.", speaker: "Dr. Elena Rostova" }
      ]
    },
    {
      id: "open-source-contrib-night-nov",
      title: "Open Source Contrib Night",
      date: "Nov 12",
      month: "NOV",
      time: "8:00 PM IST",
      location: "Discord Voice Channel",
      type: "Community Meetup",
      color: "#00F0FF",
      desc: "Live pairing session. We will walk through 'Good First Issues' on the DevLink repo and merge PRs live.",
      longDesc: "Join the core maintainers of DevLink for a high-velocity programming session. We will examine the current product roadmap, triage active bug reports, walk through our custom design systems, and pair-program live to resolve Github issues. All merged pull requests during this session receive specialized community contributor badges.",
      status: "open",
      capacity: 100,
      requirements: ["Git / GitHub basic setup", "React & CSS familiarity"],
      tags: ["Git", "React", "TypeScript"],
      speakers: [
        { name: "DevLink Core Bot", role: "Registry System", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop", bio: "Automated DevOps bot summarizing pull request statistics and test coverage." }
      ],
      agenda: [
        { time: "08:00 PM IST", title: "Codebase Architecture Tour", description: "A quick overview of our Next.js App directory, styling directives, and Tailwind themes.", speaker: "DevLink Core Bot" },
        { time: "08:30 PM IST", title: "Issue Claiming & Live Pairing", description: "Claim an issue from our backlog and build a solution live with one-on-one maintainer support.", speaker: "DevLink Core Bot" }
      ]
    },
    {
      id: "founders-pitch-session-q4",
      title: "Founders Pitch Session",
      date: "Nov 20",
      month: "NOV",
      time: "6:30 PM IST",
      location: "Virtual Video Stage",
      type: "Startup Event",
      color: "#F59E0B",
      desc: "Early-stage founders from the ecosystem present their MVPs to the community and engineering guilds.",
      longDesc: "Watch the next wave of developer tooling, cloud infrastructure, and AI automation startups pitch their early MVPs. Founders get 5 minutes to demo their product directly to the DevLink community, followed by live technical Q&A from our engineering guild masters. Perfect for developers looking to join early-stage teams or founders seeking early technical feedback.",
      status: "open",
      capacity: 300,
      requirements: ["Interest in startups", "Developer tooling insights"],
      tags: ["Startup", "Funding", "Product Demo"],
      speakers: [
        { name: "Marcus Vance", role: "Venture Guild Lead", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop", bio: "Partner at Guild Ventures focusing on developer tooling and open-source infrastructure." }
      ],
      agenda: [
        { time: "06:30 PM IST", title: "Introduction & Pitch Protocol", description: "Overview of DevLink Venture Guild initiatives and presentation formats.", speaker: "Marcus Vance" }
      ]
    }
  ];

  const pastEvents = [
    {
      id: "genesis-meetup-bhopal",
      title: "DevLink Genesis Meetup",
      date: "April 15, 2026",
      location: "Bhopal IT Park Node",
      type: "Local Meetup",
      color: "#00F0FF",
      photosCount: 42,
      videoRecap: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      desc: "The very first gathering of DevLink early adopters. We mapped out the core architecture, established the initial open-source guilds, and formed foundational teams.",
      longDesc: "On April 15, 2026, the Bhopal IT Park Node hosted the historic first offline gathering of DevLink developers. Over 50 engineers gathered to talk about decentralizing developer networks and startup funding. We brainstormed the core schema of DevLink, built the initial wireframes, launched our local open-source guilds, and enjoyed pizza and code in equal measure. This event set the cultural foundation of extreme execution and high-performance engineering that defines DevLink today.",
      status: "completed",
      tags: ["Community", "Meetup", "Bhopal"],
      images: [
        "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop"
      ],
      stats: { attendees: 52, projectsBuilt: 2, commitsLine: "89 commits merged", linesOfCode: "12k lines" },
      speakers: [
        { name: "Rishi Raj", role: "Node Coordinator", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", bio: "Full-stack engineer managing the Bhopal Node developer community." }
      ],
      agenda: [
        { time: "10:00 AM", title: "Decentralized Networks Keynote", description: "Rethinking the developer resume and startup pitch as transparent, peer-verified graphs.", speaker: "Rishi Raj" }
      ],
      projects: [
        { name: "DevLink Web UI Base", description: "The initial Next.js boilerplate and Tailwind config designed at the meetup.", link: "#", contributors: ["@rishi", "@nikhil"] }
      ]
    },
    {
      id: "vaitra-core-health-sprint",
      title: "Vaitra Core Health Sprint",
      date: "March 02, 2026",
      location: "Virtual Stage",
      type: "Mini-Sprint",
      color: "#FF5F56",
      photosCount: 18,
      videoRecap: false,
      desc: "A focused weekend sprint where community members contributed to the Vaitra healthcare platform, building out doctor listings and medicine tracking schemas.",
      longDesc: "Vaitra is a healthcare application built under the DevLink community incubator. Over a 48-hour period, a specialized team of 20 developers held a focused sprint to implement an doctor doctor matching listings listings schema.",
      status: "completed",
      tags: ["HealthTech", "Next.js", "Sprint"],
      images: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
      ],
      stats: { attendees: 21, projectsBuilt: 1, commitsLine: "142 commits", linesOfCode: "24k lines" },
      speakers: [
        { name: "Dr. Amit Verma", role: "Vaitra Creator", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop", bio: "Cardiologist turned software architect." }
      ],
      agenda: [
        { time: "09:00 AM", title: "Health Data Compliance", description: "Compliance overview.", speaker: "Dr. Amit Verma" }
      ],
      projects: [
        { name: "Doctor Matcher Engine", description: "Algorithm for doctors matching.", link: "#", contributors: ["@docverma"] }
      ]
    }
  ];

  const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];

  for (const e of allEvents) {
    const createdEvent = await prisma.event.create({
      data: {
        id: e.id,
        title: e.title,
        desc: e.desc,
        longDesc: e.longDesc,
        date: e.date,
        month: (e as any).month || null,
        time: (e as any).time || null,
        location: e.location,
        type: e.type,
        color: e.color,
        tags: JSON.stringify(e.tags),
        capacity: (e as any).capacity || 100,
        requirements: JSON.stringify((e as any).requirements || []),
        status: e.status,
        photosCount: e.photosCount || 0,
        videoRecap: e.videoRecap || false,
        videoUrl: e.videoUrl || null,
        images: JSON.stringify(e.images || []),
        attendeesCount: e.stats?.attendees || 0,
        projectsBuilt: e.stats?.projectsBuilt || 0,
        commitsLine: e.stats?.commitsLine || null,
        linesOfCode: e.stats?.linesOfCode || null,
      },
    });

    for (const speaker of (e as any).speakers || []) {
      await prisma.eventSpeaker.create({
        data: {
          eventId: createdEvent.id,
          name: speaker.name,
          role: speaker.role,
          avatar: speaker.avatar,
          bio: speaker.bio,
        },
      });
    }

    for (const agenda of (e as any).agenda || []) {
      await prisma.eventAgenda.create({
        data: {
          eventId: createdEvent.id,
          time: agenda.time,
          title: agenda.title,
          description: agenda.description,
          speaker: agenda.speaker,
        },
      });
    }

    for (const proj of (e as any).projects || []) {
      await prisma.eventProject.create({
        data: {
          eventId: createdEvent.id,
          name: proj.name,
          description: proj.description,
          link: proj.link,
          contributors: JSON.stringify(proj.contributors || []),
        },
      });
    }
  }
  console.log("Events seeded!");

  // Seed inquiries
  const inquiries = [
    {
      name: "Dr. Sarah Chen",
      email: "schen@mit.edu",
      category: "PARTNERSHIPS",
      subject: "University Lab Collaboration Proposal",
      message: "Hello DevLink team, we are interested in setting up a joint AI Hackathon and research incubator with MIT's EECS department. Let us know who we should sync with to draft the collaboration framework.",
      organization: "MIT CSAIL",
      status: "New",
      replies: []
    },
    {
      name: "Alex Mercer",
      email: "alex@polygon.vc",
      category: "SPONSORSHIPS",
      subject: "Sponsoring summer developer tracks",
      message: "We've been tracking DevLink's builder community for a while. We would love to sponsor your next ecosystem program and open-source hackathons. Do you have a sponsorship deck or pricing structures for Q3/Q4?",
      organization: "Polygon Ventures",
      status: "In Progress",
      replies: [
        {
          sender: "DevLink System Node",
          text: "Hi Alex, thank you for reaching out! We are currently assembling our Q3 Hackathon sponsor guide and would be thrilled to talk. Our relations lead will reach out to you within 24 hours."
        }
      ]
    },
    {
      name: "Elena Rostova",
      email: "elena@rust.dev",
      category: "SUPPORT",
      subject: "Account validation failure on onboarding",
      message: "Hey, I am trying to complete my onboarding profile, but the verification process keeps timing out when attempting to scan my Github key signature. Is there a manual review process?",
      organization: "Independent Builder",
      status: "Resolved",
      replies: [
        {
          sender: "DevLink Core",
          text: "Hey Elena! We noticed an API rate-limit issue with the GitHub keys API earlier today. We have resolved the timeout block. Could you try verifying your key signature again? Feel free to ping us if you face any issues."
        },
        {
          sender: "Elena Rostova",
          text: "Awesome! Verified successfully now. Thanks for the quick support!"
        }
      ]
    }
  ];

  for (const inq of inquiries) {
    const createdInq = await prisma.inquiry.create({
      data: {
        name: inq.name,
        email: inq.email,
        category: inq.category,
        subject: inq.subject,
        message: inq.message,
        organization: inq.organization,
        status: inq.status,
      },
    });

    for (const r of inq.replies) {
      await prisma.inquiryReply.create({
        data: {
          inquiryId: createdInq.id,
          sender: r.sender,
          text: r.text,
        },
      });
    }
  }
  console.log("Inquiries seeded!");

  // Seed default admin configurations/settings
  const settings = [
    {
      key: "devlink_site_settings",
      value: { siteName: "DevLink Core", description: "The Multiplayer Developers Ecosystem", adminEmail: "admin@devlink.com" }
    },
    {
      key: "devlink_section_visibility",
      value: {
        "Homepage (/)::Hero Banner": true,
        "Homepage (/)::Featured Stats": true,
        "Homepage (/)::Featured Events": true,
        "Homepage (/)::Community Showcase": true,
        "Homepage (/)::Testimonials": true,
      }
    },
    {
      key: "devlink_page_modes",
      value: {
        "Homepage": "live",
        "Projects": "live",
        "Startups": "live",
        "Events": "live",
      }
    },
    {
      key: "devlink_page_visibility",
      value: {
        "Homepage": true,
        "Projects": true,
        "Startups": true,
        "Events": true,
      }
    },
    {
      key: "devlink_page_notes",
      value: {}
    },
    {
      key: "devlink_nav_items",
      value: [
        { label: "Matrix", path: "/projects" },
        { label: "Startups", path: "/startups" },
        { label: "Sprints", path: "/events" },
        { label: "Community", path: "/community" }
      ]
    },
    {
      key: "devlink_site_mode",
      value: "live"
    }
  ];

  for (const s of settings) {
    await prisma.adminSetting.create({
      data: {
        key: s.key,
        value: JSON.stringify(s.value),
      },
    });
  }
  console.log("Admin Settings seeded!");

  // Seed default announcements
  const announcements = [
    { title: "Multiplayer Network Launch", message: "Node gateway sync has been fully initialized for the 2026 cohort. Select guilds to begin active sprints.", status: "published", active: true },
    { title: "AgriTech Sprint Registrations Open", message: "Register for the AI Agriculture Summit to collaborate on vertical farming sensor optimization graphs.", status: "published", active: false }
  ];

  for (const a of announcements) {
    await prisma.announcement.create({
      data: {
        title: a.title,
        message: a.message,
        status: a.status,
        active: a.active,
      },
    });
  }
  console.log("Announcements seeded!");

  console.log("Seeding complete! Devlink database is ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
