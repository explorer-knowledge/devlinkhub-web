"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

interface SiteSettings {
  siteName: string;
  tagline: string;
  twitterUrl: string;
  githubUrl: string;
  discordUrl: string;
  linkedinUrl: string;
  contactEmail: string;
  footerText: string;
  maintenanceMessage: string;
  comingSoonMessage: string;
  waitlistOpen: boolean;
  applyOpen: boolean;
  showStats: boolean;
  primaryColor: string;
  accentColor: string;
  launchDate: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "DevLink",
  tagline: "Where Developers Connect, Build & Grow",
  twitterUrl: "https://twitter.com/devlinkhq",
  githubUrl: "https://github.com/devlinkhq",
  discordUrl: "https://discord.gg/devlink",
  linkedinUrl: "https://linkedin.com/company/devlinkhq",
  contactEmail: "hello@devlink.tech",
  footerText: "© 2026 DevLink. All rights reserved.",
  maintenanceMessage: "We're upgrading DevLink. Back soon!",
  comingSoonMessage: "Something amazing is coming. Stay tuned.",
  waitlistOpen: true,
  applyOpen: true,
  showStats: true,
  primaryColor: "#FF1CF7",
  accentColor: "#00F0FF",
  launchDate: "2026-01-01",
};

type SettingsKey = keyof SiteSettings;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings");
        if (res.ok) {
          const map = await res.json();
          const stored = map["devlink_site_settings"];
          if (stored) {
            setSettings({ ...DEFAULT_SETTINGS, ...stored });
            return;
          }
        }
      } catch (e) {
        console.warn("Backend settings API unavailable, falling back to local storage", e);
      }

      try {
        const stored = JSON.parse(localStorage.getItem("devlink_site_settings") || "null");
        if (stored) setSettings({ ...DEFAULT_SETTINGS, ...stored });
      } catch {}
    }
    loadSettings();
  }, []);

  async function saveSettings() {
    try {
      const res = await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "devlink_site_settings", value: settings }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        localStorage.setItem("devlink_site_settings", JSON.stringify(settings));
        return;
      }
    } catch (e) {
      console.error("Failed to save settings to backend:", e);
    }

    localStorage.setItem("devlink_site_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function update(key: SettingsKey, value: string | boolean) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  const TABS = [
    { id: "general", label: "General" },
    { id: "social", label: "Social Links" },
    { id: "messaging", label: "Messaging" },
    { id: "features", label: "Features" },
    { id: "appearance", label: "Appearance" },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Site Settings</h1>
            <p className="text-sm text-zinc-500 mt-1">Configure global DevLink platform settings</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-emerald-400 font-semibold">✓ Settings saved!</span>}
            <button
              onClick={saveSettings}
              className="px-5 py-2.5 rounded-xl bg-[#FF1CF7] text-white text-sm font-bold hover:brightness-110 transition shadow-[0_0_20px_rgba(255,28,247,0.3)]"
            >
              Save All Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 mb-6 bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-1.5 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#FF1CF7] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-7">
          {activeTab === "general" && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-white mb-4">General Information</h2>
              <Field label="Site Name" value={settings.siteName} onChange={v => update("siteName", v)} placeholder="DevLink" />
              <Field label="Tagline" value={settings.tagline} onChange={v => update("tagline", v)} placeholder="Where Developers Connect, Build & Grow" />
              <Field label="Contact Email" value={settings.contactEmail} onChange={v => update("contactEmail", v)} placeholder="hello@devlink.tech" />
              <Field label="Footer Text" value={settings.footerText} onChange={v => update("footerText", v)} placeholder="© 2026 DevLink. All rights reserved." />
              <Field label="Launch Date" value={settings.launchDate} onChange={v => update("launchDate", v)} placeholder="2026-01-01" type="date" />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-white mb-4">Social Links</h2>
              <Field label="Twitter / X" value={settings.twitterUrl} onChange={v => update("twitterUrl", v)} placeholder="https://twitter.com/devlinkhq" />
              <Field label="GitHub" value={settings.githubUrl} onChange={v => update("githubUrl", v)} placeholder="https://github.com/devlinkhq" />
              <Field label="Discord" value={settings.discordUrl} onChange={v => update("discordUrl", v)} placeholder="https://discord.gg/devlink" />
              <Field label="LinkedIn" value={settings.linkedinUrl} onChange={v => update("linkedinUrl", v)} placeholder="https://linkedin.com/company/devlinkhq" />
            </div>
          )}

          {activeTab === "messaging" && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-white mb-4">Status Messages</h2>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Maintenance Mode Message</label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={e => update("maintenanceMessage", e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Coming Soon Message</label>
                <textarea
                  value={settings.comingSoonMessage}
                  onChange={e => update("comingSoonMessage", e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white mb-4">Feature Flags</h2>
              {(
                [
                  { key: "waitlistOpen" as SettingsKey, label: "Waitlist Open", desc: "Allow users to join the waitlist" },
                  { key: "applyOpen" as SettingsKey, label: "Applications Open", desc: "Allow users to apply to DevLink" },
                  { key: "showStats" as SettingsKey, label: "Show Stats", desc: "Display community stats on homepage" },
                ] as { key: SettingsKey; label: string; desc: string }[]
              ).map(f => (
                <div key={f.key} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-zinc-500">{f.desc}</p>
                  </div>
                  <button
                    onClick={() => update(f.key, !settings[f.key])}
                    className={`relative w-11 h-6 rounded-full border transition-all duration-200 ${
                      settings[f.key] ? "bg-[#FF1CF7] border-[#FF1CF7]" : "bg-white/[0.06] border-white/[0.1]"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${settings[f.key] ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-white mb-4">Brand Colors</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-white/10 shrink-0" style={{ background: settings.primaryColor }} />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={e => update("primaryColor", e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-white/10 shrink-0" style={{ background: settings.accentColor }} />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={e => update("accentColor", e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF1CF7]/50 transition font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <p className="text-xs text-zinc-500 mb-3">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 flex-1 rounded-xl" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }} />
                  <button className="px-4 h-10 rounded-xl font-bold text-sm text-white" style={{ background: settings.primaryColor }}>
                    Button
                  </button>
                  <span className="text-sm font-bold" style={{ color: settings.accentColor }}>Accent text</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save button at bottom too */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveSettings}
            className="px-6 py-3 rounded-xl bg-[#FF1CF7] text-white text-sm font-bold hover:brightness-110 transition"
          >
            {saved ? "✓ Saved!" : "Save All Settings"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF1CF7]/50 focus:ring-1 focus:ring-[#FF1CF7]/10 transition"
      />
    </div>
  );
}
