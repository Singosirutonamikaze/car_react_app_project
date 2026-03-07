import PropTypes from "prop-types";
import { LuTriangleAlert } from "react-icons/lu";

function EmptyState({ title, message, compact = false }) {
  const wrapperClass = compact
    ? "dashboard-recent-empty min-h-[140px]"
    : "dashboard-recent-empty";

  return (
    <div className={wrapperClass}>
      <LuTriangleAlert className="text-cyan-300 text-2xl" />
      <p className="dashboard-recent-empty-title">{title}</p>
      <p className="dashboard-recent-empty-subtitle">{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

export default EmptyState;
