import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = "", hover = true }: CardProps) => {
  return (
    <div className={`card ${hover ? "" : "hover:transform-none hover:shadow-none"} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-5 border-b border-[var(--border)] ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-5 border-t border-[var(--border)] bg-black/10 rounded-b-[var(--radius-lg)] ${className}`}>{children}</div>
);
