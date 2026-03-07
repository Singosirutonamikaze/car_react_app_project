interface BadgeProps {
  readonly label: string;
  readonly className?: string;
}

function Badge({ label, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium client-theme-chip border ${className}`}>
      {label}
    </span>
  );
}

export default Badge;
