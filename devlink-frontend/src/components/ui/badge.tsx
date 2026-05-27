import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "green" | "purple" | "yellow" | "red" | "muted";
  className?: string;
}

export const Badge = ({ children, variant = "accent", className = "" }: BadgeProps) => {
  const variants = {
    accent: "badge-accent",
    green: "badge-green",
    purple: "badge-purple",
    yellow: "badge-yellow",
    red: "badge-red",
    muted: "badge-muted",
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
