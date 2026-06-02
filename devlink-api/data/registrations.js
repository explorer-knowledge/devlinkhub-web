const registrations = [
  {
    id: "REG-001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    college: "MIT",
    ticketType: "VIP Pass",
    type: "Individual",
    payment: "Paid",
    teamName: "",
    teamMembers: [],
    eventId: "syntax-weavers-inaugural-sprint"
  },
  {
    id: "REG-002",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    college: "Stanford University",
    ticketType: "Standard",
    type: "Team",
    payment: "Unpaid",
    teamName: "CodeCrafters",
    teamMembers: ["David Miller (david.m@example.com)", "Jessica Taylor (jessica.t@example.com)", "Ryan Connor (ryan.c@example.com)"],
    eventId: 1
  },
  {
    id: "REG-003",
    name: "Michael Chen",
    email: "m.chen@example.com",
    college: "Harvard",
    ticketType: "Student Pass",
    type: "Individual",
    payment: "Paid",
    teamName: "",
    teamMembers: [],
    eventId: "syntax-weavers-inaugural-sprint"
  },
  {
    id: "REG-004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    college: "UC Berkeley",
    ticketType: "Standard",
    type: "Team",
    payment: "Unpaid",
    teamName: "CyberSquad",
    teamMembers: ["Kevin Hart (kevin.h@example.com)", "Sonia Gupta (sonia.g@example.com)"],
    eventId: 2
  },
  {
    id: "REG-005",
    name: "James Park",
    email: "j.park@example.com",
    college: "Caltech",
    ticketType: "VIP Pass",
    type: "Individual",
    payment: "Refunded",
    teamName: "",
    teamMembers: [],
    eventId: 3
  }
];

module.exports = { registrations };
