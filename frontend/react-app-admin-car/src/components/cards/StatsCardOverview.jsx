import React from "react";
import PropTypes from "prop-types";

function StatsCardOverview(props) {
  const icon = props.icon;
  const label = props.label;
  const value = props.value;
  const color = props.color;
  const textColor = props.textColor;
  const className = props.className;
  const rootClass =
    "bg-[#010B18]/60 backdrop-blur-xl border border-slate-100/10 rounded-2xl p-6 " +
    (className || "");
  const iconClass =
    "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg " +
    (color || "");
  const valueClass = "text-2xl font-bold " + (textColor || "text-slate-100");

  return (
    <div className={rootClass}>
      <div className="flex items-center gap-4">
        <div className={iconClass}>{icon}</div>
        <div>
          <p className="text-slate-300 text-sm">{label}</p>
          <div className={valueClass}>{value}</div>
        </div>
      </div>
    </div>
  );
}

StatsCardOverview.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  textColor: PropTypes.string,
  className: PropTypes.string,
};

StatsCardOverview.defaultProps = {
  icon: null,
  label: "",
  value: "",
  color: "",
  textColor: "",
  className: "",
};

export default StatsCardOverview;
