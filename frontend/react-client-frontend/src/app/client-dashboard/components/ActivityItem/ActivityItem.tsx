interface DashboardActivityItem {
  type: "achat" | "commande" | "favori";
  title: string;
  date: string;
  amount?: number;
}

interface ActivityItemProps {
  readonly item: DashboardActivityItem;
  readonly icon: React.ReactNode;
  readonly formattedDate: string;
  readonly formattedAmount?: string;
}

function ActivityItem({ item, icon, formattedDate, formattedAmount }: ActivityItemProps) {
  return (
    <div className="rounded-lg border px-4 py-3 client-theme-card-soft">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <p className="client-theme-text-primary font-medium">{item.title}</p>
          <p className="client-theme-text-secondary text-sm">
            {formattedDate}
            {formattedAmount && (
              <span className="ml-2 text-green-300 font-semibold">{formattedAmount}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;
