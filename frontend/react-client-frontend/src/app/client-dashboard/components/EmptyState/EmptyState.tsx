import { LuTriangleAlert } from "react-icons/lu";

interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly compact?: boolean;
}

function EmptyState({ title, message, compact = false }: EmptyStateProps) {
  return (
    <div
      className={[
        "rounded-lg border-2 border-dashed backdrop-blur-xl client-theme-card-soft",
        "flex flex-col items-center justify-center text-center px-6",
        compact ? "min-h-[140px] py-6" : "min-h-[180px] py-8",
      ].join(" ")}
    >
      <div className="h-10 w-10 rounded-lg border flex items-center justify-center client-theme-icon-soft">
        <LuTriangleAlert className="text-xl" />
      </div>
      <p className="mt-3 client-theme-text-primary font-semibold text-sm md:text-base">{title}</p>
      <p className="mt-1 client-theme-text-secondary text-sm max-w-md">{message}</p>
    </div>
  );
}

export default EmptyState;
