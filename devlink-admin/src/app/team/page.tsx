"use client";

import { useState, useEffect } from "react";
import { UserPlus, MoreHorizontal, X } from "lucide-react";
import { getTeam, addTeamMember, type TeamMember } from "@/lib/api";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", email: "", access: "Viewer" });

  useEffect(() => {
    getTeam()
      .then(setTeam)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const newMember = await addTeamMember(formData);
      setTeam((prev) => [newMember, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: "", role: "", email: "", access: "Viewer" });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team Management</h1>
          <p className="text-text-muted mt-1">Manage core team members and their roles.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg neon-glow"
        >
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface/50 border-b border-border text-xs text-text-muted uppercase">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-surface/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.avatar && (
                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full border border-border" />
                      )}
                      <div>
                        <div className="font-medium text-text-primary">{member.name}</div>
                        <div className="text-xs text-text-muted">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{member.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${member.access === "Admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-surface text-text-muted border-border"}`}>
                      {member.access}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-primary"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border w-full max-w-md rounded-xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-primary"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-6">Add Team Member</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
              <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
              <input type="text" placeholder="Role (e.g. Designer)" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
              <select value={formData.access} onChange={(e) => setFormData({ ...formData, access: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button type="submit" disabled={adding} className="w-full py-2 bg-primary text-white rounded-lg mt-4 neon-glow disabled:opacity-60">
                {adding ? "Adding..." : "Add Member"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
