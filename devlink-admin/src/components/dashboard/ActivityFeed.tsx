"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, CalendarPlus, CreditCard, Award, Settings, CheckCircle2, type LucideIcon } from "lucide-react";
import { getActivity, type ActivityItem } from "@/lib/api";

const iconMap: Record<string, LucideIcon> = {
  CheckCircle2,
  UserPlus,
  CalendarPlus,
  CreditCard,
  Award,
  Settings,
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivity()
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="glass-panel p-5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Recent Activity</h3>
          <p className="text-xs text-text-muted mt-0.5">Live feed of platform events</p>
        </div>
        <button className="text-xs text-primary hover:text-primary-dark transition-colors font-medium">
          View all
        </button>
      </div>

      <div className="space-y-0.5 flex-1 overflow-y-auto max-h-[280px] pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          activities.map((act, i) => {
            const Icon = iconMap[act.icon] ?? CheckCircle2;
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.4 }}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors cursor-default group"
              >
                <div className={`w-8 h-8 rounded-lg ${act.bg} ${act.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary leading-snug truncate">{act.title}</p>
                  <p className="text-[11px] text-text-muted leading-snug mt-0.5 truncate">{act.desc}</p>
                </div>
                <span className="text-[10px] text-text-muted whitespace-nowrap mt-0.5 group-hover:text-text-secondary transition-colors">
                  {act.time}
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <span className="w-2 h-2 rounded-full bg-success pulse-dot" />
        <span className="text-[10px] text-text-muted">Live · Updates every 30s</span>
      </div>
    </motion.div>
  );
}
