import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import "../styles/style.css";

const ParticleBg = lazy(() => import("../components/ParticleBg"));

/* --- Tracks Data --- */
const tracks = [
  { icon: "ai", title: "Artificial Intelligence & ML", desc: "Build intelligent systems that solve real-world challenges using cognitive nodes, vector embeddings, and LLM orchestration." },
  { icon: "web", title: "Web & Software Development", desc: "Create modern, highly-responsive, performance-optimized, and secure digital products and platforms." },
  { icon: "health", title: "HealthTech", desc: "Develop solutions that improve healthcare accessibility, diagnostic systems, patient management, and efficiency." },
  { icon: "education", title: "EdTech", desc: "Transform educational journeys, classroom learning, and shared resource archives through engaging tech." },
  { icon: "finance", title: "FinTech", desc: "Build tools that simplify transactions, secure payment gateways, and improve regional financial accessibility." },
  { icon: "open", title: "Open Innovation", desc: "Got a unique idea? Bring any impactful, high-performance technology concept to life on our open stage." }
];

const renderTrackIcon = (iconId: string) => {
  switch (iconId) {
    case "ai":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case "web":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "health":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "education":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "finance":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <rect x="6" y="14" width="4" height="2" />
        </svg>
      );
    case "open":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
        </svg>
      );
    default:
      return null;
  }
};

const renderRoleIcon = (roleId: string) => {
  switch (roleId) {
    case "students":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px rgba(0, 242, 254, 0.2))" }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case "developers":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-green)", filter: "drop-shadow(0 0 6px rgba(0, 255, 135, 0.2))" }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "designers":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-pink)", filter: "drop-shadow(0 0 6px rgba(255, 0, 127, 0.2))" }}>
          <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12a10 10 0 0 0 10 10zm0-16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
        </svg>
      );
    case "ai":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px rgba(0, 242, 254, 0.2))" }}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case "entrepreneurs":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-violet)", filter: "drop-shadow(0 0 6px rgba(139, 92, 246, 0.2))" }}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
        </svg>
      );
    case "communities":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px rgba(0, 242, 254, 0.2))" }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case "beginners":
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-green)", filter: "drop-shadow(0 0 6px rgba(0, 255, 135, 0.2))" }}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return null;
  }
};

const renderPlanIcon = (iconId: string) => {
  switch (iconId) {
    case "zap":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", verticalAlign: "middle" }}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "rocket":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-pink)", verticalAlign: "middle" }}>
          <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2c.004.008.008.016.012.024A10.15 10.15 0 0 1 15 6v3h3a10.15 10.15 0 0 1 3.976.988c.008.004.016.008.024.012L22 2l-8 8z" />
          <path d="M9 15l-3 3v3h3l3-3H9z" />
        </svg>
      );
    default:
      return null;
  }
};

const renderPipelineStepIcon = (iconId: string, color: string, isActive: boolean) => {
  const filter = isActive ? `drop-shadow(0 0 10px ${color})` : "none";
  const strokeWidth = isActive ? "2" : "1.5";
  const opacity = isActive ? 1 : 0.65;

  switch (iconId) {
    case "ideate":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter,
            opacity,
            transition: "all 0.3s ease",
            transform: isActive ? "scale(1.1)" : "scale(1)"
          }}
        >
          {/* Bulb base */}
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <line x1="9" y1="18" x2="15" y2="18" />
          <line x1="10" y1="22" x2="14" y2="22" />
          {/* Filament inside */}
          <path d="M12 9v2M10 10.5h4" opacity="0.6" strokeWidth="1" />
          {/* Rays of light */}
          {isActive && (
            <>
              <line x1="12" y1="2" x2="12" y2="4" strokeWidth="2" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" />
              <line x1="2" y1="12" x2="4" y2="12" strokeWidth="2" />
              <line x1="20" y1="12" x2="22" y2="12" strokeWidth="2" />
              <line x1="18.36" y1="4.22" x2="16.93" y2="5.64" strokeWidth="2" />
            </>
          )}
        </svg>
      );
    case "design":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter,
            opacity,
            transition: "all 0.3s ease",
            transform: isActive ? "scale(1.1)" : "scale(1)"
          }}
        >
          {/* Paint board palette */}
          <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12a10 10 0 0 0 10 10zm0-16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
          <path d="M6 12c0-3 2-5.5 5-6" opacity="0.5" />
          <circle cx="12" cy="14" r="1.5" fill={isActive ? color : "none"} />
        </svg>
      );
    case "code":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter,
            opacity,
            transition: "all 0.3s ease",
            transform: isActive ? "scale(1.1) rotate(-5deg)" : "scale(1)"
          }}
        >
          {/* Brackets and lightning */}
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          {/* Lightning bolt inside code */}
          <polygon points="12 2 9 12 13 12 11 22" fill={isActive ? `${color}22` : "none"} strokeWidth="1.5" />
        </svg>
      );
    case "pitch":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter,
            opacity,
            transition: "all 0.3s ease",
            transform: isActive ? "scale(1.1) translate(2px, -2px)" : "scale(1)"
          }}
        >
          {/* Rocket */}
          <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2c.004.008.008.016.012.024A10.15 10.15 0 0 1 15 6v3h3a10.15 10.15 0 0 1 3.976.988c.008.004.016.008.024.012L22 2l-8 8z" />
          <path d="M9 15l-3 3v3h3l3-3H9z" />
          {isActive && (
            <>
              <line x1="3" y1="21" x2="1" y2="23" strokeWidth="2" />
              <line x1="2" y1="18" x2="0" y2="19" strokeWidth="1" />
              <line x1="6" y1="22" x2="5" y2="24" strokeWidth="1" />
            </>
          )}
        </svg>
      );
    case "scale":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter,
            opacity,
            transition: "all 0.3s ease",
            transform: isActive ? "scale(1.1) rotate(15deg)" : "scale(1)"
          }}
        >
          {/* Globe */}
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
          {/* Node points if active */}
          {isActive && (
            <>
              <circle cx="12" cy="2" r="1.5" fill={color} />
              <circle cx="12" cy="22" r="1.5" fill={color} />
              <circle cx="2" cy="12" r="1.5" fill={color} />
              <circle cx="22" cy="12" r="1.5" fill={color} />
            </>
          )}
        </svg>
      );
    default:
      return null;
  }
};

/* --- Schedule Data --- */
const day1Schedule = [
  { time: "09:00 AM", title: "Opening Session", desc: "Welcome briefing, Auraxis launch keynotes, and community onboarding." },
  { time: "10:30 AM", title: "Speaker Talks", desc: "Gain insights from experienced speakers, mentors, and developers." },
  { time: "11:30 AM", title: "Technology Insights", desc: "Deep dive into modern developer tools, workflows, and production frameworks." },
  { time: "12:30 PM", title: "AI & Development Discussions", desc: "Interactive discussions covering AI tools, vector embeddings, and API integrations." },
  { time: "02:00 PM", title: "Product Building Sessions", desc: "Hands-on coding workshop building production-ready projects." },
  { time: "04:30 PM", title: "Networking Opportunities", desc: "Connect with fellow developers, professionals, and future founders." },
  { time: "05:30 PM", title: "Community Activities", desc: "Fun, community-driven interactive events and developer guilds sync." },
  { time: "06:30 PM", title: "Refreshments", desc: "Unwind with food, beverages, and casual conversations." }
];

const day2Schedule = [
  { time: "08:00 AM", title: "Hackathon Kickoff", desc: "Kickstart Day 2, prepare workspaces, and welcome the developers." },
  { time: "08:30 AM", title: "Team Building & Collaboration", desc: "Help solo participants form teams (1-4 members) and align skills." },
  { time: "09:00 AM", title: "Challenge Reveal", desc: "Release of the Auraxis Hackathon challenge themes and rules." },
  { time: "09:30 AM", title: "Building Phase", desc: "Start of the intensive building sprint. Hackathon execution commences." },
  { time: "02:00 PM", title: "Mentor Interactions", desc: "One-on-one reviews and technical guidance from industry experts." },
  { time: "04:30 PM", title: "Project Presentations", desc: "Pitch and demonstrate working solutions directly to the judges panel." },
  { time: "06:30 PM", title: "Results & Recognition", desc: "Prize announcements, participation certificates, and closing ceremony." }
];

/* --- Pricing Plans --- */
const pricingPlans = [
  {
    key: "auraxis_pass",
    badge: "Official Entry Pass",
    title: "AURAXIS Pass",
    icon: "zap",
    price: "₹349",
    features: [
      "Access to BuildX Workshop",
      "Access to Auraxis Hackathon",
      "Official Participation Certificate",
      "Community Access Perks",
      "Networking Opportunities",
      "Mentor Interactions",
      "Refreshments & Food"
    ]
  },
  {
    key: "early_bird",
    badge: "Stay Tuned",
    title: "Early Bird Promo",
    icon: "rocket",
    price: "Campaigns",
    featured: true,
    features: [
      "Access to BuildX Workshop",
      "Access to Auraxis Hackathon",
      "Official Participation Certificate",
      "Community Access Perks",
      "Special Promo Benefits",
      "Food & Refreshments"
    ]
  }
];

/* --- FAQ Data --- */
const faqs = [
  { q: "Is the workshop free?", a: "Yes, full access to the BuildX workshop is included with the AURAXIS registration pass." },
  { q: "Can I participate alone?", a: "Yes. Solo participation is allowed, and we support solo builders looking to form cohorts." },
  { q: "Can I create a team later?", a: "No. Teams must be finalized during registration. Once a team is registered, members cannot be added, removed, or replaced." },
  { q: "What is the team size?", a: "Teams can consist of 1 to 4 members. The pass covers the entire team." },
  { q: "Where is the event venue?", a: "The event venue is to be announced." },
  { q: "When will prizes be announced?", a: "Prize pool details and challenge themes will be revealed during the kickoff on Day 2." }
];

/* --- Organizers Data --- */
const organizers = [
  {
    name: "Pawan Kushwaha",
    role: "Founder & Community Head",
    init: "PK",
    image: "/static/founder-image.svg",
    bio: "Visionary behind DevLinkHub — building a developer community that empowers students and creators across India through collaboration, learning, and innovation.",
    badge: "FOUNDER",
    badgeColor: "var(--accent-cyan)",
    skills: ["Community Building", "Leadership", "Event Management", "Startup Ecosystem"],
    socials: {
      linkedin: "https://www.linkedin.com/in/pawan-kushwaha-ai",
      twitter: "#",
      github: "https://github.com/Pawankus6261",
      instagram: "https://www.instagram.com/_age_of_souls_"
    }
  },
  {
    name: "Prince Kumar",
    role: "Operations Head",
    init: "PR",
    image: "/static/operation-head.jpeg",
    bio: "Drives the operational backbone of DevLinkHub AURAXIS, ensuring everything runs smoothly — from logistics and coordination to participant experience.",
    badge: "OPERATIONS",
    badgeColor: "var(--accent-green)",
    skills: ["Logistics", "Team Coordination", "Project Planning", "Execution"],
    socials: {
      linkedin: "https://www.linkedin.com/in/princekumar-aiml/",
      twitter: "#",
      github: "#",
      instagram: "https://www.instagram.com/prince_kushwaha9349"
    }
  },
  {
    name: "Ayush Kumar",
    role: "Community Relations Head",
    init: "AK",
    image: "/static/community-realations-head.png",
    bio: "Bridges the gap between the community and the event — managing outreach, partnerships, and ensuring every participant feels welcomed and valued.",
    badge: "COMMUNITY",
    badgeColor: "var(--accent-violet)",
    skills: ["Outreach", "Partnership Building", "Communication", "Brand Relations"],
    socials: {
      linkedin: "https://www.linkedin.com/in/ayush-kumar13?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      twitter: "#",
      github: "https://github.com/aayush1323",
      instagram: "https://www.instagram.com/aayush__1613?igsh=cHAyeDI2MjA1MDcz"
    }
  },
  {
    name: "Kartik Raj",
    role: "Community Manager",
    init: "KR",
    image: "/static/community-manager.jpg",
    bio: "Keeps the community active and engaged — organizing discussions, facilitating collaborations, and nurturing the developer ecosystem at DevLinkHub.",
    badge: "COMMUNITY",
    badgeColor: "var(--accent-violet)",
    skills: ["Engagement", "Content Strategy", "Community Growth", "Moderation"],
    socials: {
      linkedin: "https://www.linkedin.com/in/kartik-raj-619a58307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      twitter: "#",
      github: "#",
      instagram: "https://www.instagram.com/the__kartik_?igsh=MXJodmViNWMzNjR0ZQ=="
    }
  },
  {
    name: "Nilesh Patel",
    role: "Management Lead",
    init: "NI",
    image: "/static/management-lead.jpeg",
    bio: "Oversees planning and project management for the event, making sure every moving part aligns toward a successful and impactful experience.",
    badge: "MANAGEMENT",
    badgeColor: "var(--accent-orange)",
    skills: ["Project Management", "Strategic Planning", "Resource Allocation", "Risk Management"],
    socials: {
      linkedin: "#",
      twitter: "#",
      github: "https://github.com/Nilesh6251",
      instagram: "https://www.instagram.com/_nileshpatel07?igsh=MXBjY2diN3JhNnJhNQ=="
    }
  },
  {
    name: "Akshat Agrawal",
    role: "Technical Lead",
    init: "AA",
    image: "/static/tech-lead.jpg",
    bio: "Leads the technical vision of DevLinkHub — architecting platforms, guiding technical decisions, and mentoring developers within the community.",
    badge: "TECH",
    badgeColor: "var(--accent-pink)",
    skills: ["Full Stack Dev", "System Architecture", "API Design", "Mentorship", "Cloud"],
    socials: {
      linkedin: "https://www.linkedin.com/in/akshat-agrawal-520171398/",
      twitter: "#",
      github: "https://github.com/explorer-knowledge",
      instagram: "https://www.instagram.com/akshatt_101/",
      telegram: "https://t.me/TheOnly_no"
    }
  },
  {
    name: "Ranjan Kumar Singh",
    role: "Technical Co-Lead",
    init: "RS",
    image: "/static/co-tech-lead.jpg",
    bio: "Co-leads the technical engineering efforts, contributing to platform development and helping elevate the quality of technical projects across the team.",
    badge: "TECH",
    badgeColor: "var(--accent-pink)",
    skills: ["Frontend Dev", "React", "TypeScript", "UI Engineering", "Performance"],
    socials: {
      linkedin: "https://www.linkedin.com/in/ranjan-kumar-singh-aa1822336/",
      twitter: "#",
      github: "https://github.com/kumarranjankr06-spec",
      instagram: "https://www.instagram.com/ranjankumarkr0066/",
      telegram: "https://t.me/ranjan436454"
    }
  }
];

/* --- Interactive Card Spotlight Hover Tilt Wrapper --- */
function TiltGlassCard({
  children,
  className = "",
  style = {},
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;
    if (rafRef.current !== null) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 4;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      if (glow) {
        glow.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(0, 245, 255, 0.09) 0%, rgba(255, 255, 255, 0.01) 75%, transparent 100%)`;
        glow.style.opacity = "1";
      }
    });
  };

  const handleMouseEnter = () => {
    // ── FIX: apply will-change ONLY when hovering, not permanently ──
    // Permanently setting will-change on 20+ cards = 20+ GPU compositor layers always allocated
    if (cardRef.current) cardRef.current.style.willChange = "transform";
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768 || 'ontouchstart' in window) return;
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    // ── FIX: release compositor layer after hover ends ──
    card.style.willChange = "auto";
    if (glow) glow.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={style}  // removed static willChange:"transform" from here
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div ref={glowRef} className="spotlight-glow" style={{ opacity: 0, transition: "opacity 0.3s ease" }}></div>
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  /* --- States --- */
  // Safe initialization: check window existence (avoids SSR crash + DOM read on every render)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  // Memoized: avoids re-computing window.innerWidth on every render
  const showBackgroundEffects = !isMobile && window.innerWidth >= 1024 && !('ontouchstart' in window);
  const [activeTab, setActiveTab] = useState<"day1" | "day2">("day1");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isTerminalSwapped, setIsTerminalSwapped] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<typeof organizers[0] | null>(null);
  const [hoveredPipelineStep, setHoveredPipelineStep] = useState<number>(0);

  const [isClosed, setIsClosed] = useState(() => {
    const val = (window as any).__registrationSeats;
    return val !== undefined && val <= 0;
  });

  useEffect(() => {
    const handleUpdate = (e: any) => {
      setIsClosed(e.detail <= 0);
    };
    window.addEventListener("registration-seats-update", handleUpdate);
    return () => window.removeEventListener("registration-seats-update", handleUpdate);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Single merged Escape key handler (was two separate useEffects)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedOrg) setSelectedOrg(null);
      if (isTerminalSwapped) setIsTerminalSwapped(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedOrg, isTerminalSwapped]);

  // Lock body scroll when organizer modal is active
  useEffect(() => {
    if (selectedOrg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOrg]);

  // Hero Original CLI text lines state
  const [cliText, setCliText] = useState("");
  // Swapped Hackathon CLI printing steps
  const [hackathonCliText, setHackathonCliText] = useState("");
  const [hackathonCliDone, setHackathonCliDone] = useState(false);

  /* --- Canvases --- */
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

  /* --- 1. Water Canvas Sine Mesh Animation (desktop only) --- */
  useEffect(() => {
    if (isMobile || window.innerWidth < 1024 || 'ontouchstart' in window) return;
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let h = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (window.innerWidth < 768) return;
      w = canvas.width = canvas.parentElement?.clientWidth || 500;
      h = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const GRID_STEP = 35;
    const spacing = 70;
    const amplitude = 10;
    const frequency = 0.007;
    let frame = 0;
    let animId: number;
    // ── FIX: pause when tab not visible ──
    let isPaused = document.hidden;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      // ── CRITICAL: skip all work when tab is in background ──
      if (isPaused) return;
      // Draw every 3rd frame (~20fps)
      if (frame % 3 !== 0) { frame++; return; }

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(0, 245, 255, 0.10)";
      ctx.lineWidth = 1;

      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += GRID_STEP) {
          const disp = Math.sin(x * frequency + y * 0.01 + frame * 0.008) * amplitude;
          if (x === 0) ctx.moveTo(x, y + disp);
          else ctx.lineTo(x, y + disp);
        }
        ctx.stroke();
      }

      for (let x = spacing; x < w; x += spacing) {
        ctx.beginPath();
        for (let y = 0; y <= h; y += GRID_STEP) {
          const disp = Math.sin(x * 0.01 + y * frequency + frame * 0.008) * amplitude;
          if (y === 0) ctx.moveTo(x + disp, y);
          else ctx.lineTo(x + disp, y);
        }
        ctx.stroke();
      }
      frame++;
    };

    const onVisibilityChange = () => { isPaused = document.hidden; };
    document.addEventListener("visibilitychange", onVisibilityChange);

    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", handleResize);
      canvas.width = 0; canvas.height = 0;
    };
  }, []);

  /* --- 2. Hero Original CLI (npm install loop) --- */
  useEffect(() => {
    if (!isTerminalSwapped) {
      setCliText("admin@devlinkhub:~ $ ");
      return;
    }

    const steps = [
      { type: "type", text: "npm install devlinkhub" },
      { type: "wait", delay: 400 },
      { type: "print", text: "\n<span style='color:var(--accent-green)'>✔</span> Building community...\n" },
      { type: "wait", delay: 300 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Connecting developers...\n" },
      { type: "wait", delay: 300 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Launching AURAXIS 2026...\n" },
      { type: "wait", delay: 350 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Loading opportunities...\n" },
      { type: "wait", delay: 300 },
      { type: "print", text: "<span style='color:var(--accent-green)'>✔</span> Ready.\n\n" },
      { type: "wait", delay: 500 },
      { type: "print", text: "+ devlinkhub-auraxis@2026.1.0\nadded 142 packages, and audited 143 packages in 1.8s\n\n" },
      { type: "wait", delay: 1000 },
      { type: "type", text: "npm run dev" },
      { type: "wait", delay: 400 },
      { type: "print", text: "\n\n  VITE v5.4.1  ready in 124 ms\n" },
      { type: "print", text: "  ➜  Local:   <span style='color:var(--accent-cyan)'>http://localhost:5173/</span>\n" },
      { type: "print", text: "  ➜  Network: use --host to expose\n" },
      { type: "print", text: "  ➜  press h + enter to show help\n\n" },
      { type: "wait", delay: 1500 },
      { type: "print", text: "<span style='color:var(--white-secondary)'>[Click terminal card to query details]</span>\n" }
    ];

    let currentText = "admin@devlinkhub:~ $ ";
    setCliText(currentText);

    let stepIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    // ── FIX: alive flag — guarantees loop stops even if mid-chain ──
    // clearTimeout() only cancels the ONE currently scheduled callback.
    // If the effect re-runs while a callback is queued, the old callback
    // fires and schedules a new one, restarting the loop. The alive flag
    // prevents any callback from scheduling further work after cleanup.
    let alive = true;

    const execute = () => {
      // ── CRITICAL: bail out immediately if effect was cleaned up ──
      if (!alive) return;

      if (stepIdx >= steps.length) {
        return; // Stop the animation sequence permanently when finished
      }

      const step = steps[stepIdx];

      if (step.type === "type") {
        const text = step.text || "";
        if (charIdx < text.length) {
          currentText += text[charIdx];
          setCliText(currentText);
          charIdx++;
          timeoutId = setTimeout(execute, 50);
        } else {
          stepIdx++;
          charIdx = 0;
          timeoutId = setTimeout(execute, 100);
        }
      } else if (step.type === "print") {
        currentText += step.text || "";
        setCliText(currentText);
        stepIdx++;
        timeoutId = setTimeout(execute, 40);
      } else if (step.type === "wait") {
        stepIdx++;
        timeoutId = setTimeout(execute, step.delay || 0);
      } else if (step.type === "clear") {
        currentText = "admin@devlinkhub:~ $ ";
        setCliText(currentText);
        stepIdx = 0;
        charIdx = 0;
        timeoutId = setTimeout(execute, 300);
      }
    };

    timeoutId = setTimeout(execute, 500);
    return () => {
      // ── Kill the chain: flag stops any in-flight callback from rescheduling ──
      alive = false;
      clearTimeout(timeoutId);
    };
  }, [isTerminalSwapped]);
  // ── FIX: removed isMobile from deps — CLI animation doesn't need to restart on resize ──

  /* --- 3. Swapped CLI (Hackathon sequence) --- */
  useEffect(() => {
    if (isTerminalSwapped) {
      setHackathonCliText("");
      setHackathonCliDone(false);
      return;
    }

    const steps = [
      { type: "type", text: "./auraxis2026.sh --info" },
      { type: "wait", delay: 500 },
      { type: "print", text: "\n[STAGING] Loading DevLinkHub Auraxis registry...\n" },
      { type: "wait", delay: 400 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Event: DevLinkHub Auraxis 2026\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Venue: To be announced\n" },
      { type: "wait", delay: 200 },
      {
        type: "print",
        text: isClosed
          ? "<span style='color:var(--accent-cyan)'>[OK]</span> Status: <span style='color:#ff4757;font-weight:bold;'>REGISTRATION CLOSED</span>\n"
          : "<span style='color:var(--accent-cyan)'>[OK]</span> Status: REGISTRATION ACTIVE\n"
      },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Modules: BuildX Workshop + Auraxis Hackathon\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Entry Model: Solo or Teams (1-4 members)\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Perks: Certificate | Refreshments | Mentorship\n" },
      { type: "wait", delay: 200 },
      { type: "print", text: "<span style='color:var(--accent-cyan)'>[OK]</span> Community: 500+ developers synced\n\n" }
    ];

    let currentText = "admin@devlinkhub:~ $ ";
    setHackathonCliText(currentText);
    setHackathonCliDone(false);

    let stepIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    // ── FIX: alive flag prevents mid-chain callbacks from rescheduling ──
    let alive = true;

    const execute = () => {
      if (!alive) return;  // bail immediately if cleaned up

      if (stepIdx >= steps.length) {
        setHackathonCliDone(true);
        return;
      }

      const step = steps[stepIdx];

      if (step.type === "type") {
        const text = step.text || "";
        if (charIdx < text.length) {
          currentText += text[charIdx];
          setHackathonCliText(currentText);
          charIdx++;
          timeoutId = setTimeout(execute, 50);
        } else {
          stepIdx++;
          charIdx = 0;
          timeoutId = setTimeout(execute, 100);
        }
      } else if (step.type === "print") {
        currentText += step.text || "";
        setHackathonCliText(currentText);
        stepIdx++;
        timeoutId = setTimeout(execute, 40);
      } else if (step.type === "wait") {
        stepIdx++;
        timeoutId = setTimeout(execute, step.delay || 0);
      }
    };

    timeoutId = setTimeout(execute, 400);
    return () => {
      alive = false;
      clearTimeout(timeoutId);
    };
  }, [isTerminalSwapped, isClosed]);
  // ── FIX: removed isMobile from deps — sequence doesn't change on resize ──

  /* --- 4. Global Escape key listener --- */
  // REMOVED: merged into the single Escape handler above

  return (
    <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      {/* GLOBAL EFFECTS LAYERS (Depth Layer 0) */}
      <div className="noise-texture" aria-hidden="true"></div>
      <div className="dot-pattern" aria-hidden="true"></div>

      <div className="ambient-blob blob-cyan" style={{ top: "-10%", left: "-10%" }} aria-hidden="true"></div>
      <div className="ambient-blob blob-violet" style={{ top: "40%", right: "-10%" }} aria-hidden="true"></div>
      <div className="ambient-blob blob-green" style={{ bottom: "-10%", left: "20%" }} aria-hidden="true"></div>

      {/* SECTION 1: HERO SECTION */}
      <section className="hero-wrapper" id="home">
        {showBackgroundEffects && (
          <Suspense fallback={null}>
            <div className="hero-particles-bg" aria-hidden="true">
              <ParticleBg />
            </div>
          </Suspense>
        )}
        {showBackgroundEffects && <canvas ref={heroCanvasRef} className="hero-water-bg" aria-hidden="true"></canvas>}

        <div className="hero-inner-grid">
          <motion.div
            className="hero-text-block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="hero-eyebrow">&gt; auraxis.launch_event() ✓</span>
            <h1 className="hero-headline">
              <span>BUILD.</span>
              <span>CONNECT.</span>
              <span>GROW.</span>
            </h1>
            <p className="hero-subtitle">
              <strong>DEVLINKHUB AURAXIS 2026</strong> is the first flagship developer launch event of DevLinkHub.
              Join a thriving developer community in Bhopal for two days of hands-on learning, networking, and intense innovation.
            </p>
            <div className="hero-btns" style={{ marginTop: "1rem" }}>
              <a
                href="#tracks"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#tracks")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Tracks &rarr;
              </a>
              {isClosed ? (
                <span
                  className="btn-secondary disabled"
                  style={{ pointerEvents: "none", opacity: 0.6, cursor: "not-allowed", background: "rgba(255, 71, 87, 0.1)", border: "1px solid rgba(255, 71, 87, 0.2)", color: "#ff4757" }}
                >
                  Closed ✖
                </span>
              ) : (
                <a
                  href="/register"
                  className="btn-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                >
                  Register Now
                </a>
              )}
            </div>
            <div className="hero-date-grid">
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>20-21 June 2026</span>
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Team Size: 1-4 Members</span>
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
                <span>Open for Students &amp; Developers</span>
              </div>
              <div>
                <div
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "inherit" }}
                  className="hero-venue-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>To be announced</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CLI Terminal */}
          <div className="hero-visual-block" aria-hidden="true">
            {/* Hero blob — pure CSS animation, no JS SVG <animate> */}
            <div aria-hidden="true" style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%", height: "80%", zIndex: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,242,254,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
              filter: "blur(20px)",
              opacity: 0.5,
              pointerEvents: "none",
              animation: "blobBreath1 16s ease-in-out infinite alternate"
            }} />

            <motion.div
              layoutId="cli-terminal"
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="glass-card hero-visual-card"
              style={{
                zIndex: 10,
                cursor: "default",
                transform: "perspective(1200px) rotateY(-8deg)"
              }}
            >
              <AnimatePresence mode="wait">
                {!isTerminalSwapped ? (
                  <motion.div
                    key="original-cli"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, width: "100%" }}
                  >
                    {/* Hackathon CLI Header (Default view, no close button) */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span className="pulsing-dot" style={{ background: "#ff5f56", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#ffbd2e", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#27c93f", boxShadow: "none" }}></span>
                      </div>
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent-cyan)" }}>
                        /devlinkhub/auraxis/info
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13.5px",
                        lineHeight: 1.7,
                        color: "var(--accent-green)",
                        overflow: "hidden",
                        flex: 1,
                        textAlign: "left",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: hackathonCliText }}></span>
                      {!hackathonCliDone && <span className="blinking-caret"></span>}
                    </div>

                    {/* Terminal Footer */}
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: isClosed ? "#ff4757" : "var(--accent-green)", marginTop: "16px" }}>
                      <span>// status: {isClosed ? "closed" : "active"}</span>
                      {isClosed ? (
                        <span
                          className="cyber-register-btn disabled"
                          style={{ padding: "8px 16px", fontSize: "14px", marginTop: 0, textDecoration: "none", color: "#ff4757", cursor: "not-allowed", border: "1px solid rgba(255, 71, 87, 0.2)", opacity: 0.6 }}
                        >
                          Closed ✖
                        </span>
                      ) : (
                        <a
                          href="https://linktr.ee/DevLinkhub"
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="cyber-register-btn"
                          style={{ padding: "8px 16px", fontSize: "14px", marginTop: 0, textDecoration: "none", color: "inherit", cursor: "pointer" }}
                        >
                          Join DevLinkHub <span style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "6px" }}>⏎</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="swapped-cli"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, width: "100%" }}
                  >
                    {/* Original CLI Header (Swapped view, with close buttons) */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span
                          onClick={(e) => { e.stopPropagation(); setIsTerminalSwapped(false); }}
                          className="pulsing-dot"
                          style={{ background: "#ff5f56", boxShadow: "none", cursor: "pointer" }}
                          title="Close and Restore"
                        ></span>
                        <span className="pulsing-dot" style={{ background: "#ffbd2e", boxShadow: "none" }}></span>
                        <span className="pulsing-dot" style={{ background: "#27c93f", boxShadow: "none" }}></span>
                      </div>
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
                        bash - devlinkhub.sh
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsTerminalSwapped(false); }}
                        style={{ background: "transparent", border: "none", color: "var(--white-secondary)", cursor: "pointer", fontSize: "12px", fontFamily: "var(--font-mono)" }}
                      >
                        [ESC] X
                      </button>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13.5px",
                        lineHeight: 1.7,
                        color: "var(--accent-green)",
                        overflow: "hidden",
                        flex: 1,
                        textAlign: "left",
                        whiteSpace: "pre-wrap"
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: cliText }}></span>
                      <span className="blinking-caret"></span>
                    </div>

                    {/* Terminal Footer */}
                    <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-green)", marginTop: "16px" }}>
                      <span>// status: active</span>
                      <span>v2026.1.0 Stable</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>&gt; scroll to explore</span>
          <div className="scroll-chevron"></div>
        </div>
      </section>

      {/* SECTION 2: LIVE TERMINAL STRIP */}
      <div className="live-strip-wrap" aria-hidden="true">
        <motion.div
          className="live-strip-track"
          animate={{ x: "-50%" }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        >
          <div className="strip-item">&gt; auraxis_2026.init()</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Bhopal, MP hosting central india's builders</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; BuildX Workshop Day 1</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Auraxis Hackathon Day 2</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; auraxis_pass.price: ₹349</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; team_nodes: 1–4 members</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; git checkout -b auraxis-2026 ✓</div>
          <div className="strip-separator">——</div>
          {/* Loop duplicates */}
          <div className="strip-item">&gt; auraxis_2026.init()</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Bhopal, MP hosting central india's builders</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; BuildX Workshop Day 1</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; Auraxis Hackathon Day 2</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; auraxis_pass.price: ₹349</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; team_nodes: 1–4 members</div>
          <div className="strip-separator">——</div>
          <div className="strip-item">&gt; git checkout -b auraxis-2026 ✓</div>
        </motion.div>
      </div>

      {/* SECTION 2.5: ABOUT & WHY JOIN AURAXIS 2026 */}
      <section className="about-auraxis-section" id="about">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; auraxis.initialize_overview()</span>
            <h2 className="section-title-display">The Beginning of Something Bigger</h2>
          </motion.div>

          <div className="about-2col-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", marginBottom: "4rem", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1.5rem", color: "var(--accent-cyan)" }}>
                What is AURAXIS 2026?
              </h3>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem" }}>
                <strong>AURAXIS 2026</strong> is the official flagship launch event of <strong>DevLinkHub</strong>.
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "var(--white-secondary)" }}>
                For two exciting days, participants will learn, network, collaborate, and compete through carefully designed experiences focused on growth and innovation. Whether you're taking your first step into tech or already building projects, AURAXIS 2026 is your opportunity to learn from industry experts, connect with ambitious builders, and experience the energy of a thriving developer community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <TiltGlassCard style={{ padding: "2rem", borderLeft: "4px solid var(--accent-cyan)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#fff", marginBottom: "0.5rem" }}>
                  Day 1 • BuildX Workshop
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                  A practical, hands-on workshop designed to help participants understand modern technologies, development workflows, AI tools, product thinking, and industry trends. Learn directly from experienced speakers.
                </p>
              </TiltGlassCard>

              <TiltGlassCard style={{ padding: "2rem", borderLeft: "4px solid var(--accent-violet)" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "#fff", marginBottom: "0.5rem" }}>
                  Day 2 • Auraxis Hackathon
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--white-secondary)", lineHeight: "1.6" }}>
                  An innovation challenge where participants collaborate, build, and present creative solutions to real-world problems. Designed for developers, designers, AI enthusiasts, and problem solvers.
                </p>
              </TiltGlassCard>
            </motion.div>
          </div>

          {/* Why Join AURAXIS 2026 */}
          <div style={{ marginTop: "6rem" }}>
            <span className="section-head-mono" style={{ color: "var(--accent-green)" }}>&gt; auraxis.perks_and_value()</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: "900", marginBottom: "3rem" }}>
              Why Join AURAXIS 2026?
            </h3>

            <div className="perks-auto-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <TiltGlassCard style={{ padding: "1.5rem 1.75rem", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ color: "var(--accent-cyan)", marginBottom: "0.75rem" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))" }}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M19 8l2 2 4-4" />
                      </svg>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>
                      Learn From Industry Professionals
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--white-secondary)", lineHeight: "1.5" }}>
                      Gain insights from experienced speakers and mentors who are actively building in the industry.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TiltGlassCard style={{ padding: "1.5rem 1.75rem", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ color: "var(--accent-pink)", marginBottom: "0.75rem" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(255, 0, 127, 0.3))" }}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>
                      Build Meaningful Connections
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--white-secondary)", lineHeight: "1.5" }}>
                      Expand your developer network, find potential co-founders, and discover future collaborators.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <TiltGlassCard style={{ padding: "1.5rem 1.75rem", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ color: "var(--accent-green)", marginBottom: "0.75rem" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(0, 255, 135, 0.3))" }}>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>
                      Real Hackathon Environment
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--white-secondary)", lineHeight: "1.5" }}>
                      Work on exciting real-world challenges, pitch to judges, and showcase your building skills.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ gridColumn: "span 1" }}
              >
                <TiltGlassCard style={{ padding: "1.5rem 1.75rem", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ color: "var(--accent-cyan)", marginBottom: "0.75rem" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))" }}>
                        <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 2c.004.008.008.016.012.024A10.15 10.15 0 0 1 15 6v3h3a10.15 10.15 0 0 1 3.976.988c.008.004.016.008.024.012L22 2l-8 8z" />
                        <path d="M9 15l-3 3v3h3l3-3H9z" />
                      </svg>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>
                      Become Part of DevLinkHub
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--white-secondary)", lineHeight: "1.5" }}>
                      Join a growing developer community focused on learning together and building together.
                    </p>
                  </div>
                </TiltGlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HACKATHON TRACKS */}
      <section className="tracks-section" id="tracks">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; auraxis.tracks_mapping()</span>
            <h2 className="section-title-display">Hackathon Tracks</h2>
          </motion.div>

          <div className="tracks-grid">
            {tracks.map((track, i) => (
              <motion.div
                key={track.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <TiltGlassCard className="track-card">
                  <div className="track-icon">{renderTrackIcon(track.icon)}</div>
                  <h3 className="track-title">{track.title}</h3>
                  <p className="track-desc">{track.desc}</p>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3.5: WHO CAN PARTICIPATE */}
      <section className="eligibility-section" style={{ padding: "6rem 2rem", background: "var(--bg-secondary)", position: "relative", zIndex: 10 }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; auraxis.target_audience()</span>
            <h2 className="section-title-display">Who Can Participate?</h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
            {[
              { role: "Students", icon: "students", desc: "College students looking to learn, network, and build projects." },
              { role: "Developers", icon: "developers", desc: "Software engineers, backend, frontend, and fullstack builders." },
              { role: "Designers", icon: "designers", desc: "UI/UX designers creating intuitive and premium interfaces." },
              { role: "AI Enthusiasts", icon: "ai", desc: "Builders leveraging models, embeddings, and cognitive pipelines." },
              { role: "Beginners & Pros", icon: "beginners", desc: "Both first-time hackathon attendees and developers." }
            ].map((item, idx) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltGlassCard style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                  <div style={{ marginBottom: "1rem" }}>{renderRoleIcon(item.icon)}</div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#fff", marginBottom: "0.5rem" }}>
                    {item.role}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--white-secondary)", lineHeight: "1.5" }}>
                    {item.desc}
                  </p>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--accent-green)" }}
          >
            <span>&gt; Everyone with a passion for learning and building is welcome.</span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3.6: FEATURED SPEAKER */}
      <section className="speaker-section" style={{ padding: "6rem 2rem", position: "relative", zIndex: 10, background: "rgba(10, 10, 15, 0.4)" }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono" style={{ color: "var(--accent-pink)" }}>&gt; auraxis.featured_speaker()</span>
            <h2 className="section-title-display" style={{ marginBottom: "3rem" }}>Featured Speaker</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TiltGlassCard className="speaker-glass-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="speaker-card-inner">
                {/* Image side */}
                <div className="speaker-img-container">
                  <img src="/static/chavi_garg.jpg" alt="Chhavi Garg" className="speaker-img" />
                  <div className="speaker-img-overlay"></div>
                  <div className="speaker-badge-floating">
                    <span>FEATURED SPEAKER</span>
                  </div>
                </div>

                {/* Content side */}
                <div className="speaker-content">
                  <div className="speaker-meta">
                    <span className="speaker-tag">AURAXIS 2026 GUEST</span>
                    <h3 className="speaker-name">Chhavi Garg</h3>
                    <p className="speaker-title">Founder & CEO, Bharat XR | Co-Founder, Arexa & StartupTale</p>
                  </div>

                  <p className="speaker-bio">
                    An immersive technology pioneer, entrepreneur, and AR creator. As the founder of 
                    <strong> Bharat XR</strong> and co-founder of <strong>Arexa</strong>, she has empowered over 
                    <strong> 80,000+ students</strong> across India, building one of the nation's largest immersive 
                    technology communities. Recognized as a Snapchat Business Partner (Snap AR), Chhavi is driving 
                    the next wave of spatial computing and XR innovation.
                  </p>

                  <div className="speaker-highlights">
                    <div className="highlight-item">
                      <span className="highlight-count" style={{ color: "var(--accent-cyan)" }}>80k+</span>
                      <span className="highlight-label">Students Trained</span>
                    </div>
                    <div className="highlight-item">
                      <span className="highlight-count" style={{ color: "var(--accent-green)" }}>Snap AR</span>
                      <span className="highlight-label">Official Partner</span>
                    </div>
                    <div className="highlight-item">
                      <span className="highlight-count" style={{ color: "var(--accent-pink)" }}>XR Pioneer</span>
                      <span className="highlight-label">Community Head</span>
                    </div>
                  </div>

                  <div className="speaker-actions">
                    <a 
                      href="https://www.linkedin.com/in/chhavigg?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary linkedin-btn"
                      style={{ fontSize: "14px", padding: "10px 24px" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </TiltGlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ textAlign: "center", marginTop: "3rem", fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--white-secondary)" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span className="pulsing-dot" style={{ background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }}></span>
              More speakers & mentors to be announced soon...
            </span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3.7: PIPELINE VISUAL GRAPHIC */}
      <section className="pipeline-section" style={{ padding: "5rem 2rem 5rem 2rem", position: "relative", zIndex: 10, background: "rgba(10, 10, 15, 0.2)" }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono" style={{ color: "var(--accent-cyan)" }}>&gt; auraxis.innovation_pipeline()</span>
            <h2 className="section-title-display" style={{ marginBottom: "3rem" }}>From Concept to Reality</h2>
          </motion.div>

          {/* Interactive Pipeline Graphic */}
          <div className="pipeline-container" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* The Horizontal Steps */}
            <div className="pipeline-flow" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", flexWrap: "wrap", gap: "2rem" }}>

              {/* Connecting Background Line with running dash animation (SVG) */}
              <div className="pipeline-connector-line" style={{ position: "absolute", top: "50px", left: "5%", right: "5%", height: "4px", background: "rgba(255,255,255,0.05)", zIndex: 1, borderRadius: "2px", pointerEvents: "none" }}>
                <svg width="100%" height="100%" style={{ overflow: "visible" }}>
                  <line
                    x1="0%" y1="50%" x2="100%" y2="50%"
                    stroke="var(--accent-cyan)"
                    strokeWidth="2"
                    strokeDasharray="10 15"
                    style={{ animation: "running-dash 8s linear infinite", opacity: 0.4 }}
                  />
                </svg>
              </div>

              {[
                { number: "01", name: "IDEATE", accent: "var(--accent-cyan)", desc: "Brainstorm high-impact solutions.", icon: "ideate" },
                { number: "02", name: "DESIGN", accent: "var(--accent-violet)", desc: "Map architecture and mockups.", icon: "design" },
                { number: "03", name: "CODE", accent: "var(--accent-pink)", desc: "Hack & integrate with API layers.", icon: "code" },
                { number: "04", name: "PITCH", accent: "var(--accent-green)", desc: "Demonstrate working software.", icon: "pitch" },
                { number: "05", name: "SCALE", accent: "var(--accent-orange)", desc: "Launch to devlinkhub network.", icon: "scale" }
              ].map((step, idx) => {
                const isActive = hoveredPipelineStep === idx;
                return (
                  <motion.div
                    key={step.name}
                    className={`pipeline-node-wrapper ${isActive ? "active" : ""}`}
                    onMouseEnter={() => setHoveredPipelineStep(idx)}
                    onClick={() => setHoveredPipelineStep(idx)}
                    style={{
                      flex: "1 1 150px",
                      zIndex: 2,
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Ring Container */}
                    <div
                      className="pipeline-ring"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: isActive ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.01)",
                        border: isActive ? `2px solid ${step.accent}` : "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: isActive ? `0 0 25px ${step.accent}44, inset 0 0 12px ${step.accent}22` : "none",
                        margin: "0 auto 1rem auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        position: "relative"
                      }}
                    >
                      {renderPipelineStepIcon(step.icon, step.accent, isActive)}

                      {/* Step Badge */}
                      <div style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: step.accent,
                        color: "#0a0a0f",
                        fontSize: "10px",
                        fontWeight: "900",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        fontFamily: "var(--font-mono)"
                      }}>
                        {step.number}
                      </div>
                    </div>

                    <h4 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      letterSpacing: "1px",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                      transition: "color 0.3s ease",
                      marginBottom: "0.25rem"
                    }}>
                      {step.name}
                    </h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--white-secondary)", maxWidth: "160px", margin: "0 auto", opacity: isActive ? 1 : 0.7 }}>
                      {step.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulated Live Console Output based on Hovered Step */}
            <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(10, 10, 15, 0.6)", backdropFilter: "blur(12px)" }}>
              {/* Console Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "8px", marginBottom: "12px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f56" }}></span>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffbd2e" }}></span>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27c93f" }}></span>
                  <span style={{ marginLeft: "6px" }}>pipeline_console.log</span>
                </div>
                <div>Status: ACTIVE</div>
              </div>

              {/* Console Output (Monospace terminal font) */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: "1.6", color: "#f8f8f2", minHeight: "90px" }}>
                {hoveredPipelineStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)" }}>admin@devlinkhub:~ $ ./run_ideation.sh --auraxis-2026</div>
                    <div><span style={{ color: "var(--accent-cyan)" }}>[INIT]</span> Scanning hacker brainwaves for high-impact proposals...</div>
                    <div><span style={{ color: "var(--accent-cyan)" }}>[OK]</span> Found 42 target solutions matching current tracks.</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[SUCCESS]</span> Selected Concept: "Multi-agent cognitive collaboration network."</div>
                  </motion.div>
                )}
                {hoveredPipelineStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)" }}>admin@devlinkhub:~ $ design-system --generate --theme=glassmorphism</div>
                    <div><span style={{ color: "var(--accent-violet)" }}>[ASSETS]</span> Compiling layout tokens, glow radius: 20px, blur: 12px.</div>
                    <div><span style={{ color: "var(--accent-violet)" }}>[LAYOUT]</span> Flexbox bento grid generated. Responsive behavior set to: TRUE.</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[SUCCESS]</span> High-fidelity mockups compiled and pushed to design repository.</div>
                  </motion.div>
                )}
                {hoveredPipelineStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)" }}>admin@devlinkhub:~ $ npm run dev --build-auraxis --env=production</div>
                    <div><span style={{ color: "var(--accent-pink)" }}>[VITE]</span> Bundling source files and optimizing chunk load sizes...</div>
                    <div><span style={{ color: "var(--accent-pink)" }}>[COMPILING]</span> Transpiling React hooks + TypeScript modules to ESM.</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[SUCCESS]</span> Build succeeded. Live environment local server hosting at: http://localhost:5173/</div>
                  </motion.div>
                )}
                {hoveredPipelineStep === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)" }}>admin@devlinkhub:~ $ pitch-deck --present --audience=judges</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[SLIDES]</span> Demonstrating system architecture & frontend micro-interactions.</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[DEMO]</span> Initiating live deployment and user flow checkout sequence... SUCCESS.</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[SUCCESS]</span> Evaluation completed. Panel rating: 9.8 / 10. Excellent.</div>
                  </motion.div>
                )}
                {hoveredPipelineStep === 4 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ color: "rgba(255,255,255,0.4)" }}>admin@devlinkhub:~ $ deploy --prod --target=devlinkhub-network</div>
                    <div><span style={{ color: "rgba(255, 159, 67, 1)" }}>[DOCKER]</span> Building production containers and pushing to AWS registry...</div>
                    <div><span style={{ color: "rgba(255, 159, 67, 1)" }}>[CDN]</span> Propagating global edge nodes. Cache status: WARM.</div>
                    <div><span style={{ color: "var(--accent-green)" }}>[STATUS]</span> Auraxis registration is active. Event telemetry reporting: 100% stable.</div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE SCHEDULE TIMELINE */}
      <section className="schedule-section" id="schedule">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; event.get_schedule()</span>
            <h2 className="section-title-display">Auraxis Event Journey</h2>
          </motion.div>

          <div className="schedule-tabs-container">
            <button
              className={`schedule-tab-btn ${activeTab === "day1" ? "active" : ""}`}
              onClick={() => setActiveTab("day1")}
            >
              Day 1 — BuildX Workshop
            </button>
            <button
              className={`schedule-tab-btn ${activeTab === "day2" ? "active" : ""}`}
              onClick={() => setActiveTab("day2")}
            >
              Day 2 — Auraxis Hackathon
            </button>
          </div>

          <div className="schedule-timeline">
            <AnimatePresence mode="wait">
              {activeTab === "day1" ? (
                <motion.div
                  key="day1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {day1Schedule.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                      className={`timeline-item ${idx === 0 ? "active" : ""}`}
                    >
                      <div className="timeline-time">{item.time}</div>
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="day2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {day2Schedule.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                      className={`timeline-item ${idx === 0 ? "active" : ""}`}
                    >
                      <div className="timeline-time">{item.time}</div>
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING COMPARISON TABLE */}
      <section className="pricing-section" id="pricing">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; tickets.allocate_pricing()</span>
            <h2 className="section-title-display">Registration Passes</h2>
          </motion.div>

          <div className="pricing-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: "800px" }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltGlassCard
                  className={`pricing-card ${plan.featured ? "featured" : ""}`}
                  onClick={() => !isClosed && navigate("/register")}
                  style={{ cursor: isClosed ? "default" : "pointer" }}
                >
                  <span className="pricing-card-badge">{plan.badge}</span>
                  <h3 className="pricing-plan-title" style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {renderPlanIcon(plan.icon)}
                    {plan.title}
                  </h3>
                  <div className="pricing-price">{plan.price}</div>
                  <div className="pricing-price-period">per team configuration</div>

                  <ul className="pricing-features-list">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <span>✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  {isClosed ? (
                    <button
                      className="btn-secondary disabled"
                      style={{ width: "100%", justifyContent: "center", pointerEvents: "none", opacity: 0.6, cursor: "not-allowed", background: "rgba(255, 71, 87, 0.1)", border: "1px solid rgba(255, 71, 87, 0.2)", color: "#ff4757" }}
                    >
                      Closed ✖
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/register");
                      }}
                      className={plan.featured ? "btn-primary" : "btn-secondary"}
                      style={{ width: "100%", justifyContent: "center", cursor: "pointer", border: "none" }}
                    >
                      {plan.key === "auraxis_pass" ? "Register now ➔" : "Unlock Promo Benefits ➔"}
                    </button>
                  )}
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: JUDGING & AWARDS */}
      <section className="pillars-section" id="judging" style={{ background: "var(--bg-secondary)" }}>
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; matrix.evaluation_weights()</span>
            <h2 className="section-title-display">Judging Criteria &amp; Awards</h2>
          </motion.div>

          <div className="bento-pillars-grid">
            <TiltGlassCard className="pillar-card pillar-card--large">
              <div>
                <h3 className="pillar-title cyan" style={{ fontSize: "42px" }}>Evaluation Criteria</h3>
                <p className="pillar-body" style={{ fontSize: "15px" }}>
                  Solutions will be evaluated by an esteemed panel of technology professionals and founders based on:
                </p>
                <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)" }}>
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                        <line x1="9" y1="18" x2="15" y2="18" />
                      </svg>
                      Innovation (Uniqueness, Creativity)
                    </span>
                    <strong style={{ color: "var(--accent-cyan)" }}>30%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-violet)" }}>
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <rect x="9" y="9" width="6" height="6" />
                      </svg>
                      Technical Implementation (Robust code, scalability)
                    </span>
                    <strong style={{ color: "var(--accent-violet)" }}>25%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-green)" }}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      Problem Solving (Real-world applicability)
                    </span>
                    <strong style={{ color: "var(--accent-green)" }}>20%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-pink)" }}>
                        <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12a10 10 0 0 0 10 10zm0-16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                      </svg>
                      User Experience (Design, clean flow)
                    </span>
                    <strong style={{ color: "var(--accent-pink)" }}>15%</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fff" }}>
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      Presentation (Pitch clarity, server demo)
                    </span>
                    <strong style={{ color: "#fff" }}>10%</strong>
                  </div>
                </div>
              </div>
            </TiltGlassCard>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", height: "100%" }}>
              <TiltGlassCard className="pillar-card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
                <div>
                  <h3 className="pillar-title violet" style={{ fontSize: "32px", textAlign: "center", margin: 0 }}>Main Prizes</h3>
                  <div className="pillar-body" style={{ fontSize: "14px", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffd700", marginRight: "8px", verticalAlign: "middle" }}>
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
                      </svg>
                      <strong>Winner</strong>: Cash Prize + Trophy + Certificate
                    </div>
                    <div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#c0c0c0", marginRight: "8px", verticalAlign: "middle" }}>
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
                      </svg>
                      <strong>Runner-Up</strong>: Cash Prize + Certificate
                    </div>
                  </div>
                </div>
              </TiltGlassCard>
              <TiltGlassCard className="pillar-card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
                <div>
                  <h3 className="pillar-title green" style={{ fontSize: "32px", textAlign: "center", margin: 0 }}>Spotlights</h3>
                  <div className="pillar-body" style={{ fontSize: "14px", marginTop: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Best AI Project
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Best Design / UX
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Best Beginner Team
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Community Choice Award
                    </div>
                    <div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-cyan)", marginRight: "8px", verticalAlign: "middle" }}>
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                      Most Innovative Solution
                    </div>
                  </div>
                </div>
              </TiltGlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ ACCORDION */}
      <section className="faq-section" id="faq">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; support.fetch_faq()</span>
            <h2 className="section-title-display">Frequently Asked Questions</h2>
          </motion.div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-accordion-item">
                <div
                  className="faq-accordion-header"
                  onClick={() => setActiveFaq((prev) => (prev === idx ? null : idx))}
                >
                  <h3>{faq.q}</h3>
                  <motion.span
                    className="faq-accordion-icon"
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </div>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeFaq === idx ? "auto" : 0,
                    opacity: activeFaq === idx ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="faq-accordion-body">{faq.a}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7.5: ABOUT DEVLINKHUB */}
      <section className="about-devlinkhub-section">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; devlinkhub.profile()</span>
            <h2 className="section-title-display">About DevLinkHub</h2>
          </motion.div>

          <div className="glass-card about-devlink-card">
            <div className="dot-pattern" style={{ position: "absolute", opacity: 0.5 }} aria-hidden="true"></div>
            <div className="about-devlink-grid">
              <div>
                <p className="about-devlink-text">
                  DevLinkHub is a community built for students, developers, creators, and innovators who believe in learning together and building together.
                </p>
                <p className="about-devlink-subtext">
                  Our mission is simple: <strong>Build. Connect. Grow.</strong> Through hands-on workshops, innovation hackathons, networking meetups, and community-driven collaborative initiatives, we aim to create opportunities that help individuals grow both personally and professionally.
                </p>
              </div>

              <div style={{ textAlign: "center", width: "100%" }}>
                <div className="about-devlink-slogan">
                  <span style={{ color: "var(--accent-cyan)" }}>BUILD.</span><br />
                  <span style={{ color: "#fff" }}>CONNECT.</span><br />
                  <span style={{ color: "var(--accent-green)" }}>GROW.</span>
                </div>
                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", width: "100%" }}>
                  {isClosed ? (
                    <span
                      className="btn-primary disabled"
                      style={{ pointerEvents: "none", opacity: 0.6, cursor: "not-allowed", background: "rgba(255, 71, 87, 0.1)", border: "1px solid rgba(255, 71, 87, 0.2)", color: "#ff4757" }}
                    >
                      Closed ✖
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate("/register")}
                      className="btn-primary"
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: ORGANIZERS */}
      <section className="organizers-section" id="organizers">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-head-mono">&gt; nodes.get_leadership()</span>
            <h2 className="section-title-display">Organized By</h2>
          </motion.div>

          <div className="organizer-grid">
            {organizers.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltGlassCard
                  className="organizer-card"
                  onClick={() => setSelectedOrg(org)}
                  style={{ cursor: "pointer" }}
                >
                  {org.image ? (
                    <img
                      src={org.image}
                      alt={org.name}
                      className="organizer-avatar"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="organizer-avatar-placeholder">{org.init}</div>
                  )}
                  <div className="organizer-info">
                    <h4 className="organizer-name">{org.name}</h4>
                    <span className="organizer-role">{org.role}</span>
                  </div>
                  {/* View detail hint */}
                  <div className="organizer-view-hint"><span className="hint-text">View Profile</span><span className="hint-arrow">→</span></div>
                </TiltGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ORGANIZER SPOTLIGHT MODAL */}
      <AnimatePresence>
        {selectedOrg && (
          <>
            {/* Backdrop */}
            <motion.div
              key="org-backdrop"
              className="org-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedOrg(null)}
            />

            {/* Centering wrapper — separate from animation so transform doesn't clash */}
            <div className="org-modal-center-wrap">
              <motion.div
                key="org-modal"
                className="org-spotlight-modal"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedOrg.name} profile`}
              >
                {/* Close button */}
                <button
                  className="org-modal-close"
                  onClick={() => setSelectedOrg(null)}
                  aria-label="Close profile"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* ── PORTRAIT SECTION ── */}
                <div className="org-modal-portrait-zone">
                  {/* Ambient glow behind image */}
                  <div
                    className="org-modal-portrait-glow"
                    style={{ background: `radial-gradient(circle, ${selectedOrg.badgeColor}30 0%, transparent 70%)` }}
                  />
                  {/* ── Portrait frame: rings + image share the same origin ── */}
                  <div className="org-modal-portrait-frame">
                    {/* Dual glow rings — absolutely centered on the frame */}
                    <div className="org-modal-ring org-modal-ring-outer" style={{ borderColor: `${selectedOrg.badgeColor}40` }} />
                    <div className="org-modal-ring org-modal-ring-inner" style={{ borderColor: `${selectedOrg.badgeColor}80` }} />

                    {/* Portrait image */}
                    {selectedOrg.image ? (
                      <img
                        src={selectedOrg.image}
                        alt={selectedOrg.name}
                        className="org-modal-portrait"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div
                        className="org-modal-portrait-placeholder"
                        style={{ background: `linear-gradient(135deg, ${selectedOrg.badgeColor}, var(--accent-violet))` }}
                      >
                        {selectedOrg.init}
                      </div>
                    )}
                  </div>

                  {/* Floating badge overlapping image bottom */}
                  <motion.span
                    className="org-modal-floating-badge"
                    style={{
                      background: `${selectedOrg.badgeColor}18`,
                      borderColor: `${selectedOrg.badgeColor}70`,
                      color: selectedOrg.badgeColor,
                      boxShadow: `0 0 16px ${selectedOrg.badgeColor}35`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.18, type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {selectedOrg.badge}
                  </motion.span>
                </div>

                {/* ── DETAILS SECTION ── */}
                <div className="org-modal-details">
                  {/* Event label */}
                  <div className="org-modal-event-label">DevLinkHub AURAXIS 2026</div>

                  {/* Name */}
                  <h3 className="org-modal-name">{selectedOrg.name}</h3>

                  {/* Role */}
                  <div className="org-modal-role" style={{ color: selectedOrg.badgeColor }}>
                    {selectedOrg.role}
                  </div>

                  {/* Divider */}
                  <div className="org-modal-divider" style={{ background: `linear-gradient(90deg, ${selectedOrg.badgeColor}, transparent)` }} />

                  {/* Social Links */}
                  {selectedOrg.socials && (
                    <div className="org-modal-socials" style={{ marginBottom: "1.25rem", display: "flex", gap: "1rem" }}>
                      {selectedOrg.socials.linkedin && selectedOrg.socials.linkedin !== "#" && (
                        <a href={selectedOrg.socials.linkedin} target="_blank" rel="noreferrer" className="org-social-icon" style={{ color: selectedOrg.badgeColor }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {selectedOrg.socials.twitter && selectedOrg.socials.twitter !== "#" && (
                        <a href={selectedOrg.socials.twitter} target="_blank" rel="noreferrer" className="org-social-icon" style={{ color: selectedOrg.badgeColor }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {selectedOrg.socials.instagram && selectedOrg.socials.instagram !== "#" && (
                        <a href={selectedOrg.socials.instagram} target="_blank" rel="noreferrer" className="org-social-icon" style={{ color: selectedOrg.badgeColor }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </a>
                      )}
                      {selectedOrg.socials.github && selectedOrg.socials.github !== "#" && (
                        <a href={selectedOrg.socials.github} target="_blank" rel="noreferrer" className="org-social-icon" style={{ color: selectedOrg.badgeColor }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                          </svg>
                        </a>
                      )}
                      {selectedOrg.socials.telegram && selectedOrg.socials.telegram !== "#" && (
                        <a href={selectedOrg.socials.telegram} target="_blank" rel="noreferrer" className="org-social-icon" style={{ color: selectedOrg.badgeColor }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* About */}
                  <div className="org-modal-section-label">About</div>
                  <p className="org-modal-bio">{selectedOrg.bio}</p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </MotionConfig>
  );
}
