import type { IconType } from "react-icons";
import { FiRefreshCw } from "react-icons/fi";

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly icon: IconType;
  readonly onRefresh?: () => void;
  readonly refreshLabel?: string;
}

function PageHeader({
  title,
  subtitle,
  icon: Icon,
  onRefresh,
  refreshLabel = "Actualiser",
}: PageHeaderProps) {
  const normalizedSubtitle = subtitle.replaceAll(/\s+/g, " ").trim();
  const displaySubtitle = normalizedSubtitle === "Bienvenue," || !normalizedSubtitle
    ? "Bienvenue"
    : normalizedSubtitle;

  return (
    <div className="backdrop-blur-xl border rounded-lg p-4 client-surface">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2 client-theme-text-primary">
            <Icon className="client-theme-accent-text" />
            {title}
          </h1>
          <p className="text-sm client-theme-text-secondary">{displaySubtitle}</p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors client-surface client-theme-text-primary client-accent-bg"
          >
            <FiRefreshCw />
            {refreshLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
