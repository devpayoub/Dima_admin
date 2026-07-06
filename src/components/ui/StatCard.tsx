import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-muted text-sm font-medium">{title}</p>
        <p className="text-foreground text-3xl font-semibold mt-1">{value}</p>
      </div>
      <div className="bg-primary/10 p-3 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
}
