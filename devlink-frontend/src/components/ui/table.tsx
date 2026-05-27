import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ headers, children, className = "" }: TableProps) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black/20 border-b border-[var(--border)]">
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <tr className={`table-row ${className}`}>{children}</tr>
);

export const TableCell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-5 py-4 text-sm ${className}`}>{children}</td>
);
