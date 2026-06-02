const dashboard = {
  stats: {
    totalMembers: 12450,
    eventsHosted: 142,
    activePartnerships: 24,
    totalRevenue: 45200,
    memberSpark: [8200, 9400, 10100, 10900, 11200, 11800, 12450],
    eventSpark: [110, 118, 122, 128, 134, 138, 142],
    partnerSpark: [28, 26, 27, 25, 26, 25, 24],
    revenueSpark: [18000, 21000, 24500, 28000, 33500, 40000, 45200],
  },
  leaderboard: [
    { rank: 1, name: "Jane Smith", score: 1200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane", role: "Community Head" },
    { rank: 2, name: "John Doe", score: 850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", role: "Core Team" },
    { rank: 3, name: "Mike Chen", score: 720, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", role: "Volunteer" },
    { rank: 4, name: "Alice Brown", score: 590, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Member" },
    { rank: 5, name: "Raj Patel", score: 480, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj", role: "Member" },
  ],
  upcomingEvents: [
    { name: "DevFest 2025", date: "Jun 15", registrations: 324, capacity: 400, status: "Live" },
    { name: "ReactConf", date: "Jul 5", registrations: 187, capacity: 250, status: "Open" },
    { name: "AI Bootcamp", date: "Jul 20", registrations: 98, capacity: 100, status: "Almost Full" },
    { name: "WebDev Summit", date: "Aug 12", registrations: 42, capacity: 300, status: "Open" },
  ],
};

module.exports = { dashboard };
