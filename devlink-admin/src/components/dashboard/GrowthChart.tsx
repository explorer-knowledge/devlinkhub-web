"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const periodData = {
  "7D": [
    { name: "Mon", members: 12200, revenue: 3800 },
    { name: "Tue", members: 12310, revenue: 4200 },
    { name: "Wed", members: 12280, revenue: 3600 },
    { name: "Thu", members: 12450, revenue: 5100 },
    { name: "Fri", members: 12520, revenue: 4700 },
    { name: "Sat", members: 12390, revenue: 3200 },
    { name: "Sun", members: 12450, revenue: 4100 },
  ],
  "1M": [
    { name: "W1", members: 11200, revenue: 14000 },
    { name: "W2", members: 11800, revenue: 16200 },
    { name: "W3", members: 12100, revenue: 18400 },
    { name: "W4", members: 12450, revenue: 21800 },
  ],
  "6M": [
    { name: "Jan", members: 8200, revenue: 18000 },
    { name: "Feb", members: 9400, revenue: 21000 },
    { name: "Mar", members: 10100, revenue: 24500 },
    { name: "Apr", members: 10900, revenue: 28000 },
    { name: "May", members: 11700, revenue: 33500 },
    { name: "Jun", members: 12450, revenue: 45200 },
  ],
  "1Y": [
    { name: "Jan", members: 4200, revenue: 8000 },
    { name: "Feb", members: 5100, revenue: 9500 },
    { name: "Mar", members: 6200, revenue: 12000 },
    { name: "Apr", members: 7100, revenue: 15000 },
    { name: "May", members: 7800, revenue: 18000 },
    { name: "Jun", members: 8500, revenue: 21000 },
    { name: "Jul", members: 9200, revenue: 24500 },
    { name: "Aug", members: 9900, revenue: 28000 },
    { name: "Sep", members: 10500, revenue: 33000 },
    { name: "Oct", members: 11000, revenue: 38000 },
    { name: "Nov", members: 11800, revenue: 42000 },
    { name: "Dec", members: 12450, revenue: 45200 },
  ],
};

type Period = keyof typeof periodData;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg shadow-xl p-3 text-xs">
      <p className="text-text-muted font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-secondary capitalize">{p.dataKey}:</span>
          <span className="font-semibold text-text-primary">
            {p.dataKey === "revenue" ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export function GrowthChart() {
  const [period, setPeriod] = useState<Period>("6M");
  const data = periodData[period];

  const memberDelta = data[data.length - 1].members - data[0].members;
  const revDelta = data[data.length - 1].revenue - data[0].revenue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-panel p-6 col-span-1 lg:col-span-2"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Growth Overview</h3>
          <p className="text-xs text-text-muted mt-0.5">Members &amp; Revenue over time</p>
        </div>

        {/* Legend + delta */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-primary inline-block" />
            <span className="text-text-muted">Members</span>
            <span className={`font-semibold ${memberDelta >= 0 ? "text-success" : "text-error"}`}>
              {memberDelta >= 0 ? "+" : ""}{memberDelta.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-secondary inline-block" />
            <span className="text-text-muted">Revenue</span>
            <span className={`font-semibold ${revDelta >= 0 ? "text-success" : "text-error"}`}>
              {revDelta >= 0 ? "+$" : "-$"}{Math.abs(revDelta).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-background/50 border border-border rounded-lg p-1 self-start">
          {(Object.keys(periodData) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                period === p
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#gradMembers)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 4, fill: "#8b5cf6" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
