"use client";

import { useState } from "react";
import { Save, Globe, Lock, Mail, CreditCard, Paintbrush, Bell, CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "general", label: "General", icon: Globe },
  { id: "branding", label: "Branding", icon: Paintbrush },
  { id: "security", label: "Security & RBAC", icon: Lock },
  { id: "email", label: "SMTP & Email", icon: Mail },
  { id: "payment", label: "Payment Gateway", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`toggle-track ${checked ? "bg-primary" : "bg-border"}`}
    >
      <span className={`toggle-thumb ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface border border-success/30 text-text-primary px-5 py-3 rounded-xl shadow-2xl shadow-black/30"
    >
      <CheckCircle2 size={18} className="text-success shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-0.5 text-text-muted hover:text-text-primary">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [toast, setToast] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // General state
  const [communityName, setCommunityName] = useState("DevLink");
  const [domain, setDomain] = useState("community.devlink.com");
  const [contactEmail, setContactEmail] = useState("hello@devlink.com");
  const [seoDesc, setSeoDesc] = useState("The premier community platform for developers to connect, learn, and grow.");

  // Notifications toggles
  const [notifToggles, setNotifToggles] = useState({
    newMember: true,
    newRegistration: true,
    paymentReceived: true,
    systemAlerts: false,
    weeklyDigest: true,
  });

  // Security toggles
  const [secToggles, setSecToggles] = useState({
    twoFactor: true,
    ssoOnly: false,
    auditLog: true,
    sessionTimeout: false,
  });

  const toggleNotif = (key: keyof typeof notifToggles) =>
    setNotifToggles((t) => ({ ...t, [key]: !t[key] }));
  const toggleSec = (key: keyof typeof secToggles) =>
    setSecToggles((t) => ({ ...t, [key]: !t[key] }));

  const handleSave = () => {
    setToast("Settings saved successfully!");
    setTimeout(() => setToast(null), 3500);
  };

  const toggleKeyVisibility = (key: string) =>
    setShowKeys((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-muted mt-1 text-sm">Manage your community platform configurations.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all neon-glow-sm self-start">
          <Save size={15} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab Nav */}
        <div className="col-span-1 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="settings-tab-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="col-span-1 md:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                <div className="glass-panel p-6">
                  <h3 className="text-base font-semibold text-text-primary mb-5">General Configuration</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Community Name", value: communityName, setter: setCommunityName, type: "text" },
                      { label: "Contact Email", value: contactEmail, setter: setContactEmail, type: "email" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{field.label}</label>
                        <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)}
                          className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-text-primary" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Custom Domain</label>
                      <div className="flex gap-2">
                        <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)}
                          className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary transition-all" />
                        <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors text-text-primary">
                          Verify
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">SEO Description</label>
                      <textarea rows={3} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)}
                        className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary resize-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <h3 className="text-base font-semibold text-text-primary mb-5">API Keys & Integrations</h3>
                  <div className="space-y-4">
                    {[
                      { name: "discord", label: "Discord Webhook", value: "https://discord.com/api/webhooks/12345/xxx" },
                      { name: "gcal", label: "Google Calendar API Key", value: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxx" },
                    ].map((api) => (
                      <div key={api.name}>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">{api.label}</label>
                        <div className="flex gap-2">
                          <input type={showKeys[api.name] ? "text" : "password"} defaultValue={api.value}
                            className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-muted transition-all" />
                          <button onClick={() => toggleKeyVisibility(api.name)}
                            className="px-3 py-2 bg-surface border border-border rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
                            {showKeys[api.name] ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div key="notif" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="glass-panel p-6">
                  <h3 className="text-base font-semibold text-text-primary mb-1">Notification Preferences</h3>
                  <p className="text-xs text-text-muted mb-6">Choose which events trigger admin notifications.</p>
                  <div className="space-y-4">
                    {[
                      { key: "newMember" as const, label: "New member joined", desc: "Alert when someone new joins the community" },
                      { key: "newRegistration" as const, label: "New registration", desc: "Alert when a new event registration is submitted" },
                      { key: "paymentReceived" as const, label: "Payment received", desc: "Alert when a payment is confirmed" },
                      { key: "systemAlerts" as const, label: "System alerts", desc: "Critical system warnings and errors" },
                      { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary email every Monday morning" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border hover:border-border-hover transition-colors">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{item.label}</p>
                          <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle checked={notifToggles[item.key]} onChange={() => toggleNotif(item.key)} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div key="sec" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="glass-panel p-6">
                  <h3 className="text-base font-semibold text-text-primary mb-1">Security & Access Control</h3>
                  <p className="text-xs text-text-muted mb-6">Manage authentication and session policies.</p>
                  <div className="space-y-4">
                    {[
                      { key: "twoFactor" as const, label: "Two-Factor Authentication", desc: "Require 2FA for all admin logins" },
                      { key: "ssoOnly" as const, label: "SSO Only Mode", desc: "Disable email/password login, enforce SSO" },
                      { key: "auditLog" as const, label: "Audit Logging", desc: "Log all admin actions for compliance" },
                      { key: "sessionTimeout" as const, label: "Auto Session Timeout", desc: "Expire sessions after 30 minutes of inactivity" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border hover:border-border-hover transition-colors">
                        <div>
                          <p className="text-sm font-medium text-text-primary">{item.label}</p>
                          <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle checked={secToggles[item.key]} onChange={() => toggleSec(item.key)} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "branding" && (
              <motion.div key="brand" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="glass-panel p-6">
                  <h3 className="text-base font-semibold text-text-primary mb-5">Branding & Theme</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-2">Primary Brand Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" defaultValue="#3b82f6"
                          className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                        <div className="flex gap-2">
                          {["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"].map((c) => (
                            <button key={c} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white/30 transition-colors" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-2">Logo Upload</label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <p className="text-sm text-text-muted">Drop your logo here or <span className="text-primary">browse</span></p>
                        <p className="text-xs text-text-muted mt-1">PNG, SVG up to 2MB</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-2">Community Tagline</label>
                      <input type="text" defaultValue="Where Developers Connect & Grow"
                        className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-text-primary transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(activeTab === "email" || activeTab === "payment") && (
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="glass-panel p-10 text-center">
                  <div className="w-14 h-14 rounded-xl bg-surface-hover flex items-center justify-center mx-auto mb-4">
                    {activeTab === "email" ? <Mail size={24} className="text-text-muted" /> : <CreditCard size={24} className="text-text-muted" />}
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">{activeTab === "email" ? "SMTP Configuration" : "Payment Gateway"}</h3>
                  <p className="text-xs text-text-muted mt-2 max-w-xs mx-auto">This section connects to your{activeTab === "email" ? " email" : " payment"} provider. Configuration available in the next update.</p>
                  <button className="mt-4 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
                    Connect Provider
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
