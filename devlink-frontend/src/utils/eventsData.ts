export interface EventSpeaker {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface EventAgendaItem {
  time: string;
  title: string;
  description: string;
  speaker?: string;
}

export interface EventProject {
  name: string;
  description: string;
  link?: string;
  contributors: string[];
}

export interface Event {
  id: string;
  title: string;
  desc: string;
  longDesc?: string;
  date: string;
  month?: string;
  time?: string;
  location: string;
  type: string;
  color: string;
  tags: string[];
  capacity?: number;
  requirements?: string[];
  status: "open" | "live" | "completed";
  speakers?: EventSpeaker[];
  agenda?: EventAgendaItem[];
  // For past events
  photosCount?: number;
  videoRecap?: boolean;
  videoUrl?: string;
  images?: string[];
  stats?: {
    attendees: number;
    projectsBuilt?: number;
    commitsLine?: string;
    linesOfCode?: string;
  };
  projects?: EventProject[];
}

export const FEATURED_EVENT: Event = {
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
    {
      name: "Arjun Mehta",
      role: "DevLink Tech Lead",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      bio: "Former staff engineer at Vercel, now driving execution culture at DevLink."
    },
    {
      name: "Sarah Chen",
      role: "AI Developer Advocate",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      bio: "AI researcher specialized in open-weights model fine-tuning and browser-based inference."
    }
  ],
  agenda: [
    {
      time: "Day 1 - 10:00 AM IST",
      title: "Kickoff & Guild Formation",
      description: "Introduction to the sprint requirements, review of APIs, and live networking to form teams.",
      speaker: "Arjun Mehta"
    },
    {
      time: "Day 1 - 02:00 PM IST",
      title: "AI Stack Workshop",
      description: "A fast-paced guide on integrating vector indices, edge runtime cache, and state variables.",
      speaker: "Sarah Chen"
    },
    {
      time: "Day 2 - 12:00 PM IST",
      title: "Mid-Sprint Checkpoint",
      description: "Guild progress showcase, live debugging session with mentors, and telemetry check.",
      speaker: "Arjun Mehta"
    },
    {
      time: "Day 3 - 10:00 AM IST",
      title: "Submission & Demos",
      description: "DevLink deployment portal freezes. Live 3-minute video pitches play back in Discord.",
      speaker: "Sarah Chen"
    }
  ]
};

export const UPCOMING_EVENTS: Event[] = [
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
      {
        name: "Dr. Elena Rostova",
        role: "AgriTech Researcher",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        bio: "Associate Professor working on climate-adaptive machine learning models."
      }
    ],
    agenda: [
      {
        time: "02:00 PM IST",
        title: "Opening Keynote: Precision Farms",
        description: "How satellite imagery and custom autoencoders predict soil hydration and nitrogen levels.",
        speaker: "Dr. Elena Rostova"
      },
      {
        time: "03:30 PM IST",
        title: "AgriNet Weights Hands-on",
        description: "Deploying PyTorch models to Raspberry Pi nodes using WebAssembly compilations.",
        speaker: "Dr. Elena Rostova"
      }
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
      {
        name: "DevLink Core Bot",
        role: "Registry System",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
        bio: "Automated DevOps bot summarizing pull request statistics and test coverage."
      }
    ],
    agenda: [
      {
        time: "08:00 PM IST",
        title: "Codebase Architecture Tour",
        description: "A quick overview of our Next.js App directory, styling directives, and Tailwind themes.",
        speaker: "DevLink Core Bot"
      },
      {
        time: "08:30 PM IST",
        title: "Issue Claiming & Live Pairing",
        description: "Claim an issue from our backlog and build a solution live with one-on-one maintainer support.",
        speaker: "DevLink Core Bot"
      },
      {
        time: "10:30 PM IST",
        title: "PR Merge Ceremony",
        description: "Reviewing submitted PRs, compiling test suites, and pushing to main live.",
        speaker: "DevLink Core Bot"
      }
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
      {
        name: "Marcus Vance",
        role: "Venture Guild Lead",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
        bio: "Partner at Guild Ventures focusing on developer tooling and open-source infrastructure."
      }
    ],
    agenda: [
      {
        time: "06:30 PM IST",
        title: "Introduction & Pitch Protocol",
        description: "Overview of DevLink Venture Guild initiatives and presentation formats.",
        speaker: "Marcus Vance"
      },
      {
        time: "06:45 PM IST",
        title: "Founder Demos (5 Startups)",
        description: "Continuous live product demonstrations of early SaaS and developer tools.",
        speaker: "Marcus Vance"
      },
      {
        time: "07:45 PM IST",
        title: "Open Networking Rooms",
        description: "Split-out channels on Discord to meet founders, review code repos, and discuss roles.",
        speaker: "Marcus Vance"
      }
    ]
  }
];

export const PAST_EVENTS: Event[] = [
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
      "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop"
    ],
    stats: {
      attendees: 52,
      projectsBuilt: 3,
      commitsLine: "89 commits merged",
      linesOfCode: "12k lines"
    },
    speakers: [
      {
        name: "Rishi Raj",
        role: "Node Coordinator",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        bio: "Full-stack engineer managing the Bhopal Node developer community."
      }
    ],
    agenda: [
      {
        time: "10:00 AM",
        title: "Decentralized Networks Keynote",
        description: "Rethinking the developer resume and startup pitch as transparent, peer-verified graphs.",
        speaker: "Rishi Raj"
      },
      {
        time: "11:30 AM",
        title: "Guild Mapping Sandbox",
        description: "Interactive design workshop defining roles, responsibilities, and code claiming guidelines.",
        speaker: "Rishi Raj"
      },
      {
        time: "02:00 PM",
        title: "Hack Session & Wireframing",
        description: "Collaborative UI mockup creation and repository structure validation.",
        speaker: "Rishi Raj"
      }
    ],
    projects: [
      { 
        name: "DevLink Web UI Base", 
        description: "The initial Next.js boilerplate and Tailwind config designed at the meetup.",
        link: "#",
        contributors: ["@rishi", "@nikhil", "@anamika"] 
      },
      { 
        name: "Guild Credential Schema", 
        description: "A JSON schema definition defining developer badges and guild verification rules.", 
        link: "#",
        contributors: ["@shashank", "@priya"] 
      }
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
    desc: "A focused weekend sprint where community members contributed to the Vaitra healthcare platform, building out intelligent doctor listings and medicine tracking schemas.",
    longDesc: "Vaitra is a healthcare application built under the DevLink community incubator. Over a 48-hour period, a specialized team of 20 developers held a focused sprint to implement an intelligent matching algorithm for doctors and patient health schemas. We refactored database relations, integrated secure prescription signatures, and deployed the frontend node to an edge platform.",
    status: "completed",
    tags: ["HealthTech", "Next.js", "Sprint"],
    images: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
    ],
    stats: {
      attendees: 21,
      projectsBuilt: 2,
      commitsLine: "142 commits",
      linesOfCode: "24k lines"
    },
    speakers: [
      {
        name: "Dr. Amit Verma",
        role: "Vaitra Creator",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop",
        bio: "Cardiologist turned software architect building open-source healthcare infrastructure."
      }
    ],
    agenda: [
      {
        time: "09:00 AM",
        title: "Health Data Compliance Overview",
        description: "Understanding secure handling of patient metadata and HIPAA alignment goals.",
        speaker: "Dr. Amit Verma"
      },
      {
        time: "11:00 AM",
        title: "Database Schema Setup",
        description: "Refactoring PostgreSQL tables for flexible listings and doctor schedules.",
        speaker: "Dr. Amit Verma"
      },
      {
        time: "04:00 PM",
        title: "Deployment & Validation",
        description: "Running load tests and setting up edge caching configurations.",
        speaker: "Dr. Amit Verma"
      }
    ],
    projects: [
      { 
        name: "Doctor Matcher Engine", 
        description: "Algorithm prioritizing physician schedules and local ratings for faster triages.", 
        link: "#",
        contributors: ["@docverma", "@sam_dev"] 
      },
      { 
        name: "Prescription Encryption Node", 
        description: "A secure microservice signing prescriptions with local keys before cloud storage.", 
        link: "#",
        contributors: ["@cryptocodex"] 
      }
    ]
  }
];

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api`;

export async function getEventById(id: string): Promise<Event | undefined> {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API event details unavailable, using mock fallback", e);
  }

  if (FEATURED_EVENT.id === id) return FEATURED_EVENT;
  const matchedUpcoming = UPCOMING_EVENTS.find(e => e.id === id);
  if (matchedUpcoming) return matchedUpcoming;
  return PAST_EVENTS.find(e => e.id === id);
}

export async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API events service unavailable, using mock fallback", e);
  }
  return [FEATURED_EVENT, ...UPCOMING_EVENTS, ...PAST_EVENTS];
}

export function getUserRegisteredEvents(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("devlink_registered_events");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export async function toggleEventRSVP(eventId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const registered = getUserRegisteredEvents();
  const index = registered.indexOf(eventId);
  let isRegistered = false;
  
  if (index >= 0) {
    registered.splice(index, 1);
  } else {
    registered.push(eventId);
    isRegistered = true;
  }
  
  localStorage.setItem("devlink_registered_events", JSON.stringify(registered));

  try {
    const storedUser = localStorage.getItem("devlink_auth_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?.username) {
      const res = await fetch(`${API_BASE}/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.registered;
      }
    }
  } catch (e) {
    console.error("Failed to sync RSVP with backend:", e);
  }

  return isRegistered;
}

