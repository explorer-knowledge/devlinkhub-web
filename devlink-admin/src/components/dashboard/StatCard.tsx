"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useRef } from "react";


interface StatCardProps {
  title: string;
  value: string;
  numericValue?: number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  delay?: number;
  accentClass?: string;
  iconBgClass?: string;
  sparkData?: number[];
  sparkColor?: string;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (value > 1000) return prefix + Math.round(latest).toLocaleString() + suffix;
    return prefix + Math.round(latest) + suffix;
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M 0,${height} L ${pts.join(" L ")} L ${width},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r={2.5} fill={color} />
    </svg>
  );
}

export function StatCard({
  title,
  value,
  numericValue,
  trend,
  trendUp,
  icon: Icon,
  delay = 0,
  accentClass = "stat-border-blue",
  iconBgClass = "bg-primary/10 text-primary",
  sparkData = [20, 35, 28, 45, 38, 55, 62],
  sparkColor = "#3b82f6",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`glass-card p-5 flex flex-col justify-between ${accentClass} overflow-hidden relative group`}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${sparkColor}08, transparent)` }} />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold mt-1.5 text-text-primary tracking-tight">
            {numericValue !== undefined ? (
              <AnimatedNumber value={numericValue} prefix={value.startsWith("$") ? "$" : ""} suffix={value.endsWith("%") ? "%" : ""} />
            ) : (
              value
            )}
          </h3>
        </div>
        <div className={`w-9 h-9 rounded-lg ${iconBgClass} flex items-center justify-center shrink-0`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        {trend && (
          <div className="flex items-center gap-1.5">
            {trendUp ? (
              <TrendingUp size={12} className="text-success" />
            ) : (
              <TrendingDown size={12} className="text-error" />
            )}
            <span className={`text-xs font-semibold ${trendUp ? "text-success" : "text-error"}`}>{trend}</span>
            <span className="text-xs text-text-muted">vs last mo.</span>
          </div>
        )}
        <MiniSparkline data={sparkData} color={sparkColor} />
      </div>
    </motion.div>
  );
}
