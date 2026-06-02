const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json() as Promise<T>;
}

// ─── Members ────────────────────────────────────────────────────────────────
export interface Member {
  id: number;
  name: string;
  role: string;
  skills: string[];
  score: number;
  avatar: string;
  github: string;
  linkedin: string;
  joinDate: string;
  online: boolean;
  contributions: number;
  email?: string;
}

export const getMembers = (search?: string, role?: string) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (role && role !== "All") params.set("role", role);
  const qs = params.toString();
  return apiFetch<Member[]>(`/api/members${qs ? `?${qs}` : ""}`);
};

export const addMember = (data: Partial<Member>) =>
  apiFetch<Member>("/api/members", { method: "POST", body: JSON.stringify(data) });

export const deleteMember = (id: number) =>
  apiFetch<{ success: boolean }>(`/api/members/${id}`, { method: "DELETE" });

// ─── Events ─────────────────────────────────────────────────────────────────
export interface Event {
  id: number | string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registered: number;
  status: string;
  description?: string;
}

export const getEvents = (type?: string) => {
  const params = new URLSearchParams();
  if (type && type !== "All Types") params.set("type", type);
  const qs = params.toString();
  return apiFetch<Event[]>(`/api/events${qs ? `?${qs}` : ""}`);
};

export const addEvent = (data: Partial<Event>) =>
  apiFetch<Event>("/api/events", { method: "POST", body: JSON.stringify(data) });

export const deleteEvent = (id: number) =>
  apiFetch<{ success: boolean }>(`/api/events/${id}`, { method: "DELETE" });

export const updateEvent = (id: number | string, data: Partial<Event>) =>
  apiFetch<Event>(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) });

// ─── Team ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  access: string;
  avatar?: string;
  joinedAt?: string;
}

export const getTeam = () => apiFetch<TeamMember[]>("/api/team");

export const addTeamMember = (data: Partial<TeamMember>) =>
  apiFetch<TeamMember>("/api/team", { method: "POST", body: JSON.stringify(data) });

export const deleteTeamMember = (id: number) =>
  apiFetch<{ success: boolean }>(`/api/team/${id}`, { method: "DELETE" });

// ─── Activity ────────────────────────────────────────────────────────────────
export interface ActivityItem {
  id: number;
  type: string;
  icon: string;
  color: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
  avatar: string;
}

export const getActivity = () => apiFetch<ActivityItem[]>("/api/activity");

// ─── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardData {
  stats: {
    totalMembers: number;
    eventsHosted: number;
    activePartnerships: number;
    totalRevenue: number;
    memberSpark: number[];
    eventSpark: number[];
    partnerSpark: number[];
    revenueSpark: number[];
  };
  leaderboard: {
    rank: number;
    name: string;
    score: number;
    avatar: string;
    role: string;
  }[];
  upcomingEvents: {
    name: string;
    date: string;
    registrations: number;
    capacity: number;
    status: string;
  }[];
}

export const getDashboard = () => apiFetch<DashboardData>("/api/dashboard");

// ─── Registrations ──────────────────────────────────────────────────────────
export interface Registration {
  id: string;
  name: string;
  email: string;
  college: string;
  ticketType: string;
  type: "Individual" | "Team";
  payment: "Paid" | "Unpaid" | "Refunded";
  teamName?: string;
  teamMembers?: string[];
  eventId?: number | string;
}

export const getRegistrations = (search?: string, statusFilter?: string, eventId?: string) => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (statusFilter && statusFilter !== "All") params.set("statusFilter", statusFilter);
  if (eventId && eventId !== "All") params.set("eventId", eventId);
  const qs = params.toString();
  return apiFetch<Registration[]>(`/api/registrations${qs ? `?${qs}` : ""}`);
};

export const addRegistration = (data: Partial<Registration>) =>
  apiFetch<Registration>("/api/registrations", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRegistrationPayment = (id: string, payment: "Paid" | "Unpaid" | "Refunded") =>
  apiFetch<Registration>(`/api/registrations/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ payment }),
  });

export const deleteRegistration = (id: string) =>
  apiFetch<{ success: boolean }>(`/api/registrations/${id}`, {
    method: "DELETE",
  });
