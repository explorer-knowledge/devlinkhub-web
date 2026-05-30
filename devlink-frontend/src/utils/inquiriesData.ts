"use client";

export interface InquiryReply {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  organization?: string;
  status: "New" | "In Progress" | "Resolved";
  timestamp: number;
  replies: InquiryReply[];
}

const STORAGE_KEY = "devlink_contact_inquiries";

// Mock initial data if storage is empty
const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "inq-mock-1",
    name: "Dr. Sarah Chen",
    email: "schen@mit.edu",
    category: "PARTNERSHIPS",
    subject: "University Lab Collaboration Proposal",
    message: "Hello DevLink team, we are interested in setting up a joint AI Hackathon and research incubator with MIT's EECS department. Let us know who we should sync with to draft the collaboration framework.",
    organization: "MIT CSAIL",
    status: "New",
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    replies: []
  },
  {
    id: "inq-mock-2",
    name: "Alex Mercer",
    email: "alex@polygon.vc",
    category: "SPONSORSHIPS",
    subject: "Sponsoring summer developer tracks",
    message: "We've been tracking DevLink's builder community for a while. We would love to sponsor your next ecosystem program and open-source hackathons. Do you have a sponsorship deck or pricing structures for Q3/Q4?",
    organization: "Polygon Ventures",
    status: "In Progress",
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
    replies: [
      {
        id: "rep-1",
        sender: "DevLink System Node",
        text: "Hi Alex, thank you for reaching out! We are currently assembling our Q3 Hackathon sponsor guide and would be thrilled to talk. Our relations lead will reach out to you within 24 hours.",
        timestamp: Date.now() - 3600000 * 11
      }
    ]
  },
  {
    id: "inq-mock-3",
    name: "Elena Rostova",
    email: "elena@rust.dev",
    category: "SUPPORT",
    subject: "Account validation failure on onboarding",
    message: "Hey, I am trying to complete my onboarding profile, but the verification process keeps timing out when attempting to scan my Github key signature. Is there a manual review process?",
    organization: "Independent Builder",
    status: "Resolved",
    timestamp: Date.now() - 3600000 * 3, // 3 hours ago
    replies: [
      {
        id: "rep-2",
        sender: "DevLink Core",
        text: "Hey Elena! We noticed an API rate-limit issue with the GitHub keys API earlier today. We have resolved the timeout block. Could you try verifying your key signature again? Feel free to ping us if you face any issues.",
        timestamp: Date.now() - 3600000 * 2.5
      },
      {
        id: "rep-3",
        sender: "Elena Rostova",
        text: "Awesome! Verified successfully now. Thanks for the quick support!",
        timestamp: Date.now() - 3600000 * 2
      }
    ]
  }
];

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000"}/api`;

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const res = await fetch(`${API_BASE}/inquiries`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API inquiries service unavailable, using mock fallback", e);
  }

  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INQUIRIES));
    return MOCK_INQUIRIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse inquiries", e);
    return [];
  }
}

export function saveInquiriesList(inquiries: Inquiry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend API inquiry details unavailable, using mock fallback", e);
  }

  const inquiries = await getInquiries();
  return inquiries.find((inq) => inq.id === id) || null;
}

export async function saveInquiry(data: {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  organization?: string;
}): Promise<Inquiry> {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to submit inquiry to backend:", e);
  }

  // Fallback to local storage
  const inquiries = await getInquiries();
  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    email: data.email,
    category: data.category.toUpperCase(),
    subject: data.subject || `${data.category} Inquiry`,
    message: data.message,
    organization: data.organization || "",
    status: "New",
    timestamp: Date.now(),
    replies: []
  };

  inquiries.unshift(newInquiry);
  saveInquiriesList(inquiries);
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<Inquiry | null> {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Failed to update inquiry status on backend:", e);
  }

  // Fallback
  const inquiries = await getInquiries();
  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return null;
  
  inquiries[index].status = status;
  saveInquiriesList(inquiries);
  return inquiries[index];
}

export async function addInquiryReply(id: string, sender: string, text: string): Promise<Inquiry | null> {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, text }),
    });
    if (res.ok) {
      // Refresh the inquiry details to return it complete with replies
      const detailRes = await fetch(`${API_BASE}/inquiries/${id}`);
      if (detailRes.ok) return await detailRes.json();
    }
  } catch (e) {
    console.error("Failed to add inquiry reply on backend:", e);
  }

  // Fallback
  const inquiries = await getInquiries();
  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return null;
  
  const newReply: InquiryReply = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sender,
    text,
    timestamp: Date.now()
  };

  inquiries[index].replies.push(newReply);
  saveInquiriesList(inquiries);
  return inquiries[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return true;
  } catch (e) {
    console.error("Failed to delete inquiry on backend:", e);
  }

  // Fallback
  const inquiries = await getInquiries();
  const filtered = inquiries.filter((inq) => inq.id !== id);
  if (filtered.length === inquiries.length) return false;
  saveInquiriesList(filtered);
  return true;
}

export function clearAllInquiries(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

