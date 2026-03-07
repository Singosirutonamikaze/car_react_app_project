import type { ReactNode } from "react";

interface StatCardProps {
  readonly icon: ReactNode;
  readonly value: string;
  readonly label: string;
  readonly iconClassName: string;
}

function StatCard({ icon, value, label, iconClassName }: StatCardProps) {
  return (
    <div className="rounded-lg p-4 border backdrop-blur-md client-theme-card-soft">
      <div className="flex items-center gap-3">
        <div className={"w-11 h-11 rounded-lg flex items-center justify-center " + iconClassName}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold client-theme-text-primary">{value}</h3>
          <p className="client-theme-text-secondary text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
